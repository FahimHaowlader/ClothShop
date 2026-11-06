import express from 'express';
import {
  registerUser,
  loginUser,
 
  
} from '../controllers/user.controller.js';

import verifyUser from '../middleware/verifyUser.middleware.js';

const userRouter = express.Router();

// ==========================================
// 🔓 PUBLIC AUTHENTICATION ROUTES
// ==========================================

userRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "User route is working!" });
});

// Register a new customer account
userRouter.post('/register', registerUser);


userRouter.use(verifyUser); // Enforce authentication on all user operations
// Login customer and issue JWT
userRouter.post('/login', loginUser);

userRouter.post('/logout', (req, res) => {
  res.status(200).json({ message: "User logout route is working!" });
});

userRouter.post('/logout-all-sessions', (req, res) => {
  res.status(200).json({ message: "User logout from all sessions route is working!" });
});

userRouter.get('/profile', (req, res) => {
  res.status(200).json({ message: "User profile route is working!" });
});

userRouter.patch('/change-profile-basic-info', (req, res) => {
  res.status(200).json({ message: "Update user profile route is working!" });
});


userRouter.patch('/change-profile-password', (req, res) => {
  res.status(200).json({ message: "Change user password route is working!" });
});

userRouter.post('/forgot-password', (req, res) => {
  res.status(200).json({ message: "Forgot password route is working!" });
});

userRouter.post('/add-new-address', (req, res) => {
  res.status(200).json({ message: "Add new address route is working!" });
});

userRouter.get('/get-addresses', (req, res) => {
  res.status(200).json({ message: "Get user addresses route is working!" });
});

userRouter.patch('/update-address/:addressId', (req, res) => {
  const { addressId } = req.params;
  res.status(200).json({ message: `Update address with ID ${addressId} route is working!` });
});

userRouter.delete('/delete-address/:addressId', (req, res) => {
  const { addressId } = req.params;
  res.status(200).json({ message: `Delete address with ID ${addressId} route is working!` });
});

userRouter.post('/set-default-address/:addressId', (req, res) => {
  const { addressId } = req.params;
  res.status(200).json({ message: `Set default address with ID ${addressId} route is working!` });
});





// ==========================================
// 👤 CUSTOMER PROTECTED ROUTES
// ==========================================






// ==========================================
// 👮 STAFF & ADMIN USER MANAGEMENT
// ==========================================

// Restrict staff routes to authorized employee roles




// Fetch single customer details or delete user account by ID


export default userRouter;