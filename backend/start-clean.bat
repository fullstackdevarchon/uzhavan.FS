@echo off
echo ====================================
echo    Terravale Ventures LLP  BACKEND SERVER
echo ====================================
echo.
echo [1/3] Killing existing Node.js processes...
taskkill /f /im node.exe >nul 2>&1
echo [2/3] Waiting for cleanup...
ping 127.0.0.1 -n 3 >nul
echo [3/3] Starting backend server...
echo.
npm run dev
