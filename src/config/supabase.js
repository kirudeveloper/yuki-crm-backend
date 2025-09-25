require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const initializeSupabase = () => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (supabaseUrl && supabaseKey) {
    console.log('🌐 Initializing Supabase client');
    console.log('📍 Supabase URL:', supabaseUrl);
    return createClient(supabaseUrl, supabaseKey);
  } else {
    console.error('❌ Missing Supabase configuration');
    console.error('   SUPABASE_URL:', supabaseUrl ? '✅ Set' : '❌ Missing');
    console.error('   SUPABASE_ANON_KEY:', supabaseKey ? '✅ Set' : '❌ Missing');
    return null;
  }
};

// Initialize Supabase client
const supabase = initializeSupabase();

// Test and initialize the database
const initializeSupabaseDatabase = async () => {
  try {
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    console.log('🔧 Verifying Supabase connection...');
    
    // Test connection by trying to fetch from customers table
    const { data, error } = await supabase
      .from('customers')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('📝 Customers table does not exist. Please create it manually.');
      console.log('🔗 Go to: https://supabase.com/dashboard/project/bolgjtzgwxxshyjnjlvw/editor');
      console.log('📋 Run the SQL from the table creation script.');
      return false;
    } else if (error) {
      console.error('❌ Error connecting to Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Supabase connection verified successfully');
    console.log('📊 Customers table is accessible');
    console.log('🎯 Ready for CRUD operations!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error verifying Supabase connection:', error.message);
    console.log('⚠️  Continuing with limited functionality...');
    return false;
  }
};

module.exports = {
  supabase,
  initializeDatabase: initializeSupabaseDatabase
};
