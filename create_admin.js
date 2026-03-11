const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function createAdmin() {
  try {
    // Koneksi ke database
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'sekolah_db'
    });

    console.log('Connected to database');

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log('Password hash:', hashedPassword);

    // Cek apakah user admin sudah ada
    const [existing] = await connection.execute('SELECT * FROM users WHERE username = ?', ['admin']);
    
    if (existing.length > 0) {
      // Update password yang sudah ada
      await connection.execute(
        'UPDATE users SET password = ? WHERE username = ?',
        [hashedPassword, 'admin']
      );
      console.log('Admin password updated successfully!');
    } else {
      // Insert user admin baru
      await connection.execute(
        'INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
        ['admin', hashedPassword, 'Administrator', 'admin@sekolah.com', 'admin']
      );
      console.log('Admin user created successfully!');
    }

    // Test login
    const [users] = await connection.execute('SELECT * FROM users WHERE username = ?', ['admin']);
    if (users.length > 0) {
      const isValid = await bcrypt.compare('admin123', users[0].password);
      console.log('Login test result:', isValid ? 'SUCCESS' : 'FAILED');
    }

    await connection.end();
    console.log('\nLogin credentials:');
    console.log('Username: admin');
    console.log('Password: admin123');
    
  } catch (error) {
    console.error('Error:', error.message);
    
    if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n❌ Database "sekolah_db" tidak ditemukan!');
      console.log('Silakan jalankan script SQL di file config/database.sql terlebih dahulu.');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n❌ Tidak bisa connect ke MySQL!');
      console.log('Pastikan MySQL service sudah running.');
    }
  }
}

createAdmin();