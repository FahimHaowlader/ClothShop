import express from 'express';
import {
  createOrder,

  updateOrderStatus,
  updatePaymentStatus,
  processRefund,
} from '../controllers/order.controller.js';

import verifyUser from '../middleware/verifyUser.middleware.js';

const orderRouter = express.Router();

// ==========================================
// 🛒 CUSTOMER & PUBLIC ORDER ROUTES
// ==========================================



orderRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "Order test route is working!" });
});



orderRouter.post('/order-total-price', (req, res) => {
  res.status(200).json({ message: "Order total price before discount route is working!" });
});

orderRouter.get('/order-total-price-after-discount', (req, res) => {
  res.status(200).json({ message: "Order total price after discount route is working!" });
});

orderRouter.post('/create-order', createOrder);

orderRouter.use(verifyUser); // Enforce authentication on all order operations

orderRouter.get('/my-orders', (req, res) => {
  res.status(200).json({ message: "Order checkout route is working!" });
});


// ==========================================
// 👮 STAFF & ADMIN ORDER MANAGEMENT ROUTES
// ==========================================

// Protect all following endpoints for authorized staff members




// Get all store orders with query filtering (status, payment, preOrder, pagination)


// Update order shipping/delivery workflow status (shipped, delivered, cancelled)
orderRouter.patch('/:id/status', updateOrderStatus);

// Update payment details and transaction ID
orderRouter.patch('/:id/payment', updatePaymentStatus);

// Process or record customer order refunds
orderRouter.patch('/:id/refund', processRefund);

export default orderRouter;