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

import verifyUser from '../middleware/verifyUser.middleware.js';

const orderRouter = express.Router();

// ==========================================
// 🛒 CUSTOMER & PUBLIC ORDER ROUTES
// ==========================================

orderRouter.get('/', (req, res) => {
  res.status(200).json({ message: "Order route is working!" });
});

// Create a new order (Supports guest or logged-in checkout)
orderRouter.post('/', createOrder);

// Get orders belonging to the logged-in user
orderRouter.get('/my-orders', verifyUser, getMyOrders);

// Get single order details by Mongo ID or custom orderId (e.g., ORD-829401)
orderRouter.get('/:id', getOrderById);


// ==========================================
// 👮 STAFF & ADMIN ORDER MANAGEMENT ROUTES
// ==========================================

// Protect all following endpoints for authorized staff members




// Get all store orders with query filtering (status, payment, preOrder, pagination)
orderRouter.get('/', getAllOrders);

// Update order shipping/delivery workflow status (shipped, delivered, cancelled)
orderRouter.patch('/:id/status', updateOrderStatus);

// Update payment details and transaction ID
orderRouter.patch('/:id/payment', updatePaymentStatus);

// Process or record customer order refunds
orderRouter.patch('/:id/refund', processRefund);

export default orderRouter;