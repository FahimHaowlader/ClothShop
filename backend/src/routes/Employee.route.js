import express from 'express';
import {
  loginEmployee,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  logoutEmployee,
} from '../controllers/employee.controller.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 🔓 PUBLIC EMPLOYEE ROUTES
// ==========================================

// Employee login via cookie/JWT
router.post('/login', loginEmployee);


// ==========================================
// 🔒 PROTECTED EMPLOYEE ROUTES
// ==========================================

// Enforce employee authentication for all routes below
router.use(protectEmployee);

// Logout current employee (clears refresh token & cookies)
router.post('/logout', logoutEmployee);

// Get single employee details
router.get('/profile/:id', getEmployeeById);


// ==========================================
// 👮 HIGH-LEVEL MANAGEMENT ROUTES
// ==========================================

// Restrict employee list view and updates to 'major' and 'officer' roles
router.use(authorizeRoles('major', 'officer'));

// Create new staff account or fetch all staff members
router.route('/')
  .get(getAllEmployees)
  .post(createEmployee);

// Update staff access permission, role, or profile
router.put('/:id', updateEmployee);

export default router;