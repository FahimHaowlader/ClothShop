import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const EmployeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
    type: String,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Please enter a valid email address containing "@" and a domain.',
    },
  },
    pic: { type: String },
    password: { type: String,minlength: 8 },
    joinAt: { type: Date },
    leaveAt: { type: Date },
    employeeId: { type: String, unique: true, sparse: true },
    phone: {
  type: String,
  required: [true, 'Phone number is required'],
  trim: true,
  validate: {
    validator: function (v) {
      // Must contain numbers ONLY, start with 01, and be 11 digits long
      return /^01[0-9]{9}$/.test(v);
    },
    message: 'Phone number must contain only numbers, start with 01, and be 11 digits long.',
  },
},
    address: { type: String },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
    role: { type: String,enum :['officer','general',major], default: 'officer' },
  },
  { timestamps: true }
);


// 🔹 Pre-save middleware for hashing password
EmployeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  } catch (error) {
    return next(error);
  }
});

// 🔹 Compare passwords
EmployeeSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// 🔹 Generate access token
EmployeeSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      studentId: this.studentId,
      accountType: this.accountType,
      role: this.role,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// 🔹 Generate refresh token
EmployeeSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
  );
};

// 🔹 Validate refresh token
EmployeeSchema.methods.validateRefreshToken = function (token) {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    return decoded?._id?.toString() === this._id.toString();
  } catch (error) {
    return false;
  }
};

export default mongoose.model('Employee', EmployeeSchema);