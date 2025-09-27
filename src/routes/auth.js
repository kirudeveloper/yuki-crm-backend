const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

// Public routes (no authentication required)
router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/forgot-password', AuthController.forgotPassword);
router.get('/verify-token', AuthController.verifyToken);

// Protected routes (authentication required)
router.get('/profile', authMiddleware, AuthController.getProfile);

module.exports = router;

