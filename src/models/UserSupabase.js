const { supabase } = require('../config/supabase');

class UserSupabase {
  static async create(userData) {
    try {
      const { company_id, email, password, firstName, lastName, role = 'user' } = userData;
      
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            company_id,
            email,
            password,
            first_name: firstName,
            last_name: lastName,
            role
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
        .select('*')
        .eq('email', email)
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
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findByCompanyId(company_id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('company_id', company_id);

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
      const { email, password, firstName, lastName, role } = userData;
      
      const { data, error } = await supabase
        .from('users')
        .update({
          email,
          password,
          first_name: firstName,
          last_name: lastName,
          role,
          updated_at: new Date().toISOString()
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

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('users')
        .delete()
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
