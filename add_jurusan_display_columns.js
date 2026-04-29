const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_db'
  });

  try {
    await connection.execute(
      "ALTER TABLE jurusan ADD COLUMN IF NOT EXISTS icon VARCHAR(50) DEFAULT 'fas fa-graduation-cap' AFTER deskripsi"
    );
    await connection.execute(
      "ALTER TABLE jurusan ADD COLUMN IF NOT EXISTS warna VARCHAR(100) DEFAULT 'linear-gradient(135deg,#0ea5e9,#0369a1)' AFTER icon"
    );
    await connection.execute(
      "ALTER TABLE jurusan ADD COLUMN IF NOT EXISTS warna_badge VARCHAR(50) DEFAULT '#e0f2fe' AFTER warna"
    );
    await connection.execute(
      "ALTER TABLE jurusan ADD COLUMN IF NOT EXISTS warna_teks_badge VARCHAR(50) DEFAULT '#0369a1' AFTER warna_badge"
    );

    // Update existing data with appropriate colors/icons
    await connection.execute("UPDATE jurusan SET icon='fas fa-network-wired', warna='linear-gradient(135deg,#0ea5e9,#0369a1)', warna_badge='#e0f2fe', warna_teks_badge='#0369a1' WHERE kode='TKJ'");
    await connection.execute("UPDATE jurusan SET icon='fas fa-car', warna='linear-gradient(135deg,#f59e0b,#d97706)', warna_badge='#fef3c7', warna_teks_badge='#d97706' WHERE kode='TKR'");
    await connection.execute("UPDATE jurusan SET icon='fas fa-utensils', warna='linear-gradient(135deg,#ef4444,#dc2626)', warna_badge='#fee2e2', warna_teks_badge='#dc2626' WHERE kode LIKE '%Kuliner%' OR nama LIKE '%Kuliner%'");
    await connection.execute("UPDATE jurusan SET icon='fas fa-snowflake', warna='linear-gradient(135deg,#10b981,#059669)', warna_badge='#d1fae5', warna_teks_badge='#059669' WHERE kode='TPTUP'");

    console.log('Migrasi berhasil: kolom icon, warna, warna_badge, warna_teks_badge ditambahkan ke tabel jurusan');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Kolom sudah ada');
    } else {
      throw err;
    }
  } finally {
    await connection.end();
  }
}

migrate().catch(console.error);

