const mysql = require('mysql2/promise');
require('dotenv').config();

async function createSliderTable() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });

    console.log('Connected to database...');

    // Create slider table
    await connection.query(`
      CREATE TABLE IF NOT EXISTS slider (
        id INT PRIMARY KEY AUTO_INCREMENT,
        judul VARCHAR(255) NOT NULL,
        subjudul TEXT,
        deskripsi TEXT,
        gambar VARCHAR(255) NOT NULL,
        link_url VARCHAR(255),
        link_text VARCHAR(100),
        urutan INT DEFAULT 0,
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabel slider berhasil dibuat');

    // Check if slider table is empty
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM slider');
    
    if (rows[0].count === 0) {
      // Insert sample data
      await connection.query(`
        INSERT INTO slider (judul, subjudul, deskripsi, gambar, link_url, link_text, urutan, status) VALUES 
        ('Membangun Masa Depan Melalui Pendidikan', 'Selamat Datang di Website Resmi Kami', 'Menciptakan generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan dengan pendidikan berkualitas tinggi.', 'slider1.jpg', '/profil', 'Pelajari Lebih Lanjut', 1, 'aktif'),
        ('Fasilitas Modern untuk Pembelajaran Optimal', 'Teknologi Terdepan', 'Dilengkapi dengan laboratorium komputer, perpustakaan digital, dan fasilitas pembelajaran modern lainnya untuk mendukung proses belajar mengajar.', 'slider2.jpg', '/galeri', 'Lihat Fasilitas', 2, 'aktif'),
        ('Prestasi Gemilang di Berbagai Bidang', 'Kebanggaan Sekolah', 'Meraih berbagai prestasi di tingkat regional dan nasional dalam bidang akademik, olahraga, dan seni budaya.', 'slider3.jpg', '/berita', 'Lihat Prestasi', 3, 'aktif')
      `);
      console.log('✓ Sample data slider berhasil ditambahkan');
    } else {
      console.log('✓ Tabel slider sudah berisi data');
    }

    await connection.end();
    console.log('\n✅ Setup slider table selesai!');
    console.log('Silakan restart server dengan: node server.js');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createSliderTable();
