import express from 'express';
import {
  validateAndApplyCoupon,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 🎟️ CUSTOMER COUPON ROUTES
// ==========================================

// Validate and calculate discount for cart total
router.post('/apply', protect, validateAndApplyCoupon);


// ==========================================
// 👮 STAFF & ADMIN COUPON MANAGEMENT
// ==========================================

// Protect all management endpoints for authorized staff
router.use(protectEmployee);
router.use(authorizeRoles('admin', 'major', 'officer'));

// Create a new coupon OR get all coupons
router.route('/')
  .post(createCoupon)
  .get(getAllCoupons);

// Single coupon management by ID
router.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default router;