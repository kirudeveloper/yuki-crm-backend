const OpportunitySupabase = require('../models/OpportunitySupabase');

class OpportunityController {
  // Get all opportunities
  static async getAllOpportunities(req, res) {
    try {
      console.log('📊 Fetching all opportunities...');
      
      const opportunities = await OpportunitySupabase.findAll();
      
      res.json({
        success: true,
        data: opportunities,
        count: opportunities.length
      });
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunities',
        error: error.message
      });
    }
  }

  // Get opportunity by ID
  static async getOpportunityById(req, res) {
    try {
      const { id } = req.params;
      console.log(`📊 Fetching opportunity with ID: ${id}`);
      
      const opportunity = await OpportunitySupabase.findById(id);
      
      if (!opportunity) {
        return res.status(404).json({
          success: false,
          message: 'Opportunity not found'
        });
      }
      
      res.json({
        success: true,
        data: opportunity
      });
    } catch (error) {
      console.error('Error fetching opportunity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch opportunity',
        error: error.message
      });
    }
  }

  // Create new opportunity
  static async createOpportunity(req, res) {
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

      console.log('📊 Creating opportunity for company:', companyId, 'by user:', userId);

      const opportunityData = {
        ...req.body,
        company_id: companyId, // Set from authenticated user
        user_id: userId, // Set from authenticated user
        created_by: userId // Track who created the opportunity
      };
      
      const opportunity = await OpportunitySupabase.create(opportunityData);
      
      res.status(201).json({
        success: true,
        data: opportunity,
        message: 'Opportunity created successfully'
      });
    } catch (error) {
      console.error('Error creating opportunity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create opportunity',
        error: error.message
      });
    }
  }

  // Update opportunity
  static async updateOpportunity(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;
      console.log(`📊 Updating opportunity ${id}:`, updateData);
      
      const opportunity = await OpportunitySupabase.update(id, updateData);
      
      res.json({
        success: true,
        data: opportunity,
        message: 'Opportunity updated successfully'
      });
    } catch (error) {
      console.error('Error updating opportunity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to update opportunity',
        error: error.message
      });
    }
  }

  // Delete opportunity
  static async deleteOpportunity(req, res) {
    try {
      const { id } = req.params;
      console.log(`📊 Deleting opportunity ${id}`);
      
      await OpportunitySupabase.delete(id);
      
      res.json({
        success: true,
        message: 'Opportunity deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting opportunity:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to delete opportunity',
        error: error.message
      });
    }
  }
}

module.exports = OpportunityController;
