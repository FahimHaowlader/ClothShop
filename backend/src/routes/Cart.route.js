import express from 'express';
import {
  addItemToCart,
  getUserCart,
  removeItemFromCart
} from '../controllers/Cart.controller.js';
import verifyUser from '../middleware/verifyUser.middleware.js'

const cartRouter = express.Router();

// Enforce authentication on all cart operations
//  cartRouter.use(verifyUser);
cartRouter.get('/', (req, res) => {
  res.status(200).json({ message: "Cart route is working!" });
});
cartRouter.route('/checkout')
  .get(getUserCart)
  .post(addItemToCart)
  .delete(removeItemFromCart);

export default cartRouter;