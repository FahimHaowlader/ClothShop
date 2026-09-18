import express from 'express';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  
  
} from '../controllers/product.controller.js';

import verifyUser from '../middleware/verifyUser.middleware.js';

const productRouter = express.Router();

// ==========================================
// 🛍️ PUBLIC PRODUCT ROUTES
// ==========================================

productRouter.get('/', (req, res) => {
  res.status(200).json({ message: "Product route is working!" });
});

// Get all products (with filtering, category search, and pagination)
productRouter.get('/s', getAllProducts);

// Get single product details by Mongo ID or custom productCode
productRouter.get('/:id', getProductById);


// ==========================================
// 👮 STAFF & ADMIN MANAGEMENT ROUTES
// ==========================================



// Allow staff members ('admin', 'major', 'officer', 'general') to manage catalog


// Create new product
productRouter.post('/', createProduct);

// Single product update and deletion
productRouter.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct);



export default productRouter;