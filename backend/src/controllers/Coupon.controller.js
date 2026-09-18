import Coupon from '../models/Coupon.js';

/**
 * @desc    Validate and calculate coupon discount for checkout
 * @route   POST /api/coupons/apply
 * @access  Private (Customer)
 */
export const validateAndApplyCoupon = async (req, res) => {
  try {
    const { code, cartTotal, productIds = [] } = req.body;
    const userId = req.user._id;

    if (!code || cartTotal === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Coupon code and cart total are required.',
      });
    }

    // 1. Fetch coupon
    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid coupon code.' });
    }

    const now = new Date();

    // 2. Date validity checks
    if (coupon.validFrom && now < new Date(coupon.validFrom)) {
      return res.status(400).json({ success: false, message: 'Coupon is not active yet.' });
    }
    if (coupon.validUntil && now > new Date(coupon.validUntil)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired.' });
    }

    // 3. Minimum purchase check
    if (cartTotal < coupon.minPurchaseAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of $${coupon.minPurchaseAmount} is required for this coupon.`,
      });
    }

    // 4. Product scope restriction check (if applicable)
    if (coupon.discountApplyTo && coupon.discountApplyTo.length > 0) {
      const applicableProducts = coupon.discountApplyTo.map((id) => id.toString());
      const hasEligibleProduct = productIds.some((id) => applicableProducts.includes(id.toString()));

      if (!hasEligibleProduct) {
        return res.status(400).json({
          success: false,
          message: 'This coupon is not applicable to any items in your cart.',
        });
      }
    }

    // 5. Calculate discount amount
    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (cartTotal * coupon.discountValue) / 100;
      if (coupon.maxDiscountAmount && discountAmount > coupon.maxDiscountAmount) {
        discountAmount = coupon.maxDiscountAmount;
      }
    } else if (coupon.discountType === 'flat') {
      discountAmount = Math.min(coupon.discountValue, cartTotal);
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon applied successfully',
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: Number(discountAmount.toFixed(2)),
        finalTotal: Number(Math.max(0, cartTotal - discountAmount).toFixed(2)),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create a new coupon
 * @route   POST /api/coupons
 * @access  Private (Admin / Major / Officer)
 */
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      perUserLimit,
      discountApplyTo,
    } = req.body;

    if (!code || !discountType || discountValue === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Code, discountType, and discountValue are required.',
      });
    }

    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase().trim() });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists.' });
    }

    const coupon = await Coupon.create({
      code,
      discountType,
      discountValue,
      minPurchaseAmount,
      maxDiscountAmount,
      validFrom,
      validUntil,
      perUserLimit,
      discountApplyTo,
    });

    return res.status(201).json({
      success: true,
      message: 'Coupon created successfully',
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all coupons (Admin/Staff view)
 * @route   GET /api/coupons
 * @access  Private (Admin / Major / Officer)
 */
export const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find()
      .populate('discountApplyTo', 'name productCode')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: coupons.length,
      coupons,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single coupon details
 * @route   GET /api/coupons/:id
 * @access  Private (Admin / Major / Officer)
 */
export const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id).populate(
      'discountApplyTo',
      'name productCode'
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    return res.status(200).json({ success: true, coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update coupon details
 * @route   PUT /api/coupons/:id
 * @access  Private (Admin / Major / Officer)
 */
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon updated successfully',
      coupon,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete coupon
 * @route   DELETE /api/coupons/:id
 * @access  Private (Admin / Major)
 */
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found.' });
    }

    return res.status(200).json({
      success: true,
      message: 'Coupon deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};