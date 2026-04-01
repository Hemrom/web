@echo off
echo ========================================
echo   Website Sekolah - Starting Server
echo ========================================
echo.

echo Stopping any existing node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 /nobreak >nul

echo Checking Node.js installation...
node --version
echo.

echo Starting server...
echo.
npm start
pause
