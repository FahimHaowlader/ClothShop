import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sizeGuide: { type: String },
    description: { type: String },
    specifications: { type: [String] },
    instructions: { type: [String] },
    price: { type: Number, required: true, min: 0 },
    gender: { type: String },
    category: { type: String }, // hardcoded for now, can be changed to enum later

    collectionName: { type: String }, // hardcoded for now, can be changed to enum later
    discount: {
      type: { type: String, enum: ["flat", "percentage"] },
      amount: { type: Number },
      validFrom: {
        type: Date,
        required: [true, "Valid from date is required"],
        validate: {
          validator: function (v) {
            // Ensure it's a valid date and not in the past
            return v instanceof Date && !isNaN(v) && v >= new Date();
          },
          message:
            "Valid from date must be a valid date and cannot be in the past.",
        },
      },
      validUntil: {
        type: Date,
        validate: {
          validator: function (v) {
            // Allows null, undefined, or empty values if optional
            if (!v) return true;

            // Must be a valid date object
            if (!(v instanceof Date) || isNaN(v)) return false;

            // If validFrom exists on the document, validUntil must be >= validFrom
            if (this.validFrom && v < this.validFrom) {
              return false;
            }

            // Also ensure it's not earlier than the current date
            return v >= new Date();
          },
          message:
            "Valid until date must be a valid date, cannot be in the past, and must be equal to or after the valid from date.",
        },
      },
    },
    productCode: { type: String, unique: true, sparse: true },
    display: { type: Boolean, default: true },
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
            quantity: { type: Number, default: 0, min: 0 },
          },
        ],
      },
    ],
    bestSeller: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default mongoose.model("Product", ProductSchema);