import mongoose from 'mongoose';

const CouponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    discountType: {
      type: String,
      enum: ['flat', 'percentage'],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minPurchaseAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maxDiscountAmount: {
      type: Number,
      min: 0,
    },

    validFrom: {
      type: Date,
      default: null,
    },

    validUntil: {
      type: Date,
      default: null,
      validate: {
        validator: function (v) {
          if (!v) return true;
          return !this.validFrom || v >= this.validFrom;
        },
        message: 'validUntil cannot be earlier than validFrom.',
      },
    },

    useCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    discountApplyTo: {
      type: {
        type: String,
        enum: ['general', 'individual'],
        default: 'general',
      },

      products: {
        type: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
          },
        ],
        default: [],
        validate: {
          validator: function (products) {
            if (this.type === 'individual') {
              return products.length > 0;
            }
            return products.length === 0;
          },
          message:
            'Individual coupons require product IDs, while general coupons cannot have product IDs.',
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model('Coupon', CouponSchema);