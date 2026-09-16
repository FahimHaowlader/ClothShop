const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      validate: {
        validator: function (v) {
          // Must contain numbers ONLY, start with 01, and be 11 digits long
          return /^01[0-9]{9}$/.test(v);
        },
        message:
          "Phone number must contain only numbers, start with 01, and be 11 digits long.",
      },
    },
    email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address containing "@" and a domain.',
    },
  },
    pass: { type: String, required: true ,minlength: 8},
    refreshToken: { type: String },
    address: { type: String },
    city: { type: String },
    postCode: { type: String },
    isActive: { type: Boolean, default: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", UserSchema);
