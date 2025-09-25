const express = require('express');
const router = express.Router();
const OpportunityController = require('../controllers/opportunityController');

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
