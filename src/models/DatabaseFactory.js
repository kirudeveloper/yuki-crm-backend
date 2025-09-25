require('dotenv').config();
const SQLiteCustomer = require('./Customer');
const CustomerSupabase = require('./CustomerSupabase');

class DatabaseFactory {
  static getCustomerModel() {
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    console.log(`🔍 DatabaseFactory: DB_TYPE = "${dbType}"`);
    console.log(`🔍 All environment variables:`, Object.keys(process.env).filter(key => key.includes('DB') || key.includes('SUPABASE')));
    
    switch (dbType.toLowerCase()) {
      case 'postgresql':
      case 'postgres':
      case 'supabase':
        console.log(`✅ Using Supabase Customer model`);
        return CustomerSupabase;
      case 'sqlite':
      default:
        console.log('✅ Using SQLite Customer model');
        return SQLiteCustomer;
    }
  }
}

module.exports = DatabaseFactory;
