const { supabase } = require('../config/supabase');

// Transform snake_case to camelCase
const transformToCamelCase = (data) => {
  if (!data) return data;
  
  return {
    id: data.id,
    company_id: data.company_id,
    firstName: data.first_name,
    lastName: data.last_name,
    dateOfBirth: data.date_of_birth,
    mobileNumber: data.mobile_number,
    email: data.email,
    address: data.address,
    city: data.city,
    state: data.state,
    zipCode: data.zip_code,
    country: data.country,
    notes: data.notes,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

class CustomerSupabase {
  static async create(customerData) {
    try {
      const {
        company_id,
        firstName,
        lastName,
        dateOfBirth,
        mobileNumber,
        email,
        address,
        city,
        state,
        zipCode,
        country,
        notes
      } = customerData;
      
      const { data, error } = await supabase
        .from('customers')
        .insert([
          {
            company_id,
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth,
            mobile_number: mobileNumber,
            email,
            address,
            city,
            state,
            zip_code: zipCode,
            country,
            notes
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      return transformToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }

  static async findAll() {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return transformToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }

  static async update(id, customerData) {
    try {
      const {
        firstName,
        lastName,
        dateOfBirth,
        mobileNumber,
        email,
        address,
        city,
        state,
        zipCode,
        country,
        notes
      } = customerData;
      
      const { data, error } = await supabase
        .from('customers')
        .update({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth,
          mobile_number: mobileNumber,
          email,
          address,
          city,
          state,
          zip_code: zipCode,
          country,
          notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        throw error;
      }

      return transformToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('customers')
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
        .from('customers')
        .select('*')
        .or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,mobile_number.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CustomerSupabase;
