const express = require('express');
const router = express.Router();
const { register, login, verifyToken, getProfile, updateProfile, updateScooter, updateSettings } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', register);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /api/auth/verify
// @desc    Verify token
// @access  Private
router.get('/verify', authenticateToken, verifyToken);

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, getProfile);

// @route   PUT /api/auth/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticateToken, updateProfile);

// @route   PUT /api/auth/scooter
// @desc    Update scooter data
// @access  Private
router.put('/scooter', authenticateToken, updateScooter);

// @route   PUT /api/auth/settings
// @desc    Update user settings
// @access  Private
router.put('/settings', authenticateToken, updateSettings);

module.exports = router; 