// single image upload
// single image delete
// multiple image upload
// multiple image delete
// only manager and admin can upload and delete images
import cron from "node-cron";
import mongoose from "mongoose";
import Order from "../models/Order.modal.js";
import Product from "../models/Product.modal.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";






const cancelOrderAndReleaseStock = async (order) => {
  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      for (const item of order.orderItems) {
        const stockUpdate = await Product.updateOne(
          {
            _id: item.productId,
            variants: {
              $elemMatch: {
                color: item.color,
                availability: {
                  $elemMatch: {
                    size: item.size,
                  },
                },
              },
            },
          },
          {
            $inc: {
              "variants.$[variant].availability.$[size].quantity":
                item.quantity,
            },
          },
          {
            arrayFilters: [
              { "variant.color": item.color },
              { "size.size": item.size },
            ],
            session,
          }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `Unable to restore stock for ${item.name} (${item.color}, ${item.size}).`
          );
        }
      }
    });

   

    return {
      success: true,
      message: "Product stock restored successfully.",
    };
  } catch (error) {
    return {
      success: false,
      message: error.message || "Failed to restore product stock.",
    };
  } finally {
    await session.endSession();
  }
};


const cancelOrderAndReleaseStockForCleanUp = async (order) => {
  const session = await mongoose.startSession();

  try {
    let cancelled = false;

    await session.withTransaction(async () => {
      // 1. Cancel only if the order is still pending
      const orderUpdate = await Order.updateOne(
        {
          _id: order._id,
          paymentMethod: "online",
          paymentStatus: "pending",
          orderStatus: "pending",
        },
        {
          $set: {
            paymentStatus: "failed",
            orderStatus: "cancelled",
          },
        },
        { session }
      );

      // Already paid, cancelled, or processed
      if (orderUpdate.modifiedCount !== 1) {
        return;
      }

      // 2. Restore reserved stock
      for (const item of order.orderItems) {
        const stockUpdate = await Product.updateOne(
          {
            _id: item.productId,
            variants: {
              $elemMatch: {
                color: item.color,
                availability: {
                  $elemMatch: {
                    size: item.size,
                  },
                },
              },
            },
          },
          {
            $inc: {
              "variants.$[variant].availability.$[size].quantity":
                item.quantity,
            },
          },
          {
            arrayFilters: [
              { "variant.color": item.color },
              { "size.size": item.size },
            ],
            session,
          }
        );

        if (stockUpdate.modifiedCount !== 1) {
          throw new Error(
            `Unable to restore stock for ${item.name} (${item.color}, ${item.size}).`
          );
        }
      }

      cancelled = true;
    });

    return {
      success: true,
      cancelled,
      message: cancelled
        ? "Order cancelled and product stock restored."
        : "Order was already processed.",
    };
  } catch (error) {
    console.error("Order cancellation error:", error);

    return {
      success: false,
      cancelled: false,
      message: error.message || "Failed to cancel order.",
    };
  } finally {
    await session.endSession();
  }
};


const SIX_MINUTES = 6 * 60 * 1000;

let isRunning = false;

const startOrderCleanupWorker = () => {
  // Run every minute
  cron.schedule("* * * * *", async () => {
    if (isRunning) return;

    isRunning = true;

    try {
      const expirationTime = new Date(Date.now() - SIX_MINUTES);

      // 1. Find expired online pending orders
      const expiredOrders = await Order.find({
        paymentMethod: "online",
        paymentStatus: "pending",
        orderStatus: "pending",
        createdAt: { $lte: expirationTime },
      })
        .select("_id orderItems")
        .limit(100)
        .lean();

      if (!expiredOrders.length) return;

      console.log(
        `Found ${expiredOrders.length} expired pending orders.`
      );

      // 2. Cancel each order and restore stock
      for (const order of expiredOrders) {
        const result = await cancelOrderAndReleaseStockForCleanUp(order);

        if (result.success && result.cancelled) {
          console.log(`Order ${order._id} cancelled successfully.`);
        } else if (!result.success) {
          console.error(
            `Failed to cancel order ${order._id}:`,
            result.message
          );
        }
      }
    } catch (error) {
      console.error("Order cleanup worker error:", error);
    } finally {
      isRunning = false;
    }
  });

  console.log("Order cleanup worker started.");
};

const uploadSingleImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const deleteSingleImage = async (req, res) => {
  try {
    const { filename } = req.params;
    const filePath = `uploads/${filename}`;

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: "File not found" });
    }

    // Delete the file
    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


const uploadMultipleImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "No files uploaded" });
    }

    const imageUrls = req.files.map(file => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`);

    return res.status(200).json({
      success: true,
      message: "Images uploaded successfully",
      imageUrls,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteMultipleImages = async (req, res) => {
  try {
    const { filenames } = req.body; // Expecting an array of filenames in the request body

    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ success: false, message: "No filenames provided" });
    }

    const deletedFiles = [];
    const notFoundFiles = [];

    filenames.forEach(filename => {
      const filePath = `uploads/${filename}`;

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        deletedFiles.push(filename);
      } else {
        notFoundFiles.push(filename);
      }
    });

    return res.status(200).json({
      success: true,
      message: "Images deletion process completed",
      deletedFiles,
      notFoundFiles,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export {
  cancelOrderAndReleaseStock,
  uploadSingleImage,
  deleteSingleImage,
  uploadMultipleImages,
  deleteMultipleImages,
  startOrderCleanupWorker,
}