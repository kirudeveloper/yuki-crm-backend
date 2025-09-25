const { supabase } = require('../config/supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class UserSupabase {
  static async create(userData) {
    try {
      const { 
        companyId,
        roleId,
        email, 
        password,
        firstName,
        lastName,
        phoneNumber,
        department,
        position
      } = userData;
      
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            company_id: companyId,
            role_id: roleId,
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            phone_number: phoneNumber || null,
            department: department || null,
            position: position || null
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies (
            id,
            company_name,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            city,
            zip_code,
            country,
            website,
            industry,
            company_size
          ),
          roles (
            id,
            role_name,
            description,
            company_access_read,
            company_access_edit,
            company_access_delete,
            user_access_read,
            user_access_edit,
            user_access_delete,
            customer_access_read,
            customer_access_edit,
            customer_access_delete,
            opportunity_access_read,
            opportunity_access_edit,
            opportunity_access_delete,
            work_order_access_read,
            work_order_access_edit,
            work_order_access_delete,
            task_access_read,
            task_access_edit,
            task_access_delete,
            role_access_read,
            role_access_edit,
            role_access_delete,
            system_admin,
            can_manage_roles,
            can_manage_users
          )
        `)
        .eq('email', email)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          companies (
            id,
            company_name,
            first_name,
            last_name,
            email,
            phone_number,
            address,
            city,
            zip_code,
            country,
            website,
            industry,
            company_size
          ),
          roles (
            id,
            role_name,
            description,
            company_access_read,
            company_access_edit,
            company_access_delete,
            user_access_read,
            user_access_edit,
            user_access_delete,
            customer_access_read,
            customer_access_edit,
            customer_access_delete,
            opportunity_access_read,
            opportunity_access_edit,
            opportunity_access_delete,
            work_order_access_read,
            work_order_access_edit,
            work_order_access_delete,
            task_access_read,
            task_access_edit,
            task_access_delete,
            role_access_read,
            role_access_edit,
            role_access_delete,
            system_admin,
            can_manage_roles,
            can_manage_users
          )
        `)
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async updateLastLogin(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw error;
    }
  }

  static generateToken(user) {
    const payload = {
      id: user.id,
      email: user.email,
      companyId: user.company_id,
      roleId: user.role_id,
      firstName: user.first_name,
      lastName: user.last_name
    };

    return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
      expiresIn: '7d'
    });
  }

  static async findAllByCompany(companyId) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select(`
          *,
          roles (
            id,
            role_name,
            description
          )
        `)
        .eq('company_id', companyId)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }

  static async update(id, userData) {
    try {
      const { 
        firstName,
        lastName,
        phoneNumber,
        department,
        position,
        isActive
      } = userData;
      
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber || null,
        department: department || null,
        position: position || null,
        updated_at: new Date().toISOString()
      };

      if (isActive !== undefined) {
        updateData.is_active = isActive;
      }
      
      const { data, error } = await supabase
        .from('users')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .update({
          is_active: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserSupabase;