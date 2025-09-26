const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

// All user routes require authentication
router.use(authMiddleware);

// Get all users for the current company
router.get('/', UserController.getAllUsers);

// Get user by ID
router.get('/:id', UserController.getUserById);

// Create new user
router.post('/', UserController.createUser);

// Update user
router.put('/:id', UserController.updateUser);

// Delete user
router.delete('/:id', UserController.deleteUser);

module.exports = router;
