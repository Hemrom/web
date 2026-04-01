const db = require('../config/database');
const crypto = require('crypto');
const { createUpload } = require('../middleware/uploadSecurity');

const upload = createUpload('alumni').single('foto');

// ── FRONTEND ──────────────────────────────────────────────────────────────────

// Halaman daftar alumni publik
exports.frontendIndex = async (req, res) => {
  try {
    const { getMenuItems, getMediaSosialFooter } = require('./frontendController');
    const [[alumni], [profil], menuItems, mediaSosialFooter] = await Promise.all([
      db.query("SELECT id,nama,tahun_lulus,jurusan,pekerjaan,perusahaan,kota,foto,cerita,instagram,linkedin FROM alumni WHERE status='disetujui' ORDER BY tahun_lulus DESC, nama ASC"),
      db.query('SELECT * FROM profil_sekolah LIMIT 1'),
      getMenuItems(),
      getMediaSosialFooter()
    ]);
    res.render('frontend/alumni', {
      title: 'Alumni', currentPage: 'alumni',
      alumni, profil: profil[0] || {}, menuItems, mediaSosialFooter
    });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

// Halaman form registrasi alumni
exports.registerPage = (req, res) => {
  res.render('frontend/alumni-register', {
    title: 'Daftar Alumni', currentPage: 'alumni',
    success: false, error: null
  });
};

// Proses registrasi alumni
exports.register = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: err.message });
    try {
      const { nama, nis, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, linkedin, cerita } = req.body;
      if (!nama || !tahun_lulus) return res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: 'Nama dan tahun lulus wajib diisi.' });
      const foto = req.file ? req.file.filename : null;
      const token = crypto.randomBytes(32).toString('hex');
      await db.query(
        'INSERT INTO alumni (nama,nis,tahun_lulus,jurusan,pekerjaan,perusahaan,kota,foto,email,telepon,instagram,linkedin,cerita,token,status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [nama, nis||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, linkedin||null, cerita||null, token, 'pending']
      );
      res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: true, error: null, token });
    } catch (err) { console.error(err); res.render('frontend/alumni-register', { title: 'Daftar Alumni', currentPage: 'alumni', success: false, error: 'Terjadi kesalahan, coba lagi.' }); }
  });
};

// Halaman edit biodata alumni (via token)
exports.editPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
    if (!rows.length) return res.status(404).send('Link tidak valid atau sudah kadaluarsa.');
    res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: rows[0], success: false, error: null });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// Proses update biodata alumni
exports.editSubmit = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      const [rows] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
      return res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: rows[0]||{}, success: false, error: err.message });
    }
    try {
      const [rows] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
      if (!rows.length) return res.status(404).send('Link tidak valid.');
      const { nama, nis, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, linkedin, cerita } = req.body;
      const foto = req.file ? req.file.filename : rows[0].foto;
      await db.query(
        'UPDATE alumni SET nama=?,nis=?,tahun_lulus=?,jurusan=?,pekerjaan=?,perusahaan=?,kota=?,foto=?,email=?,telepon=?,instagram=?,linkedin=?,cerita=?,status=? WHERE token=?',
        [nama, nis||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, linkedin||null, cerita||null, 'pending', req.params.token]
      );
      const [updated] = await db.query('SELECT * FROM alumni WHERE token = ?', [req.params.token]);
      res.render('frontend/alumni-edit', { title: 'Update Biodata Alumni', currentPage: 'alumni', alumni: updated[0], success: true, error: null });
    } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
  });
};

// ── ADMIN ─────────────────────────────────────────────────────────────────────

exports.adminIndex = async (req, res) => {
  try {
    const filter = req.query.status || 'semua';
    let q = 'SELECT * FROM alumni';
    if (filter !== 'semua') q += ` WHERE status='${db.escape(filter).replace(/'/g,"''")}'`;
    const [alumni] = await db.query(filter === 'semua' ? 'SELECT * FROM alumni ORDER BY created_at DESC' : 'SELECT * FROM alumni WHERE status=? ORDER BY created_at DESC', filter === 'semua' ? [] : [filter]);
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
    const { nama, nis, tahun_lulus, jurusan, pekerjaan, perusahaan, kota, email, telepon, instagram, linkedin, cerita, status } = req.body;
    const [rows] = await db.query('SELECT foto FROM alumni WHERE id=?', [req.params.id]);
    const foto = req.file ? req.file.filename : (rows[0]?.foto || null);
    await db.query('UPDATE alumni SET nama=?,nis=?,tahun_lulus=?,jurusan=?,pekerjaan=?,perusahaan=?,kota=?,foto=?,email=?,telepon=?,instagram=?,linkedin=?,cerita=?,status=? WHERE id=?',
      [nama, nis||null, tahun_lulus, jurusan||null, pekerjaan||null, perusahaan||null, kota||null, foto, email||null, telepon||null, instagram||null, linkedin||null, cerita||null, status, req.params.id]);
    res.redirect('/admin/alumni?success=2');
  });
};

exports.adminSetujui = async (req, res) => {
  await db.query("UPDATE alumni SET status='disetujui' WHERE id=?", [req.params.id]);
  res.redirect('/admin/alumni?success=3');
};

exports.adminTolak = async (req, res) => {
  await db.query("UPDATE alumni SET status='ditolak' WHERE id=?", [req.params.id]);
  res.redirect('/admin/alumni?success=4');
};

exports.adminDelete = async (req, res) => {
  await db.query('DELETE FROM alumni WHERE id=?', [req.params.id]);
  res.redirect('/admin/alumni?success=5');
};
