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

# 3. Migrasi database
echo -e "${YELLOW}[3/5] Migrasi database...${NC}"
node migrate.js
echo -e "${GREEN}  ✓ Migrasi selesai${NC}"

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
