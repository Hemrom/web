const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const compressImage = require('../middleware/compressImage');
const { createUpload } = require('../middleware/uploadSecurity');

// Pastikan folder uploads ada
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads', { recursive: true });

const uploadMulti = createUpload('galeri', { maxFiles: 30 }).array('gambar', 30);
const uploadSingle = createUpload('galeri').single('gambar');

exports.index = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM galeri ORDER BY judul ASC, created_at DESC');
    // Group by judul
    const albumMap = {};
    rows.forEach(item => {
      const key = item.judul;
      if (!albumMap[key]) {
        albumMap[key] = { judul: item.judul, kategori: item.kategori, deskripsi: item.deskripsi, cover: item.gambar, fotos: [], id: item.id };
      }
      albumMap[key].fotos.push(item);
    });
    const albums = Object.values(albumMap);
    res.render('admin/galeri/index', { title: 'Kelola Galeri', user: req.session, albums, success: req.query.success });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/galeri/create', { title: 'Tambah Galeri', user: req.session });
};

exports.create = (req, res) => {
  uploadMulti(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).send(`
        <div style="font-family:sans-serif;padding:2rem;max-width:600px;margin:2rem auto;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;">
          <h3 style="color:#856404;">⚠️ Gagal Upload</h3>
          <p>${err.message}</p>
          <a href="/admin/galeri/create" style="color:#0ea5e9;">← Kembali</a>
        </div>
      `);
    }
    try {
      if (!req.files || req.files.length === 0) return res.status(400).send('Minimal 1 gambar harus diupload');
      // Kompres + konversi HEIC ke JPG
      await compressImage(req, res, () => {});
      const { judul, deskripsi, kategori } = req.body;
      for (let i = 0; i < req.files.length; i++) {
        const judulItem = Array.isArray(judul) ? (judul[i] || judul[0]) : judul;
        const deskripsiItem = Array.isArray(deskripsi) ? (deskripsi[i] || '') : (deskripsi || '');
        // Pakai filename terbaru (mungkin sudah diganti .jpg oleh compressImage)
        await db.query('INSERT INTO galeri (judul, deskripsi, gambar, kategori) VALUES (?, ?, ?, ?)',
          [judulItem, deskripsiItem, req.files[i].filename, kategori]);
      }
      res.redirect('/admin/galeri?success=1');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
  });
};

exports.editPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM galeri WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.redirect('/admin/galeri');
    res.render('admin/galeri/edit', { title: 'Edit Galeri', user: req.session, item: rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload file');
    await compressImage(req, res, () => {});
    try {
      const { judul, deskripsi, kategori } = req.body;
      const gambar = req.file ? req.file.filename : null;
      if (gambar) {
        await db.query('UPDATE galeri SET judul=?, deskripsi=?, gambar=?, kategori=? WHERE id=?',
          [judul, deskripsi, gambar, kategori, req.params.id]);
      } else {
        await db.query('UPDATE galeri SET judul=?, deskripsi=?, kategori=? WHERE id=?',
          [judul, deskripsi, kategori, req.params.id]);
      }
      res.redirect('/admin/galeri?success=2');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM galeri WHERE id = ?', [req.params.id]);
    res.redirect('/admin/galeri?success=3');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.deleteAlbum = async (req, res) => {
  try {
    await db.query('DELETE FROM galeri WHERE judul = ?', [req.body.judul]);
    res.redirect('/admin/galeri?success=3');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.addToAlbum = (req, res) => {
  uploadMulti(req, res, async (err) => {
    if (err) {
      console.error('Upload error:', err);
      return res.status(400).send(`
        <div style="font-family:sans-serif;padding:2rem;max-width:600px;margin:2rem auto;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;">
          <h3 style="color:#856404;">⚠️ Gagal Upload</h3>
          <p>${err.message}</p>
          <a href="/admin/galeri" style="color:#0ea5e9;">← Kembali</a>
        </div>
      `);
    }
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/admin/galeri?success=nofile');
      await compressImage(req, res, () => {});
      const { judul, deskripsi, kategori } = req.body;
      for (let i = 0; i < req.files.length; i++) {
        await db.query('INSERT INTO galeri (judul, deskripsi, gambar, kategori) VALUES (?, ?, ?, ?)',
          [judul, deskripsi || '', req.files[i].filename, kategori || '']);
      }
      res.redirect('/admin/galeri?success=4');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan: ' + error.message);
    }
  });
};
