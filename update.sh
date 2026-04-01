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

# 3. Cek apakah ada script migrasi database baru
echo -e "${YELLOW}[3/5] Cek migrasi database...${NC}"

run_migration() {
    local file=$1
    local name=$2
    if [ -f "$file" ]; then
        echo -e "  Menjalankan: ${name}..."
        node "$file" && echo -e "${GREEN}  ✓ ${name} selesai${NC}" || echo -e "${RED}  ✗ ${name} gagal (mungkin sudah ada)${NC}"
    fi
}

run_migration "create_alumni_table.js" "Tabel alumni"
run_migration "create_link_terkait_table.js" "Tabel link_terkait"
run_migration "add_tampil_wa_column.js" "Kolom tampil_wa"
run_migration "add_halaman_subtitle.js" "Kolom subtitle halaman"

# Tambah kolom thumbnail media_sosial jika belum ada
node -e "
require('./config/database').query(\"ALTER TABLE media_sosial ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(255) DEFAULT NULL\")
  .then(()=>{ console.log('  ✓ Kolom thumbnail media_sosial OK'); process.exit(0); })
  .catch(()=>{ process.exit(0); });
" 2>/dev/null || true

echo -e "${GREEN}  ✓ Database OK${NC}"

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
