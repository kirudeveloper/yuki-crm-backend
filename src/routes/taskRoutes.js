const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const authMiddleware = require('../middleware/auth');

// All task routes require authentication
router.use(authMiddleware);

// Task routes
router.post('/', taskController.createTask);
router.get('/', taskController.getAllTasks);
router.get('/search', taskController.searchTasks);
router.get('/customer/:customerId', taskController.getTasksByCustomer);
router.get('/:id', taskController.getTaskById);
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;



