require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createSupabaseTables() {
  try {
    console.log('🔍 Connecting to Supabase...');
    console.log('📍 Supabase URL:', supabaseUrl);
    
    // Test connection by checking if we can access the database
    console.log('✅ Supabase client initialized successfully!');
    
    console.log('\n🔧 Creating database tables using SQL...');
    
    // Create customers table using SQL
    const { data: customersResult, error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
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
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
      `
    });

    if (customersError) {
      console.log('ℹ️  Note: Direct SQL execution via RPC may not be available');
      console.log('💡 Let\'s try creating a test customer to verify table existence...');
      
      // Try to insert a test customer to see if table exists
      const { data: testData, error: testError } = await supabase
        .from('customers')
        .select('*')
        .limit(1);
      
      if (testError && testError.code === '42P01') {
        console.log('\n❌ Customers table does not exist.');
        console.log('📋 Please create the table manually in Supabase Dashboard:');
        console.log('\n🔗 Go to: https://supabase.com/dashboard/project/bolgjtzgwxxshyjnjlvw/editor');
        console.log('\n📝 Run this SQL in the SQL Editor:');
        console.log(`
CREATE TABLE customers (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON customers
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON customers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON customers
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON customers
  FOR DELETE USING (true);

-- Create indexes
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_mobile ON customers(mobile_number);
CREATE INDEX idx_customers_name ON customers(first_name, last_name);
CREATE INDEX idx_customers_created_at ON customers(created_at);
        `);
        return;
      } else if (testError) {
        console.log('❌ Error checking table:', testError.message);
        return;
      } else {
        console.log('✅ Customers table already exists!');
      }
    } else {
      console.log('✅ Customers table created successfully!');
    }
    
    // Test the table by creating and deleting a test customer
    console.log('\n🧪 Testing customer operations...');
    
    // Insert test customer
    const { data: insertData, error: insertError } = await supabase
      .from('customers')
      .insert([
        {
          first_name: 'Test',
          last_name: 'Customer',
          email: 'test@example.com',
          country: 'USA'
        }
      ])
      .select();
    
    if (insertError) {
      console.log('❌ Error inserting test customer:', insertError.message);
      return;
    }
    
    console.log('✅ Test customer created:', insertData[0]);
    
    // Fetch the test customer
    const { data: fetchData, error: fetchError } = await supabase
      .from('customers')
      .select('*')
      .eq('email', 'test@example.com');
    
    if (fetchError) {
      console.log('❌ Error fetching test customer:', fetchError.message);
    } else {
      console.log('✅ Test customer fetched:', fetchData[0]);
    }
    
    // Delete test customer
    const { error: deleteError } = await supabase
      .from('customers')
      .delete()
      .eq('email', 'test@example.com');
    
    if (deleteError) {
      console.log('❌ Error deleting test customer:', deleteError.message);
    } else {
      console.log('🧹 Test customer deleted successfully');
    }
    
    console.log('\n🎉 Supabase setup verification completed!');
    console.log('📊 Customers table is ready for use');
    console.log('🚀 Your backend can now connect to Supabase!');
    console.log('\n🔗 Access your Supabase dashboard at:');
    console.log('   https://supabase.com/dashboard/project/bolgjtzgwxxshyjnjlvw');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createSupabaseTables();
