# YukiCRM Backend API

A Node.js/Express backend API for the YukiCRM application, connected to Supabase database.

## 🚀 Features

- **Customer Management** - CRUD operations for customers
- **Task Management** - Create, assign, and track tasks
- **Opportunity Tracking** - Manage sales opportunities
- **Work Order Management** - Track service work
- **Supabase Integration** - Real-time database connectivity
- **RESTful API** - Clean, documented endpoints

## 📡 API Endpoints

- `GET /api/health` - Health check
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/tasks` - Get all tasks
- `POST /api/tasks` - Create task
- `GET /api/opportunities` - Get all opportunities
- `POST /api/opportunities` - Create opportunity
- `GET /api/workorders` - Get all work orders
- `POST /api/workorders` - Create work order

## 🛠️ Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Supabase** - Database and real-time features
- **PostgreSQL** - Database (via Supabase)
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Deployment

This backend is configured for deployment on:
- **Railway** (recommended)
- **Render**
- **Heroku**

## 📱 Mobile App Integration

This backend serves the YukiCRM Flutter mobile application, providing real-time data synchronization and API endpoints for all CRM functionality.

## 🔧 Environment Variables

```env
NODE_ENV=production
PORT=3000
DB_TYPE=supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
CORS_ORIGIN=*
JWT_SECRET=your_jwt_secret
```

## 📊 Database Schema

The backend connects to Supabase with the following main tables:
- `customers` - Customer information
- `tasks` - Task management
- `opportunities` - Sales opportunities
- `work_orders` - Service work orders
- `companies` - Company information
- `users` - User management

## 🎯 Status

✅ **Ready for Production Deployment**
✅ **Connected to Supabase Database**
✅ **API Endpoints Tested**
✅ **Mobile App Integration Ready**
