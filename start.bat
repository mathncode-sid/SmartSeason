@echo off
REM SmartSeason Startup Script

echo.
echo ========================================
echo SmartSeason Field Monitoring System
echo Starting Services...
echo ========================================
echo.

echo.
echo [1/2] Starting Backend Server on http://localhost:5000
echo Press Ctrl+C to stop all services
cd backend
start "SmartSeason Backend" npm start

echo.
echo [2/2] Starting Frontend Server on http://localhost:3000
timeout /t 3 /nobreak
cd ..\frontend
start "SmartSeason Frontend" npm start

cd ..

echo.
echo ========================================
echo Services Starting...
echo ========================================
echo.
echo Backend: http://localhost:5000/api/health
echo Frontend: http://localhost:3000
echo.
echo Close the command windows to stop the services.
echo.
