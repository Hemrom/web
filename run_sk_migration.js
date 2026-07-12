/**
 * run_sk_migration.js
 * Jalankan sekali: node run_sk_migration.js
 * Membuat tabel sk_guru dan sk_guru_penerima di database sekolah_db
 */

require('dotenv').config();
const db = require('./config/database');

async function run() {
  console.log('🚀 Menjalankan migrasi tabel SK Guru...');

  try {
    // Tabel utama sk_guru
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`sk_guru\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`judul\` varchar(255) NOT NULL COMMENT 'Judul/nama SK',
        \`jenis\` enum('sk_mengajar','sk_tugas_tambahan','lainnya') NOT NULL DEFAULT 'sk_mengajar',
        \`nomor_sk\` varchar(100) DEFAULT NULL,
        \`tahun_ajaran\` varchar(20) DEFAULT NULL,
        \`tanggal_sk\` date DEFAULT NULL,
        \`deskripsi\` text DEFAULT NULL,
        \`nama_file\` varchar(255) NOT NULL,
        \`nama_file_asli\` varchar(255) DEFAULT NULL,
        \`ukuran_file\` varchar(30) DEFAULT NULL,
        \`tipe_file\` varchar(10) DEFAULT NULL,
        \`status\` enum('aktif','nonaktif') DEFAULT 'aktif',
        \`dibuat_oleh\` int(11) DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
        PRIMARY KEY (\`id\`),
        KEY \`idx_jenis\` (\`jenis\`),
        KEY \`idx_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Tabel sk_guru berhasil dibuat (atau sudah ada).');

    // Tabel relasi sk_guru_penerima
    await db.query(`
      CREATE TABLE IF NOT EXISTS \`sk_guru_penerima\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        \`sk_id\` int(11) NOT NULL,
        \`guru_id\` int(11) NOT NULL,
        \`dibaca\` tinyint(1) DEFAULT 0,
        \`tanggal_dibaca\` datetime DEFAULT NULL,
        \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`unique_sk_guru\` (\`sk_id\`,\`guru_id\`),
        KEY \`idx_guru_id\` (\`guru_id\`),
        CONSTRAINT \`fk_skp_sk\` FOREIGN KEY (\`sk_id\`) REFERENCES \`sk_guru\` (\`id\`) ON DELETE CASCADE,
        CONSTRAINT \`fk_skp_guru\` FOREIGN KEY (\`guru_id\`) REFERENCES \`guru\` (\`id\`) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    console.log('✅ Tabel sk_guru_penerima berhasil dibuat (atau sudah ada).');

    console.log('\n🎉 Migrasi selesai! Fitur SK Guru siap digunakan.');
    console.log('   Admin: http://localhost:3000/admin/sk-guru');
    console.log('   Guru : http://localhost:3000/guru/sk-saya');
  } catch (err) {
    console.error('❌ Migrasi gagal:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

run();
