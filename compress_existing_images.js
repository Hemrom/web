/**
 * Script kompresi massal gambar yang sudah ada di /uploads
 * Jalankan: node compress_existing_images.js
 * Aman dijalankan berulang kali - skip file yang sudah kecil
 */
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const UPLOADS_DIR = './uploads';
const MAX_WIDTH = 1200;
const MAX_HEIGHT = 900;
const JPEG_QUALITY = 75;
const PNG_QUALITY = 75;
const MAX_SIZE_KB = 200; // Skip jika sudah < 200KB

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];

async function compressAll() {
  const files = fs.readdirSync(UPLOADS_DIR);
  const images = files.filter(f => IMAGE_EXTS.includes(path.extname(f).toLowerCase()));
  
  console.log(`\n📁 Ditemukan ${images.length} gambar di /uploads\n`);
  
  let compressed = 0, skipped = 0, failed = 0, totalSaved = 0;

  for (const filename of images) {
    const filePath = path.join(UPLOADS_DIR, filename);
    const stat = fs.statSync(filePath);
    const sizeKB = stat.size / 1024;

    // Skip jika sudah kecil
    if (sizeKB < MAX_SIZE_KB) {
      skipped++;
      continue;
    }

    const ext = path.extname(filename).toLowerCase();
    const tmpPath = filePath + '.tmp';

    try {
      const sharpInst = sharp(filePath).rotate();
      
      if (ext === '.png') {
        await sharpInst
          .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
          .png({ quality: PNG_QUALITY, compressionLevel: 9 })
          .toFile(tmpPath);
      } else {
        await sharpInst
          .resize({ width: MAX_WIDTH, height: MAX_HEIGHT, fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: JPEG_QUALITY, progressive: true, mozjpeg: true })
          .toFile(tmpPath);
      }

      const newStat = fs.statSync(tmpPath);
      const newSizeKB = newStat.size / 1024;
      
      // Hanya replace jika lebih kecil
      if (newSizeKB < sizeKB) {
        fs.renameSync(tmpPath, filePath);
        const saved = sizeKB - newSizeKB;
        totalSaved += saved;
        compressed++;
        console.log(`✅ ${filename}: ${sizeKB.toFixed(0)}KB → ${newSizeKB.toFixed(0)}KB (hemat ${saved.toFixed(0)}KB)`);
      } else {
        fs.unlinkSync(tmpPath);
        skipped++;
      }
    } catch (err) {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
      failed++;
      console.log(`❌ ${filename}: ${err.message}`);
    }
  }

  console.log(`\n========================================`);
  console.log(`✅ Dikompres : ${compressed} file`);
  console.log(`⏭️  Dilewati  : ${skipped} file (sudah kecil)`);
  console.log(`❌ Gagal     : ${failed} file`);
  console.log(`💾 Total hemat: ${(totalSaved / 1024).toFixed(1)} MB`);
  console.log(`========================================\n`);
  
  process.exit(0);
}

compressAll().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
