const database = require('../config/database');
const CustomerSupabase = require('./CustomerSupabase');

// Use Supabase if DB_TYPE is set to supabase, otherwise use SQLite
const dbType = process.env.DB_TYPE || 'sqlite';

console.log('👥 Customer model using database type:', dbType);

class Customer {
  constructor() {
    this.db = database.getDatabase();
  }

  // Static methods for Supabase compatibility
  static async create(customerData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.create(customerData);
    }
    
    const customer = new Customer();
    return customer.create(customerData);
  }

  static async findAll() {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.findAll();
    }
    
    const customer = new Customer();
    return customer.findAll();
  }

  static async findById(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.findById(id);
    }
    
    const customer = new Customer();
    return customer.findById(id);
  }

  static async update(id, customerData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.update(id, customerData);
    }
    
    const customer = new Customer();
    return customer.update(id, customerData);
  }

  static async delete(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.delete(id);
    }
    
    const customer = new Customer();
    return customer.delete(id);
  }

  static async search(searchTerm) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CustomerSupabase.search(searchTerm);
    }
    
    const customer = new Customer();
    return customer.search(searchTerm);
  }

  // Instance methods for SQLite
  create(customerData) {
    return new Promise((resolve, reject) => {
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
        notes
      } = customerData;

      const sql = `
        INSERT INTO customers (
          company_id, firstName, lastName, dateOfBirth, mobileNumber, email,
          address, city, state, zipCode, country, notes
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const params = [
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
        country || 'USA',
        notes
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...customerData });
        }
      });
    });
  }

  // Get all customers
  findAll() {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, co.companyName, co.firstName as companyContactFirstName, 
               co.lastName as companyContactLastName, co.email as companyEmail
        FROM customers c
        LEFT JOIN companies co ON c.company_id = co.id
        ORDER BY c.lastName, c.firstName
      `;
      
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // Get customer by ID
  findById(id) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, co.companyName, co.firstName as companyContactFirstName, 
               co.lastName as companyContactLastName, co.email as companyEmail
        FROM customers c
        LEFT JOIN companies co ON c.company_id = co.id
        WHERE c.id = ?
      `;
      
      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Update customer
  update(id, customerData) {
    return new Promise((resolve, reject) => {
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
        notes
      } = customerData;

      const sql = `
        UPDATE customers SET
          company_id = ?, firstName = ?, lastName = ?, dateOfBirth = ?, mobileNumber = ?,
          email = ?, address = ?, city = ?, state = ?, zipCode = ?,
          country = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      const params = [
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
        notes,
        id
      ];

      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes, ...customerData });
        }
      });
    });
  }

  // Delete customer
  delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM customers WHERE id = ?';
      
      this.db.run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, changes: this.changes });
        }
      });
    });
  }

  // Search customers
  search(searchTerm) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT c.*, co.companyName, co.firstName as companyContactFirstName, 
               co.lastName as companyContactLastName, co.email as companyEmail
        FROM customers c
        LEFT JOIN companies co ON c.company_id = co.id
        WHERE c.firstName LIKE ? OR c.lastName LIKE ? OR c.email LIKE ? OR c.mobileNumber LIKE ?
           OR co.companyName LIKE ?
        ORDER BY c.lastName, c.firstName
      `;
      
      const searchPattern = `%${searchTerm}%`;
      const params = [searchPattern, searchPattern, searchPattern, searchPattern, searchPattern];
      
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = new Customer();
