const database = require('../config/database');
const TaskSupabase = require('./TaskSupabase');

const dbType = process.env.DB_TYPE || 'sqlite';

console.log('📋 Task model using database type:', dbType);

class Task {
  static async create(taskData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.create(taskData);
    }
    
    return new Promise((resolve, reject) => {
      const { customerId, companyId, title, description, status = 'pending', priority = 'medium', dueDate } = taskData;
      const sql = `
        INSERT INTO tasks (customer_id, company_id, title, description, status, priority, due_date)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      database.getDatabase().run(sql, [customerId, companyId, title, description, status, priority, dueDate], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, ...taskData });
        }
      });
    });
  }

  static async findAll(companyId = null) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.findAll(companyId);
    }
    
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT t.*, c.firstName, c.lastName, c.email as customerEmail
        FROM tasks t
        LEFT JOIN customers c ON t.customer_id = c.id
        ORDER BY t.created_at DESC
      `;
      
      const params = [];
      if (companyId) {
        sql = `
          SELECT t.*, c.firstName, c.lastName, c.email as customerEmail
          FROM tasks t
          LEFT JOIN customers c ON t.customer_id = c.id
          WHERE t.company_id = ?
          ORDER BY t.created_at DESC
        `;
        params.push(companyId);
      }
      
      database.getDatabase().all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async findByCustomerId(customerId) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.findByCustomerId(customerId);
    }
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT * FROM tasks 
        WHERE customer_id = ? 
        ORDER BY created_at DESC
      `;
      database.getDatabase().all(sql, [customerId], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  static async findById(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.findById(id);
    }
    
    return new Promise((resolve, reject) => {
      const sql = `
        SELECT t.*, c.firstName, c.lastName, c.email as customerEmail
        FROM tasks t
        LEFT JOIN customers c ON t.customer_id = c.id
        WHERE t.id = ?
      `;
      database.getDatabase().get(sql, [id], (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  static async update(id, taskData) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.update(id, taskData);
    }
    
    return new Promise((resolve, reject) => {
      const { title, description, status, priority, dueDate } = taskData;
      const sql = `
        UPDATE tasks 
        SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;
      database.getDatabase().run(sql, [title, description, status, priority, dueDate, id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id, ...taskData });
        }
      });
    });
  }

  static async delete(id) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.delete(id);
    }
    
    return new Promise((resolve, reject) => {
      const sql = 'DELETE FROM tasks WHERE id = ?';
      database.getDatabase().run(sql, [id], function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ success: true });
        }
      });
    });
  }

  static async search(searchTerm, companyId = null) {
    if (dbType.toLowerCase() === 'supabase') {
      return await TaskSupabase.search(searchTerm, companyId);
    }
    
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT t.*, c.firstName, c.lastName, c.email as customerEmail
        FROM tasks t
        LEFT JOIN customers c ON t.customer_id = c.id
        WHERE (t.title LIKE ? OR t.description LIKE ?)
        ORDER BY t.created_at DESC
      `;
      
      const params = [`%${searchTerm}%`, `%${searchTerm}%`];
      if (companyId) {
        sql = `
          SELECT t.*, c.firstName, c.lastName, c.email as customerEmail
          FROM tasks t
          LEFT JOIN customers c ON t.customer_id = c.id
          WHERE (t.title LIKE ? OR t.description LIKE ?) AND t.company_id = ?
          ORDER BY t.created_at DESC
        `;
        params.push(companyId);
      }
      
      database.getDatabase().all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows || []);
        }
      });
    });
  }
}

module.exports = Task;



