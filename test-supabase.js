require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

console.log('🌐 Supabase URL:', supabaseUrl);
console.log('🔑 Supabase Key:', supabaseKey ? 'Set' : 'Not set');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSupabase() {
  try {
    console.log('🔧 Testing Supabase connection...');
    
    // Try to access companies table
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .limit(5);
    
    if (error) {
      console.error('❌ Error accessing companies table:', error.message);
      console.log('📝 This means the table does not exist in Supabase yet.');
      console.log('🔗 Please create the tables manually in your Supabase dashboard.');
      console.log('📋 Go to: https://supabase.com/dashboard/project/bolgjtzgwxxshyjnjlvw/editor');
    } else {
      console.log('✅ Successfully connected to Supabase!');
      console.log('📊 Companies in database:', data.length);
      console.log('📋 Data:', data);
    }
    
  } catch (error) {
    console.error('❌ Error testing Supabase:', error.message);
  }
}

testSupabase();




