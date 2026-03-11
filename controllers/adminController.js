const db = require('../config/database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('logo');

exports.loginPage = (req, res) => {
  if (req.session.userId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Login Admin', error: null });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.render('admin/login', { title: 'Login Admin', error: 'Username atau password salah' });
    }
    
    const user = users[0];
    const isValid = await bcrypt.compare(password, user.password);
    
    if (!isValid) {
      return res.render('admin/login', { title: 'Login Admin', error: 'Username atau password salah' });
    }
    
    req.session.userId = user.id;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.nama = user.nama_lengkap;
    
    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/admin/login');
};

exports.dashboard = async (req, res) => {
  try {
    const [beritaCount] = await db.query('SELECT COUNT(*) as count FROM berita');
    const [galeriCount] = await db.query('SELECT COUNT(*) as count FROM galeri');
    const [guruCount] = await db.query('SELECT COUNT(*) as count FROM guru');
    const [kontakCount] = await db.query('SELECT COUNT(*) as count FROM kontak_masuk WHERE status = "baru"');
    
    res.render('admin/dashboard', {
      title: 'Dashboard',
      user: req.session,
      stats: {
        berita: beritaCount[0].count,
        galeri: galeriCount[0].count,
        guru: guruCount[0].count,
        kontak: kontakCount[0].count
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.profilPage = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    res.render('admin/profil', {
      title: 'Profil Sekolah',
      user: req.session,
      profil: profil[0] || {},
      success: req.query.success
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.updateProfil = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    
    try {
      const { nama_sekolah, alamat, telepon, email, visi, misi } = req.body;
      const logo = req.file ? req.file.filename : null;
      
      const [existing] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
      
      if (existing.length === 0) {
        await db.query(
          'INSERT INTO profil_sekolah (nama_sekolah, alamat, telepon, email, visi, misi, logo) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [nama_sekolah, alamat, telepon, email, visi, misi, logo]
        );
      } else {
        if (logo) {
          await db.query(
            'UPDATE profil_sekolah SET nama_sekolah = ?, alamat = ?, telepon = ?, email = ?, visi = ?, misi = ?, logo = ? WHERE id = ?',
            [nama_sekolah, alamat, telepon, email, visi, misi, logo, existing[0].id]
          );
        } else {
          await db.query(
            'UPDATE profil_sekolah SET nama_sekolah = ?, alamat = ?, telepon = ?, email = ?, visi = ?, misi = ? WHERE id = ?',
            [nama_sekolah, alamat, telepon, email, visi, misi, existing[0].id]
          );
        }
      }
      
      res.redirect('/admin/profil?success=1');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.kontakMasuk = async (req, res) => {
  try {
    const [kontak] = await db.query('SELECT * FROM kontak_masuk ORDER BY created_at DESC');
    res.render('admin/kontak', {
      title: 'Kontak Masuk',
      user: req.session,
      kontak
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.updateStatusKontak = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE kontak_masuk SET status = ? WHERE id = ?', [status, req.params.id]);
    res.redirect('/admin/kontak');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};
