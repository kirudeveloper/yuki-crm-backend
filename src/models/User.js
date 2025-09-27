const database = require('../config/database');
const UserSupabase = require('./UserSupabase');

// Use Supabase if DB_TYPE is set to supabase, otherwise use SQLite
const dbType = process.env.DB_TYPE || 'sqlite';

console.log('👤 User model using database type:', dbType);

class User {
  static async create(userData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.create(userData);
    }
    
    return new Promise((resolve, reject) => {
      const { company_id, email, password, firstName, lastName, role = 'user' } = userData;
      
      const sql = `
        INSERT INTO users (company_id, email, password, firstName, lastName, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      
      database.getDatabase().run(sql, [company_id, email, password, firstName, lastName, role], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({
            id: this.lastID,
            company_id,
            email,
            firstName,
            lastName,
            role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  static async findByEmail(email) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.findByEmail(email);
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE email = ?';
      
      database.getDatabase().get(sql, [email], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findById(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.findById(id);
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE id = ?';
      
      database.getDatabase().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async findByCompanyId(company_id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.findByCompanyId(company_id);
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'SELECT * FROM users WHERE company_id = ?';
      
      database.getDatabase().all(sql, [company_id], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async update(id, userData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.update(id, userData);
    }
    
    return new Promise((resolve, reject) => {
      const { email, password, firstName, lastName, role } = userData;
      
      const sql = `
        UPDATE users 
        SET email = ?, password = ?, firstName = ?, lastName = ?, role = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      
      database.getDatabase().run(sql, [email, password, firstName, lastName, role, id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('User not found'));
        } else {
          resolve({
            id,
            email,
            firstName,
            lastName,
            role,
            updatedAt: new Date().toISOString()
          });
        }
      });
    });
  }

  static async delete(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await UserSupabase.delete(id);
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM users WHERE id = ?';
      
      database.getDatabase().run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else if (this.changes === 0) {
          reject(new Error('User not found'));
        } else {
          resolve({ id, deleted: true });
        }
      });
    });
  }
}

module.exports = User;




