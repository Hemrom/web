#!/bin/bash
# ============================================================
# Script Update - Tarik perubahan terbaru dari GitHub
# Jalankan di VPS: bash update.sh
# ============================================================

set -e

echo "🔄 Mengambil update terbaru dari GitHub..."

# Pull perubahan
git pull origin main

# Install dependency baru jika ada
npm install --omit=dev

# Reload app tanpa downtime
pm2 reload ecosystem.config.js --env production

echo "✅ Update selesai!"
pm2 status
