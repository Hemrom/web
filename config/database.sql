CREATE DATABASE IF NOT EXISTS sekolah_db;
USE sekolah_db;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  nama_lengkap VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  role ENUM('admin', 'guru') DEFAULT 'guru',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profil_sekolah (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama_sekolah VARCHAR(200) NOT NULL,
  alamat TEXT,
  telepon VARCHAR(20),
  email VARCHAR(100),
  visi TEXT,
  misi TEXT,
  logo VARCHAR(255),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS berita (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  konten TEXT NOT NULL,
  gambar VARCHAR(255),
  penulis_id INT,
  kategori ENUM('pengumuman', 'kegiatan', 'prestasi', 'umum') DEFAULT 'umum',
  status ENUM('draft', 'published') DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (penulis_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS galeri (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  gambar VARCHAR(255) NOT NULL,
  kategori VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guru (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nip VARCHAR(50) UNIQUE,
  nama VARCHAR(100) NOT NULL,
  foto VARCHAR(255),
  mata_pelajaran VARCHAR(100),
  jabatan VARCHAR(100),
  email VARCHAR(100),
  telepon VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

CREATE TABLE IF NOT EXISTS kontak_masuk (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL,
  subjek VARCHAR(200),
  pesan TEXT NOT NULL,
  status ENUM('baru', 'dibaca', 'dibalas') DEFAULT 'baru',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
);

INSERT INTO users (username, password, nama_lengkap, email, role) 
VALUES ('admin', '$2a$10$8K1p/a0dL3LcrmtS97IYCOYz6TtxMQJqhN9/LfHMto0qvjE8qLWZi', 'Administrator', 'admin@sekolah.com', 'admin');
-- Password default: admin123

INSERT INTO slider (judul, subjudul, deskripsi, gambar, link_url, link_text, urutan, status) VALUES 
('Membangun Masa Depan Melalui Pendidikan', 'Selamat Datang di Website Resmi Kami', 'Menciptakan generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan dengan pendidikan berkualitas tinggi.', 'slider1.jpg', '/profil', 'Pelajari Lebih Lanjut', 1, 'aktif'),
('Fasilitas Modern untuk Pembelajaran Optimal', 'Teknologi Terdepan', 'Dilengkapi dengan laboratorium komputer, perpustakaan digital, dan fasilitas pembelajaran modern lainnya untuk mendukung proses belajar mengajar.', 'slider2.jpg', '/galeri', 'Lihat Fasilitas', 2, 'aktif'),
('Prestasi Gemilang di Berbagai Bidang', 'Kebanggaan Sekolah', 'Meraih berbagai prestasi di tingkat regional dan nasional dalam bidang akademik, olahraga, dan seni budaya.', 'slider3.jpg', '/berita', 'Lihat Prestasi', 3, 'aktif');

INSERT INTO profil_sekolah (nama_sekolah, alamat, telepon, email, visi, misi) 
VALUES (
  'SMK Negeri 1 Kras',
  'Jl. Raya Kras, Kediri, Jawa Timur',
  '(0354) 123456',
  'info@smkn1kras.sch.id',
  'Menjadi SMK unggul yang menghasilkan lulusan berkualitas, berakhlak mulia, dan siap kerja dengan kompetensi global.',
  '1. Menyelenggarakan pendidikan kejuruan berkualitas\n2. Mengembangkan karakter dan soft skills siswa\n3. Meningkatkan kompetensi sesuai kebutuhan industri\n4. Membangun kemitraan dengan dunia usaha dan industri'
);

INSERT INTO media_sosial (judul, deskripsi, platform, embed_url, urutan, status) VALUES 
('Kegiatan Prakerin Siswa', 'Dokumentasi kegiatan praktek kerja industri siswa SMK Negeri 1 Kras', 'tiktok', 'https://www.tiktok.com/@smkn1kras/video/1234567890', 1, 'aktif'),
('Lomba Kompetensi Siswa', 'Persiapan siswa mengikuti lomba kompetensi tingkat provinsi', 'youtube', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 2, 'aktif'),
('Kegiatan Ekstrakurikuler', 'Berbagai kegiatan ekstrakurikuler yang ada di sekolah', 'instagram', 'https://www.instagram.com/p/ABC123/', 3, 'aktif');


-- Tabel Jurusan
CREATE TABLE IF NOT EXISTS jurusan (
  id INT PRIMARY KEY AUTO_INCREMENT,
  kode VARCHAR(10) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  deskripsi TEXT,
  kepala_jurusan VARCHAR(100),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabel Siswa untuk Face Recognition
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
);

-- Tabel Presensi
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
);
