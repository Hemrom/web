const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'galeri-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('gambar');

exports.index = async (req, res) => {
  try {
    const [galeri] = await db.query('SELECT * FROM galeri ORDER BY created_at DESC');
    res.render('admin/galeri/index', {
      title: 'Kelola Galeri',
      user: req.session,
      galeri
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/galeri/create', {
    title: 'Tambah Galeri',
    user: req.session
  });
};

exports.create = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    
    try {
      const { judul, deskripsi, kategori } = req.body;
      const gambar = req.file ? req.file.filename : null;
      
      if (!gambar) {
        return res.status(400).send('Gambar harus diupload');
      }
      
      await db.query(
        'INSERT INTO galeri (judul, deskripsi, gambar, kategori) VALUES (?, ?, ?, ?)',
        [judul, deskripsi, gambar, kategori]
      );
      
      res.redirect('/admin/galeri');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM galeri WHERE id = ?', [req.params.id]);
    res.redirect('/admin/galeri');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};
