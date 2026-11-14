import User from "../models/User.modal.js";
import bcrypt from "bcryptjs";

import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiResponse from "../utils/apiResponse.js";
import { cookieOptions, refreshCookieOptions } from "../utils/const.js";



/**
  @desc register a new user
  @route POST /api/users/register
  @access public (no authentication required)
 */

const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "Email or phone number already in use" });
    }

    // Create a new user
    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
  @desc login a user
  @route POST /api/users/login
  @access public (no authentication required)
 */

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      throw new apiError("Email and password are required.", 400);
    }

    // 2. Find user and explicitly select password
    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("-coupons -refreshToken ");

    if (!user) {
      throw new apiError("Invalid email or password.", 401);
    }

    // 3. Check account access
    if (!user.access) {
      throw new apiError("Your account has been disabled.", 403);
    }

    // 4. Verify password
    const isMatch = await user.isPasswordCorrect(password);

    if (!isMatch) {
      throw new apiError("Invalid email or password.", 401);
    }

    // 5. Generate tokens
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // 6. Save refresh token in database
    user.refreshToken = refreshToken;
    await user.save();

    // 7. Set HTTP-only cookies
    res
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, refreshCookieOptions);

    // 8. Return user information
    return res.status(200).json(
      apiResponse(200, "Login successful.", {
        ...user,
        refreshToken: undefined,
        password: undefined,
      }),
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    } else {
      throw new apiError("An unexpected error occurred during login.", 500);
    }
  }
});



/**  @desc logout a user
  @route POST /api/users/logout
  @access private (requires authentication)
 */

const logoutUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Remove refresh token from database
    await User.findByIdAndUpdate(userId, {
      $unset: { refreshToken: 1 },
    });

    // 2. Clear authentication cookies
    res
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", refreshCookieOptions);

    // 3. Send response
    return res
      .status(200)
      .json(new apiResponse(200, "Logout successful.", null));
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    } else {
      throw new apiError("An unexpected error occurred during logout.", 500);
    }
  }
});



/**  
  @desc get user profile
  @route GET /api/users/profile
  @access private (requires authentication)
 */

const getProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).select(
      "-password -coupons -refreshToken -__v",
    );

    if (!user) {
      throw new apiError("User not found.", 404);
    }
    if (!user.access) {
      throw new apiError("Your account has been disabled.", 403);
    }

    return res
      .status(200)
      .json(new apiResponse(200, "Profile retrieved successfully.", user));
  } catch (error) {
    console.error("Get profile error:", error);
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(
      "An unexpected error occurred while retrieving the profile.",
      500,
    );
  }
});



/**
  @desc update user profile
  @route PUT /api/users/update-profile
  @access private (requires authentication)
 */

const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { firstName, lastName, phone } = req.body;

    // 1. Validate required fields
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      !firstName.trim() ||
      !lastName.trim()
    ) {
      throw new apiError(
        "First name and last name are required and must be valid strings.",
        400,
      );
    }

    // 2. Prepare update data
    const updateData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
    };

    // 3. Validate phone if provided
    if (phone !== undefined) {
      if (typeof phone !== "string" || !/^01[0-9]{9}$/.test(phone)) {
        throw new apiError("Invalid Bangladeshi phone number.", 400);
      }

      // 4. Check duplicate phone number
      const existingUser = await User.exists({
        phone,
        _id: { $ne: userId },
      });

      if (existingUser) {
        throw new apiError("Phone number already in use.", 409);
      }

      updateData.phone = phone;
    }

    // 5. Update profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      {
        new: true,
        runValidators: true,
        select: "-password -refreshToken -coupons -__v",
      },
    );

    if (!updatedUser) {
      throw new apiError("User not found.", 404);
    }

    // 6. Response
    return res
      .status(200)
      .json(new apiResponse(200, "Profile updated successfully.", updatedUser));
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }

    throw new apiError(
      "An unexpected error occurred while updating the profile.",
      500,
    );
  }
});



