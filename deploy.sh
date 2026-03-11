#!/bin/bash

# Website Sekolah Deployment Script
# Usage: ./deploy.sh [production|staging]

set -e

ENV=${1:-production}
echo "🚀 Deploying to $ENV environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Are you in the project root?"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Copying from .env.example..."
    cp .env.example .env
    print_warning "Please edit .env file with your configuration before continuing."
    read -p "Press Enter to continue after editing .env..."
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Run tests (if any)
if [ -f "package.json" ] && grep -q "\"test\"" package.json; then
    print_status "Running tests..."
    npm test || {
        print_error "Tests failed. Deployment aborted."
        exit 1
    }
fi

# Build assets (if needed)
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    print_status "Building assets..."
    npm run build
fi

# Database setup check
print_status "Checking database connection..."
node -e "
const db = require('./config/database');
db.query('SELECT 1')
  .then(() => {
    console.log('✅ Database connection successful');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Database connection failed:', err.message);
    process.exit(1);
  });
" || {
    print_error "Database connection failed. Please check your .env configuration."
    exit 1
}

# Create uploads directory if it doesn't exist
if [ ! -d "uploads" ]; then
    print_status "Creating uploads directory..."
    mkdir -p uploads
    chmod 755 uploads
fi

# Create logs directory for PM2
if [ ! -d "logs" ]; then
    print_status "Creating logs directory..."
    mkdir -p logs
fi

# Start/restart with PM2
print_status "Starting application with PM2..."
if pm2 describe website-sekolah > /dev/null 2>&1; then
    print_status "Restarting existing PM2 process..."
    pm2 restart website-sekolah
else
    print_status "Starting new PM2 process..."
    pm2 start ecosystem.config.js --env $ENV
fi

# Save PM2 configuration
pm2 save

# Show status
print_status "Deployment completed! Application status:"
pm2 status website-sekolah

print_status "🎉 Deployment successful!"
echo ""
echo "📱 Access your website:"
echo "   Frontend: http://localhost:3000"
echo "   Admin: http://localhost:3000/admin"
echo "   Login: admin / admin123"
echo ""
echo "🔧 Useful commands:"
echo "   pm2 logs website-sekolah    # View logs"
echo "   pm2 restart website-sekolah # Restart app"
echo "   pm2 stop website-sekolah    # Stop app"
echo "   pm2 delete website-sekolah  # Remove app"