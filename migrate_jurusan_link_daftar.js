/**
 * Migrasi: Tambah kolom link_daftar ke tabel jurusan
 * Jalankan: node migrate_jurusan_link_daftar.js
 */
const db = require('./config/database');

async function migrate() {
  try {
    await db.query(`
      ALTER TABLE jurusan
      ADD COLUMN IF NOT EXISTS link_daftar VARCHAR(255) DEFAULT '/spmb' AFTER warna_teks_badge
    `);
    console.log('✅ Kolom link_daftar berhasil ditambahkan');

    // Set default untuk semua jurusan yang sudah ada
    await db.query(`UPDATE jurusan SET link_daftar='/spmb' WHERE link_daftar IS NULL OR link_daftar=''`);
    console.log('✅ Default link_daftar = /spmb untuk semua jurusan');

    console.log('\n✅ Migrasi selesai!');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('⚠️  Kolom link_daftar sudah ada, dilewati');
    } else {
      console.error('❌ Error:', err.message);
    }
  } finally {
    process.exit(0);
  }
}

migrate();
