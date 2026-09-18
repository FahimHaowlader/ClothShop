import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

/**
 * @desc    Create a product review (Optional verified-purchase check)
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */
export const createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;
    const userId = req.user._id;

    if (!productId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and a rating between 1 and 5 are required.',
      });
    }

    // 1. Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found.' });
    }

    // 2. Prevent duplicate reviews by the same user for the same product
    const existingReview = await Review.findOne({ user: userId, product: productId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this product.',
      });
    }

    // 3. Optional: Verify purchase if orderId is provided or verify against user order history
    let validOrderId = null;
    if (orderId) {
      const verifiedOrder = await Order.findOne({
        _id: orderId,
        user: userId,
        'items.productId': productId,
        orderStatus: 'Delivered', // Ensures only delivered products can be reviewed
      });

      if (!verifiedOrder) {
        return res.status(400).json({
          success: false,
          message: 'Invalid order or product has not been delivered yet.',
        });
      }
      validOrderId = verifiedOrder._id;
    }

    // 4. Create review
    const review = await Review.create({
      user: userId,
      product: productId,
      order: validOrderId,
      rating: Number(rating),
      comment,
      isApproved: true, // Defaulting to approved per your schema
    });

    return res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all approved reviews for a specific product with rating aggregate
 * @route   GET /api/reviews/product/:productId
 * @access  Public
 */
export const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Fetch approved reviews with user details
    const [reviews, total] = await Promise.all([
      Review.find({ product: productId, isApproved: true })
        .populate('user', 'name pic')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Review.countDocuments({ product: productId, isApproved: true }),
    ]);

    // Calculate rating aggregates (Average & Distribution)
    const stats = await Review.aggregate([
      { $match: { product: product._id || new Review().schema.tree.product.type(productId), isApproved: true } },
      {
        $group: {
          _id: '$product',
          averageRating: { $avg: '$rating' },
          totalReviews: { $sum: 1 },
        },
      },
    ]);

    const averageRating = stats.length > 0 ? Number(stats[0].averageRating.toFixed(1)) : 0;

    return res.status(200).json({
      success: true,
      count: reviews.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      averageRating,
      reviews,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update an existing review
 * @route   PUT /api/reviews/:id
 * @access  Private (Review Owner)
 */
export const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findById(id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Ensure only the review author can modify it
    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    if (rating !== undefined) review.rating = Number(rating);
    if (comment !== undefined) review.comment = comment;

    await review.save();

    return res.status(200).json({
      success: true,
      message: 'Review updated successfully',
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Review Owner or Admin/Major/Officer)
 */
export const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    const isOwner = review.user.toString() === req.user?._id?.toString();
    const isStaff = ['admin', 'major', 'officer'].includes(req.employee?.role);

    if (!isOwner && !isStaff) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    await review.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Toggle review approval status (Moderation)
 * @route   PATCH /api/reviews/:id/approval
 * @access  Private (Admin / Major / Officer)
 */
export const toggleReviewApproval = async (req, res) => {
  try {
    const { id } = req.params;
    const { isApproved } = req.body;

    const review = await Review.findByIdAndUpdate(
      id,
      { $set: { isApproved: Boolean(isApproved) } },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    return res.status(200).json({
      success: true,
      message: `Review ${review.isApproved ? 'approved' : 'hidden'} successfully`,
      review,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};