const { supabase } = require('../config/supabase');

class UserController {
  // Get all users for the current company
  static async getAllUsers(req, res) {
    try {
      console.log('🔍 UserController.getAllUsers called');
      
      // Get company ID from the authenticated user (from JWT token)
      const companyId = req.user?.company_id;
      
      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in token'
        });
      }

      console.log('🔍 Fetching users for company:', companyId);

      const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('first_name', { ascending: true });

      if (error) {
        console.error('❌ Error fetching users:', error);
        return res.status(500).json({
          success: false,
          message: 'Failed to fetch users',
          error: error.message
        });
      }

      console.log('✅ Found users:', users?.length || 0);

      res.json({
        success: true,
        data: users || [],
        count: users?.length || 0
      });

    } catch (error) {
      console.error('❌ UserController.getAllUsers error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in token'
        });
      }

      const { data: user, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .eq('company_id', companyId)
        .single();

      if (error) {
        console.error('❌ Error fetching user:', error);
        return res.status(404).json({
          success: false,
          message: 'User not found',
          error: error.message
        });
      }

      res.json({
        success: true,
        data: user
      });

    } catch (error) {
      console.error('❌ UserController.getUserById error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Create new user
  static async createUser(req, res) {
    try {
      const companyId = req.user?.company_id;
      const userData = req.body;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in token'
        });
      }

      // Add company_id to user data
      userData.company_id = companyId;

      const { data: user, error } = await supabase
        .from('users')
        .insert([userData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating user:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to create user',
          error: error.message
        });
      }

      res.status(201).json({
        success: true,
        data: user,
        message: 'User created successfully'
      });

    } catch (error) {
      console.error('❌ UserController.createUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;
      const userData = req.body;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in token'
        });
      }

      const { data: user, error } = await supabase
        .from('users')
        .update(userData)
        .eq('id', id)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) {
        console.error('❌ Error updating user:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to update user',
          error: error.message
        });
      }

      res.json({
        success: true,
        data: user,
        message: 'User updated successfully'
      });

    } catch (error) {
      console.error('❌ UserController.updateUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in token'
        });
      }

      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', id)
        .eq('company_id', companyId);

      if (error) {
        console.error('❌ Error deleting user:', error);
        return res.status(400).json({
          success: false,
          message: 'Failed to delete user',
          error: error.message
        });
      }

      res.json({
        success: true,
        message: 'User deleted successfully'
      });

    } catch (error) {
      console.error('❌ UserController.deleteUser error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = UserController;

