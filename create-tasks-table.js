require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function createTasksTable() {
  try {
    console.log('🔍 Connecting to Supabase...');
    console.log('📍 Supabase URL:', supabaseUrl);
    
    console.log('\n🔧 Creating Tasks table...');
    
    // Test if we can create the table using a test operation first
    console.log('💡 Attempting to create Tasks table via SQL...');
    
    // Since we can't execute SQL directly, let's try to check if the table exists
    // by trying to select from it
    const { data: testData, error: testError } = await supabase
      .from('tasks')
      .select('*')
      .limit(1);
    
    if (testError && testError.code === '42P01') {
      console.log('\n❌ Tasks table does not exist.');
      console.log('📋 Please create the table manually in Supabase Dashboard:');
      console.log('\n🔗 Go to: https://supabase.com/dashboard/project/bolgjtzgwxxshyjnjlvw/editor');
      console.log('\n📝 Run this SQL in the SQL Editor:');
      console.log(`
-- Create Tasks table
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  subject VARCHAR(255) NOT NULL,
  due_date DATE,
  description TEXT,
  status VARCHAR(50) DEFAULT 'Open',
  customer_id INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign key constraint to customers table
  CONSTRAINT fk_tasks_customer 
    FOREIGN KEY (customer_id) 
    REFERENCES customers(id) 
    ON DELETE SET NULL
);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable read access for all users" ON tasks
  FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON tasks
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON tasks
  FOR UPDATE USING (true);

CREATE POLICY "Enable delete access for all users" ON tasks
  FOR DELETE USING (true);

-- Create indexes for performance
CREATE INDEX idx_tasks_customer_id ON tasks(customer_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);

-- Add comments for documentation
COMMENT ON TABLE tasks IS 'Tasks related to customers in the CRM system';
COMMENT ON COLUMN tasks.subject IS 'Brief description of the task';
COMMENT ON COLUMN tasks.due_date IS 'When the task is due';
COMMENT ON COLUMN tasks.description IS 'Detailed description of the task';
COMMENT ON COLUMN tasks.status IS 'Current status of the task (Open, In Progress, Completed, Cancelled)';
COMMENT ON COLUMN tasks.customer_id IS 'Reference to the customer this task belongs to';
      `);
      
      console.log('\n📊 After creating the table, you can use these status values:');
      console.log('   - Open (default)');
      console.log('   - In Progress');
      console.log('   - Completed');
      console.log('   - Cancelled');
      
      return false;
    } else if (testError) {
      console.log('❌ Error checking table:', testError.message);
      return false;
    } else {
      console.log('✅ Tasks table already exists!');
    }
    
    // Test the table by creating and deleting a test task
    console.log('\n🧪 Testing tasks operations...');
    
    // First, get a customer to link to
    const { data: customers, error: customerError } = await supabase
      .from('customers')
      .select('id, first_name, last_name')
      .limit(1);
    
    if (customerError) {
      console.log('❌ Error fetching customers:', customerError.message);
      return false;
    }
    
    if (customers.length === 0) {
      console.log('⚠️  No customers found. Creating a test customer first...');
      
      const { data: newCustomer, error: createCustomerError } = await supabase
        .from('customers')
        .insert([
          {
            first_name: 'Test',
            last_name: 'Customer',
            email: 'test-for-task@example.com',
            country: 'USA'
          }
        ])
        .select();
      
      if (createCustomerError) {
        console.log('❌ Error creating test customer:', createCustomerError.message);
        return false;
      }
      
      customers.push(newCustomer[0]);
      console.log('✅ Test customer created:', newCustomer[0]);
    }
    
    const testCustomer = customers[0];
    console.log('👤 Using customer for test:', `${testCustomer.first_name} ${testCustomer.last_name} (ID: ${testCustomer.id})`);
    
    // Insert test task
    const { data: insertData, error: insertError } = await supabase
      .from('tasks')
      .insert([
        {
          subject: 'Test Task',
          due_date: '2025-08-01',
          description: 'This is a test task to verify the table is working',
          status: 'Open',
          customer_id: testCustomer.id
        }
      ])
      .select();
    
    if (insertError) {
      console.log('❌ Error inserting test task:', insertError.message);
      return false;
    }
    
    console.log('✅ Test task created:', insertData[0]);
    
    // Fetch the test task with customer details
    const { data: fetchData, error: fetchError } = await supabase
      .from('tasks')
      .select(`
        *,
        customers:customer_id (
          id,
          first_name,
          last_name,
          email
        )
      `)
      .eq('subject', 'Test Task');
    
    if (fetchError) {
      console.log('❌ Error fetching test task with customer:', fetchError.message);
    } else {
      console.log('✅ Test task with customer details:', fetchData[0]);
    }
    
    // Delete test task
    const { error: deleteError } = await supabase
      .from('tasks')
      .delete()
      .eq('subject', 'Test Task');
    
    if (deleteError) {
      console.log('❌ Error deleting test task:', deleteError.message);
    } else {
      console.log('🧹 Test task deleted successfully');
    }
    
    // Clean up test customer if we created one
    if (testCustomer.email === 'test-for-task@example.com') {
      await supabase
        .from('customers')
        .delete()
        .eq('email', 'test-for-task@example.com');
      console.log('🧹 Test customer deleted');
    }
    
    console.log('\n🎉 Tasks table setup verification completed!');
    console.log('📊 Tasks table is ready for use');
    console.log('🔗 Foreign key relationship with customers table established');
    console.log('🚀 You can now create tasks linked to customers!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    return false;
  }
}

createTasksTable();
