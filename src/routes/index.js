const express = require('express');
const router = express.Router();

// Import route modules
const customerRoutes = require('./customers');
const taskRoutes = require('./taskRoutes');
const opportunityRoutes = require('./opportunities');
const workOrderRoutes = require('./workorders');
// const companyRoutes = require('./companyRoutes'); // TODO: Create company routes

// Mount routes
router.use('/customers', customerRoutes);
router.use('/tasks', taskRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/workorders', workOrderRoutes);
// router.use('/companies', companyRoutes); // TODO: Enable when company routes are created

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CRM API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Small Business CRM API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      customers: '/api/customers',
      tasks: '/api/tasks',
      opportunities: '/api/opportunities',
      workorders: '/api/workorders'
      // companies: '/api/companies' // TODO: Enable when company routes are created
    }
  });
});

module.exports = router;
