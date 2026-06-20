/**
 * Optimasi ulang semua gambar di folder uploads/ ke WebP.
 * Jalankan sekali di VPS: node scripts/optimize-uploads.js
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const UPLOADS = path.join(__dirname, '..', 'uploads');
const SKIP = new Set(['.svg', '.gif', '.webp', '.ico']);
const MAX = { width: 1920, height: 1080 };

async function optimizeFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP.has(ext)) return { file: filePath, status: 'skip' };

  const base = filePath.slice(0, -ext.length);
  const out = `${base}.webp`;
  if (fs.existsSync(out) && out !== filePath) return { file: filePath, status: 'exists' };

  try {
    const meta = await sharp(filePath).metadata();
    if (ext === '.png' && meta.hasAlpha) {
      await sharp(filePath).rotate()
        .resize({ ...MAX, fit: 'inside', withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9, palette: true })
        .toFile(`${base}.opt.tmp`);
      fs.renameSync(`${base}.opt.tmp`, filePath);
      return { file: filePath, status: 'png-optimized' };
    }

    await sharp(filePath).rotate()
      .resize({ ...MAX, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 78, effort: 4 })
      .toFile(`${base}.opt.tmp`);
    fs.renameSync(`${base}.opt.tmp`, out);
    if (out !== filePath) fs.unlinkSync(filePath);
    return { file: out, status: 'webp' };
  } catch (err) {
    return { file: filePath, status: 'error', error: err.message };
  }
}

async function run() {
  if (!fs.existsSync(UPLOADS)) {
    console.error('Folder uploads tidak ditemukan');
    process.exit(1);
  }

  const files = fs.readdirSync(UPLOADS)
    .filter(f => !f.startsWith('.'))
    .map(f => path.join(UPLOADS, f))
    .filter(f => fs.statSync(f).isFile());

  let ok = 0, skip = 0, err = 0;
  for (const file of files) {
    const result = await optimizeFile(file);
    if (result.status === 'error') {
      err++;
      console.log('✗', path.basename(file), result.error);
    } else if (result.status === 'skip' || result.status === 'exists') {
      skip++;
    } else {
      ok++;
      console.log('✓', path.basename(result.file), result.status);
    }
  }

  console.log(`\nSelesai: ${ok} dioptimasi, ${skip} dilewati, ${err} gagal`);
  process.exit(err ? 1 : 0);
}

run();
