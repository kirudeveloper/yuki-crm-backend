const UserSupabase = require('../models/UserSupabase');
const CompanySupabase = require('../models/CompanySupabase');
const { supabase } = require('../config/supabase');

class AuthController {
  // Register a new company and user
  static async register(req, res) {
    try {
      const {
        // Company data
        companyName,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        city,
        zipCode,
        country,
        website,
        industry,
        companySize,
        // User data
        password
      } = req.body;

      // Validate required fields
      if (!companyName || !firstName || !lastName || !email || !phoneNumber || !password) {
        return res.status(400).json({
          success: false,
          message: 'Missing required fields: companyName, firstName, lastName, email, phoneNumber, password'
        });
      }

      // Check if email already exists in companies table
      const { data: existingCompany } = await supabase
        .from('companies')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCompany) {
        return res.status(400).json({
          success: false,
          message: 'A company with this email already exists'
        });
      }

      // Check if email already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .single();

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'A user with this email already exists'
        });
      }

      // Create company
      const companyData = {
        companyName,
        firstName,
        lastName,
        email,
        phoneNumber,
        address,
        city,
        zipCode,
        country,
        website,
        industry,
        companySize
      };

      const company = await CompanySupabase.create(companyData);
      console.log('✅ Company created:', company.id);

      // Create Super Admin role for the company
      const { data: superAdminRole, error: roleError } = await supabase
        .from('roles')
        .insert([
          {
            company_id: company.id,
            role_name: 'Super Admin',
            description: 'Full system access with all permissions',
            company_access_read: true,
            company_access_edit: true,
            company_access_delete: true,
            user_access_read: true,
            user_access_edit: true,
            user_access_delete: true,
            customer_access_read: true,
            customer_access_edit: true,
            customer_access_delete: true,
            opportunity_access_read: true,
            opportunity_access_edit: true,
            opportunity_access_delete: true,
            work_order_access_read: true,
            work_order_access_edit: true,
            work_order_access_delete: true,
            task_access_read: true,
            task_access_edit: true,
            task_access_delete: true,
            role_access_read: true,
            role_access_edit: true,
            role_access_delete: true,
            system_admin: true,
            can_manage_roles: true,
            can_manage_users: true
          }
        ])
        .select()
        .single();

      if (roleError) {
        console.error('❌ Error creating Super Admin role:', roleError);
        throw roleError;
      }

      console.log('✅ Super Admin role created:', superAdminRole.id);

      // Create user with Super Admin role
      const userData = {
        companyId: company.id,
        roleId: superAdminRole.id,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        department: 'Management',
        position: 'Super Admin'
      };

      const user = await UserSupabase.create(userData);
      console.log('✅ User created:', user.id);

      // Generate JWT token
      const token = UserSupabase.generateToken(user);

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user: {
            id: user.id,
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            companyId: user.company_id,
            roleId: user.role_id
          },
          company: {
            id: company.id,
            companyName: company.company_name,
            email: company.email
          },
          token
        }
      });

    } catch (error) {
      console.error('❌ Registration error:', error);
      res.status(500).json({
        success: false,
        message: 'Registration failed',
        error: error.message
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email and password are required'
        });
      }

      // Find user by email
      const user = await UserSupabase.findByEmail(email);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Verify password
      const isPasswordValid = await UserSupabase.verifyPassword(password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      // Update last login
      await UserSupabase.updateLastLogin(user.id);

      // Generate JWT token
      const token = UserSupabase.generateToken(user);

      // Return success response (exclude password)
      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          token
        }
      });

    } catch (error) {
      console.error('❌ Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Login failed',
        error: error.message
      });
    }
  }

  // Forgot password (placeholder - implement email service later)
  static async forgotPassword(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email is required'
        });
      }

      // Check if user exists
      const user = await UserSupabase.findByEmail(email);
      
      if (!user) {
        // Don't reveal if email exists or not for security
        return res.json({
          success: true,
          message: 'If the email exists, a password reset link has been sent'
        });
      }

      // TODO: Implement email service to send reset link
      // For now, just return success message
      res.json({
        success: true,
        message: 'Password reset functionality will be implemented soon'
      });

    } catch (error) {
      console.error('❌ Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to process password reset request',
        error: error.message
      });
    }
  }

  // Verify token (for protected routes)
  static async verifyToken(req, res) {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'No token provided'
        });
      }

      const jwt = require('jsonwebtoken');
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get fresh user data
      const user = await UserSupabase.findById(decoded.id);
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token'
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        message: 'Token is valid',
        data: {
          user: userWithoutPassword
        }
      });

    } catch (error) {
      console.error('❌ Token verification error:', error);
      res.status(401).json({
        success: false,
        message: 'Invalid token',
        error: error.message
      });
    }
  }

  // Get user profile
  static async getProfile(req, res) {
    try {
      const userId = req.user.id; // From middleware
      const user = await UserSupabase.findById(userId);
      
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({
        success: true,
        data: {
          user: userWithoutPassword
        }
      });

    } catch (error) {
      console.error('❌ Get profile error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to get user profile',
        error: error.message
      });
    }
  }
}

module.exports = AuthController;
