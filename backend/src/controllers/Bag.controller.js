import Bag from "../models/Bag.modal.js";
import Product from "../models/Product.modal.js";
import User from "../models/User.modal.js";


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



export {
  getBagItems,
  getBagItemsDetails,
  addItemToBag,
  removeItemFromBag,
  clearBag,
  updateItemQuantityInBag
}