const mongoose = require('mongoose');

const CouponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ['flat', 'percentage'], required: true },
    discountValue: { type: Number, required: true },
    minPurchaseAmount: { type: Number, default: 0 },
    maxDiscountAmount: { type: Number },
    validFrom: {
  type: Date,
  validate: {
    validator: function (v) {
      if (!v) return true; // Allows null/undefined if optional
      return v >= new Date();
    },
    message: 'preOrderValid date cannot be earlier than the current date.',
  },
},
    validUntil: {
  type: Date,
  validate: {
    validator: function (v) {
      if (!v) return true;
      
      // Get validFrom date from the current document context
      const validFromDate = this.validFrom || new Date();
      
      // Ensure validUntil is greater than or equal to validFrom
      return v >= validFromDate;
    },
    message: 'validUntil date cannot be earlier than validFrom date.',
  },
},
    perUserLimit: { type: Number, default: 1 },
    useCount: { type: Number, default: 0 },
    discountApplyTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', CouponSchema);