const db = require('../config/database');
const { createUpload } = require('../middleware/uploadSecurity');
const compressImage = require('../middleware/compressImage');

const upload = createUpload('artikel').single('gambar');

const createSlug = (text) => text.toLowerCase()
  .replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/--+/g, '-').trim();

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.adminIndex = async (req, res) => {
  try {
    const [artikel] = await db.query(
      'SELECT * FROM artikel ORDER BY created_at DESC'
    );
    res.render('admin/artikel/index', { title: 'Kelola Artikel', user: req.session, artikel });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminCreatePage = (req, res) => {
  res.render('admin/artikel/create', { title: 'Tambah Artikel', user: req.session });
};

exports.adminCreate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, ringkasan, kategori, status, tampil_home } = req.body;
      let slug = createSlug(judul);
      const [exist] = await db.query('SELECT id FROM artikel WHERE slug = ?', [slug]);
      if (exist.length) slug = slug + '-' + Date.now();
      const gambar = req.file ? req.file.filename : null;
      await db.query(
        'INSERT INTO artikel (judul, slug, konten, ringkasan, gambar, kategori, penulis_id, penulis_nama, penulis_tipe, status, tampil_home) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [judul, slug, konten, ringkasan, gambar, kategori || 'Umum', req.session.userId, req.session.nama_lengkap || 'Admin', 'admin', status || 'draft', tampil_home ? 1 : 0]
      );
      res.redirect('/admin/artikel');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminEditPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM artikel WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Tidak ditemukan');
    res.render('admin/artikel/edit', { title: 'Edit Artikel', user: req.session, artikel: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminUpdate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, ringkasan, kategori, status, tampil_home } = req.body;
      const [rows] = await db.query('SELECT * FROM artikel WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).send('Tidak ditemukan');
      const gambar = req.file ? req.file.filename : rows[0].gambar;
      await db.query(
        'UPDATE artikel SET judul=?, konten=?, ringkasan=?, gambar=?, kategori=?, status=?, tampil_home=? WHERE id=?',
        [judul, konten, ringkasan, gambar, kategori || 'Umum', status || 'draft', tampil_home ? 1 : 0, req.params.id]
      );
      res.redirect('/admin/artikel');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminDelete = async (req, res) => {
  try {
    await db.query('DELETE FROM artikel WHERE id = ?', [req.params.id]);
    res.redirect('/admin/artikel');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── GURU ──────────────────────────────────────────────────────────────────────

exports.guruIndex = async (req, res) => {
  try {
    const [artikel] = await db.query(
      'SELECT * FROM artikel WHERE penulis_id = ? AND penulis_tipe = "guru" ORDER BY created_at DESC',
      [req.session.guruId]
    );
    const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    res.render('guru/artikel/index', { title: 'Artikel Saya', guru: guru[0], artikel });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guruCreatePage = async (req, res) => {
  const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
  res.render('guru/artikel/create', { title: 'Tulis Artikel', guru: guru[0] });
};

exports.guruCreate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, ringkasan, kategori, status } = req.body;
      let slug = createSlug(judul);
      const [exist] = await db.query('SELECT id FROM artikel WHERE slug = ?', [slug]);
      if (exist.length) slug = slug + '-' + Date.now();
      const gambar = req.file ? req.file.filename : null;
      const [guru] = await db.query('SELECT nama FROM guru WHERE id = ?', [req.session.guruId]);
      await db.query(
        'INSERT INTO artikel (judul, slug, konten, ringkasan, gambar, kategori, penulis_id, penulis_nama, penulis_tipe, status, tampil_home) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
        [judul, slug, konten, ringkasan, gambar, kategori || 'Umum', req.session.guruId, guru[0].nama, 'guru', status || 'draft', 0]
      );
      res.redirect('/guru/artikel');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.guruEditPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM artikel WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
    if (!rows.length) return res.status(404).send('Tidak ditemukan');
    const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    res.render('guru/artikel/edit', { title: 'Edit Artikel', guru: guru[0], artikel: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guruUpdate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, ringkasan, kategori, status } = req.body;
      const [rows] = await db.query('SELECT * FROM artikel WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
      if (!rows.length) return res.status(404).send('Tidak ditemukan');
      const gambar = req.file ? req.file.filename : rows[0].gambar;
      await db.query(
        'UPDATE artikel SET judul=?, konten=?, ringkasan=?, gambar=?, kategori=?, status=? WHERE id=? AND penulis_id=? AND penulis_tipe="guru"',
        [judul, konten, ringkasan, gambar, kategori || 'Umum', status || 'draft', req.params.id, req.session.guruId]
      );
      res.redirect('/guru/artikel');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.guruDelete = async (req, res) => {
  try {
    await db.query('DELETE FROM artikel WHERE id = ? AND penulis_id = ? AND penulis_tipe = "guru"', [req.params.id, req.session.guruId]);
    res.redirect('/guru/artikel');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── FRONTEND ──────────────────────────────────────────────────────────────────

exports.frontendIndex = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 9;
    const offset = (page - 1) * limit;
    const kategori = req.query.kategori || '';

    let whereClause = 'WHERE status = "published"';
    let params = [];
    if (kategori) { whereClause += ' AND kategori = ?'; params.push(kategori); }

    const [[{ total }]] = await db.query(`SELECT COUNT(*) as total FROM artikel ${whereClause}`, params);
    const [artikel] = await db.query(
      `SELECT * FROM artikel ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [...params, limit, offset]
    );
    const [kategoriList] = await db.query('SELECT DISTINCT kategori FROM artikel WHERE status = "published" ORDER BY kategori ASC');

    const { getMenuItems, getMediaSosialFooter, getProfilSekolah } = require('./frontendController');
    const [menuItems, mediaSosialFooter, profil] = await Promise.all([
      getMenuItems(), getMediaSosialFooter(), getProfilSekolah()
    ]);

    res.render('frontend/artikel', {
      title: 'Artikel', currentPage: 'artikel',
      artikel, kategoriList, kategoriAktif: kategori,
      totalPages: Math.ceil(total / limit), currentPageNum: page,
      menuItems, mediaSosialFooter, profil
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.frontendDetail = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM artikel WHERE slug = ? AND status = "published"', [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404' });
    const artikel = rows[0];
    await db.query('UPDATE artikel SET views = views + 1 WHERE id = ?', [artikel.id]);

    const [related] = await db.query(
      'SELECT id, judul, slug, gambar, created_at, penulis_nama FROM artikel WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 4',
      [artikel.id]
    );

    const { getMenuItems, getMediaSosialFooter, getProfilSekolah } = require('./frontendController');
    const [menuItems, mediaSosialFooter, profil] = await Promise.all([
      getMenuItems(), getMediaSosialFooter(), getProfilSekolah()
    ]);

    res.render('frontend/artikel-detail', {
      title: artikel.judul, currentPage: 'artikel',
      artikel, related, menuItems, mediaSosialFooter, profil
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
