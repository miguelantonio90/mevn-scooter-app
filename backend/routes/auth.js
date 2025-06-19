const express = require('express');
const router = express.Router();
const { register, login, verifyToken } = require('../controllers/authController');
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

module.exports = router; 