import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleReviewApproval,
} from '../controllers/review.controller.js';

import verifyUser from '../middleware/verifyUser.middleware.js';

const reviewRouter = express.Router();

// ==========================================
// 💬 PUBLIC REVIEW ROUTES
// ==========================================

reviewRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "Review route is working!" });
});

reviewRouter.get('/review/:productId', getProductReviews);

reviewRouter.use(verifyUser); // Enforce authentication on all review operations
reviewRouter.post('/create-review', createReview);


// Get all approved reviews for a specific product with rating aggregates
reviewRouter.get('/product/:productId', getProductReviews);


// ==========================================
// 🛒 CUSTOMER PROTECTED ROUTES
// ==========================================



// ==========================================
// 👮 STAFF MODERATION ROUTES
// ==========================================



export default reviewRouter;