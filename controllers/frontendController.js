const db = require('../config/database');

exports.home = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [beritaTerbaru] = await db.query(
      'SELECT * FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 6'
    );
    const [galeri] = await db.query('SELECT * FROM galeri ORDER BY created_at DESC LIMIT 6');
    const [slider] = await db.query('SELECT * FROM slider WHERE status = "aktif" ORDER BY urutan ASC, created_at DESC');
    
    res.render('frontend/home', {
      title: 'Beranda',
      currentPage: 'home',
      profil: profil[0] || {},
      berita: beritaTerbaru,
      galeri,
      slider
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.profil = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    res.render('frontend/profil', {
      title: 'Profil Sekolah',
      currentPage: 'profil',
      profil: profil[0] || {}
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.berita = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    
    const [berita] = await db.query(
      'SELECT * FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    const [total] = await db.query('SELECT COUNT(*) as count FROM berita WHERE status = "published"');
    
    res.render('frontend/berita', {
      title: 'Berita',
      currentPage: 'berita',
      berita,
      currentPage: page,
      totalPages: Math.ceil(total[0].count / limit)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.beritaDetail = async (req, res) => {
  try {
    const [berita] = await db.query(
      'SELECT b.*, u.nama_lengkap as penulis FROM berita b LEFT JOIN users u ON b.penulis_id = u.id WHERE b.slug = ? AND b.status = "published"',
      [req.params.slug]
    );
    
    if (berita.length === 0) {
      return res.status(404).render('frontend/404', { title: 'Berita Tidak Ditemukan' });
    }
    
    const [beritaTerkait] = await db.query(
      'SELECT * FROM berita WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 3',
      [berita[0].id]
    );
    
    res.render('frontend/berita-detail', {
      title: berita[0].judul,
      berita: berita[0],
      beritaTerkait
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.galeri = async (req, res) => {
  try {
    const [galeri] = await db.query('SELECT * FROM galeri ORDER BY created_at DESC');
    res.render('frontend/galeri', {
      title: 'Galeri',
      currentPage: 'galeri',
      galeri
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guru = async (req, res) => {
  try {
    const [guru] = await db.query('SELECT * FROM guru ORDER BY nama ASC');
    res.render('frontend/guru', {
      title: 'Guru & Staff',
      currentPage: 'guru',
      guru
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.kontakPage = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    res.render('frontend/kontak', {
      title: 'Kontak',
      currentPage: 'kontak',
      profil: profil[0] || {},
      success: req.query.success
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.kontakSubmit = async (req, res) => {
  try {
    const { nama, email, subjek, pesan } = req.body;
    await db.query(
      'INSERT INTO kontak_masuk (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)',
      [nama, email, subjek, pesan]
    );
    res.redirect('/kontak?success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.mediaSosial = async (req, res) => {
  try {
    const [mediaSosial] = await db.query('SELECT * FROM media_sosial WHERE status = "aktif" ORDER BY urutan ASC, created_at DESC');
    res.render('frontend/media-sosial', {
      title: 'Media Sosial',
      currentPage: 'media-sosial',
      mediaSosial
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};
