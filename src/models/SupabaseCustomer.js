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
      notes
    } = customerData;

    const query = `
      INSERT INTO customers (
        first_name, last_name, date_of_birth, mobile_number, email,
        address, city, state, zip_code, country, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      RETURNING *
    `;

    const values = [
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
      notes
    } = customerData;

    const query = `
      UPDATE customers SET
        first_name = $1, last_name = $2, date_of_birth = $3, mobile_number = $4,
        email = $5, address = $6, city = $7, state = $8, zip_code = $9,
        country = $10, notes = $11, updated_at = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `;

    const values = [
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
      notes: dbCustomer.notes,
      createdAt: dbCustomer.created_at,
      updatedAt: dbCustomer.updated_at
    };
  }
}

module.exports = PostgreSQLCustomer;