/**
 * @desc change user password
 * @route PUT /api/users/change-password
 * @access private (requires authentication)
 */

const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  // 1. Validate input
  if (!currentPassword || !newPassword) {
    throw new apiError("Current password and new password are required.", 400);
  }

  if (typeof currentPassword !== "string" || typeof newPassword !== "string") {
    throw new apiError("Passwords must be valid strings.", 400);
  }

  // 2. Validate new password
  if (newPassword.length < 8) {
    throw new apiError("New password must be at least 8 characters.", 400);
  }

  if (currentPassword === newPassword) {
    throw new apiError(
      "New password must be different from current password.",
      400,
    );
  }

  // 3. Find user and explicitly select password
  const user = await User.findById(userId).select("+password");

  if (!user) {
    throw new apiError("User not found.", 404);
  }

  // 4. Verify current password
  const isMatch = await user.isPasswordCorrect(currentPassword);

  if (!isMatch) {
    throw new apiError("Current password is incorrect.", 400);
  }

  // 5. Update password (pre-save middleware hashes it)
  user.password = newPassword;
  await user.save();

  // 6. Success response
  return res
    .status(200)
    .json(new apiResponse(200, "Password changed successfully.", null));
});



/**
 * @desc update user email
 * @route PUT /api/users/email
 * @access private (requires authentication)
 */
const updateEmail = async (req, res) => {
  try {
    const userId = req.user._id;
    const { newEmail } = req.body;

    // Check if the new email already exists for another user
    const existingUser = await User.findOne({
      email: newEmail,
      _id: { $ne: userId },
    });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    // Update the user's email
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { email: newEmail },
      { new: true, runValidators: true },
    ).select("-password -refreshToken");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating email:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/**
  @desc get user addresses
  @route GET /api/users/addresses
  @access private (requires authentication)
 */

const getAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Fetch user addresses
  const user = await User.findById(userId).select("address");

  if (!user) {
    throw new apiError("User not found.", 404);
  }

  // 2. Return addresses
  return res
    .status(200)
    .json(
      new apiResponse(200, "Addresses fetched successfully.", user.address),
    );
});



/**
 * @desc add a new address for the user
 * @route POST /api/users/addresses
 * @access private (requires authentication)
 */
const addAddress = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { name, street, city, postCode, isDefault = false } = req.body;

  // 1. Validate required fields
  if (!name || !street?.trim() || !city?.trim() || !postCode?.trim()) {
    throw new apiError("All address fields are required.", 400);
  }

  // 2. Validate address type
  if (!["home", "office", "other"].includes(name)) {
    throw new apiError("Invalid address type.", 400);
  }

  if (typeof isDefault !== "boolean") {
    throw new apiError("isDefault must be a boolean.", 400);
  }

  // 3. Start transaction
  const session = await mongoose.startSession();

  try {
    let updatedUser;

    await session.withTransaction(async () => {
      // 4. Find user
      const user = await User.findById(userId).session(session);

      if (!user) {
        throw new apiError("User not found.", 404);
      }

      // 5. Check maximum address limit
      if (user.address.length >= 3) {
        throw new apiError("You can add a maximum of 3 addresses.", 400);
      }

      // 6. Check duplicate address type
      const alreadyExists = user.address.some(
        (address) => address.name === name,
      );

      if (alreadyExists) {
        throw new apiError(`You already have a ${name} address.`, 409);
      }

      // 7. Set previous default to false
      if (isDefault) {
        user.address.forEach((address) => {
          address.isDefault = false;
        });
      }

      // 8. Add new address
      user.address.push({
        name,
        street: street.trim(),
        city: city.trim(),
        postCode: postCode.trim(),
        isDefault,
      });

      // 9. Save user
      await user.save({ session });

      updatedUser = user;
    });

    return res.status(201).json(
      new apiResponse(
        201,
        "Address added successfully.",
        updatedUser.address[updatedUser.address.length - 1], // Return the newly added address
      ),
    );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(
      "An unexpected error occurred while adding the address.",
      500,
    );
  } finally {
    await session.endSession();
  }
});



