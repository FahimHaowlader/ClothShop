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
          quantity: { type: Number, required: true, min: 1 },
          unitPrice: { type: Number, required: true },
          preOrder: { type: Boolean, default: false },
        },
      ],
      validate: [
        (val) => val.length <= 10,
        'Cart max limit reached (10 items max)',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Cart', CartSchema);