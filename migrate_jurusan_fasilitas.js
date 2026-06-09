/**
 * Migrasi: Buat tabel jurusan_fasilitas
 * Jalankan: node migrate_jurusan_fasilitas.js
 */
const db = require('./config/database');

async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS jurusan_fasilitas (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        jurusan     VARCHAR(10) NOT NULL,
        nama        VARCHAR(100) NOT NULL,
        deskripsi   TEXT,
        gambar      VARCHAR(255),
        icon        VARCHAR(60) DEFAULT 'fas fa-building',
        urutan      INT DEFAULT 0,
        created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_jurusan (jurusan)
      )
    `);
    console.log('✅ Tabel jurusan_fasilitas berhasil dibuat');

    // Seed data default untuk TKJ
    const defaults = [
      { jurusan:'TKJ', nama:'Lab Jaringan Komputer', deskripsi:'Lengkap dengan router Cisco, switch manageable, dan access point profesional.', icon:'fas fa-network-wired', urutan:1 },
      { jurusan:'TKJ', nama:'Lab Komputer',          deskripsi:'PC terbaru dengan spesifikasi tinggi untuk kegiatan praktik sehari-hari.',        icon:'fas fa-desktop',        urutan:2 },
      { jurusan:'TKJ', nama:'Server Room',            deskripsi:'Ruang server sungguhan untuk praktik administrasi server dan cloud.',              icon:'fas fa-server',         urutan:3 },
      { jurusan:'TKJ', nama:'Ruang Fiber Optik',      deskripsi:'Alat splicing dan pengujian kabel fiber optik modern.',                           icon:'fas fa-circle-dot',     urutan:4 },
    ];

    for (const f of defaults) {
      const [exist] = await db.query('SELECT id FROM jurusan_fasilitas WHERE jurusan=? AND nama=?', [f.jurusan, f.nama]);
      if (!exist.length) {
        await db.query(
          'INSERT INTO jurusan_fasilitas (jurusan,nama,deskripsi,icon,urutan) VALUES (?,?,?,?,?)',
          [f.jurusan, f.nama, f.deskripsi, f.icon, f.urutan]
        );
        console.log(`  ✅ Seed: ${f.jurusan} - ${f.nama}`);
      } else {
        console.log(`  ⚠️  Skip (sudah ada): ${f.jurusan} - ${f.nama}`);
      }
    }

    console.log('\n✅ Migrasi selesai!');
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
