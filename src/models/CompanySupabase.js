const { supabase } = require('../config/supabase');

class CompanySupabase {
  static async create(companyData) {
    try {
      const { companyName, firstName, lastName, email, phoneNumber } = companyData;
      
      const { data, error } = await supabase
        .from('companies')
        .insert([
          {
            company_name: companyName,
            first_name: firstName,
            last_name: lastName,
            email,
            phone_number: phoneNumber
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

  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('companies')
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

  static async update(id, companyData) {
    try {
      const { companyName, firstName, lastName, email, phoneNumber } = companyData;
      
      const { data, error } = await supabase
        .from('companies')
        .update({
          company_name: companyName,
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phoneNumber,
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
        .from('companies')
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

  static async search(searchTerm) {
    try {
      const { data, error } = await supabase
        .from('companies')
        .select('*')
        .or(`company_name.ilike.%${searchTerm}%,first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return data || [];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CompanySupabase;
