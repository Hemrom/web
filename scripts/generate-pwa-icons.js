/**
 * Generate PWA Icons - SMKN 1 Kras
 * Background biru cerah #2563eb, logo di tengah (60% safe zone maskable)
 *
 * Dijalankan otomatis saat server start jika icon belum ada.
 * Bisa juga dijalankan manual: node scripts/generate-pwa-icons.js
 */

const sharp = require('sharp');
const path  = require('path');
const fs    = require('fs');

const ROOT       = path.join(__dirname, '..');
const SOURCE     = path.join(ROOT, 'assets', 'img', 'logo-sekolah.png');
const OUTPUT_DIR = path.join(ROOT, 'public', 'icons');

// Warna background biru cerah
const BG = { r: 37, g: 99, b: 235, alpha: 1 };

const SIZES = [48, 72, 96, 128, 144, 192, 256, 512];

async function generateOne(size) {
  const outFile = path.join(OUTPUT_DIR, `icon-${size}.png`);
  if (fs.existsSync(outFile)) return; // skip jika sudah ada

  // Logo mengisi 60% canvas (standar maskable safe zone)
  const logoSize = Math.round(size * 0.60);
  const offset   = Math.round((size - logoSize) / 2);

  const logo = await sharp(SOURCE)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  await sharp({
    create: { width: size, height: size, channels: 4, background: BG }
  })
  .composite([{ input: logo, top: offset, left: offset }])
  .png()
  .toFile(outFile);

  console.log(`[PWA Icons] ✅ icon-${size}.png`);
}

async function generateAll() {
  if (!fs.existsSync(SOURCE)) {
    console.warn('[PWA Icons] ⚠️  Logo tidak ditemukan:', SOURCE);
    return;
  }
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  for (const size of SIZES) {
    try {
      await generateOne(size);
    } catch (e) {
      console.warn(`[PWA Icons] ⚠️  Gagal generate icon-${size}.png:`, e.message);
    }
  }
}

// Jika dipanggil langsung
if (require.main === module) {
  // Force regenerate semua
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.readdirSync(OUTPUT_DIR)
      .filter(f => f.startsWith('icon-') && f.endsWith('.png'))
      .forEach(f => fs.unlinkSync(path.join(OUTPUT_DIR, f)));
  }
  generateAll().then(() => console.log('[PWA Icons] Selesai.')).catch(console.error);
}

module.exports = { generateAll };
