const { supabase } = require('../config/supabase');

// Transform snake_case to camelCase
const transformToCamelCase = (data) => {
  if (!data) return data;
  
  return {
    id: data.id,
    customerId: data.customer_id,
    companyId: data.company_id,
    title: data.title,
    description: data.description,
    status: data.status,
    priority: data.priority,
    dueDate: data.due_date,
    completedAt: data.completed_at,
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
};

class TaskSupabase {
  static async create(taskData) {
    try {
      const {
        customerId,
        companyId,
        userId,
        title,
        description,
        status = 'pending',
        priority = 'medium',
        dueDate,
        ownerId
      } = taskData;

      const { data, error } = await supabase
        .from('tasks')
        .insert([
          {
            customer_id: customerId,
            company_id: companyId,
            user_id: userId,
            title,
            description,
            status,
            priority,
            due_date: dueDate,
            owner_id: ownerId
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

  static async findAll(companyId = null) {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }

  static async findByCustomerId(customerId) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('customer_id', customerId)
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
        .from('tasks')
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

  static async update(id, taskData) {
    try {
      const {
        title,
        description,
        status,
        priority,
        dueDate
      } = taskData;

      const updateData = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (status !== undefined) updateData.status = status;
      if (priority !== undefined) updateData.priority = priority;
      if (dueDate !== undefined) updateData.due_date = dueDate;
      
      // Set completed_at when status changes to completed
      if (status === 'completed') {
        updateData.completed_at = new Date().toISOString();
      } else if (status !== 'completed') {
        updateData.completed_at = null;
      }

      const { data, error } = await supabase
        .from('tasks')
        .update(updateData)
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
        .from('tasks')
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

  static async search(searchTerm, companyId = null) {
    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
        .order('created_at', { ascending: false });

      if (companyId) {
        query = query.eq('company_id', companyId);
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = TaskSupabase;



