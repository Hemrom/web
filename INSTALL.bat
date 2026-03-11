@echo off
echo ========================================
echo   Website Sekolah - Installation
echo ========================================
echo.
echo Step 1: Installing dependencies...
call npm install
echo.
echo Step 2: Creating uploads folder...
if not exist "uploads" mkdir uploads
echo.
echo ========================================
echo Installation completed!
echo ========================================
echo.
echo Next steps:
echo 1. Setup MySQL database (run config/database.sql)
echo 2. Configure .env file if needed
echo 3. Run START.bat to start the server
echo.
pause
