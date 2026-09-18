import express from 'express';
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  toggleReviewApproval,
} from '../controllers/review.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 💬 PUBLIC REVIEW ROUTES
// ==========================================

// Get all approved reviews for a specific product with rating aggregates
router.get('/product/:productId', getProductReviews);


// ==========================================
// 🛒 CUSTOMER PROTECTED ROUTES
// ==========================================

// Submit a product review (verifies prior purchase if orderId is provided)
router.post('/', protect, createReview);

// Update review content or rating (Review author only)
router.put('/:id', protect, updateReview);

// Delete a review (Review author or Staff member)
router.delete('/:id', protect, deleteReview);


// ==========================================
// 👮 STAFF MODERATION ROUTES
// ==========================================

// Approve or hide a customer review
router.patch(
  '/:id/approval',
  protectEmployee,
  authorizeRoles('admin', 'major', 'officer'),
  toggleReviewApproval
);

export default router;