#!/bin/bash

# Quick Supabase Connection Test Script

echo "🔄 Testing Supabase Connection..."

# Stop current server
echo "Stopping current server..."
lsof -ti:3000 | xargs kill -9 2>/dev/null || echo "No process on port 3000"

# Check if DATABASE_URL is set correctly
if grep -q "\[YOUR-PASSWORD\]" .env; then
    echo "❌ Please replace [YOUR-PASSWORD] with your actual Supabase password in .env file"
    echo ""
    echo "1. Go to https://supabase.com/dashboard"
    echo "2. Select project: bolgjtzgwxxshyjnjlvw"  
    echo "3. Go to Settings → Database"
    echo "4. Copy your password"
    echo "5. Replace [YOUR-PASSWORD] in .env file"
    echo ""
    exit 1
fi

# Start server
echo "Starting server with Supabase..."
npm start
