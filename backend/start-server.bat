@echo off
title Terravale Ventures LLP  Backend Server
color 0A
echo.
echo ========================================
echo       Terravale Ventures LLP  BACKEND SERVER
echo ========================================
echo.
echo [STEP 1/4] Checking for existing processes...
netstat -ano | findstr :5000 >nul
if %errorlevel% == 0 (
    echo Found processes using port 5000. Killing them...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
        taskkill /PID %%a /F >nul 2>&1
    )
    echo Waiting for cleanup...
    ping 127.0.0.1 -n 3 >nul
) else (
    echo Port 5000 is free.
)

echo.
echo [STEP 2/4] Killing any remaining Node.js processes...
taskkill /f /im node.exe /t >nul 2>&1

echo.
echo [STEP 3/4] Verifying port availability...
netstat -ano | findstr :5000 >nul
if %errorlevel% == 0 (
    echo ERROR: Port 5000 is still in use!
    pause
    exit /b 1
) else (
    echo Port 5000 is available.
)

echo.
echo [STEP 4/4] Starting backend server...
echo ========================================
echo.
npm run dev
