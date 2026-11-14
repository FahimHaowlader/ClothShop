import Review from '../models/Review.modal.js';
import Order from '../models/Order.modal.js';
import Product from '../models/Product.modal.js';


import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";



/**
 * @desc    Create a product review (Optional verified-purchase check)
 * @route   POST /api/reviews
 * @access  Private (Customer)
 */

const giveReview = asyncHandler(async (req, res) => {
  try {
  const { productId, orderId, rating, comment } = req.body;
  const userId = req.user._id;

  // 1. Validate required fields
  if (!productId || !orderId || rating === undefined || rating === null) {
    throw new apiError("Product, order, and rating are required.", 400);
  }

  // 2. Validate ObjectIds
  if (
    !mongoose.Types.ObjectId.isValid(productId) ||
    !mongoose.Types.ObjectId.isValid(orderId)
  ) {
    throw new apiError("Invalid product or order ID.", 400);
  }

  // 3. Validate rating
  const numericRating = Number(rating);

  if (
    !Number.isInteger(numericRating) ||
    numericRating < 1 ||
    numericRating > 5
  ) {
    throw new apiError("Rating must be an integer between 1 and 5.", 400);
  }

  // 4. Validate comment
  if (comment !== undefined && typeof comment !== "string") {
    throw new apiError("Comment must be a string.", 400);
  }

  const trimmedComment = comment?.trim();

  const session = await mongoose.startSession();

  try {
    let createdReview;

    await session.withTransaction(async () => {
      // 5. Verify delivered order belongs to the user
      const verifiedOrder = await Order.findOne({
        _id: orderId,
        user: userId,
        orderItems: {
          $elemMatch: {
            productId,
          },
        },
        orderStatus: "Delivered",
      })
        .select("_id")
        .session(session);

      if (!verifiedOrder) {
        throw new apiError(
          "You can only review products from your delivered orders.",
          400
        );
      }

      // 6. Prevent duplicate reviews
      const existingReview = await Review.exists({
        user: userId,
        product: productId,
      }).session(session);

      if (existingReview) {
        throw new apiError(
          "You have already reviewed this product.",
          409
        );
      }

      // 7. Create review
      const [review] = await Review.create(
        [
          {
            user: userId,
            product: productId,
            order: verifiedOrder._id,
            rating: numericRating,
            comment: trimmedComment,
          },
        ],
        { session }
      );

      // 8. Update product rating
      const product = await Product.findById(productId)
        .select("review")
        .session(session);

      if (!product) {
        throw new apiError("Product not found.", 404);
      }

      const { averageRating, reviewCount } = product.review;

      const newAverageRating =
        ((averageRating * reviewCount) + numericRating) /
        (reviewCount + 1);

      product.review.averageRating = Number(
        newAverageRating.toFixed(2)
      );

      product.review.reviewCount += 1;

      await product.save({ session });

      createdReview = review;
    });

    return res.status(201).json(
      new apiResponse(
        201,
        "Review submitted successfully.",
        createdReview
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error; // Re-throw known apiError for centralized handling
    }
    throw new apiError("Failed to submit review. Please try again later.", 500);
    } 
    finally {
    await session.endSession();
  }
} catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to submit review. Please try again later.", 500);
} 
});



/**
 * @desc    Get all approved reviews for a specific product with rating aggregate
 * @route   GET /api/reviews/product
 * @access  Public
 */

 const getProductReviews = asyncHandler(async (req, res) => {
  try {
  const { productId,page = 1,limit = 10 } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError("Invalid product ID.", 400);
  }

 
  const skip = (page - 1) * limit;


  // Fetch approved reviews
  const reviews = await Review.find({
    product: productId,
    isApproved: true,
  })
    .populate("user", "firstName lastName ")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return res.status(200).json(
    new apiResponse(200, "Product reviews fetched successfully.", {
      page,
      limit,
      reviews,
      hasNextPage: reviews.length === limit,
    })
  );
} catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to fetch product reviews. Please try again later.", 500);
}
});



/**
 * @desc    Get product rating stats (average rating and review count)
 * @route   GET /api/reviews/product/:productId/stats
 * @access  Public
 */

const getProductRatingStats = asyncHandler(async (req, res) => {
  try {
  const { productId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError("Invalid product ID.", 400);
  }

  const stats = await Product.findById(productId)
    .select("rating")
    .lean();

  if (!stats) {
    throw new apiError("Product not found.", 404);
  }

  return res.status(200).json(
    new apiResponse(
      200,
      "Product rating stats fetched successfully.",
      stats
    )
  );
} catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to fetch product rating stats. Please try again later.", 500);
}
});



