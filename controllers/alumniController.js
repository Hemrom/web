const db = require('../config/database');
const crypto = require('crypto');
const { createUpload } = require('../middleware/uploadSecurity');
const compressImage = require('../middleware/compressImage');
const cache = require('../utils/cache');

const upload = createUpload('alumni').single('foto');

const clearHomeAlumniCache = () => cache.del('home_alumni');

const getCommonData = async () => {
  const { getMenuItems } = require('./frontendController');
  const cached = cache.get('media_sosial_footer');
  const mediaSosialFooter = cached || await (async () => {
    const [rows] = await db.query("SELECT id,judul,platform,embed_url FROM media_sosial WHERE status='aktif' ORDER BY urutan ASC");
    cache.set('media_sosial_footer', rows, 300);
    return rows;
  })();
  const [[profilRows], menuItems] = await Promise.all([
    db.query('SELECT * FROM profil_sekolah LIMIT 1'),
    getMenuItems()
  ]);
  return { profil: profilRows || {}, menuItems, mediaSosialFooter };
};

// ── FRONTEND ──────────────────────────────────────────────────────────────────

exports.frontendIndex = async (req, res) => {
  try {
    const common = await getCommonData();
    const [alumni] = await db.query("SELECT id,nama,tahun_lulus,jurusan,pekerjaan,perusahaan,kota,foto,cerita,instagram,tiktok FROM alumni WHERE status='disetujui' ORDER BY tahun_lulus DESC, nama ASC");
    res.render('frontend/alumni', { title: 'Alumni', currentPage: 'alumni', alumni, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.registerPage = async (req, res) => {
  try {
    const common = await getCommonData();
    res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: null, token: null, ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.register = (req, res) => {
  upload(req, res, async (err) => {
    const common = await getCommonData();
    if (err) return res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: err.message, token: null, ...common });
    try {
      await compressImage(req, res, () => {});
      const { nama, nisn, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, tiktok, cerita } = req.body;
      if (!nama || !tahun_lulus) return res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: 'Nama dan tahun lulus wajib diisi.', token: null, ...common });
      const foto = req.file ? req.file.filename : null;
      const token = crypto.randomBytes(32).toString('hex');
      await db.query(
        'INSERT INTO alumni (nama,nisn,tahun_lulus,jurusan,pekerjaan,perusahaan,kota,foto,email,telepon,instagram,tiktok,cerita,token,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nama, nisn||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, tiktok||null, cerita||null, token, 'pending']
      );
      res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: true, error: null, token, ...common });
    } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
  });
};

exports.updatePage = async (req, res) => {
  try {
    if (req.query.token) return res.redirect('/alumni/edit/' + req.query.token);
    const common = await getCommonData();
    res.render('frontend/alumni-update', { title: 'Update Biodata Alumni', currentPage: 'alumni', error: null, ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.editPage = async (req, res) => {
  try {
    const common = await getCommonData();
    const [rows] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
    if (!rows.length) return res.status(404).send('Link tidak valid atau sudah kadaluarsa.');
    res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: rows[0], success: false, error: null, ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.editSubmit = (req, res) => {
  upload(req, res, async (err) => {
    const common = await getCommonData();
    const [rows] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
    if (!rows.length) return res.status(404).send('Link tidak valid.');
    if (err) return res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: rows[0], success: false, error: err.message, ...common });
    try {
      await compressImage(req, res, () => {});
      const { nama, nisn, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, tiktok, cerita } = req.body;
      const foto = req.file ? req.file.filename : rows[0].foto;
      await db.query(
        'UPDATE alumni SET nama=?,nisn=?,tahun_lulus=?,jurusan=?,pekerjaan=?,perusahaan=?,kota=?,foto=?,email=?,telepon=?,instagram=?,tiktok=?,cerita=?,status=? WHERE token=?',
        [nama, nisn||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, tiktok||null, cerita||null, 'pending', req.params.token]
      );
      const [updated] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
      res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: updated[0], success: true, error: null, ...common });
    } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
  });
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.adminIndex = async (req, res) => {
  try {
    const filter = req.query.status || 'semua';
    const [alumni] = await db.query(
      filter === 'semua' ? 'SELECT * FROM alumni ORDER BY created_at DESC' : 'SELECT * FROM alumni WHERE status=? ORDER BY created_at DESC',
      filter === 'semua' ? [] : [filter]
    );
    const [[stats]] = await db.query('SELECT COUNT(*) as total, SUM(status="pending") as pending, SUM(status="disetujui") as disetujui, SUM(status="ditolak") as ditolak FROM alumni');
    res.render('admin/alumni/index', { title: 'Data Alumni', user: req.session, alumni, stats, filter, success: req.query.success });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.adminEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM alumni WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/alumni');
  res.render('admin/alumni/edit', { title: 'Edit Alumni', user: req.session, alumni: rows[0] });
};

exports.adminUpdate = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.redirect('/admin/alumni?success=0');
    await compressImage(req, res, () => {});
    const { nama, nisn, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, tiktok, cerita, status } = req.body;
    const [rows] = await db.query('SELECT foto FROM alumni WHERE id=?', [req.params.id]);
    const foto = req.file ? req.file.filename : (rows[0]?.foto || null);
    await db.query('UPDATE alumni SET nama=?,nisn=?,tahun_lulus=?,jurusan=?,pekerjaan=?,perusahaan=?,kota=?,foto=?,email=?,telepon=?,instagram=?,tiktok=?,cerita=?,status=? WHERE id=?',
      [nama, nisn||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, tiktok||null, cerita||null, status, req.params.id]);
    clearHomeAlumniCache();
    res.redirect('/admin/alumni?success=2');
  });
};

exports.adminSetujui = async (req, res) => {
  await db.query("UPDATE alumni SET status='disetujui' WHERE id=?", [req.params.id]);
  clearHomeAlumniCache();
  res.redirect('/admin/alumni?success=3');
};

exports.adminTolak = async (req, res) => {
  await db.query("UPDATE alumni SET status='ditolak' WHERE id=?", [req.params.id]);
  clearHomeAlumniCache();
  res.redirect('/admin/alumni?success=4');
};

exports.adminDelete = async (req, res) => {
  await db.query('DELETE FROM alumni WHERE id=?', [req.params.id]);
  clearHomeAlumniCache();
  res.redirect('/admin/alumni?success=5');
};
