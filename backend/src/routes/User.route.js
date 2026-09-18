import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  addShippingAddress,
  removeShippingAddress,
  getAllUsers,
  getUserById,
  deleteUser,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 🔓 PUBLIC AUTHENTICATION ROUTES
// ==========================================

// Register a new customer account
router.post('/register', registerUser);

// Login customer and issue JWT
router.post('/login', loginUser);

// Logout customer / clear session cookies
router.post('/logout', logoutUser);


// ==========================================
// 👤 CUSTOMER PROTECTED ROUTES
// ==========================================

// Apply user auth protection to all routes in this section
router.use('/profile', protect);

// Get or update logged-in user profile
router.route('/profile')
  .get(getUserProfile)
  .put(updateUserProfile);

// Manage user address book
router.post('/profile/address', protect, addShippingAddress);
router.delete('/profile/address/:addressId', protect, removeShippingAddress);


// ==========================================
// 👮 STAFF & ADMIN USER MANAGEMENT
// ==========================================

// Restrict staff routes to authorized employee roles
router.use(protectEmployee);
router.use(authorizeRoles('admin', 'major', 'officer'));

// Fetch all registered customers (with search & pagination)
router.get('/', getAllUsers);

// Fetch single customer details or delete user account by ID
router.route('/:id')
  .get(getUserById)
  .delete(deleteUser);

export default router;