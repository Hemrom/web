const db = require('./config/database');

async function createMenuNavigasiTable() {
  try {
    // Create table if not exists
    await db.query(`
      CREATE TABLE IF NOT EXISTS menu_navigasi (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        label      VARCHAR(100) NOT NULL,
        url        VARCHAR(255) NOT NULL,
        parent_id  INT NULL,
        urutan     INT NOT NULL DEFAULT 0,
        status     ENUM('aktif', 'nonaktif') NOT NULL DEFAULT 'aktif',
        icon       VARCHAR(100) NULL,
        target     ENUM('_self', '_blank') NOT NULL DEFAULT '_self',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (parent_id) REFERENCES menu_navigasi(id) ON DELETE CASCADE
      )
    `);
    console.log('Tabel menu_navigasi berhasil dibuat (atau sudah ada).');

    // Check if already seeded
    const [existing] = await db.query('SELECT COUNT(*) as count FROM menu_navigasi');
    if (existing[0].count > 0) {
      console.log('Data sudah ada, skip seeding.');
      process.exit(0);
    }

    // Seed parent menus
    const [beranda] = await db.query(
      "INSERT INTO menu_navigasi (label, url, urutan, icon) VALUES ('Beranda', '/', 1, NULL)"
    );
    const [profil] = await db.query(
      "INSERT INTO menu_navigasi (label, url, urutan, icon) VALUES ('Profil', '/profil', 2, NULL)"
    );
    await db.query("INSERT INTO menu_navigasi (label, url, urutan) VALUES ('Berita', '/berita', 3)");
    await db.query("INSERT INTO menu_navigasi (label, url, urutan) VALUES ('Galeri', '/galeri', 4)");
    await db.query("INSERT INTO menu_navigasi (label, url, urutan) VALUES ('Guru', '/guru', 5)");
    await db.query("INSERT INTO menu_navigasi (label, url, urutan) VALUES ('Media Sosial', '/media-sosial', 6)");
    await db.query("INSERT INTO menu_navigasi (label, url, urutan) VALUES ('Kontak', '/kontak', 7)");

    const profilId = profil[0].insertId;

    // Seed sub-menus under Profil
    await db.query(
      "INSERT INTO menu_navigasi (label, url, parent_id, urutan) VALUES ('Visi & Misi', '/profil/visi-misi', ?, 1)",
      [profilId]
    );
    await db.query(
      "INSERT INTO menu_navigasi (label, url, parent_id, urutan) VALUES ('Sejarah Sekolah', '/profil/sejarah', ?, 2)",
      [profilId]
    );
    await db.query(
      "INSERT INTO menu_navigasi (label, url, parent_id, urutan) VALUES ('Guru & Karyawan', '/guru', ?, 3)",
      [profilId]
    );
    await db.query(
      "INSERT INTO menu_navigasi (label, url, parent_id, urutan) VALUES ('Sambutan Kepala Sekolah', '/profil/sambutan', ?, 4)",
      [profilId]
    );

    console.log('Seed data default berhasil dimasukkan.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

createMenuNavigasiTable();
