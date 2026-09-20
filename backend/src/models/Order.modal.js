import mongoose from 'mongoose';
import { customAlphabet } from 'nanoid';

const nanoid8Upper = customAlphabet('23456789ABCDEFGHJKLMNPQRSTUVWXYZ', 8);

const OrderSchema = new mongoose.Schema(
  {
   orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `${nanoid8Upper()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String },
    phone: { type: String },
    shippingAddress: { type: String },
    orderItems: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        pic: { type: String },
        color: { type: String },
        size: { type: String },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        subTotal: { type: Number, required: true },
        discount: {
          type:{ type: String, enum: ['flat', 'percentage']},
          amount: { type: Number, default: 0 },
        },
      },
    ],
    subTotalAfterDiscount: { type: Number },
    preOrder: { type: Boolean, default: false },
    orderStatus: {
      type: String,
      enum: ['pending',,'confirmed','packed','shipped' ,'delivered', 'cancelled'],
      default: 'pending',
    },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
    shippedAt: {
  type: Date,
  validate: {
    validator: function (v) {
      if (!v) return true;
      // Cannot be earlier than today (start of current day)
      return v >= new Date();
    },
    message: 'shippedAt date cannot be earlier than today.',
  },
},
deliveredAt: {
  type: Date,
  validate: {
    validator: function (v) {
      if (!v) return true;
      if (!this.shippedAt) return true; // If not shipped yet, pass validation
      return v >= this.shippedAt;
    },
    message: 'deliveredAt date cannot be earlier than shippedAt date.',
  },
},
cancelledAt: {
  type: Date,
  validate: {
    validator: function (v) {
      if (!v) return true;
      if (!this.shippedAt) return true; // If not shipped yet, pass validation
      return v >= this.shippedAt;
    },
    message: 'cancelledAt date cannot be earlier than shippedAt date.',
  },
},
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid',],
      default: 'unpaid',
    },
    paymentMethod: { type: String },
    transactionId: { type: String },
    paidAt: { type: Date },
    refundStatus: {
      type: String,
      enum: [ 'requested', 'refunded','rejected' ],
    },
    refundMethod: { type: String },
    refundReason: { type: String },
    refundDate: { type: Date },
    employeeId : { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  },
  { timestamps: true }
);

export default mongoose.model('Order', OrderSchema);