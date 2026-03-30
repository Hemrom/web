#!/bin/bash
# ============================================================
# Script Deploy Otomatis - SMKN 1 Kras Website
# Jalankan di VPS: bash deploy.sh
# ============================================================

set -e  # Stop jika ada error

echo "🚀 Memulai deployment SMKN 1 Kras Website..."

# ── 1. Install dependencies ──────────────────────────────────
echo "📦 Installing dependencies..."
npm install --omit=dev

# ── 2. Buat folder yang dibutuhkan ───────────────────────────
echo "📁 Membuat folder..."
mkdir -p uploads logs public

# Buat .gitkeep agar folder uploads tidak kosong
touch uploads/.gitkeep

# ── 3. Cek file .env ─────────────────────────────────────────
if [ ! -f ".env" ]; then
  echo ""
  echo "⚠️  File .env belum ada!"
  echo "   Salin dari contoh: cp .env.example .env"
  echo "   Lalu edit: nano .env"
  echo ""
  echo "   Isi minimal yang dibutuhkan:"
  echo "   DB_HOST=127.0.0.1"
  echo "   DB_USER=nama_user_db"
  echo "   DB_PASSWORD=password_db"
  echo "   DB_NAME=sekolah_db"
  echo "   SESSION_SECRET=random_string_panjang"
  echo "   COOKIE_SECURE=true"
  echo "   NODE_ENV=production"
  echo ""
  exit 1
fi

# ── 4. Setup database ─────────────────────────────────────────
echo "🗄️  Apakah ingin import database? (y/n)"
read -r IMPORT_DB
if [ "$IMPORT_DB" = "y" ]; then
  source .env
  echo "   Importing database..."
  mysql -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" < config/database.sql
  echo "   ✅ Database imported"
fi

# ── 5. Setup akun guru login ──────────────────────────────────
echo "👨‍🏫 Apakah ingin setup akun login guru? (y/n)"
read -r SETUP_GURU
if [ "$SETUP_GURU" = "y" ]; then
  node setup_guru_login.js
fi

# ── 6. Jalankan dengan PM2 ────────────────────────────────────
echo "⚙️  Menjalankan dengan PM2..."
if pm2 list | grep -q "smkn1kras"; then
  pm2 reload ecosystem.config.js --env production
  echo "   ✅ App di-reload"
else
  pm2 start ecosystem.config.js --env production
  pm2 save
  echo "   ✅ App dijalankan"
fi

echo ""
echo "✅ Deployment selesai!"
echo "🌐 Website berjalan di port 3000"
echo "📋 Cek status: pm2 status"
echo "📋 Cek log: pm2 logs smkn1kras.sch.id"
