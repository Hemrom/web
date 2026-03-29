const mysql = require('mysql2/promise');
require('dotenv').config();

async function addWhatsappColumn() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_db'
  });

  try {
    await connection.execute(
      "ALTER TABLE profil_sekolah ADD COLUMN IF NOT EXISTS whatsapp VARCHAR(20) NULL AFTER telepon"
    );
    console.log('Kolom whatsapp berhasil ditambahkan ke profil_sekolah');
  } catch (err) {
    if (err.code === 'ER_DUP_FIELDNAME') {
      console.log('Kolom whatsapp sudah ada');
    } else {
      throw err;
    }
  } finally {
    await connection.end();
  }
}

addWhatsappColumn().catch(console.error);
