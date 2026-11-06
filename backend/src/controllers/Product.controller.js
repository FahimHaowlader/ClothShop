import Product from "../models/Product.modal.js";

import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";

// user controllers 

/**
@desc    Get featured product
@route   GET /api/products/featured
@access  Public
 */
const getFeaturedProduct = asyncHandler(async (req, res) => {
  try {
    const product = await Product.findOne({ display: true, featured: true })
      .select(
        "-sizeGuide -description -specifications -instructions -gender -category -collectionName -bestSeller -featured -createdAt -updatedAt"
      );

    if (!product) {
      throw new apiError(404, "No featured product found");
    }

    return res.status(200).json(
      new apiResponse(200, product, "Featured product retrieved successfully")
    );
    } catch (error) {
    // Preserve custom operational errors (400, 404), otherwise throw 500
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});


/**
@desc    Get best seller products
@route   GET /api/products/bestsellers
@access  Public
 */
const getBestSellerProducts = asyncHandler(async (req, res) => {
  try {
    const products = await Product.find({ display: true, bestSeller: true })
      .select(
        "-sizeGuide -description -specifications -instructions -gender -category -collectionName -bestSeller -featured -createdAt -updatedAt"
      )
      .limit(4);

    if (!products || products.length === 0) {
      throw new apiError(404, "No best seller products found");
    }

    return res.status(200).json(
      new apiResponse(200, products, "Best seller products retrieved successfully")
    );
  }catch (error) {
    // Preserve custom operational errors (400, 404), otherwise throw 500
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});


/**
@desc    Get all products by user filter, category search, and pagination
@route   POST /api/products/filter
@access  Public
 */
export const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const {
      category,
      collectionName,
      gender,
      search,
      size,
      sortBy,
      page = 1,
      limit = 20,
    } = req.body;

    // Must always show displayed products
    const filter = { display: true };

    if (category) filter.category = category;
    if (collectionName) filter.collectionName = collectionName;
    if (gender) filter.gender = gender;

    // Search by product name or code
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { productCode: { $regex: search, $options: "i" } },
      ];
    }

    // Filter by size inside variants.availability array
    if (size) {
      filter["variants.availability.size"] = size;
    }

    // Handle sort options
    let sortOption = { createdAt: -1 }; // Default: newest first

    if (sortBy === "pre-order") {
      filter.canPreOrder = true;
    } else if (sortBy === "a-z") {
      sortOption = { name: 1 };
    } else if (sortBy === "newest") {
      sortOption = { createdAt: -1 };
    } else if (sortBy === "price-high-to-low") {
      sortOption = { price: -1 };
    } else if (sortBy === "price-low-to-high") {
      sortOption = { price: 1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .select(
          "-sizeGuide -description -specifications -instructions -gender -category -collectionName -bestSeller -featured -createdAt -updatedAt"
        )
        .sort(sortOption)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json(
      new apiResponse(
        200,
        {
          total,
          page: Number(page),
          totalPages: Math.ceil(total / Number(limit)),
          products,
        },
        "Products retrieved successfully"
      )
    );
  } catch (error) {
    // Preserve custom operational errors (400, 404), otherwise throw 500
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});


/**
@desc    Get single product details
@route   GET /api/products/:id
@access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new apiError(400, "Product ID is required");
    }
    
    const product = await Product.findById(id);

    // Check if the product exists AND if it is set to display
    if (!product || !product.display) {
      throw new apiError(404, "Product not found");
    }

    return res.status(200).json(
      new apiResponse(
        200,
        product,
        "Product details retrieved successfully"
      )
    );
  } catch (error) {
    // Preserve custom operational errors (400, 404), otherwise throw 500
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(500, error.message);
  }
});



/**
 * @desc    Create a new product with variants & discount rules
 * @route   POST /api/products
 * @access  Private (Admin / Major / Officer)
 */
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      sizeGuide,
      description,
      price,
      gender,
      category,
      collectionName,
      discount,
      productCode,
      display,
      canPreOrder,
      preOrderValid,
      variants,
    } = req.body;

    if (!name || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name and price are strictly required.",
      });
    }

    // Prevent duplicate product code
    if (productCode) {
      const existing = await Product.findOne({ productCode });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: "A product with this productCode already exists.",
        });
      }
    }

    const product = await Product.create({
      name,
      sizeGuide,
      description,
      price,
      gender,
      category,
      collectionName,
      discount,
      productCode,
      display,
      canPreOrder,
      preOrderValid,
      variants,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



export const getproductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.find({ category, display: true }).sort({ createdAt: -1 });

    if (!products || products.length === 0) {
      return res.status(404).json({ success: false, message: "No products found for this category" });
    }

    return res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single product details with active discount calculation
 * @route   GET /api/products/:id
 * @access  Public
 */

/**
 * @desc    Update product details or active discount settings // name , price ,              description , gender , category , product code , 
 * @route   PUT /api/products/:id
 * @access  Private (Admin / Major / Officer)
 */
export const updateProductBasicInfo = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductVariants = async (req, res) => {
  try {
    const { id } = req.params;
    const { variants } = req.body;

    if (!Array.isArray(variants)) {
      return res.status(400).json({
        success: false,
        message: "Variants must be an array.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { variants },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product variants updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;

    if (!discount || typeof discount !== "object") {
      return res.status(400).json({
        success: false,
        message: "Discount must be an object with type, amount, and valid fields.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { discount },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product discount updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateProductDisplayStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { display } = req.body;

    if (typeof display !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Display status must be a boolean value.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { display },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product display status updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const updateProductPreOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { canPreOrder, preOrderValid } = req.body;

    if (typeof canPreOrder !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "canPreOrder must be a boolean value.",
      });
    }

    if (preOrderValid && new Date(preOrderValid) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "preOrderValid date cannot be earlier than the current date.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { canPreOrder, preOrderValid },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product pre-order status updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { productCode } = req.body;

    if (!productCode) {
      return res.status(400).json({
        success: false,
        message: "productCode is required.",
      });
    }

    // Check for duplicate product code
    const existingProduct = await Product.findOne({ productCode, _id: { $ne: id } });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: "A product with this productCode already exists.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { productCode },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product code updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateProductSizeGuide = async (req, res) => {
  try {
    const { id } = req.params;
    const { sizeGuide } = req.body;

    if (!sizeGuide) {
      return res.status(400).json({
        success: false,
        message: "sizeGuide is required.",
      });
    }

    const product = await Product.findByIdAndUpdate(
      id,
      { sizeGuide },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product size guide updated successfully",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update stock availability status for a specific size in a variant
 * @route   PATCH /api/products/:id/availability
 * @access  Private (Admin / Major / Officer)
 */
export const updateSizeAvailability = async (req, res) => {
  try {
    const { id } = req.params;
    const { color, size, available } = req.body;

    if (!color || !size || available === undefined) {
      return res.status(400).json({
        success: false,
        message: "color, size, and available status are required.",
      });
    }

    // Atomic update inside embedded variants and availability arrays
    const product = await Product.findOneAndUpdate(
      { _id: id, "variants.color": color },
      {
        $set: {
          "variants.$[varElem].availability.$[availElem].available": Boolean(available),
        },
      },
      {
        arrayFilters: [
          { "varElem.color": color },
          { "availElem.size": size },
        ],
        new: true,
      }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product, color variant, or size not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Size availability updated",
      product,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin / Major)
 */
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export  { getFeaturedProduct,
          getBestSellerProducts

        };