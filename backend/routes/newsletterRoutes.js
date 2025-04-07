const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  subscribeToNewsletter, 
  unsubscribeFromNewsletter, 
  getNewsletterSubscriptions, 
  deleteNewsletterSubscription 
} = require('../controllers/newsletterController');
const { check } = require('express-validator');

// @route   POST /api/newsletter/subscribe
// @desc    Subscribe to newsletter
// @access  Public
router.post(
  '/subscribe', 
  [
    check('email', 'Please include a valid email').isEmail()
  ], 
  subscribeToNewsletter
);

// @route   PUT /api/newsletter/unsubscribe
// @desc    Unsubscribe from newsletter
// @access  Public
router.put(
  '/unsubscribe', 
  [
    check('email', 'Please include a valid email').isEmail()
  ], 
  unsubscribeFromNewsletter
);

// @route   GET /api/newsletter
// @desc    Get all newsletter subscriptions
// @access  Private/Admin
router.get('/', protect, admin, getNewsletterSubscriptions);

// @route   DELETE /api/newsletter/:id
// @desc    Delete newsletter subscription
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteNewsletterSubscription);

module.exports = router;
