const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'slider-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('gambar');

exports.index = async (req, res) => {
  try {
    const [slider] = await db.query('SELECT * FROM slider ORDER BY urutan ASC, created_at DESC');
    res.render('admin/slider/index', {
      title: 'Kelola Slider',
      user: req.session,
      slider
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/slider/create', {
    title: 'Tambah Slider',
    user: req.session
  });
};

exports.create = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    
    try {
      const { judul, subjudul, deskripsi, link_url, link_text, urutan, status } = req.body;
      const gambar = req.file ? req.file.filename : null;
      
      if (!gambar) {
        return res.status(400).send('Gambar harus diupload');
      }
      
      await db.query(
        'INSERT INTO slider (judul, subjudul, deskripsi, gambar, link_url, link_text, urutan, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [judul, subjudul, deskripsi, gambar, link_url, link_text, urutan || 0, status]
      );
      
      res.redirect('/admin/slider');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.editPage = async (req, res) => {
  try {
    const [slider] = await db.query('SELECT * FROM slider WHERE id = ?', [req.params.id]);
    if (slider.length === 0) {
      return res.status(404).send('Slider tidak ditemukan');
    }
    res.render('admin/slider/edit', {
      title: 'Edit Slider',
      user: req.session,
      slider: slider[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    
    try {
      const { judul, subjudul, deskripsi, link_url, link_text, urutan, status } = req.body;
      const gambar = req.file ? req.file.filename : null;
      
      if (gambar) {
        await db.query(
          'UPDATE slider SET judul = ?, subjudul = ?, deskripsi = ?, gambar = ?, link_url = ?, link_text = ?, urutan = ?, status = ? WHERE id = ?',
          [judul, subjudul, deskripsi, gambar, link_url, link_text, urutan || 0, status, req.params.id]
        );
      } else {
        await db.query(
          'UPDATE slider SET judul = ?, subjudul = ?, deskripsi = ?, link_url = ?, link_text = ?, urutan = ?, status = ? WHERE id = ?',
          [judul, subjudul, deskripsi, link_url, link_text, urutan || 0, status, req.params.id]
        );
      }
      
      res.redirect('/admin/slider');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM slider WHERE id = ?', [req.params.id]);
    res.redirect('/admin/slider');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};