@echo off
REM Real-Time Bus Tracking System - Deployment Script for Windows
REM This script sets up and deploys both frontend and backend

echo 🚀 Starting deployment of Bus Tracking System...

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Install backend dependencies
echo 📦 Installing backend dependencies...
cd "Web API"
call npm install
cd ..

REM Install frontend dependencies
echo 📦 Installing frontend dependencies...
cd client
call npm install
cd ..

REM Create environment file if it doesn't exist
if not exist "Web API\.env" (
    echo 🔧 Creating environment file...
    (
        echo # Bus Tracking API Environment Variables
        echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
        echo PORT=3000
        echo NODE_ENV=development
        echo.
        echo # Database settings
        echo DB_PATH=./data
        echo.
        echo # Rate limiting
        echo RATE_LIMIT_WINDOW_MS=900000
        echo RATE_LIMIT_MAX_REQUESTS=100
        echo.
        echo # Logging
        echo LOG_LEVEL=info
    ) > "Web API\.env"
    echo ✅ Environment file created at Web API\.env
    echo ⚠️  Please update the JWT_SECRET in Web API\.env for production
)

REM Seed the database
echo 🌱 Seeding database...
call npm run seed

REM Build both applications
echo 🏗️ Building applications...
call npm run build

echo ✅ Deployment completed successfully!
echo.
echo 🎉 Your Bus Tracking System is ready!
echo.
echo 📋 Next steps:
echo 1. Start development servers: npm run dev
echo 2. Backend will be available at: http://localhost:3000
echo 3. Frontend will be available at: http://localhost:5173
echo 4. API documentation at: http://localhost:3000/docs
echo.
echo 🔧 Available commands:
echo   npm run dev          - Start both frontend and backend
echo   npm run dev:backend  - Start backend only
echo   npm run dev:frontend - Start frontend only
echo   npm run build        - Build both applications
echo   npm test             - Run all tests
echo   npm run seed         - Seed the database
echo.
echo 📚 For more information, see README.md
pause