/**
 * @desc    Get a user's review for a specific product
 * @route   GET /api/reviews/product/:productId/user-review
 * @access  Private (Customer)
 */

const getUserReview = asyncHandler(async (req, res) => {
  try {
  const { productId } = req.params;
  const userId = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError("Invalid product ID.", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    throw new apiError("Invalid user ID.", 400);
  }


  const review = await Review.findOne({
    user: userId,
    product: productId,
  }).lean();

  if (!review) {
    return res.status(404).json(
      new apiResponse(404, "No review found for this product by the user.", null)
    );
  }

  return res.status(200).json(
    new apiResponse(200, "User review fetched successfully.", review)
  );
} catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to fetch user review. Please try again later.", 500);
}
});

/**
 * @desc    Update an existing review
 * @route   PUT /api/reviews/:id
 * @access  Private (Review Owner)
 */




const updateReview = asyncHandler(async (req, res) => {
  try{
  const userId = req.user._id;
  const { reviewId } = req.params;
  const { rating, comment } = req.body;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new apiError("Invalid review ID.", 400);
  }

  if (rating === undefined && comment === undefined) {
    throw new apiError("Please provide a rating or comment to update.", 400);
  }

  const updateData = {};

  // Validate rating
  if (rating !== undefined) {
    const parsedRating = Number(rating);

    if (!Number.isInteger(parsedRating) || parsedRating < 1 || parsedRating > 5) {
      throw new apiError("Rating must be an integer between 1 and 5.", 400);
    }

    updateData.rating = parsedRating;
  }

  // Validate comment
  if (comment !== undefined) {
    if (typeof comment !== "string" || !comment.trim()) {
      throw new apiError("Comment cannot be empty.", 400);
    }

    updateData.comment = comment.trim();
  }

  const session = await mongoose.startSession();

  try {
    let updatedReview;

    await session.withTransaction(async () => {
      // 1. Find review
      const previousReview = await Review.findOne({
        _id: reviewId,
        user: userId,
      }).session(session);

      if (!previousReview) {
        throw new apiError("Review not found.", 404);
      }

      // 2. Calculate rating difference
      const oldRating = previousReview.rating;
      const newRating = updateData.rating ?? oldRating;

      const ratingDifference = newRating - oldRating;

      if (
        ratingDifference === 0 &&
        updateData.comment === undefined
      ) {
        throw new apiError("No changes detected in the review.", 400);
      }

      // 3. Update review
      if (updateData.rating !== undefined) {
        previousReview.rating = updateData.rating;
      }

      if (updateData.comment !== undefined) {
        previousReview.comment = updateData.comment;
      }

      await previousReview.save({ session });

      // 4. Update product average rating
      if (previousReview.isApproved && ratingDifference !== 0) {
        const product = await Product.findById(
          previousReview.product
        ).select("review").session(session);

        if (!product) {
          throw new apiError("Product not found.", 404);
        }

        const { averageRating, reviewCount } = product.review;

        if (reviewCount > 0) {
          product.review.averageRating =
            ((averageRating * reviewCount) + ratingDifference) /
            reviewCount;

          await product.save({ session });
        }
      }

      updatedReview = previousReview;
    });

    return res.status(200).json(
      new apiResponse(
        200,
        "Review updated successfully.",
        updatedReview
      )
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError("Failed to update review. Please try again later.", 500);
  } finally {
    await session.endSession();
  }
}
  catch (error) {
    if (error instanceof apiError) {
      throw error; // Re-throw known apiError for centralized handling
    }
    throw new apiError("Failed to update review. Please try again later.", 500);
  }
});




/**
 * @desc    Delete a review
 * @route   DELETE /api/reviews/:id
 * @access  Private (Review Owner or Admin/Major/Officer)
 */

