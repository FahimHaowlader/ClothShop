import express from 'express';
import {
  loginEmployee,
  createEmployee,
  getAllEmployees,
  getEmployeeById,
  updateEmployee,
  logoutEmployee,
} from '../controllers/employee.controller.js';
import verifyUser from '../middleware/verifyUser.middleware.js';

const employeeRouter = express.Router();

// ==========================================
// 🔓 PUBLIC EMPLOYEE ROUTES
// ==========================================


employeeRouter.get('/', (req, res) => {
  res.status(200).json({ message: "Employee route is working!" });
});


// Employee login via cookie/JWT
employeeRouter.post('/login', loginEmployee);


// ==========================================
// 🔒 PROTECTED EMPLOYEE ROUTES
// ==========================================


employeeRouter.use(verifyUser); // Apply user verification middleware to all routes below



// Logout current employee (clears refresh token & cookies)
employeeRouter.post('/logout', logoutEmployee);

// Get single employee details
employeeRouter.get('/profile/:id', getEmployeeById);


// ==========================================
// 👮 HIGH-LEVEL MANAGEMENT ROUTES
// ==========================================

// Restrict employee list view and updates to 'major' and 'officer' roles
// employeeRouter.use(authorizeRoles('major', 'officer'));

// Create new staff account or fetch all staff members
employeeRouter.route('/')
  .get(getAllEmployees)
  .post(createEmployee);

// Update staff access permission, role, or profile
employeeRouter.put('/:id', updateEmployee);

export default employeeRouter;