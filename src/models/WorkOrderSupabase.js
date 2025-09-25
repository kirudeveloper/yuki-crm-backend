const { supabase } = require('../config/supabase');

class WorkOrderSupabase {
  static async create(workOrderData) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .insert([workOrderData])
        .select()
        .single();

      if (error) {
        console.error('Error creating work order:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in WorkOrderSupabase.create:', error);
      throw error;
    }
  }

  static async findAll(companyId = null) {
    try {
      let query = supabase.from('work_orders').select(`
        *,
        customers:customer_id (
          id,
          first_name,
          last_name,
          email
        ),
        opportunities:opportunity_id (
          id,
          title,
          value
        )
      `);

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching work orders:', error);
        throw error;
      }

      return data || [];
    } catch (error) {
      console.error('Error in WorkOrderSupabase.findAll:', error);
      throw error;
    }
  }

  static async findById(id) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          ),
          opportunities:opportunity_id (
            id,
            title,
            value
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching work order:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in WorkOrderSupabase.findById:', error);
      throw error;
    }
  }

  static async update(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('work_orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating work order:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in WorkOrderSupabase.update:', error);
      throw error;
    }
  }

  static async delete(id) {
    try {
      const { error } = await supabase
        .from('work_orders')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting work order:', error);
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error in WorkOrderSupabase.delete:', error);
      throw error;
    }
  }
}

module.exports = WorkOrderSupabase;
