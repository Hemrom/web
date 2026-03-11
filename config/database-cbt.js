const mysql = require('mysql2/promise');
require('dotenv').config();

// Koneksi ke database CBT
const cbtPool = mysql.createPool({
  host: process.env.CBT_DB_HOST || 'localhost',
  user: process.env.CBT_DB_USER || 'root',
  password: process.env.CBT_DB_PASSWORD || '',
  database: process.env.CBT_DB_NAME || 'cbt_kras',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = cbtPool;