const db = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { createUpload } = require('../middleware/uploadSecurity');
const { loginLimiter } = require('../middleware/security');

const uploadSingle = createUpload('portal').single('gambar');
const uploadPortalForm = createUpload('portal', { maxFiles: 5 }).single('gambar');

// Helper: render portal view dengan csrfToken otomatis
const portalRender = (res, req, view, data) => {
  res.render(view, { csrfToken: req.session.csrfToken, ...data });
};

const createSlug = (text) => text.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
  + '-' + Date.now().toString(36);

const getCommon = async () => {
  const { getMenuItems } = require('./frontendController');
  const [[profilRows], menuItems] = await Promise.all([
    db.query('SELECT * FROM profil_sekolah LIMIT 1'),
    getMenuItems()
  ]);
  const profil = profilRows || {};
  const [mediaSosialFooter] = await db.query("SELECT id,judul,platform,embed_url FROM media_sosial WHERE status='aktif' ORDER BY urutan ASC");
  return { profil, menuItems, mediaSosialFooter };
};

// ── FRONTEND PRESTASI ─────────────────────────────────────────────────────────
exports.prestasiIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const kategori = req.query.kategori || '';
    const [prestasi] = await db.query(
      kategori
        ? "SELECT * FROM prestasi WHERE status='published' AND kategori=? ORDER BY tahun DESC, created_at DESC"
        : "SELECT * FROM prestasi WHERE status='published' ORDER BY tahun DESC, created_at DESC",
      kategori ? [kategori] : []
    );
    res.render('frontend/prestasi', { title: 'Prestasi', currentPage: 'prestasi', prestasi, kategori, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.prestasiDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM prestasi WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/prestasi-detail', { title: rows[0].judul, prestasi: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── FRONTEND BKK ──────────────────────────────────────────────────────────────
exports.bkkIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [lowongan] = await db.query("SELECT * FROM bkk_lowongan WHERE status='aktif' ORDER BY created_at DESC");
    res.render('frontend/bkk', { title: 'BKK - Bursa Kerja Khusus', currentPage: 'bkk', lowongan, ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.bkkDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM bkk_lowongan WHERE slug=? AND status='aktif'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/bkk-detail', { title: rows[0].judul, lowongan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── FRONTEND OSIS ─────────────────────────────────────────────────────────────
exports.osisIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [kegiatan] = await db.query("SELECT * FROM osis_kegiatan WHERE status='published' ORDER BY created_at DESC");
    res.render('frontend/osis', { title: 'OSIS', currentPage: 'osis', kegiatan, ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.osisDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM osis_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/osis-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL LOGIN (shared) ─────────────────────────────────────────────────────
exports.portalLoginPage = (role, title) => (req, res) => {
  if (req.session.portalId && req.session.portalRole === role) return res.redirect(`/${role === 'jurusan' ? 'jurusan-portal' : role}/dashboard`);
  res.render('portal/login', { title, role, error: null });
};

exports.portalLogin = (role) => async (req, res) => {
  try {
    const { username, password } = req.body;
    const [rows] = await db.query('SELECT * FROM portal_users WHERE username=? AND role=? AND aktif=1', [username, role]);
    if (!rows.length) return res.render('portal/login', { title: `Login ${role.toUpperCase()}`, role, error: 'Username atau password salah' });
    const valid = await bcrypt.compare(password, rows[0].password);
    if (!valid) return res.render('portal/login', { title: `Login ${role.toUpperCase()}`, role, error: 'Username atau password salah' });
    req.session.portalId = rows[0].id;
    req.session.portalRole = rows[0].role;
    req.session.portalNama = rows[0].nama;
    req.session.portalJurusan = rows[0].jurusan;
    const redirect = role === 'jurusan' ? '/jurusan-portal/dashboard' : `/${role}/dashboard`;
    res.redirect(redirect);
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.portalLogout = (role) => (req, res) => {
  req.session.portalId = null;
  req.session.portalRole = null;
  req.session.portalNama = null;
  const redirect = role === 'jurusan' ? '/jurusan-portal/login' : `/${role}/login`;
  res.redirect(redirect);
};

// ── PORTAL BKK DASHBOARD ──────────────────────────────────────────────────────
exports.bkkDashboard = async (req, res) => {
  const [lowongan] = await db.query('SELECT * FROM bkk_lowongan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/bkk/dashboard', { title: 'Dashboard BKK', user: req.session, lowongan, success: req.query.success });
};

exports.bkkCreatePage = (req, res) => portalRender(res, req, 'portal/bkk/create', { title: 'Tambah Lowongan', user: req.session });

exports.bkkCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/bkk/create', { title: 'Tambah Lowongan', user: req.session, error: err.message });
    const { judul, perusahaan, lokasi, deskripsi, persyaratan, kategori, deadline, kontak, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO bkk_lowongan (judul,slug,perusahaan,lokasi,deskripsi,persyaratan,gambar,kategori,deadline,kontak,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [judul, slug, perusahaan, lokasi||null, deskripsi||null, persyaratan||null, gambar, kategori||'kerja', deadline||null, kontak||null, status||'aktif']);
    res.redirect('/bkk/dashboard?success=1');
  });
};

exports.bkkEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bkk_lowongan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/bkk/dashboard');
  portalRender(res, req, 'portal/bkk/edit', { title: 'Edit Lowongan', user: req.session, item: rows[0] });
};

exports.bkkUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/bkk/dashboard');
    const { judul, perusahaan, lokasi, deskripsi, persyaratan, kategori, deadline, kontak, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bkk_lowongan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bkk_lowongan SET judul=?,perusahaan=?,lokasi=?,deskripsi=?,persyaratan=?,gambar=?,kategori=?,deadline=?,kontak=?,status=? WHERE id=?',
      [judul, perusahaan, lokasi||null, deskripsi||null, persyaratan||null, gambar, kategori||'kerja', deadline||null, kontak||null, status||'aktif', req.params.id]);
    res.redirect('/bkk/dashboard?success=2');
  });
};

exports.bkkDelete = async (req, res) => {
  await db.query('DELETE FROM bkk_lowongan WHERE id=?', [req.params.id]);
  res.redirect('/bkk/dashboard?success=3');
};

// ── PORTAL OSIS DASHBOARD ─────────────────────────────────────────────────────
exports.osisDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM osis_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/osis/dashboard', { title: 'Dashboard OSIS', user: req.session, kegiatan, success: req.query.success });
};

exports.osisCreatePage = (req, res) => portalRender(res, req, 'portal/osis/create', { title: 'Tambah Kegiatan', user: req.session });

exports.osisCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/osis/create', { title: 'Tambah Kegiatan', user: req.session, error: err.message });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO osis_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
    res.redirect('/osis/dashboard?success=1');
  });
};

