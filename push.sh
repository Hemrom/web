#!/bin/bash
# ============================================
# Script Push dari Lokal ke GitHub
# Jalankan: bash push.sh "pesan commit"
# Atau: bash push.sh  (pesan otomatis)
# ============================================

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   PUSH KE GITHUB                       ${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Cek apakah ada perubahan
if git diff --quiet && git diff --cached --quiet; then
    # Cek untracked files
    if [ -z "$(git status --porcelain)" ]; then
        echo -e "${YELLOW}Tidak ada perubahan untuk di-push.${NC}"
        echo ""
        echo "Commit terbaru:"
        git log --oneline -3
        exit 0
    fi
fi

# Tampilkan perubahan
echo -e "${YELLOW}File yang berubah:${NC}"
git status --short
echo ""

# Pesan commit
if [ -n "$1" ]; then
    MSG="$1"
else
    MSG="update $(date '+%Y-%m-%d %H:%M')"
fi

echo -e "${YELLOW}Commit message: ${MSG}${NC}"
echo ""

# Add, commit, push
git add .
git commit -m "$MSG"
git push origin main

echo ""
echo -e "${GREEN}✓ Berhasil push ke GitHub!${NC}"
echo ""
echo -e "${YELLOW}Sekarang update VPS dengan:${NC}"
echo -e "  ssh user@ip-vps"
echo -e "  bash update.sh"
echo ""
echo "Commit terbaru:"
git log --oneline -3
