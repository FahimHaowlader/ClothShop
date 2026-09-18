import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductDisplay,
  applyProductDiscount,
} from '../controllers/product.controller.js';
import { protectEmployee, authorizeRoles } from '../middleware/employeeAuth.middleware.js';

const router = express.Router();

// ==========================================
// 🛍️ PUBLIC PRODUCT ROUTES
// ==========================================

// Get all products (with filtering, category search, and pagination)
router.get('/', getAllProducts);

// Get single product details by Mongo ID or custom productCode
router.get('/:id', getProductById);


// ==========================================
// 👮 STAFF & ADMIN MANAGEMENT ROUTES
// ==========================================

// Protect all remaining product management endpoints
router.use(protectEmployee);

// Allow staff members ('admin', 'major', 'officer', 'general') to manage catalog
router.use(authorizeRoles('admin', 'major', 'officer', 'general'));

// Create new product
router.post('/', createProduct);

// Single product update and deletion
router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);

// Toggle product visibility in catalog (display: true/false)
router.patch('/:id/display', toggleProductDisplay);

// Set or update active product discount
router.patch('/:id/discount', applyProductDiscount);

export default router;