exports.osisEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM osis_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/osis/dashboard');
  portalRender(res, req, 'portal/osis/edit', { title: 'Edit Kegiatan', user: req.session, item: rows[0] });
};

exports.osisUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/osis/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM osis_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE osis_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/osis/dashboard?success=2');
  });
};

exports.osisDelete = async (req, res) => {
  await db.query('DELETE FROM osis_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/osis/dashboard?success=3');
};

// ── PORTAL JURUSAN DASHBOARD ──────────────────────────────────────────────────
exports.jurusanDashboard = async (req, res) => {
  const jurusan = req.session.portalJurusan;
  const [prestasi] = await db.query('SELECT * FROM prestasi WHERE jurusan=? ORDER BY created_at DESC', [jurusan]);
  portalRender(res, req, 'portal/jurusan/dashboard', { title: `Dashboard Jurusan ${jurusan}`, user: req.session, prestasi, jurusan, success: req.query.success });
};

exports.jurusanCreatePage = (req, res) => portalRender(res, req, 'portal/jurusan/create', { title: 'Tambah Prestasi', user: req.session });

exports.jurusanCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/jurusan/create', { title: 'Tambah Prestasi', user: req.session, error: err.message });
    const { judul, deskripsi, kategori, tingkat, tahun, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    const jurusan = req.session.portalJurusan;
    await db.query('INSERT INTO prestasi (judul,slug,deskripsi,gambar,kategori,tingkat,tahun,jurusan,status) VALUES (?,?,?,?,?,?,?,?,?)',
      [judul, slug, deskripsi||null, gambar, kategori||'lainnya', tingkat||'sekolah', tahun||new Date().getFullYear(), jurusan, status||'published']);
    res.redirect('/jurusan-portal/dashboard?success=1');
  });
};

