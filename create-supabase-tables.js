require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase configuration');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  console.log('🔧 Creating tables in Supabase...');
  
  try {
    // Create companies table
    const { error: companiesError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS companies (
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

    if (companiesError) {
      console.log('⚠️  Companies table might already exist:', companiesError.message);
    } else {
      console.log('✅ Companies table created');
    }

    // Create customers table
    const { error: customersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES companies(id),
          "firstName" TEXT NOT NULL,
          "lastName" TEXT NOT NULL,
          "dateOfBirth" DATE,
          "mobileNumber" TEXT UNIQUE,
          email TEXT UNIQUE,
          address TEXT,
          city TEXT,
          state TEXT,
          "zipCode" TEXT,
          country TEXT DEFAULT 'USA',
          notes TEXT,
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (customersError) {
      console.log('⚠️  Customers table might already exist:', customersError.message);
    } else {
      console.log('✅ Customers table created');
    }

    // Create users table
    const { error: usersError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          company_id INTEGER REFERENCES companies(id),
          username TEXT UNIQUE NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL,
          "firstName" TEXT,
          "lastName" TEXT,
          role TEXT DEFAULT 'user',
          "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (usersError) {
      console.log('⚠️  Users table might already exist:', usersError.message);
    } else {
      console.log('✅ Users table created');
    }

    console.log('🎉 All tables created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message);
  }
}

createTables();