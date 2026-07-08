/**
 * Generate PWA Icons untuk SMKN 1 Kras
 * Membuat icon maskable dengan background biru cerah dan logo di tengah
 *
 * Jalankan: node generate_pwa_icons.js
 */

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const SOURCE_LOGO = path.join(__dirname, 'assets', 'img', 'logo-sekolah.png');
const OUTPUT_DIR  = path.join(__dirname, 'public', 'icons');

// Warna background — biru cerah khas pendidikan
const BG_COLOR = { r: 37, g: 99, b: 235, alpha: 1 }; // #2563eb

// Ukuran icon yang dibutuhkan PWA
const SIZES = [
  { size: 48,   name: 'icon-48.png'   },
  { size: 72,   name: 'icon-72.png'   },
  { size: 96,   name: 'icon-96.png'   },
  { size: 128,  name: 'icon-128.png'  },
  { size: 144,  name: 'icon-144.png'  },
  { size: 192,  name: 'icon-192.png'  },
  { size: 256,  name: 'icon-256.png'  },
  { size: 512,  name: 'icon-512.png'  },
];

async function generateIcon(size, outputPath) {
  // Safe zone maskable: logo mengisi 60% dari canvas (40% padding di sisi-sisi)
  const logoSize = Math.round(size * 0.6);
  const offset   = Math.round((size - logoSize) / 2);

  // 1. Resize logo dengan background transparan
  const resizedLogo = await sharp(SOURCE_LOGO)
    .resize(logoSize, logoSize, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .png()
    .toBuffer();

  // 2. Buat canvas background biru bulat dengan logo di tengah
  await sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: BG_COLOR
    }
  })
  .composite([{
    input: resizedLogo,
    top: offset,
    left: offset,
  }])
  .png()
  .toFile(outputPath);

  console.log(`✅ Generated: ${path.basename(outputPath)} (${size}x${size})`);
}

async function main() {
  // Pastikan source logo ada
  if (!fs.existsSync(SOURCE_LOGO)) {
    console.error('❌ Logo tidak ditemukan:', SOURCE_LOGO);
    process.exit(1);
  }

  // Buat folder output
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  console.log('🎨 Generating PWA icons...\n');

  for (const { size, name } of SIZES) {
    await generateIcon(size, path.join(OUTPUT_DIR, name));
  }

  console.log('\n✅ Semua icon berhasil dibuat di:', OUTPUT_DIR);
  console.log('👉 Sekarang update manifest.json sudah otomatis menggunakan icon baru.');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
