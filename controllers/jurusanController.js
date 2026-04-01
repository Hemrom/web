const db = require('../config/database');

// Halaman daftar jurusan
exports.index = async (req, res) => {
  try {
    const [jurusan] = await db.query(`
      SELECT j.*, 
        (SELECT COUNT(*) FROM siswa WHERE jurusan = j.nama) as jumlah_siswa
      FROM jurusan j
      ORDER BY j.kode
    `);
    
    res.render('admin/jurusan/index', {
      title: 'Data Jurusan',
      user: req.session,
      jurusan,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Halaman tambah jurusan
exports.create = (req, res) => {
  res.render('admin/jurusan/create', {
    title: 'Tambah Jurusan',
    user: req.session
  });
};

// Simpan jurusan baru
exports.store = async (req, res) => {
  try {
    const { kode, nama, deskripsi, kepala_jurusan, status, icon, warna } = req.body;

    // Tentukan warna badge otomatis berdasarkan warna gradient
    const badgeMap = {
      '#0ea5e9': { bg: '#e0f2fe', teks: '#0369a1' },
      '#f59e0b': { bg: '#fef3c7', teks: '#d97706' },
      '#ef4444': { bg: '#fee2e2', teks: '#dc2626' },
      '#10b981': { bg: '#d1fae5', teks: '#059669' },
      '#8b5cf6': { bg: '#ede9fe', teks: '#7c3aed' },
      '#ec4899': { bg: '#fce7f3', teks: '#db2777' },
      '#6366f1': { bg: '#e0e7ff', teks: '#4f46e5' },
      '#14b8a6': { bg: '#ccfbf1', teks: '#0d9488' },
    };
    const colorKey = Object.keys(badgeMap).find(k => (warna || '').includes(k)) || '#0ea5e9';
    const badge = badgeMap[colorKey];

    await db.query(
      'INSERT INTO jurusan (kode, nama, deskripsi, kepala_jurusan, status, icon, warna, warna_badge, warna_teks_badge) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [kode, nama, deskripsi, kepala_jurusan, status || 'aktif', icon || 'fas fa-graduation-cap', warna || 'linear-gradient(135deg,#0ea5e9,#0369a1)', badge.bg, badge.teks]
    );

    res.redirect('/admin/data-sekolah?tab=jurusan&success=1');
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.redirect('/admin/jurusan/create?error=duplicate');
    } else {
      res.status(500).send('Terjadi kesalahan');
    }
  }
};

// Halaman edit jurusan
exports.edit = async (req, res) => {
  try {
    const [jurusan] = await db.query('SELECT * FROM jurusan WHERE id = ?', [req.params.id]);
    
    if (jurusan.length === 0) {
      return res.status(404).send('Jurusan tidak ditemukan');
    }
    
    // Hitung jumlah siswa
    const [siswaCount] = await db.query(
      'SELECT COUNT(*) as total FROM siswa WHERE jurusan = ?',
      [jurusan[0].nama]
    );
    
    res.render('admin/jurusan/edit', {
      title: 'Edit Jurusan',
      user: req.session,
      jurusan: jurusan[0],
      jumlahSiswa: siswaCount[0].total
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Update jurusan
exports.update = async (req, res) => {
  try {
    const { kode, nama, deskripsi, deskripsi_lengkap, kepala_jurusan, status, icon, warna } = req.body;

    const badgeMap = {
      '#0ea5e9': { bg: '#e0f2fe', teks: '#0369a1' },
      '#f59e0b': { bg: '#fef3c7', teks: '#d97706' },
      '#ef4444': { bg: '#fee2e2', teks: '#dc2626' },
      '#10b981': { bg: '#d1fae5', teks: '#059669' },
      '#8b5cf6': { bg: '#ede9fe', teks: '#7c3aed' },
      '#ec4899': { bg: '#fce7f3', teks: '#db2777' },
      '#6366f1': { bg: '#e0e7ff', teks: '#4f46e5' },
      '#14b8a6': { bg: '#ccfbf1', teks: '#0d9488' },
    };
    const colorKey = Object.keys(badgeMap).find(k => (warna || '').includes(k)) || '#0ea5e9';
    const badge = badgeMap[colorKey];

    const [oldJurusan] = await db.query('SELECT nama FROM jurusan WHERE id = ?', [req.params.id]);

    await db.query(
      'UPDATE jurusan SET kode=?, nama=?, deskripsi=?, deskripsi_lengkap=?, kepala_jurusan=?, status=?, icon=?, warna=?, warna_badge=?, warna_teks_badge=? WHERE id=?',
      [kode, nama, deskripsi, deskripsi_lengkap||null, kepala_jurusan, status, icon || 'fas fa-graduation-cap', warna || 'linear-gradient(135deg,#0ea5e9,#0369a1)', badge.bg, badge.teks, req.params.id]
    );

    if (oldJurusan[0].nama !== nama) {
      await db.query('UPDATE siswa SET jurusan = ? WHERE jurusan = ?', [nama, oldJurusan[0].nama]);
    }

    res.redirect('/admin/data-sekolah?tab=jurusan&success=1');
  } catch (error) {
    console.error(error);
    if (error.code === 'ER_DUP_ENTRY') {
      res.redirect(`/admin/jurusan/edit/${req.params.id}?error=duplicate`);
    } else {
      res.status(500).send('Terjadi kesalahan');
    }
  }
};

// Hapus jurusan
exports.destroy = async (req, res) => {
  try {
    const [jurusan] = await db.query('SELECT nama FROM jurusan WHERE id = ?', [req.params.id]);
    const [siswaCount] = await db.query(
      'SELECT COUNT(*) as total FROM siswa WHERE jurusan = ?',
      [jurusan[0].nama]
    );

    if (siswaCount[0].total > 0) {
      return res.redirect('/admin/data-sekolah?tab=jurusan&error=has_students');
    }

    await db.query('DELETE FROM jurusan WHERE id = ?', [req.params.id]);
    res.redirect('/admin/data-sekolah?tab=jurusan&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// API: Get siswa by jurusan
exports.getSiswaByJurusan = async (req, res) => {
  try {
    const [jurusan] = await db.query('SELECT nama FROM jurusan WHERE id = ?', [req.params.id]);
    
    if (jurusan.length === 0) {
      return res.status(404).json({ success: false, message: 'Jurusan tidak ditemukan' });
    }
    
    const [siswa] = await db.query(
      'SELECT id, nis, nama, kelas FROM siswa WHERE jurusan = ? ORDER BY kelas, nama',
      [jurusan[0].nama]
    );
    
    res.json({
      success: true,
      data: siswa,
      jurusan: jurusan[0].nama
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa'
    });
  }
};

// API: Get statistik jurusan
exports.getStatistik = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        j.id,
        j.kode,
        j.nama,
        j.kepala_jurusan,
        j.status,
        COUNT(DISTINCT s.id) as total_siswa,
        COUNT(DISTINCT s.kelas) as total_kelas,
        COUNT(DISTINCT CASE WHEN s.status = 'aktif' THEN s.id END) as siswa_aktif
      FROM jurusan j
      LEFT JOIN siswa s ON s.jurusan = j.nama
      GROUP BY j.id, j.kode, j.nama, j.kepala_jurusan, j.status
      ORDER BY j.kode
    `);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil statistik'
    });
  }
};
