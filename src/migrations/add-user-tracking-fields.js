const { supabase } = require('../config/supabase');

async function addUserTrackingFields() {
  try {
    console.log('🔄 Adding user tracking fields to all tables...');

    // Add user_id and created_by fields to customers table
    console.log('📝 Adding user tracking fields to customers table...');
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE customers 
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `
    });

    if (customersError) {
      console.error('❌ Error adding fields to customers table:', customersError);
    } else {
      console.log('✅ Added user tracking fields to customers table');
    }

    // Add user_id and created_by fields to tasks table
    console.log('📝 Adding user tracking fields to tasks table...');
    const { error: tasksError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE tasks 
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `
    });

    if (tasksError) {
      console.error('❌ Error adding fields to tasks table:', tasksError);
    } else {
      console.log('✅ Added user tracking fields to tasks table');
    }

    // Add user_id and created_by fields to opportunities table
    console.log('📝 Adding user tracking fields to opportunities table...');
    const { error: opportunitiesError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE opportunities 
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `
    });

    if (opportunitiesError) {
      console.error('❌ Error adding fields to opportunities table:', opportunitiesError);
    } else {
      console.log('✅ Added user tracking fields to opportunities table');
    }

    // Add user_id and created_by fields to work_orders table
    console.log('📝 Adding user tracking fields to work_orders table...');
    const { error: workOrdersError } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE work_orders 
        ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        ADD COLUMN IF NOT EXISTS created_by INTEGER REFERENCES users(id) ON DELETE SET NULL;
      `
    });

    if (workOrdersError) {
      console.error('❌ Error adding fields to work_orders table:', workOrdersError);
    } else {
      console.log('✅ Added user tracking fields to work_orders table');
    }

    // Create indexes for better performance
    console.log('📝 Creating indexes for user tracking fields...');
    const { error: indexError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE INDEX IF NOT EXISTS idx_customers_user_id ON customers(user_id);
        CREATE INDEX IF NOT EXISTS idx_customers_created_by ON customers(created_by);
        CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
        CREATE INDEX IF NOT EXISTS idx_tasks_created_by ON tasks(created_by);
        CREATE INDEX IF NOT EXISTS idx_opportunities_user_id ON opportunities(user_id);
        CREATE INDEX IF NOT EXISTS idx_opportunities_created_by ON opportunities(created_by);
        CREATE INDEX IF NOT EXISTS idx_work_orders_user_id ON work_orders(user_id);
        CREATE INDEX IF NOT EXISTS idx_work_orders_created_by ON work_orders(created_by);
      `
    });

    if (indexError) {
      console.error('❌ Error creating indexes:', indexError);
    } else {
      console.log('✅ Created indexes for user tracking fields');
    }

    console.log('🎉 Migration completed successfully!');

  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run the migration if this file is executed directly
if (require.main === module) {
  addUserTrackingFields();
}

module.exports = addUserTrackingFields;

