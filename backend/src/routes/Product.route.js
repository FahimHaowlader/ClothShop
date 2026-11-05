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

productRouter.get('/test', (req, res) => {
  res.status(200).json({ message: "Product test route is working!" });
});

// ==========================================
// 🛍️ PUBLIC PRODUCT ROUTES
// ==========================================

productRouter.get('/shop', (req, res) => {
  res.status(200).json({ message: "Product route is working!" });
});

productRouter.get('/best-sellers', (req, res) => {
  res.status(200).json({ message: "Best Sellers route is working!" });
});

productRouter.get('/featured', (req, res) => {
  res.status(200).json({ message: "Featured Products route is working!" });
});

productRouter.get('/men', (req, res) => { 
  res.status(200).json({ message: "Men's Products route is working!" });
});

productRouter.get('/women', (req, res) => {
  res.status(200).json({ message: "Women's Products route is working!" });
});

productRouter.get('/collection/:collectionName', (req, res) => {
  const { collectionName } = req.params;
  res.status(200).json({ message: `Collection route for ${collectionName} is working!` });
});

productRouter.get('product/:productId', (req, res) => {
  const { productId } = req.params;
  res.status(200).json({ message: `Product details route for product ID ${productId} is working!` });
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