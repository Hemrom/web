#!/bin/bash
# ============================================
# Script Push dari Lokal ke GitHub
# Jalankan: bash push.sh "pesan commit"
# Atau:     bash push.sh           (pesan otomatis)
# Atau:     bash push.sh "pesan" develop  (ke branch lain)
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

BRANCH="${2:-main}"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   PUSH KE GITHUB - SMKN 1 KRAS        ${NC}"
echo -e "${BLUE}   Branch: ${BRANCH}                   ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Cek git repo
if [ ! -d ".git" ]; then
    echo -e "${RED}✗ Bukan git repository!${NC}"
    exit 1
fi

# Cek apakah ada perubahan
if [ -z "$(git status --porcelain)" ]; then
    echo -e "${YELLOW}Tidak ada perubahan untuk di-push.${NC}"
    echo ""
    echo "Commit terbaru:"
    git log --oneline -3
    exit 0
fi

# Tampilkan perubahan
echo -e "${YELLOW}File yang berubah:${NC}"
git status --short
echo ""

# Pesan commit
if [ -n "$1" ]; then
    MSG="$1"
else
    MSG="update: $(date '+%Y-%m-%d %H:%M')"
fi

echo -e "${YELLOW}Commit message : ${MSG}${NC}"
echo -e "${YELLOW}Target branch  : ${BRANCH}${NC}"
echo ""

# Add semua, kecuali yang di .gitignore
git add .

# Commit
git commit -m "$MSG"

# Push
if git push origin "$BRANCH"; then
    echo ""
    echo -e "${GREEN}✓ Berhasil push ke GitHub branch [${BRANCH}]!${NC}"
    echo ""
    echo -e "${YELLOW}Sekarang update VPS dengan:${NC}"
    echo -e "  ssh user@ip-vps 'cd /var/www/smkn1kras && bash update.sh'"
    echo ""
    echo "Commit terbaru:"
    git log --oneline -3
else
    echo ""
    echo -e "${RED}✗ Gagal push! Cek koneksi atau token GitHub.${NC}"
    exit 1
fi
