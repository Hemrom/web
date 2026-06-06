/**
 * Migration script - jalankan: node migrate.js
 * Aman dijalankan berulang kali (CREATE TABLE IF NOT EXISTS)
 */
const db = require('./config/database');

async function run() {
  const queries = [
    // Alumni
    `CREATE TABLE IF NOT EXISTS alumni (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(100) NOT NULL,
      nis VARCHAR(50) DEFAULT NULL,
      tahun_lulus YEAR DEFAULT NULL,
      jurusan VARCHAR(100) DEFAULT NULL,
      pekerjaan VARCHAR(150) DEFAULT NULL,
      perusahaan VARCHAR(150) DEFAULT NULL,
      kota VARCHAR(100) DEFAULT NULL,
      foto VARCHAR(255) DEFAULT NULL,
      email VARCHAR(100) DEFAULT NULL,
      telepon VARCHAR(20) DEFAULT NULL,
      instagram VARCHAR(100) DEFAULT NULL,
      linkedin VARCHAR(200) DEFAULT NULL,
      cerita TEXT DEFAULT NULL,
      token VARCHAR(64) DEFAULT NULL,
      status ENUM('pending','disetujui','ditolak') DEFAULT 'pending',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Link terkait
    `CREATE TABLE IF NOT EXISTS link_terkait (
      id INT AUTO_INCREMENT PRIMARY KEY,
      nama VARCHAR(255) NOT NULL,
      url VARCHAR(500) NOT NULL,
      logo VARCHAR(255) DEFAULT NULL,
      deskripsi VARCHAR(255) DEFAULT NULL,
      urutan INT DEFAULT 0,
      status ENUM('aktif','nonaktif') DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Prestasi
    `CREATE TABLE IF NOT EXISTS prestasi (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      deskripsi TEXT,
      gambar VARCHAR(255),
      kategori ENUM('akademik','non-akademik','olahraga','seni','teknologi','lainnya') DEFAULT 'lainnya',
      tingkat ENUM('sekolah','kecamatan','kabupaten','provinsi','nasional','internasional') DEFAULT 'sekolah',
      tahun YEAR,
      jurusan VARCHAR(100),
      status ENUM('draft','published') DEFAULT 'published',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // BKK
    `CREATE TABLE IF NOT EXISTS bkk_lowongan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      perusahaan VARCHAR(150) NOT NULL,
      lokasi VARCHAR(150),
      deskripsi TEXT,
      persyaratan TEXT,
      gambar VARCHAR(255),
      kategori ENUM('magang','kerja','beasiswa','lainnya') DEFAULT 'kerja',
      deadline DATE,
      kontak VARCHAR(255),
      status ENUM('aktif','nonaktif') DEFAULT 'aktif',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // OSIS Kegiatan
    `CREATE TABLE IF NOT EXISTS osis_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // OSIS Berita
    `CREATE TABLE IF NOT EXISTS osis_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // OSIS Galeri
    `CREATE TABLE IF NOT EXISTS osis_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Portal users
    `CREATE TABLE IF NOT EXISTS portal_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      nama VARCHAR(100) NOT NULL,
      role ENUM('bkk','osis','jurusan') NOT NULL,
      jurusan VARCHAR(100) DEFAULT NULL,
      aktif TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Jurusan galeri
    `CREATE TABLE IF NOT EXISTS jurusan_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      jurusan VARCHAR(100) NOT NULL,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan VARCHAR(255) DEFAULT NULL,
      urutan INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Jurusan berita
    `CREATE TABLE IF NOT EXISTS jurusan_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      jurusan VARCHAR(100) NOT NULL,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','informasi','pengumuman','prestasi') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // ALTER columns (aman jika sudah ada)
    `ALTER TABLE profil_sekolah ADD COLUMN IF NOT EXISTS tampil_wa TINYINT(1) DEFAULT 1`,
    `ALTER TABLE halaman ADD COLUMN IF NOT EXISTS subtitle VARCHAR(500) DEFAULT NULL AFTER judul`,
    `ALTER TABLE media_sosial ADD COLUMN IF NOT EXISTS thumbnail VARCHAR(255) DEFAULT NULL`,
    `ALTER TABLE jurusan ADD COLUMN IF NOT EXISTS deskripsi_lengkap TEXT DEFAULT NULL`,

    // Pramuka tables
    `CREATE TABLE IF NOT EXISTS pramuka_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pramuka_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pramuka_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Tambah role pramuka ke portal_users
    `ALTER TABLE portal_users MODIFY COLUMN role ENUM('bkk','osis','jurusan','pramuka','olahraga','paskibraka') NOT NULL`,

    `CREATE TABLE IF NOT EXISTS olahraga_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS olahraga_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS olahraga_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Paskibraka tables
    `CREATE TABLE IF NOT EXISTS paskibraka_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS paskibraka_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS paskibraka_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Seni tables
    `CREATE TABLE IF NOT EXISTS seni_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS seni_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS seni_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Bahasa Asing tables
    `CREATE TABLE IF NOT EXISTS bahasa_asing_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS bahasa_asing_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS bahasa_asing_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Tambah role seni dan bahasa_asing ke portal_users
    `ALTER TABLE portal_users MODIFY COLUMN role ENUM('bkk','osis','jurusan','pramuka','olahraga','paskibraka','seni','bahasa_asing') NOT NULL`,

    // Rohis tables
    `CREATE TABLE IF NOT EXISTS rohis_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS rohis_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS rohis_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Tambah role rohis ke portal_users
    `ALTER TABLE portal_users MODIFY COLUMN role ENUM('bkk','osis','jurusan','pramuka','olahraga','paskibraka','seni','bahasa_asing','rohis') NOT NULL`,

    // PMR tables
    `CREATE TABLE IF NOT EXISTS pmr_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pmr_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pmr_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Tambah role pmr ke portal_users
    `ALTER TABLE portal_users MODIFY COLUMN role ENUM('bkk','osis','jurusan','pramuka','olahraga','paskibraka','seni','bahasa_asing','rohis','pmr') NOT NULL`,

    // PIK-R tables
    `CREATE TABLE IF NOT EXISTS pikr_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pengumuman','penyuluhan','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pikr_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','penyuluhan','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pikr_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL DEFAULT 'Galeri PIK-R',
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Pecinta Alam tables
    `CREATE TABLE IF NOT EXISTS pecinta_alam_kegiatan (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('kegiatan','pendakian','kemah','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pecinta_alam_berita (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) UNIQUE,
      konten TEXT,
      gambar VARCHAR(255),
      kategori ENUM('berita','pengumuman','kegiatan','pendakian','lainnya') DEFAULT 'berita',
      status ENUM('draft','published') DEFAULT 'published',
      penulis VARCHAR(100),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    `CREATE TABLE IF NOT EXISTS pecinta_alam_galeri (
      id INT AUTO_INCREMENT PRIMARY KEY,
      judul VARCHAR(255) NOT NULL DEFAULT 'Galeri Pecinta Alam',
      gambar VARCHAR(255) NOT NULL,
      keterangan TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

    // Tambah role pikr dan pecinta_alam ke portal_users
    `ALTER TABLE portal_users MODIFY COLUMN role ENUM('bkk','osis','jurusan','pramuka','olahraga','paskibraka','seni','bahasa_asing','rohis','pmr','pikr','pecinta_alam') NOT NULL`,

    // Agenda
    `CREATE TABLE IF NOT EXISTS agenda (
      id INT(11) NOT NULL AUTO_INCREMENT,
      judul VARCHAR(255) NOT NULL,
      slug VARCHAR(255) DEFAULT NULL,
      deskripsi TEXT DEFAULT NULL,
      gambar VARCHAR(255) DEFAULT NULL,
      tanggal_mulai DATE NOT NULL,
      tanggal_selesai DATE DEFAULT NULL,
      waktu_mulai TIME DEFAULT NULL,
      waktu_selesai TIME DEFAULT NULL,
      lokasi VARCHAR(255) DEFAULT NULL,
      koordinator_nama VARCHAR(150) DEFAULT NULL,
      koordinator_email VARCHAR(150) DEFAULT NULL,
      koordinator_telp VARCHAR(50) DEFAULT NULL,
      status ENUM('aktif','nonaktif') DEFAULT 'aktif',
      tampil_home TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      UNIQUE KEY slug (slug)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
  ];

  let ok = 0, skip = 0;
  for (const q of queries) {
    try {
      await db.query(q);
      ok++;
    } catch (e) {
      skip++;
      if (!e.message.includes('Duplicate') && !e.message.includes('already exists')) {
        console.log('  skip:', e.message.substring(0, 80));
      }
    }
  }
  console.log(`  Tabel: ${ok} OK, ${skip} skip`);

  // Menu navigasi - tambah jika belum ada
  const menus = [
    { label: 'Beranda',          url: '/',          urutan: 1 },
    { label: 'Profil',           url: '/profil',    urutan: 2 },
    { label: 'Berita',           url: '/berita',    urutan: 3 },
    { label: 'Program Keahlian', url: '/jurusan',   urutan: 4 },
    { label: 'Prestasi',         url: '/prestasi',  urutan: 5 },
    { label: 'BKK',              url: '/bkk',       urutan: 6 },
    { label: 'OSIS',             url: '/osis',      urutan: 7 },
    { label: 'Galeri',           url: '/galeri',    urutan: 8 },
    { label: 'Kontak',           url: '/kontak',    urutan: 9 },
  ];

  let menuAdded = 0;
  for (const m of menus) {
    try {
      const [ex] = await db.query('SELECT id FROM menu_navigasi WHERE url=? LIMIT 1', [m.url]);
      if (!ex.length) {
        await db.query(
          'INSERT INTO menu_navigasi (label,url,urutan,status) VALUES (?,?,?,?)',
          [m.label, m.url, m.urutan, 'aktif']
        );
        menuAdded++;
        console.log('  + Menu:', m.label);
      }
    } catch (e) {
      console.log('  Menu skip:', e.message.substring(0, 60));
    }
  }
  if (menuAdded === 0) console.log('  Menu: semua sudah ada');
  else console.log(`  Menu: ${menuAdded} ditambahkan`);

  console.log('  Migrasi selesai!');
  process.exit(0);
}

run().catch(e => {
  console.error('Migration error:', e.message);
  process.exit(1);
});
