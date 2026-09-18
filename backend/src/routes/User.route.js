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

userRouter.get('/', (req, res) => {
  res.status(200).json({ message: "User route is working!" });
});

// Register a new customer account
userRouter.post('/register', registerUser);

// Login customer and issue JWT
userRouter.post('/login', loginUser);





// ==========================================
// 👤 CUSTOMER PROTECTED ROUTES
// ==========================================






// ==========================================
// 👮 STAFF & ADMIN USER MANAGEMENT
// ==========================================

// Restrict staff routes to authorized employee roles




// Fetch single customer details or delete user account by ID


export default userRouter;