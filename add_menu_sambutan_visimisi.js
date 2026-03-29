const db = require('./config/database');

async function run() {
  try {
    // Cari id menu Profil
    const [rows] = await db.query("SELECT id FROM menu_navigasi WHERE url = '/profil' AND parent_id IS NULL LIMIT 1");

    let profilId = null;
    if (rows.length > 0) {
      profilId = rows[0].id;
      console.log(`✅ Menu Profil ditemukan, id: ${profilId}`);
    } else {
      console.log('⚠️  Menu Profil tidak ditemukan, menu akan ditambahkan tanpa parent.');
    }

    // Insert Profil Sekolah jika belum ada
    const [cekProfil] = await db.query(
      "SELECT id FROM menu_navigasi WHERE url = '/profil' AND parent_id IS NOT NULL LIMIT 1"
    );
    if (cekProfil.length === 0) {
      await db.query(
        "INSERT INTO menu_navigasi (label, url, parent_id, urutan, status) VALUES (?, ?, ?, ?, 'aktif')",
        ['Profil Sekolah', '/profil', profilId, 0]
      );
      console.log('✅ Menu "Profil Sekolah" berhasil ditambahkan.');
    } else {
      console.log('ℹ️  Menu "Profil Sekolah" sudah ada, skip.');
    }

    // Insert Sejarah Sekolah jika belum ada
    const [cekSejarah] = await db.query(
      "SELECT id FROM menu_navigasi WHERE url = '/profil/sejarah' LIMIT 1"
    );
    if (cekSejarah.length === 0) {
      await db.query(
        "INSERT INTO menu_navigasi (label, url, parent_id, urutan, status) VALUES (?, ?, ?, ?, 'aktif')",
        ['Sejarah Sekolah', '/profil/sejarah', profilId, 3]
      );
      console.log('✅ Menu "Sejarah Sekolah" berhasil ditambahkan.');
    } else {
      console.log('ℹ️  Menu "Sejarah Sekolah" sudah ada, skip.');
    }

    // Insert Sambutan Kepala Sekolah jika belum ada
    const [cekSambutan] = await db.query(
      "SELECT id FROM menu_navigasi WHERE url = '/profil/sambutan' LIMIT 1"
    );
    if (cekSambutan.length === 0) {
      await db.query(
        "INSERT INTO menu_navigasi (label, url, parent_id, urutan, status) VALUES (?, ?, ?, ?, 'aktif')",
        ['Sambutan Kepala Sekolah', '/profil/sambutan', profilId, 4]
      );
      console.log('✅ Menu "Sambutan Kepala Sekolah" berhasil ditambahkan.');
    } else {
      console.log('ℹ️  Menu "Sambutan Kepala Sekolah" sudah ada, skip.');
    }

    // Insert Visi & Misi jika belum ada
    const [cekVisiMisi] = await db.query(
      "SELECT id FROM menu_navigasi WHERE url = '/profil/visi-misi' LIMIT 1"
    );
    if (cekVisiMisi.length === 0) {
      await db.query(
        "INSERT INTO menu_navigasi (label, url, parent_id, urutan, status) VALUES (?, ?, ?, ?, 'aktif')",
        ['Visi & Misi', '/profil/visi-misi', profilId, 1]
      );
      console.log('✅ Menu "Visi & Misi" berhasil ditambahkan.');
    } else {
      console.log('ℹ️  Menu "Visi & Misi" sudah ada, skip.');
    }

    console.log('\nSelesai. Refresh halaman Kontrol Website > tab Kelola Menu.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

run();
