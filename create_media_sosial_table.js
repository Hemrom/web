const mysql = require('mysql2/promise');
require('dotenv').config();

async function createMediaSosialTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });

    console.log('Connected to database');

    // Create media_sosial table
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS media_sosial (
        id INT PRIMARY KEY AUTO_INCREMENT,
        judul VARCHAR(255) NOT NULL,
        deskripsi TEXT,
        platform ENUM('tiktok', 'youtube', 'instagram', 'facebook', 'twitter') NOT NULL,
        embed_url TEXT NOT NULL,
        thumbnail VARCHAR(255),
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        urutan INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;

    await connection.execute(createTableQuery);
    console.log('Table media_sosial created successfully');

    // Insert sample data
    const insertSampleData = `
      INSERT INTO media_sosial (judul, deskripsi, platform, embed_url, urutan, status) VALUES 
      ('Kegiatan Prakerin Siswa', 'Dokumentasi kegiatan praktek kerja industri siswa SMK Negeri 1 Kras', 'tiktok', 'https://www.tiktok.com/@smkn1kras/video/1234567890', 1, 'aktif'),
      ('Lomba Kompetensi Siswa', 'Persiapan siswa mengikuti lomba kompetensi tingkat provinsi', 'youtube', 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', 2, 'aktif'),
      ('Kegiatan Ekstrakurikuler', 'Berbagai kegiatan ekstrakurikuler yang ada di sekolah', 'instagram', 'https://www.instagram.com/p/ABC123/', 3, 'aktif')
      ON DUPLICATE KEY UPDATE id=id
    `;

    await connection.execute(insertSampleData);
    console.log('Sample data inserted successfully');

    await connection.end();
    console.log('Database connection closed');
    console.log('Media sosial table setup completed!');

  } catch (error) {
    console.error('Error:', error);
  }
}

createMediaSosialTable();