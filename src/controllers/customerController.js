const { validationResult } = require('express-validator');
const DatabaseFactory = require('../models/DatabaseFactory');

class CustomerController {
  // Get the appropriate customer model based on database type
  getCustomerModel() {
    return DatabaseFactory.getCustomerModel();
  }

  // Create a new customer
  async createCustomer(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

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

      console.log('🔍 Creating customer for company:', companyId, 'by user:', userId);

      const customerData = {
        company_id: companyId, // Set from authenticated user
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
        company: req.body.company,
        jobTitle: req.body.jobTitle,
        industry: req.body.industry,
        leadSource: req.body.leadSource,
        status: req.body.status,
        notes: req.body.notes
      };

      const Customer = this.getCustomerModel();
      const customer = await Customer.create(customerData);

      res.status(201).json({
        success: true,
        message: 'Customer created successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error creating customer:', error);
      
      // Handle unique constraint violations
      if (error.message.includes('UNIQUE constraint failed')) {
        const field = error.message.includes('email') ? 'email' : 'mobile number';
        return res.status(400).json({
          success: false,
          message: `A customer with this ${field} already exists`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get all customers (filtered by company)
  async getAllCustomers(req, res) {
    try {
      // Get company_id from authenticated user
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      console.log('🔍 Fetching customers for company:', companyId);

      const Customer = this.getCustomerModel();
      const customers = await Customer.findByCompanyId(companyId);

      res.json({
        success: true,
        message: 'Customers retrieved successfully',
        data: customers,
        count: customers.length
      });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Get customer by ID (with company security check)
  async getCustomerById(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Customer = this.getCustomerModel();
      const customer = await Customer.findByIdAndCompany(id, companyId);

      if (!customer) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Customer retrieved successfully',
        data: customer
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Update customer (with company security check)
  async updateCustomer(req, res) {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const customerData = {
        company_id: companyId, // Ensure company_id is from authenticated user
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        dateOfBirth: req.body.dateOfBirth,
        mobileNumber: req.body.mobileNumber,
        email: req.body.email,
        address: req.body.address,
        city: req.body.city,
        state: req.body.state,
        zipCode: req.body.zipCode,
        country: req.body.country,
        company: req.body.company,
        jobTitle: req.body.jobTitle,
        industry: req.body.industry,
        leadSource: req.body.leadSource,
        status: req.body.status,
        notes: req.body.notes
      };

      const Customer = this.getCustomerModel();
      const result = await Customer.updateByIdAndCompany(id, companyId, customerData);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Customer updated successfully',
        data: result
      });
    } catch (error) {
      console.error('Error updating customer:', error);
      
      // Handle unique constraint violations
      if (error.message.includes('UNIQUE constraint failed')) {
        const field = error.message.includes('email') ? 'email' : 'mobile number';
        return res.status(400).json({
          success: false,
          message: `A customer with this ${field} already exists`
        });
      }

      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Delete customer (with company security check)
  async deleteCustomer(req, res) {
    try {
      const { id } = req.params;
      const companyId = req.user?.company_id;

      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }

      const Customer = this.getCustomerModel();
      const result = await Customer.deleteByIdAndCompany(id, companyId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: 'Customer not found or access denied'
        });
      }

      res.json({
        success: true,
        message: 'Customer deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting customer:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }

  // Search customers (with company security check)
  async searchCustomers(req, res) {
    try {
      const { q } = req.query;
      const companyId = req.user?.company_id;
      
      if (!companyId) {
        return res.status(400).json({
          success: false,
          message: 'Company ID not found in authentication token'
        });
      }
      
      if (!q || q.trim() === '') {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const Customer = this.getCustomerModel();
      const customers = await Customer.searchByCompany(q.trim(), companyId);

      res.json({
        success: true,
        message: 'Search completed successfully',
        data: customers,
        count: customers.length,
        query: q
      });
    } catch (error) {
      console.error('Error searching customers:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      });
    }
  }
}

module.exports = CustomerController;
