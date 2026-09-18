import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Name is required'], 
      trim: true 
    },
    phone: {
      type: String,
      unique: true, // Prevents duplicate registrations
      trim: true,
      validate: {
        validator: function (v) {
          // Validates 11-digit Bangladeshi mobile numbers starting with 01
          return /^01[0-9]{9}$/.test(v);
        },
        message: 'Phone number must contain only numbers, start with 01, and be 11 digits long.',
      },
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // Prevents duplicate accounts
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address.',
      },
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'], 
      minlength: [8, 'Password must be at least 8 characters'] 
    },
    refreshToken: { type: String },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    postCode: { type: String, trim: true },
    access: { type: Boolean, default: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    orders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }], // Changed to Array
    coupons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Coupon' }],
  },
  { timestamps: true }
);

// 🔹 Pre-save hook: Hash password before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error);
  }
});

// 🔹 Instance method: Compare passwords
UserSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Instance method: Generate Access Token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      phone: this.phone,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
  );
};

// 🔹 Instance method: Generate Refresh Token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
  );
};

// 🔹 Instance method: Validate Refresh Token
UserSchema.methods.validateRefreshToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded?._id?.toString() === this._id.toString();
  } catch (error) {
    return false;
  }
};

export default  mongoose.model('User', UserSchema);