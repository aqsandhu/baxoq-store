const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  getProducts, 
  getProductById, 
  getProductBySlug,
  createProduct, 
  updateProduct, 
  deleteProduct, 
  createProductReview,
  getTopProducts,
  getFeaturedProducts
} = require('../controllers/productController');
const { check } = require('express-validator');

// @route   GET /api/products
// @desc    Get all products
// @access  Public
router.get('/', getProducts);

// @route   GET /api/products/top
// @desc    Get top rated products
// @access  Public
router.get('/top', getTopProducts);

// @route   GET /api/products/featured
// @desc    Get featured products
// @access  Public
router.get('/featured', getFeaturedProducts);

// @route   GET /api/products/slug/:slug
// @desc    Get single product by slug
// @access  Public
router.get('/slug/:slug', getProductBySlug);

// @route   GET /api/products/:id
// @desc    Get single product by ID
// @access  Public
router.get('/:id', getProductById);

// @route   POST /api/products
// @desc    Create a product
// @access  Private/Admin
router.post(
  '/', 
  [
    protect, 
    admin,
    check('name', 'Name is required').not().isEmpty(),
    check('price', 'Price is required').isNumeric(),
    check('category', 'Category is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('countInStock', 'Count in stock is required').isNumeric()
  ], 
  createProduct
);

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private/Admin
router.put('/:id', protect, admin, updateProduct);

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteProduct);

// @route   POST /api/products/:id/reviews
// @desc    Create new review
// @access  Private
router.post(
  '/:id/reviews', 
  [
    protect,
    check('rating', 'Rating is required').isNumeric(),
    check('comment', 'Comment is required').not().isEmpty()
  ], 
  createProductReview
);

module.exports = router;
