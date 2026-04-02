const db = require('../config/database');
const path = require('path');
const fs = require('fs');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/files/',
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, 'file-' + Date.now() + ext);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar', '.txt', '.jpg', '.png'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) cb(null, true);
    else cb(new Error('Tipe file tidak diizinkan'));
  }
}).single('file');

const formatSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.adminIndex = async (req, res) => {
  try {
    const [files] = await db.query('SELECT * FROM file_download ORDER BY created_at DESC');
    res.render('admin/file-download/index', { title: 'Kelola File Download', user: req.session, files });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminCreatePage = (req, res) => {
  res.render('admin/file-download/create', { title: 'Upload File', user: req.session });
};

exports.adminCreate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    if (!req.file) return res.status(400).send('File wajib diupload');
    try {
      const { judul, deskripsi, kategori, status, tampil_home } = req.body;
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();
      await db.query(
        'INSERT INTO file_download (judul, deskripsi, nama_file, ukuran_file, tipe_file, kategori, penulis_id, penulis_nama, penulis_tipe, status, tampil_home) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [judul, deskripsi, req.file.filename, formatSize(req.file.size), ext, kategori || 'Umum', req.session.userId, req.session.nama_lengkap || 'Admin', 'admin', status || 'aktif', tampil_home ? 1 : 0]
      );
      res.redirect('/admin/file-download');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminEditPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM file_download WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Tidak ditemukan');
    res.render('admin/file-download/edit', { title: 'Edit File', user: req.session, file: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminUpdate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    try {
      const { judul, deskripsi, kategori, status, tampil_home } = req.body;
      const [rows] = await db.query('SELECT * FROM file_download WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).send('Tidak ditemukan');
      let nama_file = rows[0].nama_file;
      let ukuran_file = rows[0].ukuran_file;
      let tipe_file = rows[0].tipe_file;
      if (req.file) {
        nama_file = req.file.filename;
        ukuran_file = formatSize(req.file.size);
        tipe_file = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();
      }
      await db.query(
        'UPDATE file_download SET judul=?, deskripsi=?, nama_file=?, ukuran_file=?, tipe_file=?, kategori=?, status=?, tampil_home=? WHERE id=?',
        [judul, deskripsi, nama_file, ukuran_file, tipe_file, kategori || 'Umum', status || 'aktif', tampil_home ? 1 : 0, req.params.id]
      );
      res.redirect('/admin/file-download');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminDelete = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT nama_file FROM file_download WHERE id = ?', [req.params.id]);
    if (rows.length) {
      const filePath = path.join('./uploads/files/', rows[0].nama_file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('DELETE FROM file_download WHERE id = ?', [req.params.id]);
    res.redirect('/admin/file-download');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── GURU ──────────────────────────────────────────────────────────────────────

exports.guruIndex = async (req, res) => {
  try {
    const [files] = await db.query(
      'SELECT * FROM file_download WHERE penulis_id = ? AND penulis_tipe = "guru" ORDER BY created_at DESC',
      [req.session.guruId]
    );
    const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    res.render('guru/file-download/index', { title: 'File Download Saya', guru: guru[0], files });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guruCreatePage = async (req, res) => {
  const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
  res.render('guru/file-download/create', { title: 'Upload File', guru: guru[0] });
};

exports.guruCreate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    if (!req.file) return res.status(400).send('File wajib diupload');
    try {
      const { judul, deskripsi, kategori, status } = req.body;
      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();
      const [guru] = await db.query('SELECT nama FROM guru WHERE id = ?', [req.session.guruId]);
      await db.query(
        'INSERT INTO file_download (judul, deskripsi, nama_file, ukuran_file, tipe_file, kategori, penulis_id, penulis_nama, penulis_tipe, status, tampil_home) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [judul, deskripsi, req.file.filename, formatSize(req.file.size), ext, kategori || 'Umum', req.session.guruId, guru[0].nama, 'guru', status || 'aktif', 0]
      );
      res.redirect('/guru/file-download');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.guruEditPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM file_download WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
    if (!rows.length) return res.status(404).send('Tidak ditemukan');
    const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    res.render('guru/file-download/edit', { title: 'Edit File', guru: guru[0], file: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guruUpdate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    try {
      const { judul, deskripsi, kategori, status } = req.body;
      const [rows] = await db.query('SELECT * FROM file_download WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
      if (!rows.length) return res.status(404).send('Tidak ditemukan');
      let nama_file = rows[0].nama_file;
      let ukuran_file = rows[0].ukuran_file;
      let tipe_file = rows[0].tipe_file;
      if (req.file) {
        nama_file = req.file.filename;
        ukuran_file = formatSize(req.file.size);
        tipe_file = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();
      }
      await db.query(
        'UPDATE file_download SET judul=?, deskripsi=?, nama_file=?, ukuran_file=?, tipe_file=?, kategori=?, status=? WHERE id=? AND penulis_id=? AND penulis_tipe="guru"',
        [judul, deskripsi, nama_file, ukuran_file, tipe_file, kategori || 'Umum', status || 'aktif', req.params.id, req.session.guruId]
      );
      res.redirect('/guru/file-download');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.guruDelete = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT nama_file FROM file_download WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
    if (rows.length) {
      const filePath = path.join('./uploads/files/', rows[0].nama_file);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('DELETE FROM file_download WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
    res.redirect('/guru/file-download');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── FRONTEND ──────────────────────────────────────────────────────────────────

exports.frontendIndex = async (req, res) => {
  try {
    const kategori = req.query.kategori || '';
    let whereClause = 'WHERE status = "aktif"';
    let params = [];
    if (kategori) { whereClause += ' AND kategori = ?'; params.push(kategori); }

    const [files] = await db.query(`SELECT * FROM file_download ${whereClause} ORDER BY created_at DESC`, params);
    const [kategoriList] = await db.query('SELECT DISTINCT kategori FROM file_download WHERE status = "aktif" ORDER BY kategori ASC');

    const { getMenuItems, getMediaSosialFooter, getProfilSekolah } = require('./frontendController');
    const [menuItems, mediaSosialFooter, profil] = await Promise.all([
      getMenuItems(), getMediaSosialFooter(), getProfilSekolah()
    ]);

    res.render('frontend/file-download', {
      title: 'File Download', currentPage: 'file-download',
      files, kategoriList, kategoriAktif: kategori,
      menuItems, mediaSosialFooter, profil
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.frontendDownload = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM file_download WHERE id = ? AND status = "aktif"', [req.params.id]);
    if (!rows.length) return res.status(404).send('File tidak ditemukan');
    const file = rows[0];
    const filePath = path.join(__dirname, '../uploads/files/', file.nama_file);
    if (!fs.existsSync(filePath)) return res.status(404).send('File tidak ditemukan di server');
    await db.query('UPDATE file_download SET jumlah_download = jumlah_download + 1 WHERE id = ?', [file.id]);
    res.download(filePath, file.judul + path.extname(file.nama_file));
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
