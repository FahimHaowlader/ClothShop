import express from 'express';
import  {
  giveReview,
  getProductReviews,
  getProductRatingStats,
  getUserReview,
  updateReview,
  deleteReview,
  getProductReviewsForStaff,
  toggleReviewApproval
}from '../controllers/Review.controller.js';

import verifyUser from '../middleware/verifyUser.middleware.js';

const reviewRouter = express.Router();

// ==========================================
// 💬 PUBLIC REVIEW ROUTES
// ==========================================

reviewRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "Review route is working!" });
});

// Get all reviews for a specific product (Public view)
reviewRouter.get('/review/:productId', getProductReviews);

// Get a specific user's review for a product (Public view)
reviewRouter.get('/review/:productId/stats', getProductRatingStats);

reviewRouter.use(verifyUser); // Enforce authentication on all review operations

// user can give a review for a product they purchased
reviewRouter.post('/create-review', giveReview);


// Get user owned review for a specific product
reviewRouter.get('/user-review/:productId', getUserReview);

// Update a review (only by the review owner)
reviewRouter.patch('/update-review/:reviewId', updateReview);

// Delete a review (only by the review owner or admin)
reviewRouter.delete('/delete-review/:reviewId', deleteReview);





// Get all reviews for a specific product (Staff view)
reviewRouter.get('/product/:productId/staff', getProductReviewsForStaff);

// Toggle review approval status (only by staff)
reviewRouter.patch('/toggle-approval', toggleReviewApproval);



export default reviewRouter;