const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_db'
  });
  await c.execute(`
    CREATE TABLE IF NOT EXISTS halaman_galeri (
      id INT PRIMARY KEY AUTO_INCREMENT,
      halaman_id INT NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan VARCHAR(255),
      urutan INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (halaman_id) REFERENCES halaman(id) ON DELETE CASCADE
    )
  `);
  console.log('Tabel halaman_galeri berhasil dibuat');
  await c.end();
}
run().catch(console.error);
