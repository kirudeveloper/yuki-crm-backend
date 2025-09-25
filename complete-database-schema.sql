-- Complete Database Schema for CRM System
-- Based on the provided entity relationship diagram
-- Updated with custom primary key formats

-- Drop existing tables if they exist (to start fresh)
DROP TABLE IF EXISTS work_orders CASCADE;
DROP TABLE IF EXISTS opportunities CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS customers CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- Drop existing functions if they exist
DROP FUNCTION IF EXISTS generate_company_id();
DROP FUNCTION IF EXISTS generate_role_id();
DROP FUNCTION IF EXISTS generate_user_id();
DROP FUNCTION IF EXISTS generate_customer_id();
DROP FUNCTION IF EXISTS generate_opportunity_id();
DROP FUNCTION IF EXISTS generate_work_order_id();
DROP FUNCTION IF EXISTS generate_task_id();

-- Create functions to generate custom primary keys
CREATE OR REPLACE FUNCTION generate_company_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM companies 
    WHERE id ~ '^CMP[0-9]+$';
    
    formatted_id := 'CMP' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_role_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM roles 
    WHERE id ~ '^ROL[0-9]+$';
    
    formatted_id := 'ROL' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_user_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM users 
    WHERE id ~ '^USR[0-9]+$';
    
    formatted_id := 'USR' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_customer_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM customers 
    WHERE id ~ '^CST[0-9]+$';
    
    formatted_id := 'CST' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_opportunity_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM opportunities 
    WHERE id ~ '^OPT[0-9]+$';
    
    formatted_id := 'OPT' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_work_order_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM work_orders 
    WHERE id ~ '^WOR[0-9]+$';
    
    formatted_id := 'WOR' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_task_id()
RETURNS TEXT AS $$
DECLARE
    next_id INTEGER;
    formatted_id TEXT;
BEGIN
    SELECT COALESCE(MAX(CAST(SUBSTRING(id FROM 4) AS INTEGER)), 0) + 1 
    INTO next_id 
    FROM tasks 
    WHERE id ~ '^TSK[0-9]+$';
    
    formatted_id := 'TSK' || LPAD(next_id::TEXT, 12, '0');
    RETURN formatted_id;
END;
$$ LANGUAGE plpgsql;

