import express from 'express';
import { protect, admin } from '../middleware/authMiddleware.js';
import { 
  registerUser, 
  loginUser, 
  logoutUser,
  getUserProfile, 
  updateUserProfile, 
  getUsers, 
  deleteUser 
} from '../controllers/authController.js';
import { check } from 'express-validator';

const router = express.Router();

// @route   POST /api/users/register
// @desc    Register a new user
// @access  Public
router.post(
  '/register', 
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  registerUser
);

// @route   POST /api/users/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   POST /api/users/logout
// @desc    Logout user
// @access  Private
router.post('/logout', logoutUser);

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// @route   GET /api/users
// @desc    Get all users
// @access  Private/Admin
router.get('/', protect, admin, getUsers);

// @route   DELETE /api/users/:id
// @desc    Delete user
// @access  Private/Admin
router.delete('/:id', protect, admin, deleteUser);

export default router;
