const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const { 
  submitContactForm, 
  getContactSubmissions, 
  getContactById, 
  updateContactStatus, 
  deleteContact 
} = require('../controllers/contactController');
const { check } = require('express-validator');

// @route   POST /api/contact
// @desc    Submit contact form
// @access  Public
router.post(
  '/', 
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('subject', 'Subject is required').not().isEmpty(),
    check('message', 'Message is required').not().isEmpty()
  ], 
  submitContactForm
);

// @route   GET /api/contact
// @desc    Get all contact submissions
// @access  Private/Admin
router.get('/', protect, admin, getContactSubmissions);

// @route   GET /api/contact/:id
// @desc    Get contact submission by ID
// @access  Private/Admin
router.get('/:id', protect, admin, getContactById);

// @route   PUT /api/contact/:id
// @desc    Update contact status
// @access  Private/Admin
router.put('/:id', protect, admin, updateContactStatus);

// @route   DELETE /api/contact/:id
// @desc    Delete contact submission
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteContact);

module.exports = router;
