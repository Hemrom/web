const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'berita-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('gambar');
const uploadEditor = multer({ storage }).single('file');
const uploadFields = multer({ storage }).any();

// Upload gambar dari editor Summernote
exports.uploadGambar = (req, res) => {
  uploadEditor(req, res, (err) => {
    if (err || !req.file) {
      return res.json({ error: 'Upload gagal' });
    }
    res.json({ url: '/uploads/' + req.file.filename });
  });
};

const createSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

exports.index = async (req, res) => {
  try {
    const [berita] = await db.query(
      'SELECT b.*, u.nama_lengkap as penulis FROM berita b LEFT JOIN users u ON b.penulis_id = u.id ORDER BY b.created_at DESC'
    );
    res.render('admin/berita/index', {
      title: 'Kelola Berita',
      user: req.session,
      berita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/berita/create', {
    title: 'Tambah Berita',
    user: req.session
  });
};

exports.create = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).send('Error upload file: ' + err.message);
    }
    try {
      const { judul, konten, kategori, status } = req.body;
      const slug = createSlug(judul);
      const gambar = req.files && req.files.find(f => f.fieldname === 'gambar') 
        ? req.files.find(f => f.fieldname === 'gambar').filename 
        : null;
      await db.query(
        'INSERT INTO berita (judul, slug, konten, gambar, penulis_id, kategori, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [judul, slug, konten, gambar, req.session.userId, kategori, status]
      );
      res.redirect('/admin/berita');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.editPage = async (req, res) => {
  try {
    const [berita] = await db.query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    if (berita.length === 0) {
      return res.status(404).send('Berita tidak ditemukan');
    }
    res.render('admin/berita/edit', {
      title: 'Edit Berita',
      user: req.session,
      berita: berita[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(500).send('Error upload file: ' + err.message);
    }
    try {
      const { judul, konten, kategori, status } = req.body;
      const slug = createSlug(judul);
      const gambar = req.files && req.files.find(f => f.fieldname === 'gambar')
        ? req.files.find(f => f.fieldname === 'gambar').filename
        : null;
      if (gambar) {
        await db.query(
          'UPDATE berita SET judul = ?, slug = ?, konten = ?, gambar = ?, kategori = ?, status = ? WHERE id = ?',
          [judul, slug, konten, gambar, kategori, status, req.params.id]
        );
      } else {
        await db.query(
          'UPDATE berita SET judul = ?, slug = ?, konten = ?, kategori = ?, status = ? WHERE id = ?',
          [judul, slug, konten, kategori, status, req.params.id]
        );
      }
      res.redirect('/admin/berita');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.redirect('/admin/berita');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};
