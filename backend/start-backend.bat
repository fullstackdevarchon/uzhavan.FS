@echo off
cls
title Terravale Ventures LLP  Backend Server
color 0A

echo.
echo ==========================================
echo        Terravale Ventures LLP  BACKEND SERVER
echo ==========================================
echo.

echo [1/3] Cleaning up existing processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr "TCP.*:5000" 2^>nul') do (
    echo Killing process %%a using port 5000...
    taskkill /PID %%a /F >nul 2>&1
)

echo [2/3] Final cleanup...
taskkill /f /im node.exe /t >nul 2>&1
ping 127.0.0.1 -n 2 >nul

echo [3/3] Starting server...
echo ==========================================
echo.
npm run dev
