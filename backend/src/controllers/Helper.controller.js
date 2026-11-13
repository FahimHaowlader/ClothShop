// single image upload
// single image delete
// multiple image upload
// multiple image delete
// only manager and admin can upload and delete images

import mongoose from "mongoose";
import Order from "../models/Order.modal.js";
import Product from "../models/Product.modal.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";






export const cancelOrderAndReleaseStock = async (order) => {
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




export const uploadSingleImage = async (req, res) => {
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


export const deleteSingleImage = async (req, res) => {
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


export const uploadMultipleImages = async (req, res) => {
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

export const deleteMultipleImages = async (req, res) => {
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