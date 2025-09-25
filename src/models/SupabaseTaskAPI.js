const { supabase } = require('../config/supabase');

class SupabaseTaskAPI {
  // Get all tasks with optional customer information
  static async findAll(includeCustomer = false) {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (includeCustomer) {
        query = supabase.from('tasks').select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.findAll:', error);
      throw error;
    }
  }

  // Get tasks by customer ID
  static async findByCustomerId(customerId, includeCustomer = false) {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (includeCustomer) {
        query = supabase.from('tasks').select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `);
      }
      
      const { data, error } = await query
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks by customer:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.findByCustomerId:', error);
      throw error;
    }
  }

  // Get a single task by ID
  static async findById(id, includeCustomer = false) {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (includeCustomer) {
        query = supabase.from('tasks').select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `);
      }
      
      const { data, error } = await query.eq('id', id).single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          return null; // No task found
        }
        console.error('Error fetching task by ID:', error);
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.findById:', error);
      throw error;
    }
  }

  // Create a new task
  static async create(taskData) {
    try {
      // Validate required fields
      if (!taskData.subject) {
        throw new Error('Subject is required');
      }

      // Prepare the task data
      const task = {
        subject: taskData.subject,
        due_date: taskData.due_date || taskData.dueDate,
        description: taskData.description,
        status: taskData.status || 'Open',
        customer_id: taskData.customer_id || taskData.customerId,
        created_at: new Date(),
        updated_at: new Date()
      };

      // Remove undefined values
      Object.keys(task).forEach(key => task[key] === undefined && delete task[key]);

      const { data, error } = await supabase
        .from('tasks')
        .insert([task])
        .select()
        .single();

      if (error) {
        console.error('Error creating task:', error);
        throw error;
      }

      console.log('✅ Task created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.create:', error);
      throw error;
    }
  }

  // Update an existing task
  static async update(id, taskData) {
    try {
      // Prepare the update data
      const updateData = {
        updated_at: new Date()
      };

      // Add fields that are provided
      if (taskData.subject !== undefined) updateData.subject = taskData.subject;
      if (taskData.due_date !== undefined || taskData.dueDate !== undefined) {
        updateData.due_date = taskData.due_date || taskData.dueDate;
      }
      if (taskData.description !== undefined) updateData.description = taskData.description;
      if (taskData.status !== undefined) updateData.status = taskData.status;
      if (taskData.customer_id !== undefined || taskData.customerId !== undefined) {
        updateData.customer_id = taskData.customer_id || taskData.customerId;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating task:', error);
        throw error;
      }

      console.log('✅ Task updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.update:', error);
      throw error;
    }
  }

  // Delete a task
  static async delete(id) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error deleting task:', error);
        throw error;
      }

      console.log('✅ Task deleted successfully:', data);
      return data;
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.delete:', error);
      throw error;
    }
  }

  // Get tasks by status
  static async findByStatus(status, includeCustomer = false) {
    try {
      let query = supabase.from('tasks').select('*');
      
      if (includeCustomer) {
        query = supabase.from('tasks').select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `);
      }
      
      const { data, error } = await query
        .eq('status', status)
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching tasks by status:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.findByStatus:', error);
      throw error;
    }
  }

  // Get overdue tasks
  static async findOverdue(includeCustomer = false) {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      let query = supabase.from('tasks').select('*');
      
      if (includeCustomer) {
        query = supabase.from('tasks').select(`
          *,
          customers:customer_id (
            id,
            first_name,
            last_name,
            email
          )
        `);
      }
      
      const { data, error } = await query
        .lt('due_date', today)
        .neq('status', 'Completed')
        .neq('status', 'Cancelled')
        .order('due_date', { ascending: true });
      
      if (error) {
        console.error('Error fetching overdue tasks:', error);
        throw error;
      }
      
      return data || [];
    } catch (error) {
      console.error('Error in SupabaseTaskAPI.findOverdue:', error);
      throw error;
    }
  }
}

module.exports = SupabaseTaskAPI;
