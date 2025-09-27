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
    caseNumber: row.case_number,
    title: row.title,
    description: row.description,
    caseType: row.case_type,
    priority: row.priority,
    status: row.status,
    customerId: row.customer_id,
    contactPerson: row.contact_person,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    assignedTo: row.assigned_to,
    category: row.category,
    subcategory: row.subcategory,
    resolutionSummary: row.resolution_summary,
    resolutionNotes: row.resolution_notes,
    estimatedResolutionDate: row.estimated_resolution_date,
    actualResolutionDate: row.actual_resolution_date,
    customerSatisfactionRating: row.customer_satisfaction_rating,
    customerFeedback: row.customer_feedback,
    tags: row.tags || [],
    attachments: row.attachments || [],
    escalationLevel: row.escalation_level,
    escalatedTo: row.escalated_to,
    escalatedAt: row.escalated_at,
    escalationReason: row.escalation_reason,
    slaDeadline: row.sla_deadline,
    slaBreached: row.sla_breached,
    notes: row.notes,
    createdBy: row.created_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

class CaseSupabase {
  // Create a new case
  static async create(caseData) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .insert([
          {
            title: caseData.title,
            description: caseData.description,
            case_type: caseData.caseType,
            priority: caseData.priority,
            status: caseData.status,
            customer_id: caseData.customerId,
            contact_person: caseData.contactPerson,
            contact_email: caseData.contactEmail,
            contact_phone: caseData.contactPhone,
            assigned_to: caseData.assignedTo,
            category: caseData.category,
            subcategory: caseData.subcategory,
            estimated_resolution_date: caseData.estimatedResolutionDate,
            notes: caseData.notes,
            company_id: caseData.company_id,
            created_by: caseData.created_by
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

  // Find cases by company ID (for security)
  static async findByCompanyId(companyId) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('company_id', companyId)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      return (data || []).map(transformToCamelCase);
    } catch (error) {
      throw error;
    }
  }

  // Find case by ID and company (for security)
  static async findByIdAndCompany(id, companyId) {
    try {
      const { data, error } = await supabase
        .from('cases')
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

  // Update case by ID and company (for security)
  static async updateByIdAndCompany(id, companyId, updateData) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .update({
          title: updateData.title,
          description: updateData.description,
          case_type: updateData.caseType,
          priority: updateData.priority,
          status: updateData.status,
          customer_id: updateData.customerId,
          contact_person: updateData.contactPerson,
          contact_email: updateData.contactEmail,
          contact_phone: updateData.contactPhone,
          assigned_to: updateData.assignedTo,
          category: updateData.category,
          subcategory: updateData.subcategory,
          resolution_summary: updateData.resolutionSummary,
          resolution_notes: updateData.resolutionNotes,
          estimated_resolution_date: updateData.estimatedResolutionDate,
          actual_resolution_date: updateData.actualResolutionDate,
          customer_satisfaction_rating: updateData.customerSatisfactionRating,
          customer_feedback: updateData.customerFeedback,
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

  // Delete case by ID and company (for security)
  static async deleteByIdAndCompany(id, companyId) {
    try {
      const { data, error } = await supabase
        .from('cases')
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

  // Search cases by company (for security)
  static async searchByCompany(companyId, query) {
    try {
      const { data, error } = await supabase
        .from('cases')
        .select('*')
        .eq('company_id', companyId)
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,case_number.ilike.%${query}%`)
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

module.exports = CaseSupabase;
