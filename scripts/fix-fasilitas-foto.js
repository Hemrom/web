/**
 * fix-fasilitas-foto.js
 *
 * Diagnosa + repair SEMUA tabel yang punya kolom gambar/foto.
 * Memperbaiki referensi yang masih .jpg/.png padahal file sudah jadi .webp
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

  // Semua file di disk
  const diskFiles = new Set(fs.readdirSync(UPLOADS));
  console.log(`📁 Total file di disk: ${diskFiles.size}\n`);

  // ── Semua tabel yang punya kolom gambar/foto ──────────────────────────────
  const TABLES = [
    { table: 'fasilitas_foto',        col: 'gambar', label: 'Foto Fasilitas' },
    { table: 'fasilitas',             col: 'gambar', label: 'Cover Fasilitas' },
    { table: 'galeri',                col: 'gambar', label: 'Galeri' },
    { table: 'guru',                  col: 'foto',   label: 'Foto Guru' },
    { table: 'siswa',                 col: 'foto',   label: 'Foto Siswa' },
    { table: 'berita',                col: 'gambar', label: 'Gambar Berita' },
    { table: 'artikel',               col: 'gambar', label: 'Gambar Artikel' },
    { table: 'agenda',                col: 'gambar', label: 'Gambar Agenda' },
    { table: 'slider',                col: 'gambar', label: 'Slider' },
    { table: 'jurusan',               col: 'gambar', label: 'Gambar Jurusan' },
    { table: 'alumni',                col: 'foto',   label: 'Foto Alumni' },
    { table: 'profil_konten',         col: 'foto',   label: 'Foto Profil' },
    { table: 'prestasi',              col: 'gambar', label: 'Gambar Prestasi' },
    { table: 'halaman',               col: 'gambar', label: 'Gambar Halaman' },
    { table: 'halaman_galeri',        col: 'gambar', label: 'Galeri Halaman' },
    { table: 'link_terkait',          col: 'logo',   label: 'Logo Link Terkait' },
    // BKK
    { table: 'bkk_lowongan',          col: 'gambar', label: 'Gambar BKK' },
    // OSIS
    { table: 'osis_kegiatan',         col: 'gambar', label: 'Gambar OSIS Kegiatan' },
    { table: 'osis_berita',           col: 'gambar', label: 'Gambar OSIS Berita' },
    { table: 'osis_galeri',           col: 'gambar', label: 'Galeri OSIS' },
    // Pramuka
    { table: 'pramuka_kegiatan',      col: 'gambar', label: 'Gambar Pramuka Kegiatan' },
    { table: 'pramuka_berita',        col: 'gambar', label: 'Gambar Pramuka Berita' },
    { table: 'pramuka_galeri',        col: 'gambar', label: 'Galeri Pramuka' },
    // Olahraga
    { table: 'olahraga_kegiatan',     col: 'gambar', label: 'Gambar Olahraga Kegiatan' },
    { table: 'olahraga_berita',       col: 'gambar', label: 'Gambar Olahraga Berita' },
    { table: 'olahraga_galeri',       col: 'gambar', label: 'Galeri Olahraga' },
    // Paskibraka
    { table: 'paskibraka_kegiatan',   col: 'gambar', label: 'Gambar Paskibraka Kegiatan' },
    { table: 'paskibraka_berita',     col: 'gambar', label: 'Gambar Paskibraka Berita' },
    { table: 'paskibraka_galeri',     col: 'gambar', label: 'Galeri Paskibraka' },
    // Seni
    { table: 'seni_kegiatan',         col: 'gambar', label: 'Gambar Seni Kegiatan' },
    { table: 'seni_berita',           col: 'gambar', label: 'Gambar Seni Berita' },
    { table: 'seni_galeri',           col: 'gambar', label: 'Galeri Seni' },
    // Bahasa Asing
    { table: 'bahasa_asing_kegiatan', col: 'gambar', label: 'Gambar B.Asing Kegiatan' },
    { table: 'bahasa_asing_berita',   col: 'gambar', label: 'Gambar B.Asing Berita' },
    { table: 'bahasa_asing_galeri',   col: 'gambar', label: 'Galeri B.Asing' },
    // Rohis
    { table: 'rohis_kegiatan',        col: 'gambar', label: 'Gambar Rohis Kegiatan' },
    { table: 'rohis_berita',          col: 'gambar', label: 'Gambar Rohis Berita' },
    { table: 'rohis_galeri',          col: 'gambar', label: 'Galeri Rohis' },
    // PMR
    { table: 'pmr_kegiatan',          col: 'gambar', label: 'Gambar PMR Kegiatan' },
    { table: 'pmr_berita',            col: 'gambar', label: 'Gambar PMR Berita' },
    { table: 'pmr_galeri',            col: 'gambar', label: 'Galeri PMR' },
    // PIK-R
    { table: 'pikr_kegiatan',         col: 'gambar', label: 'Gambar PIK-R Kegiatan' },
    { table: 'pikr_berita',           col: 'gambar', label: 'Gambar PIK-R Berita' },
    { table: 'pikr_galeri',           col: 'gambar', label: 'Galeri PIK-R' },
    // Pecinta Alam
    { table: 'pecinta_alam_kegiatan', col: 'gambar', label: 'Gambar PA Kegiatan' },
    { table: 'pecinta_alam_berita',   col: 'gambar', label: 'Gambar PA Berita' },
    { table: 'pecinta_alam_galeri',   col: 'gambar', label: 'Galeri PA' },
    // Pencak Silat
    { table: 'pencak_silat_kegiatan', col: 'gambar', label: 'Gambar Silat Kegiatan' },
    { table: 'pencak_silat_berita',   col: 'gambar', label: 'Gambar Silat Berita' },
    { table: 'pencak_silat_galeri',   col: 'gambar', label: 'Galeri Silat' },
    // Jurusan
    { table: 'jurusan_berita',        col: 'gambar', label: 'Gambar Berita Jurusan' },
    { table: 'jurusan_galeri',        col: 'gambar', label: 'Galeri Jurusan' },
    { table: 'jurusan_fasilitas',     col: 'gambar', label: 'Gambar Fasilitas Jurusan' },
  ];

  let totalFixed = 0, totalBroken = 0;

  for (const { table, col, label } of TABLES) {
    // Cek tabel ada — kalau tidak ada, skip tanpa error
    let exists;
    try {
      [[exists]] = await db.query(
        `SELECT COUNT(*) as n FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?`, [table]
      );
    } catch(e) { console.log(`⚪ ${label}: skip (${e.message})`); continue; }

    if (!exists.n) { console.log(`⚪ ${label}: tabel tidak ada`); continue; }

    // Ambil semua record yang punya nilai di kolom ini
    let rows;
    try {
      [rows] = await db.query(
        `SELECT id, \`${col}\` as val FROM \`${table}\` WHERE \`${col}\` IS NOT NULL AND \`${col}\`!=''`
      );
    } catch(e) { console.log(`⚠️  ${label}: error baca (${e.message})`); continue; }

    let fixed = 0, broken = 0, ok = 0;

    for (const row of rows) {
      const fname = row.val;

      // Sudah benar — file ada di disk
      if (diskFiles.has(fname)) { ok++; continue; }

      const ext  = path.extname(fname).toLowerCase();
      const base = fname.slice(0, -ext.length);

      // Coba semua kemungkinan ekstensi
      const candidates = [`${base}.webp`, `${base}.jpg`, `${base}.jpeg`, `${base}.png`];
      const found = candidates.find(c => diskFiles.has(c));

      if (found) {
        try {
          await db.query(`UPDATE \`${table}\` SET \`${col}\`=? WHERE id=?`, [found, row.id]);
          fixed++;
        } catch(e) {
          console.log(`  ⚠️  Gagal update [${table}] id=${row.id}: ${e.message}`);
        }
      } else {
        broken++;
        if (broken <= 5) console.log(`  ❌ [${table}] id=${row.id} hilang: ${fname}`);
      }
    }

    totalFixed  += fixed;
    totalBroken += broken;

    if (fixed > 0 || broken > 0) {
      console.log(`🔧 ${label}: ${ok} OK, ${fixed} diperbaiki, ${broken} hilang`);
    } else {
      console.log(`✅ ${label}: semua ${ok} file OK`);
    }
  }

  await db.end();
  console.log('\n' + '═'.repeat(50));
  console.log(`Total diperbaiki: ${totalFixed} | Total hilang: ${totalBroken}`);
  if (totalFixed > 0) {
    console.log('\n✅ Selesai! Restart PM2 agar cache server di-reset:');
    console.log('   pm2 restart smkn1kras');
  }
}

run().catch(err => { console.error('Error fatal:', err.message); process.exit(1); });
