const database = require('../config/database');
const CompanySupabase = require('./CompanySupabase');

// Use Supabase if DB_TYPE is set to supabase, otherwise use SQLite
const dbType = process.env.DB_TYPE || 'sqlite';

console.log('🗄️  Company model using database type:', dbType);

class Company {
  static async create(companyData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await CompanySupabase.create(companyData);
    }
    
    return new Promise((resolve, reject) => {
      const { companyName, firstName, lastName, email, phoneNumber } = companyData;
      
      const sql = `
        INSERT INTO companies (companyName, firstName, lastName, email, phoneNumber)
        VALUES (?, ?, ?, ?, ?)
      `;
      
      database.getDatabase().run(sql, [companyName, firstName, lastName, email, phoneNumber], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            companyName,
            firstName,
            lastName,
            email,
            phoneNumber,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  static async findAll() {
    if (dbType.toLowerCase() === 'supabase') {
      return await CompanySupabase.findAll();
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM companies ORDER BY createdAt DESC';
      
      database.getDatabase().all(sql, [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  static findById(id) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM companies WHERE id = ?';
      
      database.getDatabase().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static findByEmail(email) {
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM companies WHERE email = ?';
      
      database.getDatabase().get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static update(id, companyData) {
    return new Promise((resolve, reject) => {
      const { companyName, firstName, lastName, email, phoneNumber } = companyData;
      
      const sql = `
        UPDATE companies 
        SET companyName = ?, firstName = ?, lastName = ?, email = ?, phoneNumber = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      database.getDatabase().run(sql, [companyName, firstName, lastName, email, phoneNumber, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Company not found'));
        } else {
          resolve({
            id,
            companyName,
            firstName,
            lastName,
            email,
            phoneNumber,
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  static delete(id) {
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM companies WHERE id = ?';
      
      database.getDatabase().run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('Company not found'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }

  static search(searchTerm) {
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM companies 
        WHERE companyName LIKE ? OR firstName LIKE ? OR lastName LIKE ? OR email LIKE ?
        ORDER BY createdAt DESC
      `;
      
      const searchPattern = `%${searchTerm}%`;
      
      database.getDatabase().all(sql, [searchPattern, searchPattern, searchPattern, searchPattern], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Company;


