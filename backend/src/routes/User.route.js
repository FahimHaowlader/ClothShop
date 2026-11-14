import express from 'express';
import {
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
} from '../controllers/User.controller.js';

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

// Login customer and issue JWT
userRouter.post('/login', loginUser);


userRouter.use(verifyUser); // Enforce authentication on all user operations

// user logout routes
userRouter.post('/logout', logoutUser);


// user logout from all sessions route
userRouter.post('/logout-all-sessions', logoutUser);

// user profile route
userRouter.get('/profile', getProfile);

// user profile update route
userRouter.patch('/update-profile', updateProfile);


// user profile password change route
userRouter.patch('/change-password', changePassword);

// user profile email update route
userRouter.post('/forgot-password',forgotPassword);

// user profile email update route
userRouter.patch('/update-email',updateEmail);


// add new address route
userRouter.post('/add-new-address', addAddress);


// get all addresses route
userRouter.get('/get-addresses', getAddress);


// update address route
userRouter.patch('/update-address/:addressId', updateAddress);


// delete address route
userRouter.delete('/delete-address/:addressId', deleteAddress);


// set default address route
userRouter.post('/set-default-address/:addressId', setDefaultAddress);





// ==========================================
// 👤 CUSTOMER PROTECTED ROUTES
// ==========================================






// ==========================================
// 👮 STAFF & ADMIN USER MANAGEMENT
// ==========================================

// Restrict staff routes to authorized employee roles




// Fetch single customer details or delete user account by ID


export default userRouter;