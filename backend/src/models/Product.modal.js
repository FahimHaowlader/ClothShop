const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sizeGuide: { type: String },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    gender: { type: String },
    category: { type: String }, // hardcoded for now, can be changed to enum later

    collectionName: { type: String }, // hardcoded for now, can be changed to enum later
    discount: {
      type: { type: String, enum: ["flat", "percentage"] },
      amount: { type: Number },
      valid: {
        type: Date,
        validate: {
          validator: function (v) {
            if (!v) return true; // Allows null/undefined if optional
            return v >= new Date();
          },
          message: "Valid date cannot be earlier than the current date.",
        },
      },
    },
    productCode: { type: String, unique: true, sparse: true },
    display: { type: Boolean, default: false },
    canPreOrder: { type: Boolean, default: false },
    preOrderValid: {
      type: Date,
      validate: {
        validator: function (v) {
          if (!v) return true; // Allows null/undefined if optional
          return v >= new Date();
        },
        message: "preOrderValid date cannot be earlier than the current date.",
      },
    },
    variants: [
      {
        color: { type: String, required: true },
        pic: [{ type: String }],
        availability: [
          {
            size: { type: String, required: true },
            available: { type: Boolean, default: true },
          },
        ],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", ProductSchema);
