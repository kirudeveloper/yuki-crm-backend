require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');

// Import routes
const apiRoutes = require('./routes');
const whatsappRoutes = require('./routes/whatsapp');

// Initialize database based on DB_TYPE
const initializeDatabase = async () => {
  const dbType = process.env.DB_TYPE || 'sqlite';
  
  if (dbType.toLowerCase() === 'postgresql' || dbType.toLowerCase() === 'supabase') {
    if (process.env.DATABASE_URL?.includes('supabase.co') || process.env.DB_HOST?.includes('supabase.co')) {
      // Use Supabase configuration
      try {
        const { initializeDatabase } = require('./config/supabase');
        await initializeDatabase();
        console.log('✅ Supabase database initialized');
      } catch (error) {
        console.log('⚠️  Supabase connection failed, but continuing...');
        console.log('📝 Please create tables manually in Supabase dashboard');
        console.log('📖 See: docs/supabase-table-creation-guide.md');
        // Don't throw error - let server start anyway
      }
    } else {
      // Use local PostgreSQL
      const { initializeDatabase } = require('./config/postgresql');
      await initializeDatabase();
    }
  } else {
    // Initialize SQLite database
    require('./config/database');
  }
};

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet()); // Security middleware
app.use(cors()); // Enable CORS
app.use(morgan('combined')); // Request logging
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// Create database directory if it doesn't exist (for SQLite)
const fs = require('fs');
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Routes
app.use('/api', apiRoutes);
app.use('/whatsapp', whatsappRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Small Business CRM API Server',
    version: '1.0.0',
    status: 'running',
    endpoints: {
      api: '/api',
      health: '/api/health',
      customers: '/api/customers',
      tasks: '/api/tasks'
    }
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// Start server with database initialization
const startServer = async () => {
  try {
    // Initialize database
    await initializeDatabase();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 CRM API Server running on port ${PORT}`);
      console.log(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🗄️ Database: ${process.env.DB_TYPE || 'sqlite'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`👥 Customers API: http://localhost:${PORT}/api/customers`);
      console.log(`📋 Tasks API: http://localhost:${PORT}/api/tasks`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  process.exit(0);
});

module.exports = app;
