const WorkOrderSupabase = require('../models/WorkOrderSupabase');

class WorkOrderController {
  // Get all work orders
  static async getAllWorkOrders(req, res) {
    try {
      console.log('🔧 Fetching all work orders...');
      
      const workOrders = await WorkOrderSupabase.findAll();
      
      res.json({
        success: true,
        data: workOrders,
        count: workOrders.length
      });
    } catch (error) {
      console.error('Error fetching work orders:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch work orders',
        error: error.message
      });
    }
  }

  // Get work order by ID
  static async getWorkOrderById(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔧 Fetching work order with ID: ${id}`);
      
      const workOrder = await WorkOrderSupabase.findById(id);
      
      if (!workOrder) {
        return res.status(404).json({
          success: false,
          message: 'Work order not found'
        });
      }
      
      res.json({
        success: true,
        data: workOrder
      });
    } catch (error) {
      console.error('Error fetching work order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch work order',
        error: error.message
      });
    }
  }

  // Create new work order
  static async createWorkOrder(req, res) {
    try {
      // Get company_id and user_id from authenticated user
      const companyId = req.user?.company_id;
      const userId = req.user?.id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID not found in authentication token'
        });
      }

      console.log('🔧 Creating work order for company:', companyId, 'by user:', userId);

      // Transform camelCase to snake_case for database
      const workOrderData = {
        customer_id: req.body.customerId,
        opportunity_id: req.body.opportunityId,
        title: req.body.title,
        description: req.body.description,
        work_type: req.body.workType,
        priority: req.body.priority,
        status: req.body.status,
        start_date: req.body.startDate,
        due_date: req.body.dueDate,
        estimated_hours: req.body.estimatedHours,
        actual_hours: req.body.actualHours,
        hourly_rate: req.body.hourlyRate,
        total_cost: req.body.totalCost,
        notes: req.body.notes,
        company_id: companyId, // Set from authenticated user
        user_id: userId // Set from authenticated user
      };
      
      const workOrder = await WorkOrderSupabase.create(workOrderData);
      
      res.status(201).json({
        success: true,
        data: workOrder,
        message: 'Work order created successfully'
      });
    } catch (error) {
      console.error('Error creating work order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create work order',
        error: error.message
      });
    }
  }

  // Update work order
  static async updateWorkOrder(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      console.log(`🔧 Updating work order ${id}:`, updateData);
      
      const workOrder = await WorkOrderSupabase.update(id, updateData);
      
      res.json({
        success: true,
        data: workOrder,
        message: 'Work order updated successfully'
      });
    } catch (error) {
      console.error('Error updating work order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update work order',
        error: error.message
      });
    }
  }

  // Delete work order
  static async deleteWorkOrder(req, res) {
    try {
      const { id } = req.params;
      console.log(`🔧 Deleting work order ${id}`);
      
      await WorkOrderSupabase.delete(id);
      
      res.json({
        success: true,
        message: 'Work order deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting work order:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete work order',
        error: error.message
      });
    }
  }
}

module.exports = WorkOrderController;
