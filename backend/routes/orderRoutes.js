const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  createOrder, 
  getOrderById, 
  updateOrderToPaid, 
  updateOrderToDelivered, 
  updateOrderStatus,
  getMyOrders, 
  getOrders 
} = require('../controllers/orderController');
const { check } = require('express-validator');

// @route   POST /api/orders
// @desc    Create new order
// @access  Private
router.post(
  '/', 
  [
    protect,
    check('orderItems', 'Order items are required').isArray(),
    check('shippingAddress', 'Shipping address is required').isObject(),
    check('paymentMethod', 'Payment method is required').not().isEmpty(),
    check('totalPrice', 'Total price is required').isNumeric()
  ], 
  createOrder
);

// @route   GET /api/orders/myorders
// @desc    Get logged in user orders
// @access  Private
router.get('/myorders', protect, getMyOrders);

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', protect, getOrderById);

// @route   PUT /api/orders/:id/pay
// @desc    Update order to paid
// @access  Private
router.put('/:id/pay', protect, updateOrderToPaid);

// @route   PUT /api/orders/:id/deliver
// @desc    Update order to delivered
// @access  Private/Admin
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private/Admin
router.put('/:id/status', protect, admin, updateOrderStatus);

// @route   GET /api/orders
// @desc    Get all orders
// @access  Private/Admin
router.get('/', protect, admin, getOrders);

module.exports = router;
