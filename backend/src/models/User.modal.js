
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const addressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      enum: ["home", "office", "other"],
    },
    street: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    postCode: {
      type: String,
      required: true,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },

    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      validate: {
        validator: (v) => !v || /^01[0-9]{9}$/.test(v),
        message: "Invalid Bangladeshi phone number.",
      },
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (v) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "Please enter a valid email address.",
      },
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    address: {
      type: [addressSchema],
      default: [],
      validate: [
        {
          validator: (addresses) => addresses.length <= 3,
          message: "You can add a maximum of 3 addresses.",
        },
        {
          validator: (addresses) => {
            const names = addresses.map((item) => item.name);
            return new Set(names).size === names.length;
          },
          message: "Address types must be unique.",
        },
        {
          validator: (addresses) =>
            addresses.filter((item) => item.isDefault).length <= 1,
          message: "Only one address can be default.",
        },
      ],
    },

    access: {
      type: Boolean,
      default: true,
    },

    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },

    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    coupons: {
  type: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
    },
  ],
  default: [],
  select: false,
},
  },
  { timestamps: true }
);

// Hash password
UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
UserSchema.methods.isPasswordCorrect = function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

// Generate access token
UserSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
    }
  );
};

// Generate refresh token
UserSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    { _id: this._id },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "10d",
    }
  );
};

// Validate refresh token
UserSchema.methods.validateRefreshToken = function (token) {
  try {
    const decoded = jwt.verify(
      token,
      process.env.REFRESH_TOKEN_SECRET
    );

    return decoded?._id?.toString() === this._id.toString();
  } catch {
    return false;
  }
};

export default mongoose.model("User", UserSchema);
