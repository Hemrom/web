/**
 * diagnose-uploads.js
 *
 * Diagnosa lengkap: cari tahu file mana di DB yang tidak ditemukan di disk,
 * dan file mana di disk yang tidak ada referensinya di DB.
 *
 * Jalankan: node scripts/diagnose-uploads.js
 * Output: laporan detail + file diagnose-result.json
 */
require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

const UPLOADS = path.join(__dirname, '..', 'uploads');

const TARGETS = [
  { table: 'galeri',        column: 'gambar' },
  { table: 'guru',          column: 'foto'   },
  { table: 'siswa',         column: 'foto'   },
  { table: 'berita',        column: 'gambar' },
  { table: 'artikel',       column: 'gambar' },
  { table: 'agenda',        column: 'gambar' },
  { table: 'slider',        column: 'gambar' },
  { table: 'jurusan',       column: 'gambar' },
  { table: 'fasilitas',     column: 'gambar' },
  { table: 'fasilitas_foto',column: 'gambar' },
  { table: 'alumni',        column: 'foto'   },
  { table: 'profil_konten', column: 'foto'   },
  { table: 'link_terkait',  column: 'gambar' },
  { table: 'halaman',       column: 'gambar' },
  { table: 'file_download', column: 'thumbnail' },
  { table: 'prestasi',      column: 'gambar' },
];

async function run() {
  const db = await mysql.createConnection({
    host: process.env.DB_HOST, user: process.env.DB_USER,
    password: process.env.DB_PASSWORD, database: process.env.DB_NAME, charset: 'utf8mb4',
  });
  console.log('✅ DB connected\n');

  // Semua file yang ada di disk
  const diskFiles = new Set(
    fs.readdirSync(UPLOADS).filter(f => !f.startsWith('.'))
  );
  console.log(`📁 Total file di disk: ${diskFiles.size}\n`);

  const broken    = []; // di DB tapi tidak ada di disk
  const fixable   = []; // di DB dengan ext lama, tapi versi .webp ada di disk
  const dbRefs    = new Set();

  for (const { table, column } of TARGETS) {
    const [tables] = await db.query(
      `SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA=? AND TABLE_NAME=?`,
      [process.env.DB_NAME, table]
    );
    if (!tables.length) continue;

    const [rows] = await db.query(
      `SELECT id, \`${column}\` as val FROM \`${table}\` WHERE \`${column}\` IS NOT NULL AND \`${column}\` != ''`
    );

    for (const row of rows) {
      const fname = row.val;
      dbRefs.add(fname);

      if (diskFiles.has(fname)) continue; // OK

      // Coba versi .webp
      const ext = path.extname(fname).toLowerCase();
      const base = fname.slice(0, -ext.length);
      const webpName = `${base}.webp`;

      if (diskFiles.has(webpName)) {
        fixable.push({ table, column, id: row.id, old: fname, new: webpName });
      } else {
        broken.push({ table, column, id: row.id, file: fname });
      }
    }
  }

  // File di disk yang tidak ada di DB (orphan)
  const orphans = [...diskFiles].filter(f => !dbRefs.has(f) && /\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  await db.end();

  console.log('═'.repeat(60));
  console.log(`✅ OK (ada di DB & disk): ${dbRefs.size - broken.length - fixable.length}`);
  console.log(`🔧 FIXABLE (versi .webp ada di disk): ${fixable.length}`);
  console.log(`❌ BROKEN (hilang dari disk): ${broken.length}`);
  console.log(`🗑️  ORPHAN (ada di disk, tidak ada di DB): ${orphans.length}`);
  console.log('═'.repeat(60));

  if (fixable.length) {
    console.log('\n🔧 Yang bisa diperbaiki otomatis:');
    fixable.slice(0, 20).forEach(f => console.log(`  [${f.table}] id=${f.id}  ${f.old} → ${f.new}`));
    if (fixable.length > 20) console.log(`  ... dan ${fixable.length - 20} lainnya`);
  }
  if (broken.length) {
    console.log('\n❌ File hilang (tidak bisa dipulihkan tanpa backup):');
    broken.slice(0, 20).forEach(f => console.log(`  [${f.table}] id=${f.id}  ${f.file}`));
    if (broken.length > 20) console.log(`  ... dan ${broken.length - 20} lainnya`);
  }

  // Simpan hasil lengkap ke JSON
  const result = { fixable, broken, orphans };
  fs.writeFileSync(path.join(__dirname, '..', 'diagnose-result.json'), JSON.stringify(result, null, 2));
  console.log('\n📄 Hasil lengkap tersimpan di: diagnose-result.json');

  if (fixable.length > 0) {
    console.log('\n💡 Jalankan: node scripts/repair-webp-refs.js  untuk memperbaiki yang fixable');
  }
}

run().catch(err => { console.error(err.message); process.exit(1); });
