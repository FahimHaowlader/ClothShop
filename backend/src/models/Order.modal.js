import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid8Upper = customAlphabet("0123456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
      unique: true,
      default: () => `${nanoid8Upper()}`,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    shippingAddress: { type: String, required: true },
    orderItems: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        productCode: { type: String , required: true },
        pic: { type: String, required: true },
        color: { type: String , required: true },
        size: { type: String, required: true, enum: ["XS","S", "M", "L", "XL", "XXL"] },
        quantity: { type: Number, required: true },
        unitPrice: { type: Number, required: true },
        subTotal: { type: Number, required: true },
        discount: {
          type: { type: String, enum: ["flat", "percentage"] },
          amount: { type: Number, default: 0 },
        },
        preOrder: { type: Boolean, default: false },
      },
    ],
    totalPriceBeforeDiscount: { type: Number, required: true },
    totalPriceAfterDiscount: { type: Number, required: true },
    totalPriceAfterCoupon: { type: Number, required: true },
    couponCode: { type: String },
    deliveryCharge: { type: Number, required: true },
    orderStatus: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "packed",
        "shipped",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },
    processedBy: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    shippedAt: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true;
          // Cannot be earlier than today (start of current day)
          return v >= new Date();
        },
        message: "shippedAt date cannot be earlier than today.",
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
        message: "deliveredAt date cannot be earlier than shippedAt date.",
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
        message: "cancelledAt date cannot be earlier than shippedAt date.",
      },
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    paymentMethod: { type: String, enum: ["cod", "online"] },
    transactionId: { type: String },
    paidAt: { type: Date },
    refundStatus: {
      type: String,
      enum: ["requested", "refunded", "rejected"],
    },
    totalPriceWithDeliveryCharge: { type: Number, required: true },
    storeAmount: { type: Number, required: true },
    refundMethod: { type: String, enum: ["offline", "online"] },
    refundReason: { type: String },
    refundDate: { type: Date },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    orderNote: { type: String },
    orderFrom: { type: String, enum: ["website", "social-media"] },
  },

  { timestamps: true },
);

export default mongoose.model("Order", OrderSchema);
