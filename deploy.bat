@echo off
REM Website Sekolah Deployment Script for Windows
REM Usage: deploy.bat [production|staging]

setlocal enabledelayedexpansion

set ENV=%1
if "%ENV%"=="" set ENV=production

echo 🚀 Deploying to %ENV% environment...

REM Check if we're in the right directory
if not exist "package.json" (
    echo [ERROR] package.json not found. Are you in the project root?
    exit /b 1
)

REM Check if .env exists
if not exist ".env" (
    echo [WARNING] .env file not found. Copying from .env.example...
    copy .env.example .env
    echo [WARNING] Please edit .env file with your configuration before continuing.
    pause
)

REM Install dependencies
echo [INFO] Installing dependencies...
npm install
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies
    exit /b 1
)

REM Create uploads directory if it doesn't exist
if not exist "uploads" (
    echo [INFO] Creating uploads directory...
    mkdir uploads
)

REM Create logs directory for PM2
if not exist "logs" (
    echo [INFO] Creating logs directory...
    mkdir logs
)

REM Check if PM2 is installed
pm2 --version >nul 2>&1
if errorlevel 1 (
    echo [INFO] Installing PM2...
    npm install -g pm2
)

REM Start/restart with PM2
echo [INFO] Starting application with PM2...
pm2 describe website-sekolah >nul 2>&1
if errorlevel 1 (
    echo [INFO] Starting new PM2 process...
    pm2 start ecosystem.config.js --env %ENV%
) else (
    echo [INFO] Restarting existing PM2 process...
    pm2 restart website-sekolah
)

REM Save PM2 configuration
pm2 save

REM Show status
echo [INFO] Deployment completed! Application status:
pm2 status website-sekolah

echo.
echo 🎉 Deployment successful!
echo.
echo 📱 Access your website:
echo    Frontend: http://localhost:3000
echo    Admin: http://localhost:3000/admin
echo    Login: admin / admin123
echo.
echo 🔧 Useful commands:
echo    pm2 logs website-sekolah    # View logs
echo    pm2 restart website-sekolah # Restart app
echo    pm2 stop website-sekolah    # Stop app
echo    pm2 delete website-sekolah  # Remove app

pause