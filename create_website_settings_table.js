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
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS website_settings (
        id INT PRIMARY KEY AUTO_INCREMENT,
        setting_key VARCHAR(50) UNIQUE NOT NULL,
        setting_value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Default settings
    const defaults = [
      ['theme_mode', 'light'],
      ['primary_color', '#0ea5e9'],
      ['secondary_color', '#0369a1'],
      ['navbar_bg', '#ffffff'],
      ['footer_bg', '#0f172a'],
    ];

    for (const [key, value] of defaults) {
      await connection.execute(
        'INSERT IGNORE INTO website_settings (setting_key, setting_value) VALUES (?, ?)',
        [key, value]
      );
    }

    console.log('Tabel website_settings berhasil dibuat');
  } finally {
    await connection.end();
  }
}

migrate().catch(console.error);
