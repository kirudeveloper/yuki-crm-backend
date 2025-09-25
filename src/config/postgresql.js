const { Pool } = require('pg');
const path = require('path');

// PostgreSQL connection configuration
const pool = new Pool({
  user: process.env.DB_USER || process.env.USER, // Use system user by default
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'crm_database',
  password: process.env.DB_PASSWORD || '', // No password for local development
  port: process.env.DB_PORT || 5432,
});

// Test the connection
pool.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('PostgreSQL connection error:', err);
});

// Create tables if they don't exist
const initializeDatabase = async () => {
  try {
    // Create customers table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS customers (
        id SERIAL PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        date_of_birth DATE,
        mobile_number VARCHAR(20),
        email VARCHAR(255),
        address TEXT,
        city VARCHAR(255),
        state VARCHAR(255),
        zip_code VARCHAR(20),
        country VARCHAR(255) DEFAULT 'USA',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create users table (for future use)
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create indexes for better performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
      CREATE INDEX IF NOT EXISTS idx_customers_mobile ON customers(mobile_number);
      CREATE INDEX IF NOT EXISTS idx_customers_name ON customers(first_name, last_name);
    `);

    console.log('✅ PostgreSQL database tables initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing PostgreSQL database:', error);
  }
};

module.exports = {
  pool,
  initializeDatabase
};
