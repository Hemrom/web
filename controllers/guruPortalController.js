const db = require('../config/database');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const compressImage = require('../middleware/compressImage');
const { createUpload } = require('../middleware/uploadSecurity');

const upload = createUpload('guru').single('foto');

// ── Auth ──────────────────────────────────────────────────────────────────────

exports.loginPage = (req, res) => {
  if (req.session.guruId) return res.redirect('/guru/dashboard');
  res.render('guru/login', { title: 'Login Guru', error: null });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query(
      'SELECT * FROM guru WHERE guru_username = ? AND guru_username IS NOT NULL',
      [username]
    );
    if (!rows.length) {
      return res.render('guru/login', { title: 'Login Guru', error: 'Username atau password salah' });
    }
    const guru = rows[0];
    const valid = await bcrypt.compare(password, guru.guru_password);
    if (!valid) {
      return res.render('guru/login', { title: 'Login Guru', error: 'Username atau password salah' });
    }
    req.session.guruId   = guru.id;
    req.session.guruNama = guru.nama;
    req.session.guruFoto = guru.foto;

    // Regenerate session ID setelah login
    const sessionData = { guruId: guru.id, guruNama: guru.nama, guruFoto: guru.foto };
    req.session.regenerate((err) => {
      if (err) { console.error(err); return res.status(500).send('Terjadi kesalahan'); }
      Object.assign(req.session, sessionData);
      res.redirect('/guru/dashboard');
    });
  } catch (err) {
    console.error(err);
    res.render('guru/login', { title: 'Login Guru', error: 'Terjadi kesalahan, coba lagi' });
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/guru/login');
};

// ── Dashboard ─────────────────────────────────────────────────────────────────

exports.dashboard = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    if (!rows.length) return res.redirect('/guru/login');
    const guru = rows[0];

    // Berita terbaru (5)
    const [berita] = await db.query(
      'SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 5'
    );

    res.render('guru/dashboard', {
      title: 'Dashboard Guru',
      guru,
      berita
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── Profil ────────────────────────────────────────────────────────────────────

exports.profilPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    if (!rows.length) return res.redirect('/guru/login');
    res.render('guru/profil', {
      title: 'Edit Profil',
      guru: rows[0],
      success: req.query.success,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.updateProfil = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    await compressImage(req, res, () => {});
    try {
      const { nama, nip, telepon, email, mata_pelajaran, jabatan, alamat, jenis_kelamin } = req.body;
      const foto = req.file ? req.file.filename : null;

      if (foto) {
        await db.query(
          'UPDATE guru SET nama=?, nip=?, telepon=?, email=?, mata_pelajaran=?, jabatan=?, alamat=?, jenis_kelamin=?, foto=? WHERE id=?',
          [nama, nip, telepon, email, mata_pelajaran, jabatan, alamat, jenis_kelamin || null, foto, req.session.guruId]
        );
        req.session.guruFoto = foto;
      } else {
        await db.query(
          'UPDATE guru SET nama=?, nip=?, telepon=?, email=?, mata_pelajaran=?, jabatan=?, alamat=?, jenis_kelamin=? WHERE id=?',
          [nama, nip, telepon, email, mata_pelajaran, jabatan, alamat, jenis_kelamin || null, req.session.guruId]
        );
      }
      req.session.guruNama = nama;
      res.redirect('/guru/profil?success=1');
    } catch (err) {
      console.error(err);
      const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
      res.render('guru/profil', { title: 'Edit Profil', guru: rows[0], success: null, error: 'Gagal menyimpan, coba lagi.' });
    }
  });
};

// ── Hapus Foto ────────────────────────────────────────────────────────────────

exports.deleteFoto = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT foto FROM guru WHERE id = ?', [req.session.guruId]);
    if (rows.length && rows[0].foto) {
      const filePath = `./uploads/${rows[0].foto}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('UPDATE guru SET foto = NULL WHERE id = ?', [req.session.guruId]);
    req.session.guruFoto = null;
    res.redirect('/guru/profil?success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── Ganti Password ────────────────────────────────────────────────────────────

exports.passwordPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
  res.render('guru/password', { title: 'Ganti Password', guru: rows[0], success: null, error: null });
};

exports.updatePassword = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
  const guru = rows[0];
  const renderErr = (msg) => res.render('guru/password', { title: 'Ganti Password', guru, success: null, error: msg });

  try {
    const { password_lama, password_baru, password_konfirmasi } = req.body;
    if (!await bcrypt.compare(password_lama, guru.guru_password)) return renderErr('Password lama salah');
    if (password_baru.length < 6) return renderErr('Password baru minimal 6 karakter');
    if (password_baru !== password_konfirmasi) return renderErr('Konfirmasi password tidak cocok');

    const hash = await bcrypt.hash(password_baru, 10);
    await db.query('UPDATE guru SET guru_password=? WHERE id=?', [hash, req.session.guruId]);
    res.render('guru/password', { title: 'Ganti Password', guru, success: 'Password berhasil diubah', error: null });
  } catch (err) {
    console.error(err);
    renderErr('Terjadi kesalahan');
  }
};
