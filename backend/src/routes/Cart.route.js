import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItemQuantity,
  removeCartItem,
  clearCart,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Enforce authentication on all cart operations
router.use(protect);

router.route('/')
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route('/items/:itemId')
  .patch(updateCartItemQuantity)
  .delete(removeCartItem);

export default router;