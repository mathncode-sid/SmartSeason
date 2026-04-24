@echo off
REM SmartSeason Setup Script for Windows

echo.
echo ========================================
echo SmartSeason Field Monitoring System
echo Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found. Version:
node --version
npm --version
echo.

REM Setup Backend
echo Setting up Backend...
cd backend
if not exist node_modules (
    echo Installing backend dependencies...
    call npm install
)
echo Backend dependencies installed.
echo.

REM Setup Frontend
echo Setting up Frontend...
cd ..\frontend
if not exist node_modules (
    echo Installing frontend dependencies...
    call npm install
)
echo Frontend dependencies installed.
echo.

cd ..

echo.
echo ========================================
echo Setup Complete!
echo ========================================
echo.
echo To run the application:
echo.
echo 1. Open first terminal in the backend folder:
echo    cd backend
echo    npm start
echo.
echo 2. Open second terminal in the frontend folder:
echo    cd frontend
echo    npm start
echo.
echo 3. Open your browser to http://localhost:3000
echo.
echo Demo Credentials:
echo   Admin: admin@smartseason.com / password123
echo   Agent: agent@smartseason.com / password123
echo.
echo Note: Demo users will be created on first backend start.
echo.
pause