-- Create companies table
CREATE TABLE companies (
  id TEXT PRIMARY KEY DEFAULT generate_company_id(),
  company_name TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  website TEXT,
  industry TEXT,
  company_size TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create roles table with comprehensive permissions
CREATE TABLE roles (
  id TEXT PRIMARY KEY DEFAULT generate_role_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  role_name TEXT NOT NULL,
  description TEXT,
  
  -- Company permissions
  company_access_read BOOLEAN DEFAULT false,
  company_access_edit BOOLEAN DEFAULT false,
  company_access_delete BOOLEAN DEFAULT false,
  
  -- User permissions
  user_access_read BOOLEAN DEFAULT false,
  user_access_edit BOOLEAN DEFAULT false,
  user_access_delete BOOLEAN DEFAULT false,
  
  -- Customer permissions
  customer_access_read BOOLEAN DEFAULT false,
  customer_access_edit BOOLEAN DEFAULT false,
  customer_access_delete BOOLEAN DEFAULT false,
  
  -- Opportunity permissions
  opportunity_access_read BOOLEAN DEFAULT false,
  opportunity_access_edit BOOLEAN DEFAULT false,
  opportunity_access_delete BOOLEAN DEFAULT false,
  
  -- Work Order permissions
  work_order_access_read BOOLEAN DEFAULT false,
  work_order_access_edit BOOLEAN DEFAULT false,
  work_order_access_delete BOOLEAN DEFAULT false,
  
  -- Task permissions
  task_access_read BOOLEAN DEFAULT false,
  task_access_edit BOOLEAN DEFAULT false,
  task_access_delete BOOLEAN DEFAULT false,
  
  -- Role permissions
  role_access_read BOOLEAN DEFAULT false,
  role_access_edit BOOLEAN DEFAULT false,
  role_access_delete BOOLEAN DEFAULT false,
  
  -- System permissions
  system_admin BOOLEAN DEFAULT false,
  can_manage_roles BOOLEAN DEFAULT false,
  can_manage_users BOOLEAN DEFAULT false,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure role name is unique within a company
  UNIQUE(company_id, role_name)
);

-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY DEFAULT generate_user_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  role_id TEXT REFERENCES roles(id) ON DELETE SET NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone_number TEXT,
  department TEXT,
  position TEXT,
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create customers table
CREATE TABLE customers (
  id TEXT PRIMARY KEY DEFAULT generate_customer_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  date_of_birth DATE,
  mobile_number TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  country TEXT DEFAULT 'USA',
  company_name TEXT,
  job_title TEXT,
  industry TEXT,
  lead_source TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create opportunities table
CREATE TABLE opportunities (
  id TEXT PRIMARY KEY DEFAULT generate_opportunity_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  value DECIMAL(15,2),
  currency TEXT DEFAULT 'USD',
  stage TEXT DEFAULT 'prospecting',
  probability INTEGER DEFAULT 0 CHECK (probability >= 0 AND probability <= 100),
  expected_close_date DATE,
  actual_close_date DATE,
  status TEXT DEFAULT 'open',
  source TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create work_orders table
CREATE TABLE work_orders (
  id TEXT PRIMARY KEY DEFAULT generate_work_order_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE SET NULL,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  work_type TEXT,
  priority TEXT DEFAULT 'medium',
  status TEXT DEFAULT 'pending',
  start_date DATE,
  due_date DATE,
  completed_date DATE,
  estimated_hours DECIMAL(8,2),
  actual_hours DECIMAL(8,2),
  hourly_rate DECIMAL(10,2),
  total_cost DECIMAL(15,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table
CREATE TABLE tasks (
  id TEXT PRIMARY KEY DEFAULT generate_task_id(),
  company_id TEXT REFERENCES companies(id) ON DELETE CASCADE,
  customer_id TEXT REFERENCES customers(id) ON DELETE CASCADE,
  opportunity_id TEXT REFERENCES opportunities(id) ON DELETE CASCADE,
  work_order_id TEXT REFERENCES work_orders(id) ON DELETE CASCADE,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT DEFAULT 'follow_up',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  completed_at TIMESTAMP WITH TIME ZONE,
  estimated_duration INTEGER, -- in minutes
  actual_duration INTEGER, -- in minutes
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure task is related to at least one entity
  CONSTRAINT task_must_have_relation CHECK (
    customer_id IS NOT NULL OR 
    opportunity_id IS NOT NULL OR 
    work_order_id IS NOT NULL
  )
);

-- Create indexes for better performance
CREATE INDEX idx_companies_email ON companies(email);
CREATE INDEX idx_companies_company_name ON companies(company_name);

CREATE INDEX idx_roles_company_id ON roles(company_id);
CREATE INDEX idx_roles_role_name ON roles(role_name);
CREATE INDEX idx_roles_is_active ON roles(is_active);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_company_id ON users(company_id);
CREATE INDEX idx_users_role_id ON users(role_id);
CREATE INDEX idx_users_is_active ON users(is_active);

CREATE INDEX idx_customers_company_id ON customers(company_id);
CREATE INDEX idx_customers_email ON customers(email);
CREATE INDEX idx_customers_mobile ON customers(mobile_number);
CREATE INDEX idx_customers_status ON customers(status);
CREATE INDEX idx_customers_lead_source ON customers(lead_source);

CREATE INDEX idx_opportunities_company_id ON opportunities(company_id);
CREATE INDEX idx_opportunities_customer_id ON opportunities(customer_id);
CREATE INDEX idx_opportunities_user_id ON opportunities(user_id);
CREATE INDEX idx_opportunities_stage ON opportunities(stage);
CREATE INDEX idx_opportunities_status ON opportunities(status);
CREATE INDEX idx_opportunities_expected_close_date ON opportunities(expected_close_date);

CREATE INDEX idx_work_orders_company_id ON work_orders(company_id);
CREATE INDEX idx_work_orders_customer_id ON work_orders(customer_id);
CREATE INDEX idx_work_orders_opportunity_id ON work_orders(opportunity_id);
CREATE INDEX idx_work_orders_user_id ON work_orders(user_id);
CREATE INDEX idx_work_orders_status ON work_orders(status);
CREATE INDEX idx_work_orders_priority ON work_orders(priority);
CREATE INDEX idx_work_orders_due_date ON work_orders(due_date);

CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_customer_id ON tasks(customer_id);
CREATE INDEX idx_tasks_opportunity_id ON tasks(opportunity_id);
CREATE INDEX idx_tasks_work_order_id ON tasks(work_order_id);
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_task_type ON tasks(task_type);

-- Enable Row Level Security (RLS) for better security
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all operations for now - customize based on your security needs)
CREATE POLICY "Allow all operations on companies" ON companies FOR ALL USING (true);
CREATE POLICY "Allow all operations on roles" ON roles FOR ALL USING (true);
CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true);
CREATE POLICY "Allow all operations on customers" ON customers FOR ALL USING (true);
CREATE POLICY "Allow all operations on opportunities" ON opportunities FOR ALL USING (true);
CREATE POLICY "Allow all operations on work_orders" ON work_orders FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);

-- Create functions for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_roles_updated_at BEFORE UPDATE ON roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opportunities_updated_at BEFORE UPDATE ON opportunities FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some sample data for testing
INSERT INTO companies (id, company_name, first_name, last_name, email, phone_number, industry) VALUES
('CMP000000000001', 'Acme Corporation', 'John', 'Smith', 'john@acme.com', '+1-555-0123', 'Technology'),
('CMP000000000002', 'Global Solutions Inc', 'Sarah', 'Johnson', 'sarah@globalsolutions.com', '+1-555-0456', 'Consulting');

-- Insert sample roles with different permission levels
INSERT INTO roles (
  id, company_id, role_name, description,
  company_access_read, company_access_edit, company_access_delete,
  user_access_read, user_access_edit, user_access_delete,
  customer_access_read, customer_access_edit, customer_access_delete,
  opportunity_access_read, opportunity_access_edit, opportunity_access_delete,
  work_order_access_read, work_order_access_edit, work_order_access_delete,
  task_access_read, task_access_edit, task_access_delete,
  role_access_read, role_access_edit, role_access_delete,
  system_admin, can_manage_roles, can_manage_users
) VALUES
-- Super Admin Role - Full access to everything
('ROL000000000001', 'CMP000000000001', 'Super Admin', 'Full system access with all permissions',
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true),

-- Admin Role - Most permissions except system admin
('ROL000000000002', 'CMP000000000001', 'Admin', 'Administrative access with most permissions',
 true, true, false,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 false, true, true),

-- Manager Role - Read/Edit access to most entities
('ROL000000000003', 'CMP000000000001', 'Manager', 'Management level access with read/edit permissions',
 true, true, false,
 true, true, false,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 false, false, false,
 false, false, false),

-- Sales Role - Customer and opportunity focused
('ROL000000000004', 'CMP000000000001', 'Sales Representative', 'Sales focused access to customers and opportunities',
 false, false, false,
 false, false, false,
 true, true, false,
 true, true, false,
 false, false, false,
 true, true, false,
 false, false, false,
 false, false, false),

-- Technician Role - Task and work order focused
('ROL000000000005', 'CMP000000000001', 'Technician', 'Technical role focused on tasks and work orders',
 false, false, false,
 false, false, false,
 true, false, false,
 true, false, false,
 true, true, false,
 true, true, true,
 false, false, false,
 false, false, false),

-- Read Only Role - View only access
('ROL000000000006', 'CMP000000000001', 'Read Only', 'View only access to all entities',
 true, false, false,
 true, false, false,
 true, false, false,
 true, false, false,
 true, false, false,
 true, false, false,
 false, false, false,
 false, false, false),

-- Global Solutions roles
('ROL000000000007', 'CMP000000000002', 'Super Admin', 'Full system access with all permissions',
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true),

('ROL000000000008', 'CMP000000000002', 'Manager', 'Management level access with read/edit permissions',
 true, true, false,
 true, true, false,
 true, true, true,
 true, true, true,
 true, true, true,
 true, true, true,
 false, false, false,
 false, false, false);

INSERT INTO users (id, company_id, role_id, email, password, first_name, last_name, department) VALUES
('USR000000000001', 'CMP000000000001', 'ROL000000000001', 'admin@acme.com', '$2b$10$example_hash', 'Admin', 'User', 'Management'),
('USR000000000002', 'CMP000000000001', 'ROL000000000004', 'sales@acme.com', '$2b$10$example_hash', 'Sales', 'Rep', 'Sales'),
('USR000000000003', 'CMP000000000002', 'ROL000000000008', 'manager@globalsolutions.com', '$2b$10$example_hash', 'Manager', 'User', 'Operations');

INSERT INTO customers (id, company_id, first_name, last_name, email, mobile_number, company_name, job_title, lead_source) VALUES
('CST000000000001', 'CMP000000000001', 'Alice', 'Brown', 'alice@client1.com', '+1-555-0789', 'Client Corp', 'CEO', 'Website'),
('CST000000000002', 'CMP000000000001', 'Bob', 'Wilson', 'bob@client2.com', '+1-555-0321', 'Tech Solutions', 'CTO', 'Referral'),
('CST000000000003', 'CMP000000000002', 'Carol', 'Davis', 'carol@client3.com', '+1-555-0654', 'Innovation Inc', 'VP Sales', 'Cold Call');

INSERT INTO opportunities (id, company_id, customer_id, user_id, title, description, value, stage, probability, expected_close_date) VALUES
('OPT000000000001', 'CMP000000000001', 'CST000000000001', 'USR000000000002', 'Software Implementation', 'Implement CRM system for Client Corp', 50000.00, 'proposal', 75, '2024-03-15'),
('OPT000000000002', 'CMP000000000001', 'CST000000000002', 'USR000000000002', 'Technical Consulting', 'Provide technical guidance for new project', 25000.00, 'negotiation', 60, '2024-02-28'),
('OPT000000000003', 'CMP000000000002', 'CST000000000003', 'USR000000000003', 'Business Process Optimization', 'Streamline operations for Innovation Inc', 35000.00, 'discovery', 40, '2024-04-10');

INSERT INTO work_orders (id, company_id, customer_id, opportunity_id, user_id, title, description, work_type, priority, due_date, estimated_hours, hourly_rate) VALUES
('WOR000000000001', 'CMP000000000001', 'CST000000000001', 'OPT000000000001', 'USR000000000002', 'CRM Setup and Configuration', 'Initial setup and configuration of CRM system', 'implementation', 'high', '2024-03-20', 40.0, 150.00),
('WOR000000000002', 'CMP000000000001', 'CST000000000002', 'OPT000000000002', 'USR000000000002', 'Technical Architecture Review', 'Review and provide recommendations for technical architecture', 'consulting', 'medium', '2024-03-05', 20.0, 175.00),
('WOR000000000003', 'CMP000000000002', 'CST000000000003', 'OPT000000000003', 'USR000000000003', 'Process Analysis and Documentation', 'Analyze current processes and document recommendations', 'analysis', 'medium', '2024-04-15', 30.0, 125.00);

INSERT INTO tasks (id, company_id, customer_id, opportunity_id, work_order_id, user_id, title, description, task_type, status, priority, due_date) VALUES
('TSK000000000001', 'CMP000000000001', 'CST000000000001', 'OPT000000000001', 'WOR000000000001', 'USR000000000002', 'Initial client meeting', 'Schedule and conduct initial requirements gathering meeting', 'meeting', 'completed', 'high', '2024-01-15'),
('TSK000000000002', 'CMP000000000001', 'CST000000000001', 'OPT000000000001', 'WOR000000000001', 'USR000000000002', 'System configuration', 'Configure CRM system according to client requirements', 'implementation', 'in_progress', 'high', '2024-02-15'),
('TSK000000000003', 'CMP000000000001', 'CST000000000002', 'OPT000000000002', 'WOR000000000002', 'USR000000000002', 'Technical documentation review', 'Review existing technical documentation', 'review', 'pending', 'medium', '2024-02-20'),
('TSK000000000004', 'CMP000000000002', 'CST000000000003', 'OPT000000000003', 'WOR000000000003', 'USR000000000003', 'Stakeholder interviews', 'Conduct interviews with key stakeholders', 'interview', 'pending', 'medium', '2024-03-01'),
('TSK000000000005', 'CMP000000000001', 'CST000000000001', NULL, NULL, 'USR000000000002', 'Follow-up call', 'Follow up on proposal submission', 'follow_up', 'pending', 'medium', '2024-02-25');

-- Create views for common queries
CREATE VIEW customer_opportunity_summary AS
SELECT 
    c.id as customer_id,
    c.first_name,
    c.last_name,
    c.email,
    c.company_name,
    COUNT(o.id) as opportunity_count,
    COALESCE(SUM(o.value), 0) as total_opportunity_value,
    MAX(o.expected_close_date) as latest_expected_close
FROM customers c
LEFT JOIN opportunities o ON c.id = o.customer_id
GROUP BY c.id, c.first_name, c.last_name, c.email, c.company_name;

CREATE VIEW user_task_summary AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
    COUNT(CASE WHEN t.due_date < CURRENT_DATE AND t.status != 'completed' THEN 1 END) as overdue_tasks
FROM users u
LEFT JOIN tasks t ON u.id = t.user_id
GROUP BY u.id, u.first_name, u.last_name, u.email;

-- Create view for user permissions based on roles
CREATE VIEW user_permissions AS
SELECT 
    u.id as user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.company_id,
    r.role_name,
    r.description as role_description,
    r.company_access_read,
    r.company_access_edit,
    r.company_access_delete,
    r.user_access_read,
    r.user_access_edit,
    r.user_access_delete,
    r.customer_access_read,
    r.customer_access_edit,
    r.customer_access_delete,
    r.opportunity_access_read,
    r.opportunity_access_edit,
    r.opportunity_access_delete,
    r.work_order_access_read,
    r.work_order_access_edit,
    r.work_order_access_delete,
    r.task_access_read,
    r.task_access_edit,
    r.task_access_delete,
    r.role_access_read,
    r.role_access_edit,
    r.role_access_delete,
    r.system_admin,
    r.can_manage_roles,
    r.can_manage_users
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.is_active = true AND (r.is_active = true OR r.is_active IS NULL);

-- Grant necessary permissions (adjust based on your user setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

