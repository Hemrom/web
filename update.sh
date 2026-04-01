#!/bin/bash
# ============================================
# Script Update Website SMKN 1 Kras - VPS
# Jalankan: bash update.sh
# ============================================

set -e  # Stop jika ada error

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   UPDATE WEBSITE SMKN 1 KRAS - VPS    ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# 1. Cek apakah ada perubahan lokal di VPS yang bisa konflik
echo -e "${YELLOW}[1/5] Cek status git...${NC}"
if ! git diff --quiet; then
    echo -e "${YELLOW}  Ada perubahan lokal, menyimpan dengan stash...${NC}"
    git stash
fi

# 2. Pull dari GitHub
echo -e "${YELLOW}[2/5] Mengambil update terbaru dari GitHub...${NC}"
git pull origin main
echo -e "${GREEN}  ✓ Kode berhasil diperbarui${NC}"

# 3. Migrasi database langsung via SQL (tidak butuh file .js)
echo -e "${YELLOW}[3/5] Migrasi database...${NC}"

node -e "
const db = require('./config/database');
async function migrate() {
  const queries = [
    \`CREATE TABLE IF NOT EXISTS alumni (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nis VARCHAR(50) DEFAULT NULL,
      tahun_lulus YEAR DEFAULT NULL,
      jurusan VARCHAR(100) DEFAULT NULL,
      pekerjaan VARCHAR(150) DEFAULT NULL,
      perusahaan VARCHAR(150) DEFAULT NULL,
      kota VARCHAR(100) DEFAULT NULL,
      foto VARCHAR(255) DEFAULT NULL,
      email VARCHAR(100) DEFAULT NULL,
      telepon VARCHAR(20) DEFAULT NULL,
      instagram VARCHAR(100) DEFAULT NULL,
      linkedin VARCHAR(200) DEFAULT NULL,
      cerita TEXT DEFAULT NULL,
      token VARCHAR(64) DEFAULT NULL,
      status ENUM('pending','disetujui','ditolak') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4\`,
    \`CREATE TABLE IF NOT EXISTS link_terkait (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      logo VARCHAR(255) DEFAULT NULL,
      deskripsi VARCHAR(255) DEFAULT NULL,
      urutan INT DEFAULT 0,
      status ENUM('aktif','nonaktif') DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4\`,
    'ALTER TABLE profil_sekolah ADD COLUMN IF NOT EXISTS tampil_wa TINYINT(1) DEFAULT 1',
    'ALTER TABLE halaman ADD COLUMN IF NOT EXISTS subtitle VARCHAR(500) DEFAULT NULL AFTER judul',
    'ALTER TABLE media_sosial ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(255) DEFAULT NULL',
  ];
  for (const q of queries) {
    try { await db.query(q); } catch(e) { if (!e.message.includes('Duplicate')) console.log('  skip:', e.message.substring(0,60)); }
  }
  console.log('  Migrasi selesai');
  process.exit(0);
}
migrate();
"

# 4. Restart aplikasi
echo -e "${YELLOW}[4/5] Restart aplikasi...${NC}"
pm2 restart all
echo -e "${GREEN}  ✓ Aplikasi berhasil direstart${NC}"

# 5. Cek status
echo -e "${YELLOW}[5/5] Cek status aplikasi...${NC}"
sleep 2
pm2 list

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   UPDATE SELESAI!                      ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Commit terbaru:"
git log --oneline -3
echo ""
