import express from 'express';
import {
  validateAndApplyCoupon,
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
} from '../controllers/coupon.controller.js';

import verufyUser from '../middleware/verifyUser.middleware.js';

const couponRouter = express.Router();



// router.use(verufyUser);

couponRouter.get('/',(req, res) => {
  res.status(200).json({ message: "Coupon route is working!" });
});



// Create a new coupon OR get all coupons
couponRouter.route('/re')
  .post(createCoupon)
  .get(getAllCoupons);

// Single coupon management by ID
couponRouter.route('/:id')
  .get(getCouponById)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default couponRouter;