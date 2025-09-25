require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createCompaniesTable() {
  try {
    console.log('🔧 Creating companies table with correct structure...');
    
    // First, try to drop the existing table if it exists
    console.log('🗑️  Dropping existing companies table...');
    const { error: dropError } = await supabase.rpc('exec_sql', {
      sql: 'DROP TABLE IF EXISTS companies CASCADE;'
    });
    
    if (dropError) {
      console.log('⚠️  Could not drop table (might not exist):', dropError.message);
    } else {
      console.log('✅ Dropped existing table');
    }
    
    // Create the new table with correct column names
    console.log('🏗️  Creating new companies table...');
    const { error: createError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE companies (
          id SERIAL PRIMARY KEY,
          "companyName" TEXT NOT NULL,
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          "phoneNumber" TEXT NOT NULL,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    
    if (createError) {
      console.error('❌ Error creating table:', createError.message);
    } else {
      console.log('✅ Companies table created successfully!');
    }
    
    // Test the table by inserting a sample record
    console.log('🧪 Testing table with sample data...');
    const { data, error: testError } = await supabase
      .from('companies')
      .insert([
        {
          companyName: 'Test Company',
          firstName: 'Test',
          lastName: 'User',
          email: 'test@example.com',
          phoneNumber: '+1234567890'
        }
      ])
      .select()
      .single();
    
    if (testError) {
      console.error('❌ Error testing table:', testError.message);
    } else {
      console.log('✅ Successfully inserted test data:', testData);
      
      // Clean up test data
      await supabase
        .from('companies')
        .delete()
        .eq('id', testData.id);
      console.log('🧹 Cleaned up test data');
    }
    
  } catch (error) {
    console.error('❌ Error creating table:', error.message);
  }
}

createCompaniesTable();



