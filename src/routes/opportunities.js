const express = require('express');
const router = express.Router();
const OpportunityController = require('../controllers/opportunityController');
const authMiddleware = require('../middleware/auth');

// All opportunity routes require authentication
router.use(authMiddleware);

// Get all opportunities
router.get('/', OpportunityController.getAllOpportunities);

// Get opportunity by ID
router.get('/:id', OpportunityController.getOpportunityById);

// Create new opportunity
router.post('/', OpportunityController.createOpportunity);

// Update opportunity
router.put('/:id', OpportunityController.updateOpportunity);

// Delete opportunity
router.delete('/:id', OpportunityController.deleteOpportunity);

module.exports = router;
