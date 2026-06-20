/**
 * fix-fasilitas-foto.js
 *
 * Diagnosa + repair khusus foto fasilitas (tabel fasilitas_foto).
 * Script optimize-uploads.js mengubah .jpg/.png → .webp di disk,
 * tapi DB masih simpan nama lama → gambar tidak tampil.
 *
 * Jalankan: node scripts/fix-fasilitas-foto.js
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const UPLOADS = path.join(__dirname, '..', 'uploads');

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME, charset: 'utf8mb4',
  });
  console.log('✅ DB connected\n');

  // Semua file di disk (Set untuk lookup O(1))
  const diskFiles = new Set(fs.readdirSync(UPLOADS));
  console.log(`📁 Total file di disk: ${diskFiles.size}\n`);

  // ── Cek semua tabel yang punya kolom gambar ──────────────────────────────
  const TABLES = [
    { table: 'fasilitas_foto', col: 'gambar', label: 'Foto Fasilitas' },
    { table: 'fasilitas',      col: 'gambar', label: 'Cover Fasilitas' },
    { table: 'galeri',         col: 'gambar', label: 'Galeri' },
    { table: 'guru',           col: 'foto',   label: 'Foto Guru' },
    { table: 'siswa',          col: 'foto',   label: 'Foto Siswa' },
    { table: 'berita',         col: 'gambar', label: 'Gambar Berita' },
    { table: 'artikel',        col: 'gambar', label: 'Gambar Artikel' },
    { table: 'agenda',         col: 'gambar', label: 'Gambar Agenda' },
    { table: 'slider',         col: 'gambar', label: 'Slider' },
    { table: 'jurusan',        col: 'gambar', label: 'Gambar Jurusan' },
    { table: 'alumni',         col: 'foto',   label: 'Foto Alumni' },
    { table: 'profil_konten',  col: 'foto',   label: 'Foto Profil' },
    { table: 'prestasi',       col: 'gambar', label: 'Gambar Prestasi' },
    { table: 'halaman',        col: 'gambar', label: 'Gambar Halaman' },
  ];

  let totalFixed = 0, totalBroken = 0;

  for (const { table, col, label } of TABLES) {
    // Cek tabel ada
    const [[exists]] = await db.query(
      `SELECT COUNT(*) as n FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?`, [table]
    );
    if (!exists.n) { console.log(`⚪ ${label}: tabel tidak ada`); continue; }

    const [rows] = await db.query(
      `SELECT id, \`${col}\` as val FROM \`${table}\` WHERE \`${col}\` IS NOT NULL AND \`${col}\`!=''`
    );

    let fixed = 0, broken = 0, ok = 0;

    for (const row of rows) {
      const fname = row.val;

      // ── Kasus 1: file sudah ada di disk ─────────────────────────────────
      if (diskFiles.has(fname)) { ok++; continue; }

      // ── Kasus 2: coba temukan versi .webp ───────────────────────────────
      const ext  = path.extname(fname).toLowerCase();
      const base = fname.slice(0, -ext.length);
      const webpName = `${base}.webp`;

      if (diskFiles.has(webpName)) {
        await db.query(`UPDATE \`${table}\` SET \`${col}\`=? WHERE id=?`, [webpName, row.id]);
        fixed++;
        continue;
      }

      // ── Kasus 3: coba semua ekstensi umum ───────────────────────────────
      const candidates = ['.webp', '.jpg', '.jpeg', '.png'].map(e => `${base}${e}`);
      const found = candidates.find(c => diskFiles.has(c));
      if (found) {
        await db.query(`UPDATE \`${table}\` SET \`${col}\`=? WHERE id=?`, [found, row.id]);
        fixed++;
        continue;
      }

      // ── Kasus 4: benar-benar hilang ──────────────────────────────────────
      console.log(`  ❌ [${table}] id=${row.id} hilang: ${fname}`);
      broken++;
    }

    totalFixed  += fixed;
    totalBroken += broken;

    if (fixed > 0 || broken > 0) {
      console.log(`${label}: ${ok} OK, ${fixed} diperbaiki, ${broken} hilang`);
    } else {
      console.log(`✅ ${label}: semua ${ok} file OK`);
    }
  }

  await db.end();
  console.log('\n' + '═'.repeat(50));
  console.log(`Total diperbaiki: ${totalFixed} | Total hilang: ${totalBroken}`);

  if (totalBroken > 0) {
    console.log('\n⚠️  File yang hilang tidak bisa dipulihkan tanpa backup VPS.');
    console.log('   Upload ulang gambar tersebut melalui halaman admin.');
  } else if (totalFixed > 0) {
    console.log('\n✅ Selesai! Restart server tidak diperlukan.');
    console.log('   Gambar seharusnya langsung tampil kembali.');
  } else {
    console.log('\n✅ Semua referensi sudah benar. Cek apakah file di uploads/ memang ada.');
    console.log('   Jalankan: ls uploads/ | head -20  untuk cek isi folder.');
  }
}

run().catch(err => { console.error('Error:', err.message); process.exit(1); });
