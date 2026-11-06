import Bag from "../models/Bag.modal.js";
import Product from "../models/Product.modal.js";
import User from "../models/User.modal.js";
import Coupon from "../models/Coupon.modal.js";


import asyncHandler from "../utils/asyncHandler.js";
import apiResponse from "../utils/apiResponse.js";
import apiError from "../utils/apiError.js";



/** 
@desc    Get user's bag items
@route   GET /api/bag/items
@access  Public (or Private depending on your auth middleware)
*/
 const getBagItems = asyncHandler(async (req, res) => {
  try {
    // Ensure user is authenticated (if this route requires a logged-in user)
    if (!req.user?._id) {
      throw new apiError(401, "Unauthorized request");
    }

    // Find the bag associated with the logged-in user
    const bag = await Bag.findOne({ user: req.user._id });

    // Calculate total item quantity (returns 0 if cart doesn't exist yet)
    const items = bag && bag?.items || [];

    return res.status(200).json(
      new apiResponse(
        200,
        { items },
        "Bag items retrieved successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});


/** 
@desc    Get multiple product details for bag items
@route   POST /api/bag/item-details
@access  Public
*/
 const getBagItemsDetails = asyncHandler(async (req, res) => {
  try {
    const { productIds } = req.body;

    // Validate that productIds is provided and is a non-empty array
    if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
      throw new apiError(400, "An array of product IDs is required");
    }

    // Fetch all products whose IDs are in the array AND are set to display
    const products = await Product.find({
      _id: { $in: productIds },
      display: true
    }).select(
      "-sizeGuide -description -specification -instructor -gender -category -collectionName -variant -bestSeller -featured"
    );

    return res.status(200).json(
      new apiResponse(
        200,
        products,
        "Products details retrieved successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});



/**
@desc    Remove item from bag atomically and return updated bag
@route   DELETE /api/bag/item
@access  Private
*/
 const removeItemFromBag = asyncHandler(async (req, res) => {
  try {
    const { productId, color, size } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError(401, "Unauthorized request");
    }

    if (!productId || !size || !color) {
      throw new apiError(400, "Product ID, size, and color are required");
    }

    // Build the query criteria for the subdocument inside the array
    const pullCondition = { productId, size ,colors };
    

    // Atomically pull the matching item and return the newly updated document
    const updatedBag = await Bag.findOneAndUpdate(
      { user: userId },
      { $pull: { items: pullCondition } },
      { new: true }
    );

    if (!updatedBag) {
      throw new apiError(404, "Bag not found");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        updatedBag,
        "Item removed from bag successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});

/**
@desc    Add item to bag 
@route   POST /api/bag/add-item
@access  Private
*/
 const addItemToBag = asyncHandler(async (req, res) => {
  try {
    const { productId, pic, color, size, quantity = 1, unitPrice } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError(401, "Unauthorized request");
    }

    if (!productId || !size || !unitPrice || !color || !pic) {
      throw new apiError(400, "Product ID, size, and unit price are required");
    }

      if (quantity < 1) {
      throw new apiError(422, "Quantity must be at least 1");
    }


    if (quantity > 10) {
      throw new apiError(422, "Quantity can not be more than 10");
    }

    const newItem = {
      productId,
      pic,
      color,
      size,
      quantity,
      unitPrice
    };

    // Atomically push the new item if the bag has fewer than 20 items, or upsert a new bag
    const updatedBag = await Bag.findOneAndUpdate(
      { 
        user: userId,
        "items.19": { $exists: false } // Ensures array length is strictly under 20 before pushing
      },
      { 
        $push: { items: newItem } 
      },
      { upsert: true, new: true, runValidators: true }
    ).select("user");

    if (!updatedBag) {
      throw new apiError(400, "Bag max limit reached (20 items max)");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        updatedBag.user,
        "Item added to bag successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    if (error.name === "ValidationError") {
      throw new apiError(400, error.message);
    }
    throw new apiError(500, error.message);
  }
});



/**
@desc    Clear all items from the user's bag
@route   DELETE /api/bag/clear
@access  Private
*/
 const clearBag = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError(401, "Unauthorized request");
    }

    // Atomically find the bag, clear the items array, and return the updated document
    const updatedBag = await Bag.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    )

    if (!updatedBag) {
      throw new apiError(404, "Bag not found");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        updatedBag,
        "Bag cleared successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});


/**
@desc    Update item quantity in bag 
@route   PUT /api/bag/update-item-quantity
@access  Private
*/
 const updateItemQuantityInBag = asyncHandler(async (req, res) => {
  try {
    const { productId, color, size, quantity } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      throw new apiError(401, "Unauthorized request");
    }

    if (!productId || !size || !quantity || !color) {
      throw new apiError(400, "Product ID, size, color, and quantity are required");
    }

    if (quantity < 1) {
      throw new apiError(422, "Quantity must be at least 1");
    }

    if (quantity > 10) {
      throw new apiError(422, "Quantity cannot be more than 10");
    }

    // Match exact variant condition inside the items array
    const variantCondition = { productId, size, color };

    // Atomically find the bag and update the quantity of the specific array element
    const updatedBag = await Bag.findOneAndUpdate(
      { 
        user: userId, 
        items: { $elemMatch: variantCondition } 
      },
      { 
        $set: { "items.$.quantity": quantity } 
      },
      { new: true, runValidators: true }
    ).select("user");

    if (!updatedBag) {
      throw new apiError(404, "Bag or specific item variant not found");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        updatedBag.user,
        "Item quantity updated successfully"
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    if (error.name === "ValidationError") {
      throw new apiError(400, error.message);
    }
    throw new apiError(500, error.message);
  }
});




/**
@desc    Calculate total price after applying coupon
@route   POST /api/bag/items-total-price-after-discount
@access  Private
*/
const getBagTotalPriceAfterDiscount = asyncHandler(async (req, res) => {
  try {
    const { couponCode, products } = req.body;

    if (!couponCode) {
      throw new apiError(400, "Coupon code is required");
    }

    // Fetch the coupon from the database
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase().trim()
    });

    if (!coupon) {
      throw new apiError(404, "Invalid coupon code");
    }

    const now = new Date();

    if (coupon.validFrom && now < coupon.validFrom) {
      throw new apiError(400, "Coupon is not active yet");
    }

    if (coupon.validUntil && now > coupon.validUntil) {
      throw new apiError(400, "Coupon has expired");
    }

    if (!products || !Array.isArray(products) || products.length === 0) {
      throw new apiError(400, "Products are required");
    }

    // Validate products
    for (const item of products) {
      if (
        !item.productId ||
        !mongoose.Types.ObjectId.isValid(item.productId)
      ) {
        throw new apiError(400, "Invalid product ID");
      }

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1 ||
        item.quantity > 10
      ) {
        throw new apiError(400, "Invalid product quantity");
      }
    }

    // Fetch products from database (never trust frontend prices)
    const productIds = products.map(item => item.productId);

    const dbProducts = await Product.find({
      _id: { $in: productIds }
    });

    if (dbProducts.length !== new Set(productIds.map(String)).size) {
      throw new apiError(404, "One or more products not found");
    }

    let eligibleItems = products;

    // Check individual or general coupon
    if (coupon.discountApplyTo.type === "individual") {
      eligibleItems = products.filter(item =>
        coupon.discountApplyTo.products.some(
          id => id.toString() === item.productId.toString()
        )
      );

      if (eligibleItems.length === 0) {
        throw new apiError(
          400,
          "Coupon does not apply to selected products"
        );
      }
    }

    // Calculate total before and after product discounts
    let totalPriceBeforeDiscount = 0;
    let totalPriceAfterDiscount = 0;

    products.forEach(item => {
      const product = dbProducts.find(
        p => p._id.toString() === item.productId.toString()
      );

      const originalPrice = product.price;
      let productDiscountAmount = 0;

      const discount = product.discount;

      // Check product discount validity
      if (
        discount?.amount > 0 &&
        discount.validFrom &&
        now >= discount.validFrom &&
        (!discount.validUntil || now <= discount.validUntil)
      ) {
        if (discount.type === "percentage") {
          productDiscountAmount =
            (originalPrice * discount.amount) / 100;
        } else if (discount.type === "flat") {
          productDiscountAmount = discount.amount;
        }
      }

      // Discount cannot exceed product price
      productDiscountAmount = Math.min(
        productDiscountAmount,
        originalPrice
      );

      const discountedPrice = originalPrice - productDiscountAmount;

      // Calculate both totals
      totalPriceBeforeDiscount += originalPrice * item.quantity;

      totalPriceAfterDiscount += discountedPrice * item.quantity;
    });

    let discountAmount = 0;

    // Calculate eligible total after product discounts
    let eligibleTotal = 0;

    eligibleItems.forEach(item => {
      const product = dbProducts.find(
        p => p._id.toString() === item.productId.toString()
      );

      const originalPrice = product.price;
      let productDiscountAmount = 0;

      const discount = product.discount;

      if (
        discount?.amount > 0 &&
        discount.validFrom &&
        now >= discount.validFrom &&
        (!discount.validUntil || now <= discount.validUntil)
      ) {
        if (discount.type === "percentage") {
          productDiscountAmount =
            (originalPrice * discount.amount) / 100;
        } else if (discount.type === "flat") {
          productDiscountAmount = discount.amount;
        }
      }

      productDiscountAmount = Math.min(
        productDiscountAmount,
        originalPrice
      );

      const discountedPrice = originalPrice - productDiscountAmount;

      eligibleTotal += discountedPrice * item.quantity;
    });

    // Check minimum purchase amount
    if (eligibleTotal < coupon.minPurchaseAmount) {
      throw new apiError(
        400,
        `Minimum purchase amount is ${coupon.minPurchaseAmount} for eligible products to apply this coupon`
      );
    }

    // Calculate coupon discount
    if (coupon.discountType === "percentage") {
      discountAmount =
        (eligibleTotal * coupon.discountValue) / 100;

      if (coupon.maxDiscountAmount != null) {
        discountAmount = Math.min(
          discountAmount,
          coupon.maxDiscountAmount
        );
      }
    } else {
      discountAmount = coupon.discountValue;
    }

    // Coupon discount cannot exceed eligible total
    discountAmount = Math.min(discountAmount, eligibleTotal);

    // Final payable price
    const totalPrice = Math.max(
      0,
      totalPriceAfterDiscount - discountAmount
    );

    return res.status(200).json(
      new apiResponse(
        200,
        {
          totalPriceBeforeDiscount,
          totalPriceAfterDiscount,
          eligibleTotal,
          discountAmount,
          totalPrice,
          appliedCoupon: coupon.code
        },
        "Total price calculated successfully"
      )
    );

  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }

    throw new apiError(500, error.message);
  }
});




export {
  getBagItems,
  getBagItemsDetails,
  addItemToBag,
  removeItemFromBag,
  clearBag,
  updateItemQuantityInBag,
  getBagTotalPriceAfterDiscount
}