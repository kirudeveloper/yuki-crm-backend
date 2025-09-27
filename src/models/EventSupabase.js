const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Transform snake_case to camelCase
function transformToCamelCase(row) {
  return {
    id: row.id,
    companyId: row.company_id,
    title: row.title,
    description: row.description,
    startDate: row.start_date,
    endDate: row.end_date,
    allDay: row.all_day,
    location: row.location,
    eventType: row.event_type,
    status: row.status,
    priority: row.priority,
    customerId: row.customer_id,
    opportunityId: row.opportunity_id,
    caseId: row.case_id,
    assignedTo: row.assigned_to,
    participants: row.participants || [],
    reminderMinutes: row.reminder_minutes,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class EventSupabase {
  // Create a new event
  static async create(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([
          {
            title: eventData.title,
            description: eventData.description,
            start_date: eventData.startDate,
            end_date: eventData.endDate,
            all_day: eventData.allDay,
            location: eventData.location,
            event_type: eventData.eventType,
            status: eventData.status,
            priority: eventData.priority,
            customer_id: eventData.customerId,
            opportunity_id: eventData.opportunityId,
            case_id: eventData.caseId,
            assigned_to: eventData.assignedTo,
            participants: eventData.participants,
            reminder_minutes: eventData.reminderMinutes,
            notes: eventData.notes,
            company_id: eventData.company_id,
            created_by: eventData.created_by
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

  // Find events by company ID (for security)
  static async findByCompanyId(companyId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('company_id', companyId)
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }

  // Find event by ID and company (for security)
  static async findByIdAndCompany(id, companyId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .eq('company_id', companyId)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return transformToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }

  // Update event by ID and company (for security)
  static async updateByIdAndCompany(id, companyId, updateData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .update({
          title: updateData.title,
          description: updateData.description,
          start_date: updateData.startDate,
          end_date: updateData.endDate,
          all_day: updateData.allDay,
          location: updateData.location,
          event_type: updateData.eventType,
          status: updateData.status,
          priority: updateData.priority,
          customer_id: updateData.customerId,
          opportunity_id: updateData.opportunityId,
          case_id: updateData.caseId,
          assigned_to: updateData.assignedTo,
          participants: updateData.participants,
          reminder_minutes: updateData.reminderMinutes,
          notes: updateData.notes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return transformToCamelCase(data);
    } catch (error) {
      throw error;
    }
  }

  // Delete event by ID and company (for security)
  static async deleteByIdAndCompany(id, companyId) {
    try {
      const { data, error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)
        .eq('company_id', companyId)
        .select()
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          return null; // Not found
        }
        throw error;
      }

      return data !== null;
    } catch (error) {
      throw error;
    }
  }

  // Search events by company (for security)
  static async searchByCompany(companyId, query) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('company_id', companyId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .order('start_date', { ascending: true });

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EventSupabase;
