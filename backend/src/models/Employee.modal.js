import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const EmployeeSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: [true, 'Employee name is required'], 
      trim: true 
    },
    employeeId: { 
      type: String, 
      unique: true, 
      sparse: true, 
      trim: true 
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: 'Please enter a valid email address.',
      },
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      unique: true,
      trim: true,
      validate: {
        validator: function (v) {
          return /^01[0-9]{9}$/.test(v);
        },
        message: 'Phone number must contain only numbers, start with 01, and be 11 digits long.',
      },
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'] 
    },
    pic: { type: String, required: true },
    address: { type: String, trim: true },
    role: { 
      type: String, 
      enum: ['officer', 'general', 'major'], // Fixed unquoted string bug
      default: 'officer' 
    },
    joinAt: { type: Date, required: true, },
    leaveAt: { type: Date },
    access: { type: Boolean, default: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

// 🔹 Pre-save hook: Hash password before saving
EmployeeSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error);
  }
});

// 🔹 Instance method: Compare passwords
EmployeeSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// 🔹 Instance method: Generate Access Token
EmployeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      employeeId: this.employeeId,
      email: this.email,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d' }
  );
};

// 🔹 Instance method: Generate Refresh Token
EmployeeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '10d' }
  );
};

// 🔹 Instance method: Validate Refresh Token
EmployeeSchema.methods.validateRefreshToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded?._id?.toString() === this._id.toString();
  } catch (error) {
    return false;
  }
};

export default  mongoose.model('Employee', EmployeeSchema);