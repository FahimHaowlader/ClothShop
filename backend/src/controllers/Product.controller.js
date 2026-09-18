import Product from "../models/Product.js";

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

/**
 * @desc    Get all products (Filtered for storefront or admin panel)
 * @route   GET /api/products
 * @access  Public
 */
export const getAllProducts = async (req, res) => {
  try {
    const {
      category,
      collectionName,
      gender,
      display,
      minPrice,
      maxPrice,
      color,
      search,
      page = 1,
      limit = 20,
    } = req.query;

    const filter = {};

    // Filter by store active display unless specified by admin query
    if (display !== undefined) {
      filter.display = display === "true";
    } else {
      filter.display = true; // Default storefront mode
    }

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

    // Filter by color inside variants array
    if (color) {
      filter["variants.color"] = { $regex: color, $options: "i" };
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      count: products.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
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
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Calculate dynamic effective final price based on active discount rules
    let finalPrice = product.price;
    const isDiscountValid =
      product.discount?.amount > 0 &&
      (!product.discount.valid || new Date(product.discount.valid) >= new Date());

    if (isDiscountValid) {
      if (product.discount.type === "percentage") {
        finalPrice = product.price - (product.price * product.discount.amount) / 100;
      } else if (product.discount.type === "flat") {
        finalPrice = Math.max(0, product.price - product.discount.amount);
      }
    }

    return res.status(200).json({
      success: true,
      product,
      computedPrice: {
        originalPrice: product.price,
        finalPrice,
        hasActiveDiscount: isDiscountValid,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update product details or active discount settings
 * @route   PUT /api/products/:id
 * @access  Private (Admin / Major / Officer)
 */
export const updateProduct = async (req, res) => {
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