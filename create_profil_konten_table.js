const db = require('./config/database');

async function run() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS profil_konten (
        id INT PRIMARY KEY AUTO_INCREMENT,
        tipe ENUM('visi_misi', 'sejarah', 'sambutan') NOT NULL,
        judul VARCHAR(255),
        konten LONGTEXT,
        foto VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_tipe (tipe)
      )
    `);

    // Tambahkan UNIQUE constraint jika tabel sudah ada sebelumnya (migrasi)
    await db.query(`
      ALTER TABLE profil_konten ADD UNIQUE KEY uq_tipe (tipe)
    `).catch(() => {
      // Abaikan error jika constraint sudah ada
    });

    // Insert default rows jika belum ada — INSERT IGNORE mencegah duplikat berdasarkan UNIQUE KEY tipe
    await db.query(`INSERT IGNORE INTO profil_konten (tipe, judul, konten) VALUES
      ('visi_misi', 'Visi & Misi', ''),
      ('sejarah', 'Sejarah Sekolah', ''),
      ('sambutan', 'Sambutan Kepala Sekolah', '')
    `);

    console.log('✅ Tabel profil_konten berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
