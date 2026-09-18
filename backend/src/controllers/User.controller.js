import User from '../models/User.modal.js';
import bcrypt from 'bcryptjs';



// for user only 


// register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ $or: [{ email }, { phone }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already in use' });
    }

    // Create a new user
    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = user.generateAuthToken();

    res.status(200).json({ token, userId: user._id });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Get profile 
export const getProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).select('-password -refreshToken');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// 🔹 Update profile
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, email, phone, address, city, postCode } = req.body;

    // Check if the new email or phone already exists for another user
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Email or phone number already in use' });
    }

    // Update the user's profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, email, phone, address, city, postCode },
      { new: true, runValidators: true }
    ).select('-password -refreshToken');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// 🔹 Change password
export const changePassword = async (req, res) => {
  try {
    const userId = req.user._id;
    const { currentPassword, newPassword } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the current password is correct
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update the password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// forget password 
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = Date.now() + 3600000; // Token valid for 1 hour

    // Save the reset token and expiry to the user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpiry;
    await user.save();

    // Send the reset token via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot password:', error);
    res.status(500).json({ message: 'Server error' });
  }
}

