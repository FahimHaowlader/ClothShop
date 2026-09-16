const mongoose = require('mongoose');

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

module.exports = mongoose.model('Employee', EmployeeSchema);