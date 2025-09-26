const jwt = require('jsonwebtoken');
const UserSupabase = require('../models/UserSupabase');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Check if this is a demo token
    if (token.includes('demo_signature')) {
      console.log('🔍 Demo token detected, using demo user data');
      
      // Create demo user data
      const demoUser = {
        id: 'USR000000000003',
        company_id: 'CMP000000000003',
        email: 'demo@company3.com',
        first_name: 'Demo',
        last_name: 'User',
        role: 'Super Admin',
        is_active: true
      };
      
      req.user = demoUser;
      next();
      return;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user data
    const user = await UserSupabase.findById(decoded.id);
    
    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token or user not found'
      });
    }

    // Add user to request object
    req.user = user;
    next();

  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Invalid token',
      error: error.message
    });
  }
};

module.exports = authMiddleware;
