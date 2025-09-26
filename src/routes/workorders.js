const express = require('express');
const router = express.Router();
const WorkOrderController = require('../controllers/workOrderController');
const authMiddleware = require('../middleware/auth');

// All work order routes require authentication
router.use(authMiddleware);

// Get all work orders
router.get('/', WorkOrderController.getAllWorkOrders);

// Get work order by ID
router.get('/:id', WorkOrderController.getWorkOrderById);

// Create new work order
router.post('/', WorkOrderController.createWorkOrder);

// Update work order
router.put('/:id', WorkOrderController.updateWorkOrder);

// Delete work order
router.delete('/:id', WorkOrderController.deleteWorkOrder);

module.exports = router;
