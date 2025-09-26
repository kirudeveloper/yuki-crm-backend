const Task = require('../models/Task');

class TaskController {
  static async createTask(req, res) {
    try {
      console.log('🔍 TaskController - req.user:', req.user);
      console.log('🔍 TaskController - req.user?.company_id:', req.user?.company_id);
      console.log('🔍 TaskController - req.user?.id:', req.user?.id);
      
      // Get company_id and user_id from authenticated user
      const companyId = req.user?.company_id;
      const userId = req.user?.id;

      if (!companyId) {
        console.log('❌ TaskController - No company_id found in req.user');
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

      console.log('🔍 Creating task for company:', companyId, 'by user:', userId);

      const taskData = {
        ...req.body,
        companyId: companyId, // Set from authenticated user
        userId: userId, // Set from authenticated user
        createdBy: userId, // Track who created the task
        ownerId: req.body.ownerId || userId // Use provided owner or default to current user
      };

      const task = await Task.create(taskData);
      
      res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task
      });
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create task',
        error: error.message
      });
    }
  }

  static async getAllTasks(req, res) {
    try {
      const { companyId } = req.query;
      const tasks = await Task.findAll(companyId);
      
      res.json({
        success: true,
        message: 'Tasks retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tasks',
        error: error.message
      });
    }
  }

  static async getTasksByCustomer(req, res) {
    try {
      const { customerId } = req.params;
      const tasks = await Task.findByCustomerId(customerId);
      
      res.json({
        success: true,
        message: 'Customer tasks retrieved successfully',
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error fetching customer tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch customer tasks',
        error: error.message
      });
    }
  }

  static async getTaskById(req, res) {
    try {
      const { id } = req.params;
      const task = await Task.findById(id);
      
      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found'
        });
      }
      
      res.json({
        success: true,
        message: 'Task retrieved successfully',
        data: task
      });
    } catch (error) {
      console.error('Error fetching task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch task',
        error: error.message
      });
    }
  }

  static async updateTask(req, res) {
    try {
      const { id } = req.params;
      const taskData = req.body;
      
      const task = await Task.update(id, taskData);
      
      res.json({
        success: true,
        message: 'Task updated successfully',
        data: task
      });
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update task',
        error: error.message
      });
    }
  }

  static async deleteTask(req, res) {
    try {
      const { id } = req.params;
      await Task.delete(id);
      
      res.json({
        success: true,
        message: 'Task deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete task',
        error: error.message
      });
    }
  }

  static async searchTasks(req, res) {
    try {
      const { q: searchTerm, companyId } = req.query;
      
      if (!searchTerm) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }
      
      const tasks = await Task.search(searchTerm, companyId);
      
      res.json({
        success: true,
        message: 'Tasks search completed',
        data: tasks,
        count: tasks.length
      });
    } catch (error) {
      console.error('Error searching tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search tasks',
        error: error.message
      });
    }
  }
}

module.exports = TaskController;