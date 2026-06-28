/**
 * Migrasi: Tambah kolom status dan updated_at ke tabel siswa jika belum ada
 * Jalankan sekali: node migrate_siswa_columns.js
 */
require('dotenv').config();
const db = require('./config/database');

async function migrate() {
  try {
    // Cek kolom yang sudah ada
    const [cols] = await db.query('DESCRIBE siswa');
    const existingCols = cols.map(c => c.Field);
    console.log('Kolom saat ini:', existingCols.join(', '));

    const toAdd = [];

    if (!existingCols.includes('status')) {
      toAdd.push("ADD COLUMN `status` ENUM('aktif','nonaktif') NOT NULL DEFAULT 'aktif' AFTER `foto`");
    }
    if (!existingCols.includes('updated_at')) {
      toAdd.push('ADD COLUMN `updated_at` TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP AFTER `created_at`');
    }

    if (toAdd.length === 0) {
      console.log('✅ Semua kolom sudah ada, tidak perlu migrasi.');
    } else {
      const sql = `ALTER TABLE siswa ${toAdd.join(', ')}`;
      console.log('Menjalankan:', sql);
      await db.query(sql);
      console.log('✅ Migrasi berhasil! Kolom ditambahkan:', toAdd.length);
    }
  } catch (err) {
    console.error('❌ Gagal migrasi:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
