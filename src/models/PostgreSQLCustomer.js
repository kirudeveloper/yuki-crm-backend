require('dotenv').config();

// Import the appropriate pool based on database host
const getPool = () => {
  if (process.env.DATABASE_URL?.includes('supabase.co') || process.env.DB_HOST?.includes('supabase.co')) {
    // Create Supabase pool with error handling
    try {
      const { Pool } = require('pg');
      return new Pool({
        user: process.env.DB_USER || 'postgres',
        host: process.env.DB_HOST,
        database: process.env.DB_NAME || 'postgres',
        password: process.env.DB_PASSWORD,
        port: parseInt(process.env.DB_PORT) || 5432,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
        max: 10
      });
    } catch (error) {
      console.error('❌ Error creating Supabase pool:', error.message);
      throw error;
    }
  } else {
    return require('../config/postgresql').pool;
  }
};

class PostgreSQLCustomer {
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
      const pool = getPool();
      const result = await pool.query(query, values);
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get all customers
  static async getAll() {
    const query = `
      SELECT * FROM customers 
      ORDER BY created_at DESC
    `;

    try {
      const pool = getPool();
      const result = await pool.query(query);
      return result.rows.map(customer => this.formatCustomer(customer));
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get customer by ID
  static async getById(id) {
    const query = 'SELECT * FROM customers WHERE id = $1';
    
    try {
      const pool = getPool();
      const result = await pool.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
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
        first_name = $1,
        last_name = $2,
        date_of_birth = $3,
        mobile_number = $4,
        email = $5,
        address = $6,
        city = $7,
        state = $8,
        zip_code = $9,
        country = $10,
        notes = $11,
        updated_at = CURRENT_TIMESTAMP
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
      const pool = getPool();
      const result = await pool.query(query, values);
      if (result.rows.length === 0) {
        return null;
      }
      return this.formatCustomer(result.rows[0]);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Delete customer
  static async delete(id) {
    const query = 'DELETE FROM customers WHERE id = $1 RETURNING *';
    
    try {
      const pool = getPool();
      const result = await pool.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Search customers
  static async search(query) {
    const searchQuery = `
      SELECT * FROM customers 
      WHERE 
        first_name ILIKE $1 OR 
        last_name ILIKE $1 OR 
        email ILIKE $1 OR 
        mobile_number ILIKE $1 OR
        city ILIKE $1 OR
        notes ILIKE $1
      ORDER BY created_at DESC
    `;

    const searchTerm = `%${query}%`;

    try {
      const pool = getPool();
      const result = await pool.query(searchQuery, [searchTerm]);
      return result.rows.map(customer => this.formatCustomer(customer));
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Get customer count
  static async count() {
    const query = 'SELECT COUNT(*) as count FROM customers';
    
    try {
      const pool = getPool();
      const result = await pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Database error: ${error.message}`);
    }
  }

  // Format customer data from database
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