exports.jurusanEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM prestasi WHERE id=? AND jurusan=?', [req.params.id, req.session.portalJurusan]);
  if (!rows.length) return res.redirect('/jurusan-portal/dashboard');
  portalRender(res, req, 'portal/jurusan/edit', { title: 'Edit Prestasi', user: req.session, item: rows[0] });
};

exports.jurusanUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/jurusan-portal/dashboard');
    const { judul, deskripsi, kategori, tingkat, tahun, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM prestasi WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE prestasi SET judul=?,deskripsi=?,gambar=?,kategori=?,tingkat=?,tahun=?,status=? WHERE id=? AND jurusan=?',
      [judul, deskripsi||null, gambar, kategori||'lainnya', tingkat||'sekolah', tahun, status||'published', req.params.id, req.session.portalJurusan]);
    res.redirect('/jurusan-portal/dashboard?success=2');
  });
};

exports.jurusanDelete = async (req, res) => {
  await db.query('DELETE FROM prestasi WHERE id=? AND jurusan=?', [req.params.id, req.session.portalJurusan]);
  res.redirect('/jurusan-portal/dashboard?success=3');
};

// ── ADMIN: Kelola Prestasi ────────────────────────────────────────────────────
exports.adminPrestasiIndex = async (req, res) => {
  const [prestasi] = await db.query('SELECT * FROM prestasi ORDER BY tahun DESC, created_at DESC');
  res.render('admin/prestasi/index', { title: 'Kelola Prestasi', user: req.session, prestasi, success: req.query.success });
};

exports.adminPrestasiCreatePage = (req, res) => res.render('admin/prestasi/create', { title: 'Tambah Prestasi', user: req.session });

exports.adminPrestasiCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/prestasi');
    const { judul, deskripsi, kategori, tingkat, tahun, jurusan, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO prestasi (judul,slug,deskripsi,gambar,kategori,tingkat,tahun,jurusan,status) VALUES (?,?,?,?,?,?,?,?,?)',
      [judul, slug, deskripsi||null, gambar, kategori||'lainnya', tingkat||'sekolah', tahun||new Date().getFullYear(), jurusan||null, status||'published']);
    res.redirect('/admin/prestasi?success=1');
  });
};

exports.adminPrestasiEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM prestasi WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/prestasi');
  res.render('admin/prestasi/edit', { title: 'Edit Prestasi', user: req.session, item: rows[0] });
};

exports.adminPrestasiUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/prestasi');
    const { judul, deskripsi, kategori, tingkat, tahun, jurusan, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM prestasi WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE prestasi SET judul=?,deskripsi=?,gambar=?,kategori=?,tingkat=?,tahun=?,jurusan=?,status=? WHERE id=?',
      [judul, deskripsi||null, gambar, kategori||'lainnya', tingkat||'sekolah', tahun, jurusan||null, status||'published', req.params.id]);
    res.redirect('/admin/prestasi?success=2');
  });
};

exports.adminPrestasiDelete = async (req, res) => {
  await db.query('DELETE FROM prestasi WHERE id=?', [req.params.id]);
  res.redirect('/admin/prestasi?success=3');
};

// ── ADMIN: Kelola Portal Users ────────────────────────────────────────────────
exports.adminPortalUsers = async (req, res) => {
  const [users] = await db.query('SELECT id,username,nama,role,jurusan,aktif,created_at FROM portal_users ORDER BY role,nama');
  res.render('admin/portal-users', { title: 'Kelola Akun Portal', user: req.session, portalUsers: users, success: req.query.success });
};

