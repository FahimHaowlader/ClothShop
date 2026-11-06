import mongoose from 'mongoose';

const BagSchema = new mongoose.Schema(
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
         
          
        },
      ],
      validate: [
        (val) => val.length <= 20,
        'Bag max limit reached (20 items max)',
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model('Bag', BagSchema);