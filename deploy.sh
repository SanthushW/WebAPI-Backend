#!/bin/bash

# Real-Time Bus Tracking System - Deployment Script
# This script sets up and deploys both frontend and backend

set -e  # Exit on any error

echo "🚀 Starting deployment of Bus Tracking System..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd "Web API"
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd client
npm install
cd ..

# Create environment file if it doesn't exist
if [ ! -f "Web API/.env" ]; then
    echo "🔧 Creating environment file..."
    cat > "Web API/.env" << EOF
# Bus Tracking API Environment Variables
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
NODE_ENV=development

# Database settings
DB_PATH=./data

# Rate limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Logging
LOG_LEVEL=info
EOF
    echo "✅ Environment file created at Web API/.env"
    echo "⚠️  Please update the JWT_SECRET in Web API/.env for production"
fi

# Seed the database
echo "🌱 Seeding database..."
npm run seed

# Build both applications
echo "🏗️ Building applications..."
npm run build

echo "✅ Deployment completed successfully!"
echo ""
echo "🎉 Your Bus Tracking System is ready!"
echo ""
echo "📋 Next steps:"
echo "1. Start development servers: npm run dev"
echo "2. Backend will be available at: http://localhost:3000"
echo "3. Frontend will be available at: http://localhost:5173"
echo "4. API documentation at: http://localhost:3000/docs"
echo ""
echo "🔧 Available commands:"
echo "  npm run dev          - Start both frontend and backend"
echo "  npm run dev:backend  - Start backend only"
echo "  npm run dev:frontend - Start frontend only"
echo "  npm run build        - Build both applications"
echo "  npm test             - Run all tests"
echo "  npm run seed         - Seed the database"
echo ""
echo "📚 For more information, see README.md"
