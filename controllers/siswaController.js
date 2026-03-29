const db = require('../config/database');
const cbtDb = require('../config/database-cbt');

// Ambil data siswa dari database CBT
exports.getSiswaFromCBT = async (req, res) => {
  try {
    // Query untuk mengambil data siswa dari database CBT
    // Menggunakan tabel users dengan role STUDENT dan join dengan classes
    const [siswa] = await cbtDb.query(`
      SELECT 
        u.id as user_id,
        u.username as nis,
        u.full_name as nama,
        c.name as kelas,
        'Unknown' as jurusan,
        u.profile_photo as foto
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.role = 'STUDENT' AND u.is_active = 1
      ORDER BY c.name, u.full_name
    `);
    
    res.json({
      success: true,
      data: siswa,
      total: siswa.length
    });
  } catch (error) {
    console.error('Error fetching siswa from CBT:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa dari database CBT',
      error: error.message
    });
  }
};

// Sinkronisasi data siswa dari CBT ke database lokal
exports.syncSiswaFromCBT = async (req, res) => {
  try {
    // Ambil data siswa dari database CBT
    const [siswaCBT] = await cbtDb.query(`
      SELECT 
        u.id as user_id,
        u.username as nis,
        u.full_name as nama,
        c.name as kelas,
        'Unknown' as jurusan,
        u.profile_photo as foto
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.role = 'STUDENT' AND u.is_active = 1
      ORDER BY c.name, u.full_name
    `);
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    // Loop setiap siswa dan insert/update ke database lokal
    for (const siswa of siswaCBT) {
      try {
        // Cek apakah siswa sudah ada di database lokal
        const [existing] = await db.query(
          'SELECT id FROM siswa WHERE nis = ?',
          [siswa.nis]
        );
        
        if (existing.length > 0) {
          // Update data siswa yang sudah ada
          await db.query(
            'UPDATE siswa SET nama = ?, kelas = ?, jurusan = ?, foto = ?, updated_at = NOW() WHERE nis = ?',
            [siswa.nama, siswa.kelas || 'Unknown', siswa.jurusan, siswa.foto, siswa.nis]
          );
          updated++;
        } else {
          // Insert siswa baru
          await db.query(
            'INSERT INTO siswa (nis, nama, kelas, jurusan, foto, status) VALUES (?, ?, ?, ?, ?, ?)',
            [siswa.nis, siswa.nama, siswa.kelas || 'Unknown', siswa.jurusan, siswa.foto, 'aktif']
          );
          inserted++;
        }
      } catch (err) {
        console.error(`Error syncing siswa ${siswa.nis}:`, err);
        errors++;
      }
    }
    
    res.json({
      success: true,
      message: 'Sinkronisasi data siswa berhasil',
      stats: {
        total: siswaCBT.length,
        inserted,
        updated,
        errors
      }
    });
  } catch (error) {
    console.error('Error syncing siswa from CBT:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal sinkronisasi data siswa',
      error: error.message
    });
  }
};

// Daftar siswa dari database lokal
exports.index = async (req, res) => {
  try {
    const [siswa] = await db.query(`
      SELECT * FROM siswa 
      ORDER BY kelas, nama
    `);
    
    res.render('admin/siswa/index', {
      title: 'Data Siswa',
      user: req.session,
      siswa,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Halaman tambah siswa manual (jika diperlukan)
exports.create = async (req, res) => {
  try {
    // Ambil daftar jurusan
    const [jurusan] = await db.query('SELECT * FROM jurusan WHERE status = "aktif" ORDER BY kode');
    
    res.render('admin/siswa/create', {
      title: 'Tambah Siswa',
      user: req.session,
      jurusan
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Simpan siswa baru
exports.store = async (req, res) => {
  try {
    const { nis, nama, kelas, jurusan } = req.body;
    const foto = req.file ? req.file.filename : null;
    
    await db.query(
      'INSERT INTO siswa (nis, nama, kelas, jurusan, foto, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nis, nama, kelas, jurusan, foto, 'aktif']
    );
    
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Halaman edit siswa
exports.edit = async (req, res) => {
  try {
    const [siswa] = await db.query('SELECT * FROM siswa WHERE id = ?', [req.params.id]);
    
    if (siswa.length === 0) {
      return res.status(404).send('Siswa tidak ditemukan');
    }
    
    // Ambil daftar jurusan
    const [jurusan] = await db.query('SELECT * FROM jurusan WHERE status = "aktif" ORDER BY kode');
    
    res.render('admin/siswa/edit', {
      title: 'Edit Siswa',
      user: req.session,
      siswa: siswa[0],
      jurusan
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Update siswa
exports.update = async (req, res) => {
  try {
    const { nis, nama, kelas, jurusan, status } = req.body;
    const foto = req.file ? req.file.filename : null;
    
    if (foto) {
      await db.query(
        'UPDATE siswa SET nis = ?, nama = ?, kelas = ?, jurusan = ?, foto = ?, status = ? WHERE id = ?',
        [nis, nama, kelas, jurusan, foto, status, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE siswa SET nis = ?, nama = ?, kelas = ?, jurusan = ?, status = ? WHERE id = ?',
        [nis, nama, kelas, jurusan, status, req.params.id]
      );
    }
    
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Hapus siswa
exports.destroy = async (req, res) => {
  try {
    await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// API: Get siswa by kelas
exports.getSiswaByKelas = async (req, res) => {
  try {
    const [siswa] = await db.query(
      'SELECT id, nis, nama FROM siswa WHERE kelas = ? AND status = "aktif" ORDER BY nama',
      [req.params.kelas]
    );
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa'
    });
  }
};

// API: Search siswa
exports.searchSiswa = async (req, res) => {
  try {
    const { q } = req.query;
    const [siswa] = await db.query(
      'SELECT id, nis, nama, kelas FROM siswa WHERE (nama LIKE ? OR nis LIKE ?) AND status = "aktif" ORDER BY nama LIMIT 20',
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mencari siswa'
    });
  }
};
