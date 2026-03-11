const mysql = require('mysql2/promise');
require('dotenv').config();

async function createPresensiTables() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });

    console.log('Connected to database');

    // Create siswa table
    const createSiswaTable = `
      CREATE TABLE IF NOT EXISTS siswa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nis VARCHAR(20) UNIQUE NOT NULL,
        nama VARCHAR(100) NOT NULL,
        kelas VARCHAR(20) NOT NULL,
        jurusan VARCHAR(50),
        foto VARCHAR(255),
        face_descriptor TEXT,
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createSiswaTable);
    console.log('✓ Table siswa created successfully');

    // Create presensi table
    const createPresensiTable = `
      CREATE TABLE IF NOT EXISTS presensi (
        id INT PRIMARY KEY AUTO_INCREMENT,
        siswa_id INT NOT NULL,
        tanggal DATE NOT NULL,
        waktu_masuk TIME,
        waktu_keluar TIME,
        status ENUM('hadir', 'izin', 'sakit', 'alpha') DEFAULT 'hadir',
        keterangan TEXT,
        foto_presensi VARCHAR(255),
        metode ENUM('face_recognition', 'manual') DEFAULT 'face_recognition',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
        UNIQUE KEY unique_presensi (siswa_id, tanggal)
      )
    `;

    await connection.execute(createPresensiTable);
    console.log('✓ Table presensi created successfully');

    // Insert sample data
    const insertSampleSiswa = `
      INSERT INTO siswa (nis, nama, kelas, jurusan, status) VALUES 
      ('2024001', 'Ahmad Fauzi', 'XII RPL 1', 'Rekayasa Perangkat Lunak', 'aktif'),
      ('2024002', 'Siti Nurhaliza', 'XII RPL 1', 'Rekayasa Perangkat Lunak', 'aktif'),
      ('2024003', 'Budi Santoso', 'XII TKJ 1', 'Teknik Komputer Jaringan', 'aktif'),
      ('2024004', 'Dewi Lestari', 'XII MM 1', 'Multimedia', 'aktif'),
      ('2024005', 'Eko Prasetyo', 'XII RPL 2', 'Rekayasa Perangkat Lunak', 'aktif')
      ON DUPLICATE KEY UPDATE id=id
    `;

    await connection.execute(insertSampleSiswa);
    console.log('✓ Sample siswa data inserted successfully');

    // Create folders for uploads
    const fs = require('fs');
    const folders = ['uploads/siswa', 'uploads/presensi'];
    
    folders.forEach(folder => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✓ Created folder: ${folder}`);
      }
    });

    await connection.end();
    console.log('\n✅ Database setup completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Download face-api.js models to public/models/');
    console.log('2. Implement controllers and views');
    console.log('3. Test face recognition with sample students');

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createPresensiTables();