/**
  @desc update an existing address for the user
  @route PUT /api/users/addresses
  @access private (requires authentication)
 */

const updateAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { addressId, name, street, city, postCode, isDefault } = req.body;

    // 1. Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError("User not found.", 404);
    }

    // 2. Find specific address
    const address = user.address.id(addressId);

    if (!address) {
      throw new apiError("Address not found.", 404);
    }

    // 3. Validate address type
    if (name !== undefined) {
      if (!["home", "office", "other"].includes(name)) {
        throw new apiError("Invalid address type.", 400);
      }

      // Check duplicate address type (excluding current address)
      const alreadyExists = user.address.some(
        (item) => item._id.toString() !== addressId && item.name === name,
      );

      if (alreadyExists) {
        throw new apiError(`You already have a ${name} address.`, 409);
      }

      address.name = name;
    }

    // 4. Validate and update address fields
    const fields = { street, city, postCode };

    for (const [key, value] of Object.entries(fields)) {
      if (value !== undefined) {
        if (typeof value !== "string" || !value.trim()) {
          throw new apiError(`${key} must be a valid non-empty string.`, 400);
        }

        address[key] = value.trim();
      }
    }

    // 5. Validate default status
    if (isDefault !== undefined) {
      if (typeof isDefault !== "boolean") {
        throw new apiError("isDefault must be a boolean.", 400);
      }

      if (isDefault) {
        // Unset previous default address
        user.address.forEach((item) => {
          if (item._id.toString() !== addressId) {
            item.isDefault = false;
          }
        });
      }

      address.isDefault = isDefault;
    }

    // 6. Save updated address
    await user.save();

    // 7. Success response
    return res
      .status(200)
      .json(
        new apiResponse(200, "Address updated successfully.", user.address),
      );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(
      "An unexpected error occurred while updating the address.",
      500,
    );
  }
});


/**
  @desc delete an address for the user
  @route DELETE /api/users/addresses
  @access private (requires authentication)
 */

const deleteAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    // 1. Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError("User not found.", 404);
    }

    // 2. Find specific address
    const address = user.address.id(addressId);

    if (!address) {
      throw new apiError("Address not found.", 404);
    }

    // 3. Remove address
    address.deleteOne();

    // 4. Save updated user
    await user.save();

    // 5. Success response
    return res
      .status(200)
      .json(
        new apiResponse(200, "Address deleted successfully.", user.address),
      );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(
      "An unexpected error occurred while deleting the address.",
      500,
    );
  }
});



/**
 * @desc set a default address for the user
 * @route PUT /api/users/addresses/default
 * @access private (requires authentication)
 */

const setDefaultAddress = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { addressId } = req.body;

    // 1. Find user
    const user = await User.findById(userId);

    if (!user) {
      throw new apiError("User not found.", 404);
    }

    // 2. Find requested address
    const address = user.address.id(addressId);

    if (!address) {
      throw new apiError("Address not found.", 404);
    }

    // 3. Check if already default
    if (address.isDefault) {
      throw new apiError("This address is already the default address.", 400);
    }

    // 4. Unset previous default address
    user.address.forEach((item) => {
      item.isDefault = item._id.equals(address._id);
    });

    // 5. Save updated user
    await user.save();

    // 6. Success response
    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          "Default address updated successfully.",
          user.address,
        ),
      );
  } catch (error) {
    if (error instanceof apiError) {
      throw error;
    }
    throw new apiError(
      "An unexpected error occurred while setting the default address.",
      500,
    );
  }
});



/**
  @desc forgot password - send reset link
  @route POST /api/users/forgot-password
  @access public (no authentication required)
 */

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save the reset token and expiry to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send the reset token via email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset Request",
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Password reset email sent" });
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/**
 * @desc get all users (admin only)
 * @route GET /api/users
 * @access private (requires authentication)
 */

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password -refreshToken");
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
};




export {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  updateProfile,
  changePassword,
  updateEmail,
  getAddress,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  forgotPassword,
  getAllUsers,
};
