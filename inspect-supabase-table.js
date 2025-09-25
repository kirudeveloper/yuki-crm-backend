require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function inspectTable() {
  try {
    console.log('🔍 Inspecting companies table structure...');
    
    // Try to get table info by attempting a simple select
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('❌ Error accessing table:', error.message);
      console.log('📝 This suggests the table structure is different than expected.');
    } else {
      console.log('✅ Table exists and is accessible');
      console.log('📊 Sample data:', data);
    }
    
    // Try to create a simple record to see what columns are expected
    console.log('\n🧪 Testing column names...');
    
    const testData = {
      companyName: 'Test Company',
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNumber: '+1234567890'
    };
    
    const { data: insertData, error: insertError } = await supabase
      .from('companies')
      .insert([testData])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert error:', insertError.message);
      console.log('📝 This tells us what columns are expected.');
    } else {
      console.log('✅ Successfully inserted test data:', insertData);
      
      // Clean up test data
      await supabase
        .from('companies')
        .delete()
        .eq('id', insertData.id);
      console.log('🧹 Cleaned up test data');
    }
    
  } catch (error) {
    console.error('❌ Error inspecting table:', error.message);
  }
}

inspectTable();