exports.adminPortalUserCreate = async (req, res) => {
  const { username, password, nama, role, jurusan } = req.body;
  const hash = await bcrypt.hash(password, 10);
  await db.query('INSERT INTO portal_users (username,password,nama,role,jurusan) VALUES (?,?,?,?,?)',
    [username, hash, nama, role, jurusan||null]);
  res.redirect('/admin/portal-users?success=1');
};

exports.adminPortalUserDelete = async (req, res) => {
  await db.query('DELETE FROM portal_users WHERE id=?', [req.params.id]);
  res.redirect('/admin/portal-users?success=3');
};

exports.adminPortalUserToggle = async (req, res) => {
  await db.query('UPDATE portal_users SET aktif = NOT aktif WHERE id=?', [req.params.id]);
  res.redirect('/admin/portal-users?success=2');
};

// ── ADMIN: Kelola BKK ─────────────────────────────────────────────────────────
exports.adminBkkIndex = async (req, res) => {
  const [lowongan] = await db.query('SELECT * FROM bkk_lowongan ORDER BY created_at DESC');
  res.render('admin/bkk/index', { title: 'Kelola BKK', user: req.session, lowongan, success: req.query.success });
};
exports.adminBkkCreatePage = (req, res) => res.render('admin/bkk/create', { title: 'Tambah Lowongan BKK', user: req.session });
exports.adminBkkCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/bkk');
    const { judul, perusahaan, lokasi, deskripsi, persyaratan, kategori, deadline, kontak, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO bkk_lowongan (judul,slug,perusahaan,lokasi,deskripsi,persyaratan,gambar,kategori,deadline,kontak,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)',
      [judul, slug, perusahaan, lokasi||null, deskripsi||null, persyaratan||null, gambar, kategori||'kerja', deadline||null, kontak||null, status||'aktif']);
    res.redirect('/admin/bkk?success=1');
  });
};
exports.adminBkkEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bkk_lowongan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/bkk');
  res.render('admin/bkk/edit', { title: 'Edit Lowongan BKK', user: req.session, item: rows[0] });
};
exports.adminBkkUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/bkk');
    const { judul, perusahaan, lokasi, deskripsi, persyaratan, kategori, deadline, kontak, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bkk_lowongan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bkk_lowongan SET judul=?,perusahaan=?,lokasi=?,deskripsi=?,persyaratan=?,gambar=?,kategori=?,deadline=?,kontak=?,status=? WHERE id=?',
      [judul, perusahaan, lokasi||null, deskripsi||null, persyaratan||null, gambar, kategori||'kerja', deadline||null, kontak||null, status||'aktif', req.params.id]);
    res.redirect('/admin/bkk?success=2');
  });
};
exports.adminBkkDelete = async (req, res) => {
  await db.query('DELETE FROM bkk_lowongan WHERE id=?', [req.params.id]);
  res.redirect('/admin/bkk?success=3');
};

// ── ADMIN: Kelola OSIS ────────────────────────────────────────────────────────
exports.adminOsisIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM osis_kegiatan ORDER BY created_at DESC');
  res.render('admin/osis/index', { title: 'Kelola OSIS', user: req.session, kegiatan, success: req.query.success });
};
exports.adminOsisCreatePage = (req, res) => res.render('admin/osis/create', { title: 'Tambah Kegiatan OSIS', user: req.session });
exports.adminOsisCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/osis');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO osis_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', 'Admin']);
    res.redirect('/admin/osis?success=1');
  });
};
exports.adminOsisEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM osis_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/osis');
  res.render('admin/osis/edit', { title: 'Edit Kegiatan OSIS', user: req.session, item: rows[0] });
};
exports.adminOsisUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/osis');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM osis_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE osis_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/osis?success=2');
  });
};
exports.adminOsisDelete = async (req, res) => {
  await db.query('DELETE FROM osis_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/osis?success=3');
};

