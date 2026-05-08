const db = require('../config/database');
const { createUpload } = require('../middleware/uploadSecurity');
const compressImage = require('../middleware/compressImage');

const upload = createUpload('agenda').single('gambar');

const createSlug = (text) => {
  return text.toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.adminIndex = async (req, res) => {
  try {
    const [agenda] = await db.query('SELECT * FROM agenda ORDER BY tanggal_mulai DESC');
    res.render('admin/agenda/index', { title: 'Kelola Agenda', user: req.session, agenda });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminCreatePage = (req, res) => {
  res.render('admin/agenda/create', { title: 'Tambah Agenda', user: req.session });
};

exports.adminCreate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload: ' + err.message);
    await compressImage(req, res, () => {});
    try {
      const { judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, lokasi, koordinator_nama, koordinator_email, koordinator_telp, status, tampil_home } = req.body;
      let slug = createSlug(judul);
      const [exist] = await db.query('SELECT id FROM agenda WHERE slug = ?', [slug]);
      if (exist.length) slug = slug + '-' + Date.now();
      const gambar = req.file ? req.file.filename : null;
      await db.query(
        'INSERT INTO agenda (judul, slug, deskripsi, gambar, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, lokasi, koordinator_nama, koordinator_email, koordinator_telp, status, tampil_home) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [judul, slug, deskripsi || null, gambar, tanggal_mulai, tanggal_selesai || null, waktu_mulai || null, waktu_selesai || null, lokasi || null, koordinator_nama || null, koordinator_email || null, koordinator_telp || null, status || 'aktif', tampil_home ? 1 : 0]
      );
      res.redirect('/admin/agenda');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminEditPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM agenda WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).send('Agenda tidak ditemukan');
    res.render('admin/agenda/edit', { title: 'Edit Agenda', user: req.session, agenda: rows[0] });
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
      const { judul, deskripsi, tanggal_mulai, tanggal_selesai, waktu_mulai, waktu_selesai, lokasi, koordinator_nama, koordinator_email, koordinator_telp, status, tampil_home } = req.body;
      const [rows] = await db.query('SELECT * FROM agenda WHERE id = ?', [req.params.id]);
      if (!rows.length) return res.status(404).send('Agenda tidak ditemukan');
      const gambar = req.file ? req.file.filename : rows[0].gambar;
      await db.query(
        'UPDATE agenda SET judul=?, deskripsi=?, gambar=?, tanggal_mulai=?, tanggal_selesai=?, waktu_mulai=?, waktu_selesai=?, lokasi=?, koordinator_nama=?, koordinator_email=?, koordinator_telp=?, status=?, tampil_home=? WHERE id=?',
        [judul, deskripsi || null, gambar, tanggal_mulai, tanggal_selesai || null, waktu_mulai || null, waktu_selesai || null, lokasi || null, koordinator_nama || null, koordinator_email || null, koordinator_telp || null, status || 'aktif', tampil_home ? 1 : 0, req.params.id]
      );
      res.redirect('/admin/agenda');
    } catch (e) {
      console.error(e);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.adminDelete = async (req, res) => {
  try {
    await db.query('DELETE FROM agenda WHERE id = ?', [req.params.id]);
    res.redirect('/admin/agenda');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ── FRONTEND ──────────────────────────────────────────────────────────────────

exports.frontendIndex = async (req, res) => {
  try {
    const frontendController = require('./frontendController');
    const [agenda] = await db.query("SELECT * FROM agenda WHERE status='aktif' ORDER BY tanggal_mulai DESC");
    const [profil, menuItems, mediaSosialFooter] = await Promise.all([
      frontendController.getProfilSekolah(),
      frontendController.getMenuItems(),
      frontendController.getMediaSosialFooter()
    ]);
    const [artikel] = await db.query("SELECT id, judul, slug, gambar, kategori, created_at FROM artikel WHERE status='published' ORDER BY created_at DESC LIMIT 4");
    const [beritaSlider] = await db.query("SELECT id, judul, slug, gambar, kategori, created_at FROM berita WHERE status='published' ORDER BY created_at DESC LIMIT 5");
    res.render('frontend/agenda', { title: 'Agenda Sekolah', currentPage: 'agenda', agenda, profil, menuItems, mediaSosialFooter, artikel, beritaSlider });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.frontendDetail = async (req, res) => {
  try {
    const frontendController = require('./frontendController');
    const [rows] = await db.query("SELECT * FROM agenda WHERE slug = ? AND status='aktif'", [req.params.slug]);
    if (!rows.length) {
      const menuItems = await frontendController.getMenuItems();
      return res.status(404).render('frontend/404', { title: 'Agenda Tidak Ditemukan', menuItems });
    }
    const agendaItem = rows[0];
    const [profil, menuItems, mediaSosialFooter] = await Promise.all([
      frontendController.getProfilSekolah(),
      frontendController.getMenuItems(),
      frontendController.getMediaSosialFooter()
    ]);
    const [artikel] = await db.query("SELECT id, judul, slug, gambar, kategori, created_at FROM artikel WHERE status='published' ORDER BY created_at DESC LIMIT 4");
    const [beritaSlider] = await db.query("SELECT id, judul, slug, gambar, kategori, created_at FROM berita WHERE status='published' ORDER BY created_at DESC LIMIT 5");
    const [agendaLain] = await db.query("SELECT * FROM agenda WHERE status='aktif' AND id != ? ORDER BY tanggal_mulai DESC LIMIT 4", [agendaItem.id]);
    res.render('frontend/agenda-detail', { title: agendaItem.judul, currentPage: 'agenda', agenda: agendaItem, profil, menuItems, mediaSosialFooter, artikel, beritaSlider, agendaLain });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
