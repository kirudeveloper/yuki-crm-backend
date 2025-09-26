const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const customerRoutes = require('./customers');
const taskRoutes = require('./taskRoutes');
const opportunityRoutes = require('./opportunities');
const workOrderRoutes = require('./workorders');
const userRoutes = require('./users');
// const companyRoutes = require('./companyRoutes'); // TODO: Create company routes

// Mount routes
router.use('/auth', authRoutes);
router.use('/customers', customerRoutes);
router.use('/tasks', taskRoutes);
router.use('/opportunities', opportunityRoutes);
router.use('/workorders', workOrderRoutes);
router.use('/users', userRoutes);
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
      auth: '/api/auth',
      customers: '/api/customers',
      tasks: '/api/tasks',
      opportunities: '/api/opportunities',
      workorders: '/api/workorders',
      users: '/api/users'
      // companies: '/api/companies' // TODO: Enable when company routes are created
    }
  });
});

module.exports = router;