const deleteReview = asyncHandler(async (req, res) => {
  try {
  const { reviewId } = req.body;
  const userId = req?.user?._id;
  const employeeRole = req?.user?.role;

  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new apiError("Invalid review ID.", 400);
  }

  const isStaff = ["general", "major"].includes(employeeRole);

  const session = await mongoose.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. Find review
      const review = await Review.findById(reviewId).session(session);

      if (!review) {
        throw new apiError("Review not found.", 404);
      }

      // 2. Verify permission
      const isOwner =
        userId && review.user.toString() === userId.toString();

      if (!isOwner && !isStaff) {
        throw new apiError(
          "You are not authorized to delete this review.",
          403
        );
      }

      // 3. Update product rating if review is approved
      if (review.isApproved) {
        const product = await Product.findById(review.product).session(session);

        if (!product) {
          throw new apiError("Product not found.", 404);
        }

        const currentCount = product.rating.count;
        const currentAverage = product.rating.average;

        const newCount = Math.max(0, currentCount - 1);

        product.rating.count = newCount;

        product.rating.average =
          newCount > 0
            ? Number(
                (
                  (currentAverage * currentCount - review.rating) /
                  newCount
                ).toFixed(2)
              )
            : 0;

        await product.save({ session });
      }

      // 4. Delete review
      await review.deleteOne({ session });
    });
  } finally {
    await session.endSession();
  }

  return res.status(200).json(
    new apiResponse(200, "Review deleted successfully.", null)
  );
}
 catch (error) {
  if (error instanceof apiError) {
    throw error;
  }
  throw new apiError("Failed to delete review. Please try again later.", 500);
}
});



/**
 * @desc    Get all reviews for a specific product (Staff view)
 * @route   GET /api/reviews/product/:productId/staff
 * @access  Private (Admin / Major / Officer)
 */

const getProductReviewsForStaff = asyncHandler(async (req, res) => {
  try {
  const { productId} = req.params;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new apiError("Invalid product ID.", 400);
  }


  // Fetch approved reviews
  const reviews = await Review.find({
    product: productId,
  })
    .populate("user", "firstName lastName ")
    .sort({ createdAt: -1 })
    .lean();

  return res.status(200).json(
    new apiResponse(200, "Product reviews fetched successfully.", {
      reviews,
    })
  );
} catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to fetch product reviews. Please try again later.", 500);
}
});

/**
 * @desc    Toggle review approval status (Moderation)
 * @route   PATCH /api/reviews/:id/approval
 * @access  Private (Admin / Major / Officer)
 */

const toggleReviewApproval = asyncHandler(async (req, res) => {
  try{
  const { isApproved,reviewId } = req.body;
  const employeeRole = req.user?.role;

  // 1. Check employee permission
  if (!["major", "general"].includes(employeeRole)) {
    throw new apiError(
      "You are not authorized to manage review approvals.",
      403
    );
  }

  // 2. Validate review ID
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    throw new apiError("Invalid review ID.", 400);
  }

  // 3. Validate approval status
  if (typeof isApproved !== "boolean") {
    throw new apiError("isApproved must be a boolean.", 400);
  }

  const session = await mongoose.startSession();

  try {
    let updatedReview;

    await session.withTransaction(async () => {
      // 4. Find review
      const review = await Review.findById(reviewId).session(session);

      if (!review) {
        throw new apiError("Review not found.", 404);
      }

      // 5. Check whether approval status changed
      if (review.isApproved === isApproved) {
        updatedReview = review;
        return;
      }

      // 6. Find product
      const product = await Product.findById(review.product)
        .select("review")
        .session(session);

      if (!product) {
        throw new apiError("Product not found.", 404);
      }

      const { averageRating, reviewCount } = product.review;

      // 7. Update product rating
      if (isApproved) {
        const newReviewCount = reviewCount + 1;

        const newAverageRating =
          ((averageRating * reviewCount) + review.rating) /
          newReviewCount;

        product.review.averageRating = Number(
          newAverageRating.toFixed(2)
        );

        product.review.reviewCount = newReviewCount;
      } else {
        const newReviewCount = Math.max(0, reviewCount - 1);

        const newAverageRating =
          newReviewCount > 0
            ? ((averageRating * reviewCount) - review.rating) /
              newReviewCount
            : 0;

        product.review.averageRating = Number(
          Math.max(0, newAverageRating).toFixed(2)
        );

        product.review.reviewCount = newReviewCount;
      }

      // 8. Update review approval
      review.isApproved = isApproved;

      await Promise.all([
        review.save({ session }),
        product.save({ session }),
      ]);

      updatedReview = review;
    });

    return res.status(200).json(
      new apiResponse(
        200,
        `Review ${isApproved ? "approved" : "hidden"} successfully.`,
        updatedReview
      )
    );
  } finally {
    await session.endSession();
  }
}catch (error) {
  if (error instanceof apiError) {
    throw error; // Re-throw known apiError for centralized handling
  }
  throw new apiError("Failed to toggle review approval. Please try again later.", 500);
}
});


export {
  giveReview,
  getProductReviews,
  getProductRatingStats,
  getUserReview,
  updateReview,
  deleteReview,
  getProductReviewsForStaff,
  toggleReviewApproval
};
