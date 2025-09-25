const express = require('express');
const router = express.Router();
const TaskController = require('../controllers/taskController');

// Get all tasks
// GET /api/tasks
// Query params: include_customer=true (optional)
router.get('/', TaskController.getAllTasks);

// Get tasks by customer ID
// GET /api/tasks/customer/:customerId
// Query params: include_customer=true (optional)
router.get('/customer/:customerId', TaskController.getTasksByCustomer);

// Get tasks by status
// GET /api/tasks/status/:status
// Query params: include_customer=true (optional)
router.get('/status/:status', TaskController.getTasksByStatus);

// Get overdue tasks
// GET /api/tasks/overdue
// Query params: include_customer=true (optional)
router.get('/overdue', TaskController.getOverdueTasks);

// Get a single task by ID
// GET /api/tasks/:id
// Query params: include_customer=true (optional)
router.get('/:id', TaskController.getTaskById);

// Create a new task
// POST /api/tasks
// Body: { subject, due_date, description, status, customer_id }
router.post('/', TaskController.createTask);

// Update an existing task
// PUT /api/tasks/:id
// Body: { subject, due_date, description, status, customer_id }
router.put('/:id', TaskController.updateTask);

// Delete a task
// DELETE /api/tasks/:id
router.delete('/:id', TaskController.deleteTask);

module.exports = router;
