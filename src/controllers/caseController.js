const { body, validationResult } = require('express-validator');
const CaseSupabase = require('../models/CaseSupabase');

class CaseController {
  constructor() {
    this.getCaseModel = () => CaseSupabase;
  }

  // Get all cases (filtered by company)
  async getAllCases(req, res) {
    try {
      // Get company_id from authenticated user
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      console.log('🔍 Fetching cases for company:', companyId);

      const Case = this.getCaseModel();
      const cases = await Case.findByCompanyId(companyId);

      res.json({
        success: true,
        message: 'Cases retrieved successfully',
        data: cases,
        count: cases.length
      });
    } catch (error) {
      console.error('Error fetching cases:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get case by ID (with company security)
  async getCaseById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Case = this.getCaseModel();
      const caseItem = await Case.findByIdAndCompany(id, companyId);

      if (!caseItem) {
        return res.status(404).json({
          success: false,
          message: 'Case not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Case retrieved successfully',
        data: caseItem
      });
    } catch (error) {
      console.error('Error fetching case:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Create new case
  async createCase(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const companyId = req.user?.company_id;
      const userId = req.user?.id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const caseData = {
        title: req.body.title,
        description: req.body.description,
        caseType: req.body.caseType || 'support',
        priority: req.body.priority || 'medium',
        status: req.body.status || 'open',
        customerId: req.body.customerId,
        contactPerson: req.body.contactPerson,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        assignedTo: req.body.assignedTo,
        category: req.body.category,
        subcategory: req.body.subcategory,
        estimatedResolutionDate: req.body.estimatedResolutionDate,
        notes: req.body.notes,
        company_id: companyId,
        created_by: userId
      };

      console.log('🔍 Creating case with data:', caseData);

      const Case = this.getCaseModel();
      const newCase = await Case.create(caseData);

      res.status(201).json({
        success: true,
        message: 'Case created successfully',
        data: newCase
      });
    } catch (error) {
      console.error('Error creating case:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update case (with company security)
  async updateCase(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const updateData = {
        title: req.body.title,
        description: req.body.description,
        caseType: req.body.caseType,
        priority: req.body.priority,
        status: req.body.status,
        customerId: req.body.customerId,
        contactPerson: req.body.contactPerson,
        contactEmail: req.body.contactEmail,
        contactPhone: req.body.contactPhone,
        assignedTo: req.body.assignedTo,
        category: req.body.category,
        subcategory: req.body.subcategory,
        resolutionSummary: req.body.resolutionSummary,
        resolutionNotes: req.body.resolutionNotes,
        estimatedResolutionDate: req.body.estimatedResolutionDate,
        actualResolutionDate: req.body.actualResolutionDate,
        customerSatisfactionRating: req.body.customerSatisfactionRating,
        customerFeedback: req.body.customerFeedback,
        notes: req.body.notes
      };

      const Case = this.getCaseModel();
      const updatedCase = await Case.updateByIdAndCompany(id, companyId, updateData);

      if (!updatedCase) {
        return res.status(404).json({
          success: false,
          message: 'Case not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Case updated successfully',
        data: updatedCase
      });
    } catch (error) {
      console.error('Error updating case:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Delete case (with company security)
  async deleteCase(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Case = this.getCaseModel();
      const deleted = await Case.deleteByIdAndCompany(id, companyId);

      if (!deleted) {
        return res.status(404).json({
          success: false,
          message: 'Case not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Case deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting case:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Search cases (with company security)
  async searchCases(req, res) {
    try {
      const { query } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Case = this.getCaseModel();
      const cases = await Case.searchByCompany(companyId, query);

      res.json({
        success: true,
        message: 'Cases search completed',
        data: cases,
        count: cases.length
      });
    } catch (error) {
      console.error('Error searching cases:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = new CaseController();
