const db = require('./config/database');

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS halaman (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        judul      VARCHAR(255) NOT NULL,
        slug       VARCHAR(255) NOT NULL UNIQUE,
        konten     LONGTEXT,
        foto       VARCHAR(255) NULL,
        status     ENUM('aktif','nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel halaman berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}
run();
