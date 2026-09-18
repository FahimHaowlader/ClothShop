import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema(
  {
    user: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      unique: true 
    },
    items: {
      type: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
          pic: { type: String },
          color: { type: String },
          size: { type: String  ,required: true},
          quantity: { type: Number, required: true, min: 1 },
          unitPrice: { type: Number, required: true },
          preOrder: { type: Boolean, default: false },
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
          
        },
      ],
      validate: [
        (val) => val.length <= 20,
        'Cart max limit reached (20 items max)',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);