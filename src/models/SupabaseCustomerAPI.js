require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

class SupabaseCustomerAPI {
  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    );
  }

  // Create a new customer
  static async create(customerData) {
    const instance = new SupabaseCustomerAPI();
    
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

    try {
      const { data, error } = await instance.supabase
        .from('customers')
        .insert([
          {
            first_name: firstName,
            last_name: lastName,
            date_of_birth: dateOfBirth || null,
            mobile_number: mobileNumber || null,
            email: email || null,
            address: address || null,
            city: city || null,
            state: state || null,
            zip_code: zipCode || null,
            country: country || 'USA',
            notes: notes || null
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      return this.formatCustomer(data);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Get all customers
  static async getAll() {
    const instance = new SupabaseCustomerAPI();
    
    try {
      const { data, error } = await instance.supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      return data.map(customer => this.formatCustomer(customer));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get customer by ID
  static async getById(id) {
    const instance = new SupabaseCustomerAPI();
    
    try {
      const { data, error } = await instance.supabase
        .from('customers')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No rows found
        }
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      return this.formatCustomer(data);
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  // Update customer
  static async update(id, customerData) {
    const instance = new SupabaseCustomerAPI();
    
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

    try {
      const { data, error } = await instance.supabase
        .from('customers')
        .update({
          first_name: firstName,
          last_name: lastName,
          date_of_birth: dateOfBirth || null,
          mobile_number: mobileNumber || null,
          email: email || null,
          address: address || null,
          city: city || null,
          state: state || null,
          zip_code: zipCode || null,
          country: country || 'USA',
          notes: notes || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      if (!data) {
        return null;
      }

      return this.formatCustomer(data);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Delete customer
  static async delete(id) {
    const instance = new SupabaseCustomerAPI();
    
    try {
      const { error } = await instance.supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Format customer data from database to API format
  static formatCustomer(dbCustomer) {
    return {
      id: dbCustomer.id,
      firstName: dbCustomer.first_name,
      lastName: dbCustomer.last_name,
      dateOfBirth: dbCustomer.date_of_birth,
      mobileNumber: dbCustomer.mobile_number,
      email: dbCustomer.email,
      address: dbCustomer.address,
      city: dbCustomer.city,
      state: dbCustomer.state,
      zipCode: dbCustomer.zip_code,
      country: dbCustomer.country,
      notes: dbCustomer.notes,
      createdAt: dbCustomer.created_at,
      updatedAt: dbCustomer.updated_at
    };
  }
}

module.exports = SupabaseCustomerAPI;
