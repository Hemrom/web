/**
 * repair-webp-refs.js
 *
 * Memperbaiki referensi nama file di database yang masih menunjuk ke .jpg/.jpeg/.png
 * padahal file fisiknya sudah dikonversi ke .webp oleh optimize-uploads.js
 *
 * Jalankan di VPS: node scripts/repair-webp-refs.js
 * Aman dijalankan berulang — hanya update jika file .webp benar-benar ada di disk.
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const UPLOADS = path.join(__dirname, '..', 'uploads');

// ── Semua tabel + kolom yang menyimpan nama file gambar ──────────────────────
const TARGETS = [
  { table: 'galeri',         column: 'gambar' },
  { table: 'guru',           column: 'foto'   },
  { table: 'siswa',          column: 'foto'   },
  { table: 'berita',         column: 'gambar' },
  { table: 'artikel',        column: 'gambar' },
  { table: 'agenda',         column: 'gambar' },
  { table: 'slider',         column: 'gambar' },
  { table: 'jurusan',        column: 'gambar' },
  { table: 'fasilitas',      column: 'gambar' },
  { table: 'fasilitas_foto', column: 'gambar' },
  { table: 'alumni',         column: 'foto'   },
  { table: 'profil_konten',  column: 'foto'   },
  { table: 'link_terkait',   column: 'gambar' },
  { table: 'media_sosial',   column: 'icon'   },
  { table: 'halaman',        column: 'gambar' },
  { table: 'file_download',  column: 'thumbnail' },
  { table: 'prestasi',       column: 'gambar' },
];

// Ekstensi yang mungkin sudah dikonversi ke .webp
const OLD_EXTS = ['.jpg', '.jpeg', '.png'];

async function run() {
  const db = await mysql.createConnection({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset:  'utf8mb4',
  });

  console.log('✅ Koneksi database berhasil\n');

  let totalFixed = 0;
  let totalSkip  = 0;
  let totalMissing = 0;

  for (const { table, column } of TARGETS) {
    // Cek apakah tabel ada
    const [tables] = await db.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ?`,
      [process.env.DB_NAME, table]
    );
    if (tables.length === 0) {
      console.log(`⚪ Tabel "${table}" tidak ada — dilewati`);
      continue;
    }

    // Ambil semua record yang punya ekstensi lama
    const placeholders = OLD_EXTS.map(() => `${column} LIKE ?`).join(' OR ');
    const likeValues   = OLD_EXTS.map(ext => `%${ext}`);

    const [rows] = await db.query(
      `SELECT id, ${column} FROM \`${table}\` WHERE ${placeholders} AND ${column} IS NOT NULL`,
      likeValues
    );

    let fixed = 0, skip = 0, missing = 0;

    for (const row of rows) {
      const oldName = row[column];
      if (!oldName) { skip++; continue; }

      const ext     = path.extname(oldName).toLowerCase();
      if (!OLD_EXTS.includes(ext)) { skip++; continue; }

      const base    = oldName.slice(0, -ext.length);
      const newName = `${base}.webp`;

      const newPath = path.join(UPLOADS, newName);
      const oldPath = path.join(UPLOADS, oldName);

      if (fs.existsSync(newPath)) {
        // File .webp sudah ada — update referensi di DB
        await db.query(
          `UPDATE \`${table}\` SET \`${column}\` = ? WHERE id = ?`,
          [newName, row.id]
        );
        console.log(`  ✓ [${table}] id=${row.id}  ${oldName} → ${newName}`);
        fixed++;
      } else if (!fs.existsSync(oldPath)) {
        // File lama juga tidak ada — referensi rusak
        console.log(`  ✗ [${table}] id=${row.id}  FILE HILANG: ${oldName}`);
        missing++;
      } else {
        // File lama masih ada, belum dikonversi — biarkan saja
        skip++;
      }
    }

    if (fixed > 0 || missing > 0) {
      console.log(`  → ${table}.${column}: ${fixed} diperbaiki, ${missing} hilang, ${skip} dilewati\n`);
    }

    totalFixed   += fixed;
    totalSkip    += skip;
    totalMissing += missing;
  }

  await db.end();

  console.log('─'.repeat(50));
  console.log(`Selesai: ${totalFixed} referensi diperbaiki, ${totalMissing} file hilang, ${totalSkip} dilewati`);

  if (totalMissing > 0) {
    console.log('\n⚠️  Ada file yang hilang dan tidak bisa dipulihkan dari disk.');
    console.log('   Jika ada backup server, pulihkan file dari backup.');
  }
}

run().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
