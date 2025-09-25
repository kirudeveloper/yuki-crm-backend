const Company = require('../models/Company');
const User = require('../models/User');
const bcrypt = require('bcrypt');

const companyController = {
  // Create a new company
  createCompany: async (req, res) => {
    try {
      const { companyName, firstName, lastName, email, phoneNumber } = req.body;

      // Validate required fields
      if (!companyName || !firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      // Check if company with email already exists
      const existingCompany = await Company.findByEmail(email);
      if (existingCompany) {
        return res.status(409).json({
          success: false,
          message: 'Company with this email already exists'
        });
      }

      // Create the company first
      const company = await Company.create({
        companyName,
        firstName,
        lastName,
        email,
        phoneNumber
      });

      // Generate a temporary password (in production, you might want to send this via email)
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);

      // Create a user account for the company owner
      const user = await User.create({
        company_id: company.id,
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: 'admin' // Company owner gets admin role
      });

      res.status(201).json({
        success: true,
        message: 'Company and user account created successfully',
        data: {
          company,
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role
          },
          tempPassword // Include temporary password in response (remove in production)
        }
      });
    } catch (error) {
      console.error('Error creating company:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create company',
        error: error.message
      });
    }
  },

  // Get all companies
  getAllCompanies: async (req, res) => {
    try {
      const companies = await Company.findAll();
      res.json({
        success: true,
        data: companies
      });
    } catch (error) {
      console.error('Error fetching companies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch companies',
        error: error.message
      });
    }
  },

  // Get company by ID
  getCompanyById: async (req, res) => {
    try {
      const { id } = req.params;
      const company = await Company.findById(id);

      if (!company) {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }

      res.json({
        success: true,
        data: company
      });
    } catch (error) {
      console.error('Error fetching company:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch company',
        error: error.message
      });
    }
  },

  // Update company
  updateCompany: async (req, res) => {
    try {
      const { id } = req.params;
      const { companyName, firstName, lastName, email, phoneNumber } = req.body;

      // Validate required fields
      if (!companyName || !firstName || !lastName || !email || !phoneNumber) {
        return res.status(400).json({
          success: false,
          message: 'All fields are required'
        });
      }

      const company = await Company.update(id, {
        companyName,
        firstName,
        lastName,
        email,
        phoneNumber
      });

      res.json({
        success: true,
        message: 'Company updated successfully',
        data: company
      });
    } catch (error) {
      console.error('Error updating company:', error);
      if (error.message === 'Company not found') {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to update company',
        error: error.message
      });
    }
  },

  // Delete company
  deleteCompany: async (req, res) => {
    try {
      const { id } = req.params;
      await Company.delete(id);

      res.json({
        success: true,
        message: 'Company deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting company:', error);
      if (error.message === 'Company not found') {
        return res.status(404).json({
          success: false,
          message: 'Company not found'
        });
      }
      res.status(500).json({
        success: false,
        message: 'Failed to delete company',
        error: error.message
      });
    }
  },

  // Search companies
  searchCompanies: async (req, res) => {
    try {
      const { q } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Search query is required'
        });
      }

      const companies = await Company.search(q);
      res.json({
        success: true,
        data: companies
      });
    } catch (error) {
      console.error('Error searching companies:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to search companies',
        error: error.message
      });
    }
  }
};

module.exports = companyController;


