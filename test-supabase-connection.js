const { pool, initializeDatabase } = require('./src/config/supabase');

async function testSupabaseConnection() {
  try {
    console.log('🔍 Testing Supabase connection...');
    
    // Test basic connection
    const result = await pool.query('SELECT NOW() as current_time, version() as pg_version');
    console.log('✅ Supabase connection successful!');
    console.log('🕐 Current time:', result.rows[0].current_time);
    console.log('🗄️  PostgreSQL version:', result.rows[0].pg_version.split(' ')[0]);
    
    // Check if customers table exists
    const tableCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name = 'customers'
    `);
    
    if (tableCheck.rows.length > 0) {
      console.log('✅ Customers table already exists in Supabase');
    } else {
      console.log('⚠️  Customers table does not exist. Creating tables...');
      await initializeDatabase();
    }
    
    // Verify table structure
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns 
      WHERE table_name = 'customers' 
      ORDER BY ordinal_position
    `);
    
    console.log('\n📋 Customers table structure:');
    structure.rows.forEach(col => {
      console.log(`  - ${col.column_name}: ${col.data_type} (${col.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Test inserting a sample customer
    console.log('\n🧪 Testing customer creation...');
    const testCustomer = await pool.query(`
      INSERT INTO customers (first_name, last_name, email, country) 
      VALUES ('Test', 'Customer', 'test@example.com', 'USA') 
      RETURNING id, first_name, last_name, email, created_at
    `);
    
    console.log('✅ Test customer created:', testCustomer.rows[0]);
    
    // Clean up test customer
    await pool.query('DELETE FROM customers WHERE email = $1', ['test@example.com']);
    console.log('🧹 Test customer deleted');
    
    console.log('\n🎉 Supabase setup completed successfully!');
    console.log('🌐 You can now access your data in the Supabase dashboard');
    
  } catch (error) {
    console.error('❌ Error testing Supabase:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    await pool.end();
    process.exit(0);
  }
}

testSupabaseConnection();
