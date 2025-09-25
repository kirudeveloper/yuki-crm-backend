const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to the database file
const dbPath = path.join(__dirname, '../../database/crm.db');

// Create database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
    process.exit(1);
  } else {
    console.log('Connected to SQLite database for migration');
  }
});

// Migration function
const addCompanyIdToCustomers = () => {
  return new Promise((resolve, reject) => {
    // Check if company_id column already exists
    db.get("PRAGMA table_info(customers)", (err, row) => {
      if (err) {
        reject(err);
        return;
      }

      // Get all columns
      db.all("PRAGMA table_info(customers)", (err, columns) => {
        if (err) {
          reject(err);
          return;
        }

        const hasCompanyId = columns.some(col => col.name === 'company_id');
        
        if (hasCompanyId) {
          console.log('✅ company_id column already exists in customers table');
          resolve();
          return;
        }

        // Add company_id column
        const sql = 'ALTER TABLE customers ADD COLUMN company_id INTEGER';
        
        db.run(sql, (err) => {
          if (err) {
            console.error('❌ Error adding company_id column:', err.message);
            reject(err);
          } else {
            console.log('✅ Successfully added company_id column to customers table');
            resolve();
          }
        });
      });
    });
  });
};

// Run migration
addCompanyIdToCustomers()
  .then(() => {
    console.log('🎉 Migration completed successfully');
    db.close();
  })
  .catch((error) => {
    console.error('💥 Migration failed:', error);
    db.close();
    process.exit(1);
  });





