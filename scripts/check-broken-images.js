/**
 * check-broken-images.js
 * 
 * Cek berapa banyak referensi gambar yang rusak di DB vs disk.
 * Jalankan DULU sebelum fix untuk lihat situasinya.
 * 
 * Jalankan: node scripts/check-broken-images.js
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const UPLOADS = path.join(__dirname, '..', 'uploads');

const TABLES = [
  { table: 'osis_kegiatan',         col: 'gambar' },
  { table: 'osis_berita',           col: 'gambar' },
  { table: 'osis_galeri',           col: 'gambar' },
  { table: 'pramuka_kegiatan',      col: 'gambar' },
  { table: 'pramuka_berita',        col: 'gambar' },
  { table: 'pramuka_galeri',        col: 'gambar' },
  { table: 'olahraga_kegiatan',     col: 'gambar' },
  { table: 'olahraga_berita',       col: 'gambar' },
  { table: 'olahraga_galeri',       col: 'gambar' },
  { table: 'paskibraka_kegiatan',   col: 'gambar' },
  { table: 'paskibraka_berita',     col: 'gambar' },
  { table: 'paskibraka_galeri',     col: 'gambar' },
  { table: 'seni_kegiatan',         col: 'gambar' },
  { table: 'seni_berita',           col: 'gambar' },
  { table: 'seni_galeri',           col: 'gambar' },
  { table: 'bahasa_asing_kegiatan', col: 'gambar' },
  { table: 'bahasa_asing_berita',   col: 'gambar' },
  { table: 'bahasa_asing_galeri',   col: 'gambar' },
  { table: 'rohis_kegiatan',        col: 'gambar' },
  { table: 'rohis_berita',          col: 'gambar' },
  { table: 'rohis_galeri',          col: 'gambar' },
  { table: 'pmr_kegiatan',          col: 'gambar' },
  { table: 'pmr_berita',            col: 'gambar' },
  { table: 'pmr_galeri',            col: 'gambar' },
  { table: 'pikr_kegiatan',         col: 'gambar' },
  { table: 'pikr_berita',           col: 'gambar' },
  { table: 'pikr_galeri',           col: 'gambar' },
  { table: 'pecinta_alam_kegiatan', col: 'gambar' },
  { table: 'pecinta_alam_berita',   col: 'gambar' },
  { table: 'pecinta_alam_galeri',   col: 'gambar' },
  { table: 'pencak_silat_kegiatan', col: 'gambar' },
  { table: 'pencak_silat_berita',   col: 'gambar' },
  { table: 'pencak_silat_galeri',   col: 'gambar' },
  { table: 'jurusan_galeri',        col: 'gambar' },
  { table: 'jurusan_berita',        col: 'gambar' },
  { table: 'bkk_lowongan',          col: 'gambar' },
];

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME, charset: 'utf8mb4',
  });

  const diskFiles = new Set(fs.readdirSync(UPLOADS));
  console.log(`📁 File di disk: ${diskFiles.size}\n`);

  let totalBroken = 0;

  for (const { table, col } of TABLES) {
    try {
      const [[exists]] = await db.query(
        `SELECT COUNT(*) as n FROM information_schema.TABLES WHERE TABLE_SCHEMA=DATABASE() AND TABLE_NAME=?`, [table]
      );
      if (!exists.n) continue;

      const [rows] = await db.query(
        `SELECT id, \`${col}\` as val FROM \`${table}\` WHERE \`${col}\` IS NOT NULL AND \`${col}\`!=''`
      );

      const broken = rows.filter(r => !diskFiles.has(r.val));
      if (broken.length > 0) {
        totalBroken += broken.length;
        console.log(`❌ ${table}.${col}: ${broken.length} rusak dari ${rows.length} total`);
        // Tampilkan 3 contoh
        broken.slice(0,3).forEach(r => {
          const base = r.val.replace(/\.[^.]+$/, '');
          const webp = `${base}.webp`;
          const hasWebp = diskFiles.has(webp);
          console.log(`   id=${r.id}: "${r.val}" → webp ${hasWebp ? '✅ ADA' : '❌ TIDAK ADA'}`);
        });
      } else if (rows.length > 0) {
        console.log(`✅ ${table}: ${rows.length} OK`);
      }
    } catch(e) {
      // skip tabel yang tidak ada
    }
  }

  await db.end();
  console.log(`\nTotal referensi rusak: ${totalBroken}`);
}

run().catch(e => { console.error(e.message); process.exit(1); });
