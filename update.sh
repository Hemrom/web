#!/bin/bash
# ============================================
# Script Update Website SMKN 1 Kras - VPS
# Jalankan di VPS: bash update.sh
# ============================================

set -e  # Stop jika ada error

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   UPDATE WEBSITE SMKN 1 KRAS - VPS    ${NC}"
echo -e "${BLUE}   $(date '+%Y-%m-%d %H:%M:%S')        ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# ── 1. Cek & simpan perubahan lokal ──────────────────────────
echo -e "${YELLOW}[1/6] Cek status git...${NC}"
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo -e "${YELLOW}  Ada perubahan lokal di VPS, menyimpan dengan stash...${NC}"
    git stash
    echo -e "${GREEN}  ✓ Tersimpan di git stash${NC}"
else
    echo -e "${GREEN}  ✓ Working tree bersih${NC}"
fi

# ── 2. Pull dari GitHub ───────────────────────────────────────
echo -e "${YELLOW}[2/6] Mengambil update dari GitHub...${NC}"

# Hapus file .bak yang menyebabkan conflict
find . -maxdepth 1 -name "*.bak" -delete 2>/dev/null && echo -e "${YELLOW}  File .bak dihapus${NC}"

git pull origin main
echo -e "${GREEN}  ✓ Kode berhasil diperbarui${NC}"
echo "  Commit terbaru: $(git log --oneline -1)"

# ── 3. Install dependencies (jika package.json berubah) ──────
echo -e "${YELLOW}[3/6] Cek dependencies...${NC}"
if git diff HEAD~1 --name-only 2>/dev/null | grep -q "package.json"; then
    echo -e "${YELLOW}  package.json berubah, install ulang...${NC}"
    npm install --omit=dev
    echo -e "${GREEN}  ✓ Dependencies diperbarui${NC}"
else
    echo -e "${GREEN}  ✓ Tidak ada perubahan dependencies${NC}"
fi

# ── 4. Migrasi database ───────────────────────────────────────
echo -e "${YELLOW}[4/6] Menjalankan migrasi database...${NC}"
node migrate.js
# Migrasi tambahan (jalankan jika file ada)
[ -f migrate_jurusan_fasilitas.js ] && node migrate_jurusan_fasilitas.js
[ -f migrate_jurusan_link_daftar.js ] && node migrate_jurusan_link_daftar.js
echo -e "${GREEN}  ✓ Migrasi selesai${NC}"

# ── 5. Buat folder yang dibutuhkan ────────────────────────────
echo -e "${YELLOW}[5/6] Cek folder uploads & logs...${NC}"
mkdir -p uploads logs
echo -e "${GREEN}  ✓ Folder siap${NC}"

# ── 6. Restart aplikasi dengan PM2 ───────────────────────────
echo -e "${YELLOW}[6/6] Restart aplikasi...${NC}"
if pm2 list | grep -q "smkn1kras"; then
    pm2 reload smkn1kras --update-env
    echo -e "${GREEN}  ✓ Aplikasi berhasil direload${NC}"
else
    echo -e "${YELLOW}  App belum berjalan, menjalankan dengan PM2...${NC}"
    pm2 start ecosystem.config.js --env production
    pm2 save
    echo -e "${GREEN}  ✓ Aplikasi berhasil dijalankan${NC}"
fi

# Tunggu sebentar lalu cek status
sleep 2

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   UPDATE SELESAI!                      ${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
pm2 list
echo ""
echo -e "3 Commit terbaru:"
git log --oneline -3
echo ""
echo -e "${BLUE}Lihat log: pm2 logs smkn1kras --lines 20${NC}"
