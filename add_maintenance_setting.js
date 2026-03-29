const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
  const c = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sekolah_db'
  });
  await c.execute(
    "INSERT IGNORE INTO website_settings (setting_key, setting_value) VALUES ('maintenance_mode', '0')"
  );
  console.log('maintenance_mode setting added');
  await c.end();
}
run().catch(console.error);