// ── FRONTEND JURUSAN ──────────────────────────────────────────────────────────
exports.jurusanListPage = async (req, res) => {
  try {
    const common = await getCommon();
    const [jurusan] = await db.query("SELECT * FROM jurusan WHERE status='aktif' ORDER BY kode ASC");
    res.render('frontend/jurusan-list', { title: 'Program Keahlian', currentPage: 'jurusan', jurusan, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.jurusanDetailPage = async (req, res) => {
  try {
    const common = await getCommon();
    const kode = req.params.kode.toUpperCase();
    const [rows] = await db.query("SELECT * FROM jurusan WHERE kode=? AND status='aktif'", [kode]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    const jurusan = rows[0];

    // Ambil guru jurusan ini
    const [guru] = await db.query(
      "SELECT id,nama,jabatan,foto,mata_pelajaran FROM guru WHERE mata_pelajaran LIKE ? ORDER BY jabatan DESC, nama ASC",
      [`%${kode}%`]
    );

    // Ambil prestasi jurusan ini
    const [prestasi] = await db.query(
      "SELECT * FROM prestasi WHERE jurusan=? AND status='published' ORDER BY tahun DESC, created_at DESC LIMIT 6",
      [kode]
    );

    // Ambil galeri jurusan (dari tabel galeri berdasarkan kategori/judul)
    const [galeri] = await db.query(
      "SELECT * FROM galeri WHERE judul LIKE ? OR kategori LIKE ? ORDER BY created_at DESC LIMIT 8",
      [`%${kode}%`, `%${kode}%`]
    );

    // Ambil berita/informasi jurusan
    const [jurusanBerita] = await db.query(
      "SELECT * FROM jurusan_berita WHERE jurusan=? AND status='published' ORDER BY created_at DESC LIMIT 5",
      [kode]
    );

    // Ambil berita terbaru sekolah
    const [beritaTerbaru] = await db.query(
      "SELECT id,judul,slug,created_at FROM berita WHERE status='published' ORDER BY created_at DESC LIMIT 3"
    );

    res.render('frontend/jurusan-detail', {
      title: jurusan.nama, currentPage: 'jurusan',
      jurusan, guru, prestasi, galeri, jurusanBerita, beritaTerbaru, ...common
    });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL JURUSAN: Berita/Informasi ─────────────────────────────────────────
exports.jurusanBeritaIndex = async (req, res) => {
  const jurusan = req.session.portalJurusan;
  const [berita] = await db.query('SELECT * FROM jurusan_berita WHERE jurusan=? ORDER BY created_at DESC', [jurusan]);
  res.render('portal/jurusan/berita', { title: `Berita Jurusan ${jurusan}`, user: req.session, berita, jurusan, success: req.query.success, csrfToken: req.session.csrfToken });
};

exports.jurusanBeritaCreatePage = (req, res) =>
  res.render('portal/jurusan/berita-create', { title: 'Tambah Berita/Informasi', user: req.session, csrfToken: req.session.csrfToken });

exports.jurusanBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/jurusan/berita-create', { title: 'Tambah Berita/Informasi', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/jurusan/berita-create', { title: 'Tambah Berita/Informasi', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      const jurusan = req.session.portalJurusan;
      await db.query('INSERT INTO jurusan_berita (jurusan,judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?,?)',
        [jurusan, judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/jurusan-portal/berita?success=1');
    } catch (e) {
      console.error('jurusanBeritaCreate error:', e);
      portalRender(res, req, 'portal/jurusan/berita-create', { title: 'Tambah Berita/Informasi', user: req.session, error: 'Terjadi kesalahan: ' + e.message });
    }
  });
};

exports.jurusanBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM jurusan_berita WHERE id=? AND jurusan=?', [req.params.id, req.session.portalJurusan]);
  if (!rows.length) return res.redirect('/jurusan-portal/berita');
  res.render('portal/jurusan/berita-edit', { title: 'Edit Berita', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};

exports.jurusanBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/jurusan-portal/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM jurusan_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE jurusan_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=? AND jurusan=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id, req.session.portalJurusan]);
    res.redirect('/jurusan-portal/berita?success=2');
  });
};

exports.jurusanBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM jurusan_berita WHERE id=? AND jurusan=?', [req.params.id, req.session.portalJurusan]);
  res.redirect('/jurusan-portal/berita?success=3');
};

// ── ADMIN: Kelola Berita Jurusan ──────────────────────────────────────────────
exports.adminJurusanBeritaIndex = async (req, res) => {
  const jurusan = req.query.jurusan || '';
  const [berita] = await db.query(
    jurusan ? 'SELECT * FROM jurusan_berita WHERE jurusan=? ORDER BY created_at DESC' : 'SELECT * FROM jurusan_berita ORDER BY jurusan, created_at DESC',
    jurusan ? [jurusan] : []
  );
  const [jurusanList] = await db.query("SELECT kode,nama FROM jurusan WHERE status='aktif' ORDER BY kode");
  res.render('admin/jurusan-berita/index', { title: 'Berita Jurusan', user: req.session, berita, jurusanList, filterJurusan: jurusan, success: req.query.success });
};

exports.adminJurusanBeritaCreatePage = async (req, res) => {
  const [jurusanList] = await db.query("SELECT kode,nama FROM jurusan WHERE status='aktif' ORDER BY kode");
  res.render('admin/jurusan-berita/create', { title: 'Tambah Berita Jurusan', user: req.session, jurusanList });
};

exports.adminJurusanBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/jurusan-berita');
    const { judul, jurusan, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO jurusan_berita (jurusan,judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?,?)',
      [jurusan, judul, slug, konten||null, gambar, kategori||'berita', status||'published', 'Admin']);
    res.redirect('/admin/jurusan-berita?success=1');
  });
};

