import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updatePaymentStatus,
  processRefund,
} from '../controllers/order.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 🛒 CUSTOMER & PUBLIC ORDER ROUTES
// ==========================================

// Create a new order (Supports guest or logged-in checkout)
router.post('/', createOrder);

// Get orders belonging to the logged-in user
router.get('/my-orders', protect, getMyOrders);

// Get single order details by Mongo ID or custom orderId (e.g., ORD-829401)
router.get('/:id', getOrderById);


// ==========================================
// 👮 STAFF & ADMIN ORDER MANAGEMENT ROUTES
// ==========================================

// Protect all following endpoints for authorized staff members
router.use(protectEmployee);
router.use(authorizeRoles('admin', 'major', 'officer'));

// Get all store orders with query filtering (status, payment, preOrder, pagination)
router.get('/', getAllOrders);

// Update order shipping/delivery workflow status (shipped, delivered, cancelled)
router.patch('/:id/status', updateOrderStatus);

// Update payment details and transaction ID
router.patch('/:id/payment', updatePaymentStatus);

// Process or record customer order refunds
router.patch('/:id/refund', processRefund);

export default router;