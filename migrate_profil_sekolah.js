const db = require('./config/database');

async function run() {
  const columns = [
    "ALTER TABLE profil_sekolah ADD COLUMN npsn VARCHAR(20) NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN status VARCHAR(50) NULL COMMENT 'Negeri/Swasta'",
    "ALTER TABLE profil_sekolah ADD COLUMN jenjang VARCHAR(20) NULL COMMENT 'SD/SMP/SMA/SMK'",
    "ALTER TABLE profil_sekolah ADD COLUMN akreditasi VARCHAR(10) NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN no_sk_akreditasi VARCHAR(100) NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN sk_pendirian VARCHAR(100) NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN tanggal_sk DATE NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN sk_izin VARCHAR(100) NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN tanggal_sk_izin DATE NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN maps TEXT NULL",
    "ALTER TABLE profil_sekolah ADD COLUMN website VARCHAR(255) NULL",
  ];

  for (const sql of columns) {
    await db.query(sql).catch(err => {
      if (err.code === 'ER_DUP_FIELDNAME') {
        console.log(`ℹ️  Kolom sudah ada, skip: ${sql.match(/ADD COLUMN (\w+)/)[1]}`);
      } else {
        throw err;
      }
    });
  }

  console.log('✅ Migrasi profil_sekolah selesai.');
  process.exit(0);
}

run().catch(err => { console.error('❌', err.message); process.exit(1); });
