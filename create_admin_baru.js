const bcrypt = require('bcryptjs');
const db = require('./config/database');

async function createAdmin() {
  try {
    const password = 'admin123';
    const hash = await bcrypt.hash(password, 10);
    
    // Hapus admin lama jika ada, lalu buat baru
    await db.query('DELETE FROM users WHERE username = ?', ['adminbaru']);
    await db.query(
      'INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
      ['adminbaru', hash, 'Administrator', 'admin@sekolah.com', 'admin']
    );
    
    console.log('✅ Admin berhasil dibuat!');
    console.log('Username: adminbaru');
    console.log('Password: admin123');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

createAdmin();
