const { supabase } = require('../config/supabase');

class OpportunitySupabase {
  static async create(opportunityData) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .insert([opportunityData])
        .select()
        .single();

      if (error) {
        console.error('Error creating opportunity:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in OpportunitySupabase.create:', error);
      throw error;
    }
  }

  static async findAll(companyId = null) {
    try {
      let query = supabase.from('opportunities').select(`
        *,
        customers:customer_id (
          id,
          first_name,
          last_name,
          email
        )
      `);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching opportunities:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in OpportunitySupabase.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching opportunity:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in OpportunitySupabase.findById:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating opportunity:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in OpportunitySupabase.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting opportunity:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in OpportunitySupabase.delete:', error);
      throw error;
    }
  }
}

module.exports = OpportunitySupabase;
