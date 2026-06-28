/**
 * optimize-safe.js
 *
 * Versi AMAN dari optimize-uploads.js
 * Melakukan: kompresi → konversi WebP → update database → laporan
 *
 * Beda dengan optimize-uploads.js biasa:
 *  - Update referensi database OTOMATIS setelah konversi
 *  - Tidak akan ada gambar broken setelah dijalankan
 *  - Bisa dijalankan berulang kali (idempotent)
 *
 * Jalankan di VPS: node scripts/optimize-safe.js
 * Setelah selesai restart: pm2 restart smkn1kras
 */
require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const sharp = require('sharp');
const mysql = require('mysql2/promise');

const UPLOADS = path.join(__dirname, '..', 'uploads');

// Konfigurasi kompresi per prefix nama file
const PROFILES = {
  slider:   { maxWidth: 1920, maxHeight: 860,  quality: 80 },
  guru:     { maxWidth: 800,  maxHeight: 1000, quality: 80 },
  alumni:   { maxWidth: 800,  maxHeight: 1000, quality: 80 },
  siswa:    { maxWidth: 800,  maxHeight: 1000, quality: 80 },
  galeri:   { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  fasilitas:{ maxWidth: 1400, maxHeight: 1050, quality: 78 },
  berita:   { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  artikel:  { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  agenda:   { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  portal:   { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  jurusan:  { maxWidth: 1400, maxHeight: 1050, quality: 78 },
  profil:   { maxWidth: 800,  maxHeight: 1000, quality: 80 },
  link:     { maxWidth: 600,  maxHeight: 600,  quality: 76 },
  medsos:   { maxWidth: 600,  maxHeight: 600,  quality: 76 },
  default:  { maxWidth: 1200, maxHeight: 900,  quality: 75 },
};

// Semua tabel + kolom gambar di database
const DB_TARGETS = [
  { table: 'galeri',            column: 'gambar' },
  { table: 'guru',              column: 'foto'   },
  { table: 'siswa',             column: 'foto'   },
  { table: 'berita',            column: 'gambar' },
  { table: 'artikel',           column: 'gambar' },
  { table: 'agenda',            column: 'gambar' },
  { table: 'slider',            column: 'gambar' },
  { table: 'jurusan',           column: 'gambar' },
  { table: 'fasilitas',         column: 'gambar' },
  { table: 'fasilitas_foto',    column: 'gambar' },
  { table: 'alumni',            column: 'foto'   },
  { table: 'profil_konten',     column: 'foto'   },
  { table: 'link_terkait',      column: 'gambar' },
  { table: 'media_sosial',      column: 'icon'   },
  { table: 'halaman',           column: 'gambar' },
  { table: 'halaman_galeri',    column: 'gambar' },
  { table: 'file_download',     column: 'thumbnail' },
  { table: 'prestasi',          column: 'gambar' },
  { table: 'jurusan_galeri',    column: 'gambar' },
  { table: 'jurusan_fasilitas', column: 'gambar' },
  { table: 'osis_galeri',       column: 'gambar' },
  { table: 'pramuka_galeri',    column: 'gambar' },
  { table: 'olahraga_galeri',   column: 'gambar' },
  { table: 'paskibraka_galeri', column: 'gambar' },
  { table: 'rohis_galeri',      column: 'gambar' },
  { table: 'pmr_galeri',        column: 'gambar' },
];

const SKIP_EXT   = new Set(['.svg', '.gif', '.webp', '.ico', '.txt', '.md', '.json', '.pdf']);
const CONVERT_EXT = new Set(['.jpg', '.jpeg', '.png']);

function getProfile(filename) {
  const lower = filename.toLowerCase();
  for (const key of Object.keys(PROFILES)) {
    if (lower.startsWith(key)) return PROFILES[key];
  }
  return PROFILES.default;
}

async function convertToWebp(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (SKIP_EXT.has(ext)) return { status: 'skip' };
  if (!CONVERT_EXT.has(ext)) return { status: 'skip' };

  const baseNoExt  = filePath.replace(/\.[^.]+$/i, '');
  const webpPath   = `${baseNoExt}.webp`;
  const tmpPath    = `${baseNoExt}.opt.tmp`;
  const filename   = path.basename(filePath);

  // Sudah ada versi .webp — skip
  if (fs.existsSync(webpPath) && webpPath !== filePath) {
    return { status: 'exists', webpPath };
  }

  const cfg = getProfile(filename);

  try {
    const meta    = await sharp(filePath, { failOn: 'none' }).rotate().metadata();
    const keepPng = ext === '.png' && meta.hasAlpha;

    if (keepPng) {
      // PNG transparan — kompres tapi tetap PNG
      await sharp(filePath).rotate()
        .resize({ width: cfg.maxWidth, height: cfg.maxHeight, fit: 'inside', withoutEnlargement: true })
        .png({ quality: Math.min(cfg.quality, 80), compressionLevel: 6, palette: true })
        .toFile(tmpPath);
      fs.renameSync(tmpPath, filePath);
      return { status: 'png-optimized', webpPath: filePath };
    }

    // Konversi ke WebP
    await sharp(filePath).rotate()
      .resize({ width: cfg.maxWidth, height: cfg.maxHeight, fit: 'inside', withoutEnlargement: true })
      .webp({ quality: cfg.quality, effort: 4 })
      .toFile(tmpPath);

    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    fs.renameSync(tmpPath, webpPath);
    return { status: 'converted', oldPath: filePath, webpPath, oldName: filename, newName: path.basename(webpPath) };

  } catch (err) {
    if (fs.existsSync(tmpPath)) try { fs.unlinkSync(tmpPath); } catch {}
    return { status: 'error', error: err.message };
  }
}

async function updateDatabase(db, conversions) {
  // Build map: oldName → newName
  const nameMap = new Map();
  for (const c of conversions) {
    if (c.status === 'converted') {
      nameMap.set(c.oldName, c.newName);
    }
  }

  if (nameMap.size === 0) {
    console.log('\n📋 Tidak ada perubahan nama file — database tidak perlu diupdate.');
    return 0;
  }

  console.log(`\n📋 Update database untuk ${nameMap.size} file yang dikonversi...`);
  let totalUpdated = 0;

  for (const { table, column } of DB_TARGETS) {
    // Cek tabel ada
    const [tables] = await db.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?`,
      [table]
    );
    if (!tables.length) continue;

    // Cek kolom ada
    const [cols] = await db.query(
      `SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=? AND COLUMN_NAME=?`,
      [table, column]
    );
    if (!cols.length) continue;

    let tableUpdated = 0;
    for (const [oldName, newName] of nameMap) {
      const [result] = await db.query(
        `UPDATE \`${table}\` SET \`${column}\`=? WHERE \`${column}\`=?`,
        [newName, oldName]
      );
      tableUpdated += result.affectedRows;
    }

    if (tableUpdated > 0) {
      console.log(`  ✓ ${table}.${column}: ${tableUpdated} record diperbarui`);
      totalUpdated += tableUpdated;
    }
  }

  return totalUpdated;
}

async function run() {
  if (!fs.existsSync(UPLOADS)) {
    console.error('❌ Folder uploads tidak ditemukan:', UPLOADS);
    process.exit(1);
  }

  // Koneksi database
  let db;
  try {
    db = await mysql.createConnection({
      host: process.env.DB_HOST, user: process.env.DB_USER,
      password: process.env.DB_PASSWORD, database: process.env.DB_NAME,
      charset: 'utf8mb4',
    });
    console.log('✅ Koneksi database berhasil\n');
  } catch (err) {
    console.error('❌ Gagal koneksi database:', err.message);
    process.exit(1);
  }

  // Ambil semua file gambar di root uploads/ (tidak subfolder)
  const files = fs.readdirSync(UPLOADS)
    .filter(f => !f.startsWith('.') && !f.startsWith('README'))
    .map(f => ({ name: f, fullPath: path.join(UPLOADS, f) }))
    .filter(f => fs.statSync(f.fullPath).isFile())
    .filter(f => CONVERT_EXT.has(path.extname(f.name).toLowerCase()));

  console.log(`🔍 Ditemukan ${files.length} file gambar yang perlu dicek...\n`);

  const conversions = [];
  let converted = 0, skipped = 0, errors = 0;

  for (const file of files) {
    const result = await convertToWebp(file.fullPath);
    result.oldName = result.oldName || file.name;
    conversions.push(result);

    if (result.status === 'converted') {
      converted++;
      // Hitung penghematan ukuran
      const newSize = fs.existsSync(result.webpPath) ? fs.statSync(result.webpPath).size : 0;
      const newKB = Math.round(newSize / 1024);
      console.log(`  ✓ ${file.name}  →  ${path.basename(result.webpPath)} (${newKB}KB)`);
    } else if (result.status === 'error') {
      errors++;
      console.log(`  ✗ ${file.name}: ${result.error}`);
    } else {
      skipped++;
    }
  }

  console.log(`\n─── Kompresi selesai ───────────────────────────────`);
  console.log(`✅ Dikonversi: ${converted} | ⏭️  Dilewati: ${skipped} | ❌ Error: ${errors}`);

  // Update database
  const dbUpdated = await updateDatabase(db, conversions);
  await db.end();

  console.log(`\n${'═'.repeat(52)}`);
  console.log(`SELESAI!`);
  console.log(`  File dikonversi ke WebP : ${converted}`);
  console.log(`  Record database diupdate: ${dbUpdated}`);
  console.log(`  Error                   : ${errors}`);
  console.log(`${'═'.repeat(52)}`);

  if (converted > 0) {
    console.log('\n⚡ Jalankan perintah ini untuk menerapkan perubahan:');
    console.log('   pm2 restart smkn1kras\n');
  }

  process.exit(errors > 0 ? 1 : 0);
}

run();
