const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_db'
  });
  try {
    await c.execute(
      "ALTER TABLE media_sosial MODIFY COLUMN platform ENUM('tiktok','youtube','instagram','facebook','twitter','threads') NOT NULL"
    );
    console.log('Platform threads berhasil ditambahkan ke tabel media_sosial');
  } catch (e) {
    console.log(e.message);
  }
  await c.end();
}
run().catch(console.error);
