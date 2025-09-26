require('dotenv').config();
const { Pool } = require('pg');

class PostgreSQLCustomer {
  // Get pool with Supabase configuration
  static getPool() {
    // Try connection string first if available
    if (process.env.DATABASE_URL) {
      return new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
    }
    
    // Fallback to individual parameters with IPv4 preference
    return new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST,
      database: process.env.DB_NAME || 'postgres',
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT) || 5432,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
      idleTimeoutMillis: 30000,
      max: 10,
      // Try to force IPv4
      family: 4
    });
  }

  // Create a new customer
  static async create(customerData) {
    const {
      company_id,
      firstName,
      lastName,
      dateOfBirth,
      mobileNumber,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      company,
      jobTitle,
      industry,
      leadSource,
      status,
      notes
    } = customerData;

    const query = `
      INSERT INTO customers (
        company_id, first_name, last_name, date_of_birth, mobile_number, email,
        address, city, state, zip_code, country, company_name, job_title,
        industry, lead_source, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `;

    const values = [
      company_id,
      firstName,
      lastName,
      dateOfBirth || null,
      mobileNumber || null,
      email || null,
      address || null,
      city || null,
      state || null,
      zipCode || null,
      country || 'USA',
      company || null,
      jobTitle || null,
      industry || null,
      leadSource || null,
      status || 'active',
      notes || null
    ];

    try {
      const pool = this.getPool();
      const result = await pool.query(query, values);
      await pool.end();
      
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  // Get all customers
  static async getAll() {
    try {
      const pool = this.getPool();
      const result = await pool.query('SELECT * FROM customers ORDER BY created_at DESC');
      await pool.end();
      
      return result.rows.map(customer => this.formatCustomer(customer));
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get customer by ID
  static async getById(id) {
    try {
      const pool = this.getPool();
      const result = await pool.query('SELECT * FROM customers WHERE id = $1', [id]);
      await pool.end();
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      console.error('Error fetching customer:', error);
      throw error;
    }
  }

  // Update customer
  static async update(id, customerData) {
    const {
      company_id,
      firstName,
      lastName,
      dateOfBirth,
      mobileNumber,
      email,
      address,
      city,
      state,
      zipCode,
      country,
      company,
      jobTitle,
      industry,
      leadSource,
      status,
      notes
    } = customerData;

    const query = `
      UPDATE customers SET
        company_id = $1, first_name = $2, last_name = $3, date_of_birth = $4, mobile_number = $5,
        email = $6, address = $7, city = $8, state = $9, zip_code = $10,
        country = $11, company_name = $12, job_title = $13, industry = $14,
        lead_source = $15, status = $16, notes = $17, updated_at = CURRENT_TIMESTAMP
      WHERE id = $18
      RETURNING *
    `;

    const values = [
      company_id,
      firstName,
      lastName,
      dateOfBirth || null,
      mobileNumber || null,
      email || null,
      address || null,
      city || null,
      state || null,
      zipCode || null,
      country || 'USA',
      company || null,
      jobTitle || null,
      industry || null,
      leadSource || null,
      status || 'active',
      notes || null,
      id
    ];

    try {
      const pool = this.getPool();
      const result = await pool.query(query, values);
      await pool.end();
      
      if (result.rows.length === 0) {
        return null;
      }
      
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    }
  }

  // Delete customer
  static async delete(id) {
    try {
      const pool = this.getPool();
      const result = await pool.query('DELETE FROM customers WHERE id = $1 RETURNING *', [id]);
      await pool.end();
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    }
  }

  // Format customer data from database to API format
  static formatCustomer(dbCustomer) {
    return {
      id: dbCustomer.id,
      companyId: dbCustomer.company_id,
      firstName: dbCustomer.first_name,
      lastName: dbCustomer.last_name,
      dateOfBirth: dbCustomer.date_of_birth,
      mobileNumber: dbCustomer.mobile_number,
      email: dbCustomer.email,
      address: dbCustomer.address,
      city: dbCustomer.city,
      state: dbCustomer.state,
      zipCode: dbCustomer.zip_code,
      country: dbCustomer.country,
      company: dbCustomer.company_name,
      jobTitle: dbCustomer.job_title,
      industry: dbCustomer.industry,
      leadSource: dbCustomer.lead_source,
      status: dbCustomer.status,
      notes: dbCustomer.notes,
      createdAt: dbCustomer.created_at,
      updatedAt: dbCustomer.updated_at
    };
  }
}

module.exports = PostgreSQLCustomer;