exports.adminJurusanBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM jurusan_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/jurusan-berita');
  const [jurusanList] = await db.query("SELECT kode,nama FROM jurusan WHERE status='aktif' ORDER BY kode");
  res.render('admin/jurusan-berita/edit', { title: 'Edit Berita Jurusan', user: req.session, item: rows[0], jurusanList });
};

exports.adminJurusanBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/jurusan-berita');
    const { judul, jurusan, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM jurusan_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE jurusan_berita SET judul=?,jurusan=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, jurusan, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/jurusan-berita?success=2');
  });
};

exports.adminJurusanBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM jurusan_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/jurusan-berita?success=3');
};

// ── FRONTEND: Detail Berita Jurusan ──────────────────────────────────────────
exports.jurusanBeritaDetailPage = async (req, res) => {
  try {
    const common = await getCommon();
    const kode = req.params.kode.toUpperCase();
    const [jurusanRows] = await db.query("SELECT * FROM jurusan WHERE kode=? AND status='aktif'", [kode]);
    if (!jurusanRows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    const [rows] = await db.query("SELECT * FROM jurusan_berita WHERE slug=? AND jurusan=? AND status='published'", [req.params.slug, kode]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/jurusan-berita-detail', {
      title: rows[0].judul, currentPage: 'jurusan',
      berita: rows[0], jurusan: jurusanRows[0], ...common
    });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL JURUSAN: Edit Halaman ─────────────────────────────────────────────
exports.jurusanHalamanPage = async (req, res) => {
  const kode = req.session.portalJurusan;
  const [rows] = await db.query('SELECT * FROM jurusan WHERE kode=?', [kode]);
  portalRender(res, req, 'portal/jurusan/halaman', {
    title: `Edit Halaman Jurusan ${kode}`,
    user: req.session,
    jurusan: rows[0] || {},
    success: req.query.success
  });
};

exports.jurusanHalamanUpdate = async (req, res) => {
  try {
    const kode = req.session.portalJurusan;
    const { deskripsi, deskripsi_lengkap } = req.body;
    await db.query('UPDATE jurusan SET deskripsi=?, deskripsi_lengkap=? WHERE kode=?',
      [deskripsi||null, deskripsi_lengkap||null, kode]);
    res.redirect('/jurusan-portal/halaman?success=1');
  } catch (err) {
    console.error(err);
    res.redirect('/jurusan-portal/halaman?success=0');
  }
};
