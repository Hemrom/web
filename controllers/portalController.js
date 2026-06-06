const db = require('../config/database');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { createUpload } = require('../middleware/uploadSecurity');
const { loginLimiter } = require('../middleware/security');
const compressImage = require('../middleware/compressImage');

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

// ── FRONTEND EKSTRAKURIKULER ──────────────────────────────────────────────────
exports.ekstrakurikulerIndex = async (req, res) => {
  try {
    const common = await getCommon();

    // Ambil foto pertama dari galeri masing-masing ekskul otomatis
    const [[osisGaleri], [pramukaGaleri], [pmrGaleri], [paskibrakaGaleri],
           [olahragaGaleri], [seniGaleri], [bahasaGaleri], [rohisGaleri],
           [pikrGaleri], [pecintaAlamGaleri]] = await Promise.all([
      db.query('SELECT gambar FROM osis_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM pramuka_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM pmr_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM paskibraka_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM olahraga_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM seni_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM bahasa_asing_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM rohis_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM pikr_galeri ORDER BY created_at DESC LIMIT 1'),
      db.query('SELECT gambar FROM pecinta_alam_galeri ORDER BY created_at DESC LIMIT 1'),
    ]);

    const ekskul = [
      { nama: 'OSIS', deskripsi: 'Organisasi Siswa Intra Sekolah', url: '/osis', icon: 'fas fa-users', warna: '#f59e0b', foto: osisGaleri[0]?.gambar || null },
      { nama: 'Pramuka', deskripsi: 'Gerakan Pramuka SMKN 1 Kras', url: '/pramuka', icon: 'fas fa-campground', warna: '#16a34a', foto: pramukaGaleri[0]?.gambar || null },
      { nama: 'PMR', deskripsi: 'Palang Merah Remaja', url: '/pmr', icon: 'fas fa-first-aid', warna: '#dc2626', foto: pmrGaleri[0]?.gambar || null },
      { nama: 'Paskibraka', deskripsi: 'Pasukan Pengibar Bendera', url: '/paskibraka', icon: 'fas fa-flag', warna: '#991b1b', foto: paskibrakaGaleri[0]?.gambar || null },
      { nama: 'Olahraga', deskripsi: 'Ekstrakurikuler Olahraga', url: '/olahraga', icon: 'fas fa-running', warna: '#c2410c', foto: olahragaGaleri[0]?.gambar || null },
      { nama: 'Seni', deskripsi: 'Ekstrakurikuler Seni', url: '/seni', icon: 'fas fa-palette', warna: '#a855f7', foto: seniGaleri[0]?.gambar || null },
      { nama: 'Bahasa Asing', deskripsi: 'Ekstrakurikuler Bahasa Asing', url: '/bahasa-asing', icon: 'fas fa-language', warna: '#0f766e', foto: bahasaGaleri[0]?.gambar || null },
      { nama: 'Rohis', deskripsi: 'Rohani Islam SMKN 1 Kras', url: '/rohis', icon: 'fas fa-mosque', warna: '#065f46', foto: rohisGaleri[0]?.gambar || null },
      { nama: 'PIK-R', deskripsi: 'Pusat Informasi dan Konseling Remaja', url: '/pikr', icon: 'fas fa-heart', warna: '#7c3aed', foto: pikrGaleri[0]?.gambar || null },
      { nama: 'Pecinta Alam', deskripsi: 'Ekstrakurikuler Pecinta Alam', url: '/pecinta-alam', icon: 'fas fa-mountain', warna: '#78350f', foto: pecintaAlamGaleri[0]?.gambar || null },
    ];
    res.render('frontend/ekstrakurikuler', { title: 'Ekstrakurikuler', currentPage: 'ekstrakurikuler', ekskul, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
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
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM osis_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM osis_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM osis_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/osis', { title: 'OSIS', currentPage: 'osis', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.osisDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM osis_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/osis-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.osisBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM osis_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/osis-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── FRONTEND PRAMUKA ──────────────────────────────────────────────────────────
exports.pramukaIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM pramuka_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pramuka_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pramuka_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/pramuka', { title: 'Pramuka', currentPage: 'pramuka', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.pramukaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pramuka_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pramuka-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.pramukaBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pramuka_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pramuka-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── FRONTEND OLAHRAGA ─────────────────────────────────────────────────────────
exports.olahragaIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM olahraga_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM olahraga_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM olahraga_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/olahraga', { title: 'Olahraga', currentPage: 'olahraga', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};
exports.olahragaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM olahraga_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/olahraga-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};
exports.olahragaBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM olahraga_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/olahraga-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL LOGIN (shared) ─────────────────────────────────────────────────────
exports.portalLoginPage = (role, title) => (req, res) => {
  const urlPrefix = role === 'jurusan' ? 'jurusan-portal' : role === 'bahasa_asing' ? 'bahasa-asing' : role;
  if (req.session.portalId && req.session.portalRole === role) return res.redirect(`/${urlPrefix}/dashboard`);
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
    const redirect = role === 'jurusan' ? '/jurusan-portal/dashboard' : role === 'bahasa_asing' ? '/bahasa-asing/dashboard' : `/${role}/dashboard`;
    res.redirect(redirect);
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.portalLogout = (role) => (req, res) => {
  req.session.portalId = null;
  req.session.portalRole = null;
  req.session.portalNama = null;
  const redirect = role === 'jurusan' ? '/jurusan-portal/login' : role === 'bahasa_asing' ? '/bahasa-asing/login' : `/${role}/login`;
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

// ── PORTAL OSIS: Berita ───────────────────────────────────────────────────────
exports.osisBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM osis_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/osis/berita', { title: 'Berita & Informasi OSIS', user: req.session, berita, success: req.query.success });
};

exports.osisBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session });

exports.osisBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO osis_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/osis/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: e.message }); }
  });
};

exports.osisBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM osis_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/osis/berita');
  portalRender(res, req, 'portal/osis/berita-edit', { title: 'Edit Berita OSIS', user: req.session, item: rows[0] });
};

exports.osisBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/osis/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM osis_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE osis_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/osis/berita?success=2');
  });
};

exports.osisBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM osis_berita WHERE id=?', [req.params.id]);
  res.redirect('/osis/berita?success=3');
};

// ── PORTAL OSIS: Galeri ───────────────────────────────────────────────────────
const uploadGaleriOsis = createUpload('osis-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.osisGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM osis_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/osis/galeri', { title: 'Galeri OSIS', user: req.session, galeri, success: req.query.success, query: req.query });
};

exports.osisGaleriCreate = (req, res) => {
  uploadGaleriOsis(req, res, async (err) => {
    if (err) return res.redirect('/osis/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/osis/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO osis_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri OSIS', file.filename, keterangan||null]);
      }
      res.redirect('/osis/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/osis/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.osisGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM osis_galeri WHERE id=?', [req.params.id]);
  res.redirect('/osis/galeri?success=3');
};

// ── PORTAL PRAMUKA ────────────────────────────────────────────────────────────
const uploadGaleriPramuka = createUpload('pramuka-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.pramukaDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pramuka_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pramuka/dashboard', { title: 'Dashboard Pramuka', user: req.session, kegiatan, success: req.query.success });
};

exports.pramukaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/pramuka/create', { title: 'Tambah Kegiatan Pramuka', user: req.session });

exports.pramukaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/pramuka/create', { title: 'Tambah Kegiatan Pramuka', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/pramuka/create', { title: 'Tambah Kegiatan Pramuka', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO pramuka_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/pramuka/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/pramuka/create', { title: 'Tambah Kegiatan Pramuka', user: req.session, error: e.message }); }
  });
};

exports.pramukaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/pramuka/dashboard');
  portalRender(res, req, 'portal/pramuka/edit', { title: 'Edit Kegiatan Pramuka', user: req.session, item: rows[0] });
};

exports.pramukaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/pramuka/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pramuka_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/pramuka/dashboard?success=2');
  });
};

exports.pramukaDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/pramuka/dashboard?success=3');
};

exports.pramukaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pramuka_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pramuka/galeri', { title: 'Galeri Pramuka', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.pramukaGaleriCreate = (req, res) => {
  uploadGaleriPramuka(req, res, async (err) => {
    if (err) return res.redirect('/pramuka/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/pramuka/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO pramuka_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri Pramuka', file.filename, keterangan||null]);
      }
      res.redirect('/pramuka/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/pramuka/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.pramukaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_galeri WHERE id=?', [req.params.id]);
  res.redirect('/pramuka/galeri?success=3');
};

// ── PORTAL PRAMUKA: Berita ────────────────────────────────────────────────────
exports.pramukaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pramuka_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pramuka/berita', { title: 'Berita & Informasi Pramuka', user: req.session, berita, success: req.query.success });
};

exports.pramukaBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/pramuka/berita-create', { title: 'Tambah Berita Pramuka', user: req.session });

exports.pramukaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/pramuka/berita-create', { title: 'Tambah Berita Pramuka', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/pramuka/berita-create', { title: 'Tambah Berita Pramuka', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO pramuka_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/pramuka/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/pramuka/berita-create', { title: 'Tambah Berita Pramuka', user: req.session, error: e.message }); }
  });
};

exports.pramukaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pramuka_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/pramuka/berita');
  portalRender(res, req, 'portal/pramuka/berita-edit', { title: 'Edit Berita Pramuka', user: req.session, item: rows[0] });
};

exports.pramukaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/pramuka/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pramuka_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pramuka_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/pramuka/berita?success=2');
  });
};

exports.pramukaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_berita WHERE id=?', [req.params.id]);
  res.redirect('/pramuka/berita?success=3');
};

// ── PORTAL OLAHRAGA ───────────────────────────────────────────────────────────
const uploadGaleriOlahraga = createUpload('olahraga-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.olahragaDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM olahraga_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/olahraga/dashboard', { title: 'Dashboard Olahraga', user: req.session, kegiatan, success: req.query.success });
};
exports.olahragaCreatePage = (req, res) => portalRender(res, req, 'portal/olahraga/create', { title: 'Tambah Kegiatan Olahraga', user: req.session });
exports.olahragaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/olahraga/create', { title: 'Tambah Kegiatan Olahraga', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/olahraga/create', { title: 'Tambah Kegiatan Olahraga', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO olahraga_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/olahraga/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/olahraga/create', { title: 'Tambah Kegiatan Olahraga', user: req.session, error: e.message }); }
  });
};
exports.olahragaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/olahraga/dashboard');
  portalRender(res, req, 'portal/olahraga/edit', { title: 'Edit Kegiatan Olahraga', user: req.session, item: rows[0] });
};
exports.olahragaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/olahraga/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE olahraga_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/olahraga/dashboard?success=2');
  });
};
exports.olahragaDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/olahraga/dashboard?success=3');
};
exports.olahragaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM olahraga_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/olahraga/galeri', { title: 'Galeri Olahraga', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};
exports.olahragaGaleriCreate = (req, res) => {
  uploadGaleriOlahraga(req, res, async (err) => {
    if (err) return res.redirect('/olahraga/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/olahraga/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO olahraga_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri Olahraga', file.filename, keterangan||null]);
      }
      res.redirect('/olahraga/galeri?success=1');
    } catch (e) { res.redirect('/olahraga/galeri?error=' + encodeURIComponent(e.message)); }
  });
};
exports.olahragaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_galeri WHERE id=?', [req.params.id]);
  res.redirect('/olahraga/galeri?success=3');
};
exports.olahragaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM olahraga_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/olahraga/berita', { title: 'Berita & Informasi Olahraga', user: req.session, berita, success: req.query.success });
};
exports.olahragaBeritaCreatePage = (req, res) => portalRender(res, req, 'portal/olahraga/berita-create', { title: 'Tambah Berita Olahraga', user: req.session });
exports.olahragaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/olahraga/berita-create', { title: 'Tambah Berita Olahraga', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/olahraga/berita-create', { title: 'Tambah Berita Olahraga', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO olahraga_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/olahraga/berita?success=1');
    } catch (e) { portalRender(res, req, 'portal/olahraga/berita-create', { title: 'Tambah Berita Olahraga', user: req.session, error: e.message }); }
  });
};
exports.olahragaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM olahraga_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/olahraga/berita');
  portalRender(res, req, 'portal/olahraga/berita-edit', { title: 'Edit Berita Olahraga', user: req.session, item: rows[0] });
};
exports.olahragaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/olahraga/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM olahraga_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE olahraga_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/olahraga/berita?success=2');
  });
};
exports.olahragaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_berita WHERE id=?', [req.params.id]);
  res.redirect('/olahraga/berita?success=3');
};

// ── FRONTEND PASKIBRAKA ───────────────────────────────────────────────────────
exports.paskibrakaIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM paskibraka_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM paskibraka_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM paskibraka_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/paskibraka', { title: 'Paskibraka', currentPage: 'paskibraka', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.paskibrakaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM paskibraka_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/paskibraka-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.paskibrakaBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM paskibraka_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/paskibraka-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL PASKIBRAKA ─────────────────────────────────────────────────────────
const uploadGaleriPaskibraka = createUpload('paskibraka-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.paskibrakaDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM paskibraka_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/paskibraka/dashboard', { title: 'Dashboard Paskibraka', user: req.session, kegiatan, success: req.query.success });
};

exports.paskibrakaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/paskibraka/create', { title: 'Tambah Kegiatan Paskibraka', user: req.session });

exports.paskibrakaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/paskibraka/create', { title: 'Tambah Kegiatan Paskibraka', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/paskibraka/create', { title: 'Tambah Kegiatan Paskibraka', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO paskibraka_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/paskibraka/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/paskibraka/create', { title: 'Tambah Kegiatan Paskibraka', user: req.session, error: e.message }); }
  });
};

exports.paskibrakaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/paskibraka/dashboard');
  portalRender(res, req, 'portal/paskibraka/edit', { title: 'Edit Kegiatan Paskibraka', user: req.session, item: rows[0] });
};

exports.paskibrakaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/paskibraka/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE paskibraka_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/paskibraka/dashboard?success=2');
  });
};

exports.paskibrakaDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/paskibraka/dashboard?success=3');
};

exports.paskibrakaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM paskibraka_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/paskibraka/galeri', { title: 'Galeri Paskibraka', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.paskibrakaGaleriCreate = (req, res) => {
  uploadGaleriPaskibraka(req, res, async (err) => {
    if (err) return res.redirect('/paskibraka/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/paskibraka/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO paskibraka_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri Paskibraka', file.filename, keterangan||null]);
      }
      res.redirect('/paskibraka/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/paskibraka/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.paskibrakaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_galeri WHERE id=?', [req.params.id]);
  res.redirect('/paskibraka/galeri?success=3');
};

// ── PORTAL PASKIBRAKA: Berita ─────────────────────────────────────────────────
exports.paskibrakaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM paskibraka_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/paskibraka/berita', { title: 'Berita & Informasi Paskibraka', user: req.session, berita, success: req.query.success });
};

exports.paskibrakaBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/paskibraka/berita-create', { title: 'Tambah Berita Paskibraka', user: req.session });

exports.paskibrakaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/paskibraka/berita-create', { title: 'Tambah Berita Paskibraka', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/paskibraka/berita-create', { title: 'Tambah Berita Paskibraka', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO paskibraka_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/paskibraka/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/paskibraka/berita-create', { title: 'Tambah Berita Paskibraka', user: req.session, error: e.message }); }
  });
};

exports.paskibrakaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM paskibraka_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/paskibraka/berita');
  portalRender(res, req, 'portal/paskibraka/berita-edit', { title: 'Edit Berita Paskibraka', user: req.session, item: rows[0] });
};

exports.paskibrakaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/paskibraka/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM paskibraka_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE paskibraka_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/paskibraka/berita?success=2');
  });
};

exports.paskibrakaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_berita WHERE id=?', [req.params.id]);
  res.redirect('/paskibraka/berita?success=3');
};

// ── FRONTEND SENI ─────────────────────────────────────────────────────────────
exports.seniIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM seni_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM seni_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM seni_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/seni', { title: 'Seni', currentPage: 'seni', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.seniDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM seni_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/seni-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.seniBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM seni_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/seni-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL SENI ───────────────────────────────────────────────────────────────
const uploadGaleriSeni = createUpload('seni-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.seniDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM seni_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/seni/dashboard', { title: 'Dashboard Seni', user: req.session, kegiatan, success: req.query.success });
};

exports.seniCreatePage = (req, res) =>
  portalRender(res, req, 'portal/seni/create', { title: 'Tambah Kegiatan Seni', user: req.session });

exports.seniCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/seni/create', { title: 'Tambah Kegiatan Seni', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/seni/create', { title: 'Tambah Kegiatan Seni', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO seni_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/seni/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/seni/create', { title: 'Tambah Kegiatan Seni', user: req.session, error: e.message }); }
  });
};

exports.seniEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM seni_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/seni/dashboard');
  portalRender(res, req, 'portal/seni/edit', { title: 'Edit Kegiatan Seni', user: req.session, item: rows[0] });
};

exports.seniUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/seni/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM seni_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE seni_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/seni/dashboard?success=2');
  });
};

exports.seniDelete = async (req, res) => {
  await db.query('DELETE FROM seni_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/seni/dashboard?success=3');
};

exports.seniGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM seni_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/seni/galeri', { title: 'Galeri Seni', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.seniGaleriCreate = (req, res) => {
  uploadGaleriSeni(req, res, async (err) => {
    if (err) return res.redirect('/seni/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/seni/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO seni_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri Seni', file.filename, keterangan||null]);
      }
      res.redirect('/seni/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/seni/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.seniGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM seni_galeri WHERE id=?', [req.params.id]);
  res.redirect('/seni/galeri?success=3');
};

// ── PORTAL SENI: Berita ───────────────────────────────────────────────────────
exports.seniBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM seni_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/seni/berita', { title: 'Berita & Informasi Seni', user: req.session, berita, success: req.query.success });
};

exports.seniBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/seni/berita-create', { title: 'Tambah Berita Seni', user: req.session });

exports.seniBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/seni/berita-create', { title: 'Tambah Berita Seni', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/seni/berita-create', { title: 'Tambah Berita Seni', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO seni_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/seni/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/seni/berita-create', { title: 'Tambah Berita Seni', user: req.session, error: e.message }); }
  });
};

exports.seniBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM seni_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/seni/berita');
  portalRender(res, req, 'portal/seni/berita-edit', { title: 'Edit Berita Seni', user: req.session, item: rows[0] });
};

exports.seniBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/seni/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM seni_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE seni_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/seni/berita?success=2');
  });
};

exports.seniBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM seni_berita WHERE id=?', [req.params.id]);
  res.redirect('/seni/berita?success=3');
};

// ── FRONTEND BAHASA ASING ─────────────────────────────────────────────────────
exports.bahasaAsingIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM bahasa_asing_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM bahasa_asing_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM bahasa_asing_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/bahasa-asing', { title: 'Bahasa Asing', currentPage: 'bahasa-asing', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.bahasaAsingDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM bahasa_asing_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/bahasa-asing-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.bahasaAsingBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM bahasa_asing_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/bahasa-asing-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL BAHASA ASING ───────────────────────────────────────────────────────
const uploadGaleriBahasaAsing = createUpload('bahasa-asing-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.bahasaAsingDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM bahasa_asing_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/bahasa-asing/dashboard', { title: 'Dashboard Bahasa Asing', user: req.session, kegiatan, success: req.query.success });
};

exports.bahasaAsingCreatePage = (req, res) =>
  portalRender(res, req, 'portal/bahasa-asing/create', { title: 'Tambah Kegiatan Bahasa Asing', user: req.session });

exports.bahasaAsingCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/bahasa-asing/create', { title: 'Tambah Kegiatan Bahasa Asing', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/bahasa-asing/create', { title: 'Tambah Kegiatan Bahasa Asing', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO bahasa_asing_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/bahasa-asing/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/bahasa-asing/create', { title: 'Tambah Kegiatan Bahasa Asing', user: req.session, error: e.message }); }
  });
};

exports.bahasaAsingEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/bahasa-asing/dashboard');
  portalRender(res, req, 'portal/bahasa-asing/edit', { title: 'Edit Kegiatan Bahasa Asing', user: req.session, item: rows[0] });
};

exports.bahasaAsingUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/bahasa-asing/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bahasa_asing_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/bahasa-asing/dashboard?success=2');
  });
};

exports.bahasaAsingDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/bahasa-asing/dashboard?success=3');
};

exports.bahasaAsingGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM bahasa_asing_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/bahasa-asing/galeri', { title: 'Galeri Bahasa Asing', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.bahasaAsingGaleriCreate = (req, res) => {
  uploadGaleriBahasaAsing(req, res, async (err) => {
    if (err) return res.redirect('/bahasa-asing/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/bahasa-asing/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO bahasa_asing_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri Bahasa Asing', file.filename, keterangan||null]);
      }
      res.redirect('/bahasa-asing/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/bahasa-asing/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.bahasaAsingGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_galeri WHERE id=?', [req.params.id]);
  res.redirect('/bahasa-asing/galeri?success=3');
};

// ── PORTAL BAHASA ASING: Berita ───────────────────────────────────────────────
exports.bahasaAsingBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM bahasa_asing_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/bahasa-asing/berita', { title: 'Berita & Informasi Bahasa Asing', user: req.session, berita, success: req.query.success });
};

exports.bahasaAsingBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/bahasa-asing/berita-create', { title: 'Tambah Berita Bahasa Asing', user: req.session });

exports.bahasaAsingBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/bahasa-asing/berita-create', { title: 'Tambah Berita Bahasa Asing', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/bahasa-asing/berita-create', { title: 'Tambah Berita Bahasa Asing', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO bahasa_asing_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/bahasa-asing/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/bahasa-asing/berita-create', { title: 'Tambah Berita Bahasa Asing', user: req.session, error: e.message }); }
  });
};

exports.bahasaAsingBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/bahasa-asing/berita');
  portalRender(res, req, 'portal/bahasa-asing/berita-edit', { title: 'Edit Berita Bahasa Asing', user: req.session, item: rows[0] });
};

exports.bahasaAsingBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/bahasa-asing/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bahasa_asing_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/bahasa-asing/berita?success=2');
  });
};

exports.bahasaAsingBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
  res.redirect('/bahasa-asing/berita?success=3');
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
  res.render('admin/portal-users', { title: 'Kelola Akun Portal', user: req.session, portalUsers: users, success: req.query.success, query: req.query });
};

exports.adminPortalUserCreate = async (req, res) => {
  try {
    const { username, password, nama, role, jurusan } = req.body;
    const hash = await bcrypt.hash(password, 10);
    // BKK, OSIS, Pramuka, dan Olahraga tidak memiliki jurusan
    const finalJurusan = (role === 'bkk' || role === 'osis' || role === 'pramuka' || role === 'olahraga') ? null : (jurusan || null);
    await db.query('INSERT INTO portal_users (username,password,nama,role,jurusan) VALUES (?,?,?,?,?)',
      [username, hash, nama, role, finalJurusan]);
    res.redirect('/admin/portal-users?success=1');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.redirect('/admin/portal-users?error=Username+sudah+digunakan');
    }
    console.error(err);
    res.redirect('/admin/portal-users?error=Terjadi+kesalahan');
  }
};

exports.adminPortalUserEdit = async (req, res) => {
  try {
    const { nama, username, role, jurusan, password } = req.body;
    // BKK, OSIS, Pramuka, dan Olahraga tidak memiliki jurusan
    const finalJurusan = (role === 'bkk' || role === 'osis' || role === 'pramuka' || role === 'olahraga') ? null : (jurusan || null);
    
    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      await db.query('UPDATE portal_users SET nama=?,username=?,role=?,jurusan=?,password=? WHERE id=?',
        [nama, username, role, finalJurusan, hash, req.params.id]);
    } else {
      await db.query('UPDATE portal_users SET nama=?,username=?,role=?,jurusan=? WHERE id=?',
        [nama, username, role, finalJurusan, req.params.id]);
    }
    res.redirect('/admin/portal-users?success=4');
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.redirect('/admin/portal-users?error=Username+sudah+digunakan');
    console.error(err);
    res.redirect('/admin/portal-users?error=Terjadi+kesalahan');
  }
};

exports.adminPortalUserDelete = async (req, res) => {
  await db.query('DELETE FROM portal_users WHERE id=?', [req.params.id]);
  res.redirect('/admin/portal-users?success=3');
};

exports.adminPortalUserToggle = async (req, res) => {
  await db.query('UPDATE portal_users SET aktif = NOT aktif WHERE id=?', [req.params.id]);
  res.redirect('/admin/portal-users?success=2');
};

exports.adminPortalUserExport = async (req, res) => {
  try {
    const XLSX = require('xlsx');
    const [users] = await db.query('SELECT username,nama,role,jurusan,aktif FROM portal_users ORDER BY role,nama');
    const data = users.map(u => ({
      Username: u.username,
      Nama: u.nama,
      Role: u.role,
      Jurusan: u.jurusan || '',
      Status: u.aktif ? 'Aktif' : 'Nonaktif',
      Password: '' // kosong — password lama tidak bisa di-export (sudah di-hash)
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    ws['!cols'] = [{wch:18},{wch:28},{wch:10},{wch:12},{wch:10},{wch:20}];
    // Tambah catatan di baris pertama setelah data
    const lastRow = data.length + 2;
    ws[`A${lastRow}`] = { v: '* Kolom Password: isi untuk set password baru saat import. Kosongkan = password default sama dengan Username.' };
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Akun Portal');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename="portal-users.xlsx"');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.adminPortalUserImport = async (req, res) => {
  try {
    const XLSX = require('xlsx');
    const multer = require('multer');
    const upload = multer({ storage: multer.memoryStorage() }).single('excel_file');
    upload(req, res, async (err) => {
      if (err) return res.redirect('/admin/portal-users?error=Gagal+upload');
      if (!req.file) return res.redirect('/admin/portal-users?error=File+tidak+ditemukan');
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });
      let imported = 0, skipped = 0;
      for (const row of rows) {
        const username = (row['Username'] || row['username'] || '').toString().trim();
        const nama = (row['Nama'] || row['nama'] || '').toString().trim();
        const role = (row['Role'] || row['role'] || '').toString().trim().toLowerCase();
        const jurusan = (row['Jurusan'] || row['jurusan'] || '').toString().trim() || null;
        const pwd = (row['Password'] || row['password'] || username).toString().trim() || username;
        if (!username || !nama || !['bkk','osis','jurusan'].includes(role)) { skipped++; continue; }
        try {
          const hash = await bcrypt.hash(pwd, 10);
          // BKK, OSIS, dan Pramuka tidak memiliki jurusan
          const finalJurusan = (role === 'bkk' || role === 'osis' || role === 'pramuka') ? null : jurusan;
          await db.query('INSERT IGNORE INTO portal_users (username,password,nama,role,jurusan) VALUES (?,?,?,?,?)',
            [username, hash, nama, role, finalJurusan]);
          imported++;
        } catch (e) { skipped++; }
      }
      res.redirect(`/admin/portal-users?success=5&imported=${imported}&skipped=${skipped}`);
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/portal-users?error=Gagal+import');
  }
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

// ── ADMIN OSIS: Berita ────────────────────────────────────────────────────────
exports.adminOsisBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM osis_berita ORDER BY created_at DESC');
  res.render('admin/osis/berita', { title: 'Berita & Informasi OSIS', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};

exports.adminOsisBeritaCreatePage = (req, res) =>
  res.render('admin/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, csrfToken: req.session.csrfToken });

exports.adminOsisBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return res.render('admin/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: 'Judul wajib diisi', csrfToken: req.session.csrfToken });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO osis_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
      res.redirect('/admin/osis/berita?success=1');
    } catch (e) { console.error(e); res.render('admin/osis/berita-create', { title: 'Tambah Berita OSIS', user: req.session, error: e.message, csrfToken: req.session.csrfToken }); }
  });
};

exports.adminOsisBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM osis_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/osis/berita');
  res.render('admin/osis/berita-edit', { title: 'Edit Berita OSIS', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};

exports.adminOsisBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/osis/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM osis_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE osis_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/osis/berita?success=2');
  });
};

exports.adminOsisBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM osis_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/osis/berita?success=3');
};

// ── ADMIN OSIS: Galeri ────────────────────────────────────────────────────────
exports.adminOsisGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM osis_galeri ORDER BY created_at DESC');
  res.render('admin/osis/galeri', { title: 'Galeri OSIS', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};

exports.adminOsisGaleriCreate = (req, res) => {
  const uploadGaleriOsis = createUpload('osis-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleriOsis(req, res, async (err) => {
    if (err) return res.redirect('/admin/osis/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/admin/osis/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO osis_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri OSIS', file.filename, keterangan||null]);
      }
      res.redirect('/admin/osis/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/admin/osis/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.adminOsisGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM osis_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/osis/galeri?success=3');
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

    // Galeri konten utama: dari jurusan_galeri (khusus jurusan ini)
    const [galeriJurusan] = await db.query(
      "SELECT * FROM jurusan_galeri WHERE jurusan=? ORDER BY urutan ASC, created_at DESC LIMIT 8",
      [kode]
    );

    // Galeri sidebar: dari galeri utama (bervariasi)
    const [galeri] = await db.query("SELECT * FROM galeri ORDER BY created_at DESC LIMIT 4");

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
      jurusan, guru, prestasi, galeri, galeriJurusan, jurusanBerita, beritaTerbaru, ...common
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
    // Decode HTML entities yang mungkin di-encode ganda
    const decodeHtml = (str) => {
      if (!str) return null;
      return str
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'").replace(/&nbsp;/g, '\u00a0');
    };
    const decodedLengkap = decodeHtml(deskripsi_lengkap);
    await db.query('UPDATE jurusan SET deskripsi=?, deskripsi_lengkap=? WHERE kode=?',
      [deskripsi||null, decodedLengkap, kode]);
    res.redirect('/jurusan-portal/halaman?success=1');
  } catch (err) {
    console.error(err);
    res.redirect('/jurusan-portal/halaman?success=0');
  }
};

// ── PORTAL JURUSAN: Galeri ────────────────────────────────────────────────────
const uploadGaleriJurusan = createUpload('jurusan-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.jurusanGaleriIndex = async (req, res) => {
  const jurusan = req.session.portalJurusan;
  const [galeri] = await db.query('SELECT * FROM jurusan_galeri WHERE jurusan=? ORDER BY urutan ASC, created_at DESC', [jurusan]);
  portalRender(res, req, 'portal/jurusan/galeri', { title: `Galeri Jurusan ${jurusan}`, user: req.session, galeri, jurusan, success: req.query.success, query: req.query });
};

exports.jurusanGaleriCreate = (req, res) => {
  uploadGaleriJurusan(req, res, async (err) => {
    if (err) return res.redirect('/jurusan-portal/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/jurusan-portal/galeri?error=Pilih+minimal+1+foto');
      const jurusan = req.session.portalJurusan;
      const { judul, keterangan } = req.body;
      for (let i = 0; i < req.files.length; i++) {
        await db.query('INSERT INTO jurusan_galeri (jurusan,judul,gambar,keterangan) VALUES (?,?,?,?)',
          [jurusan, judul||'Galeri', req.files[i].filename, keterangan||null]);
      }
      res.redirect('/jurusan-portal/galeri?success=1');
    } catch (e) {
      console.error('galeri upload error:', e);
      res.redirect('/jurusan-portal/galeri?error=' + encodeURIComponent(e.message));
    }
  });
};

exports.jurusanGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM jurusan_galeri WHERE id=? AND jurusan=?', [req.params.id, req.session.portalJurusan]);
  res.redirect('/jurusan-portal/galeri?success=3');
};

// ── FRONTEND FASILITAS ────────────────────────────────────────────────────────
exports.fasilitasIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const kategori = req.query.kategori || '';
    const [fasilitas] = await db.query(
      kategori
        ? "SELECT * FROM fasilitas WHERE status='published' AND kategori=? ORDER BY nama ASC"
        : "SELECT * FROM fasilitas WHERE status='published' ORDER BY nama ASC",
      kategori ? [kategori] : []
    );
    // Ambil semua foto untuk fasilitas yang ada
    const ids = fasilitas.map(f => f.id);
    let fotoMap = {};
    if (ids.length) {
      const [fotos] = await db.query(
        `SELECT * FROM fasilitas_foto WHERE fasilitas_id IN (${ids.map(() => '?').join(',')}) ORDER BY urutan ASC, id ASC`,
        ids
      );
      fotos.forEach(f => {
        if (!fotoMap[f.fasilitas_id]) fotoMap[f.fasilitas_id] = [];
        fotoMap[f.fasilitas_id].push(f);
      });
    }
    res.render('frontend/fasilitas', { title: 'Fasilitas', currentPage: 'fasilitas', fasilitas, fotoMap, kategori, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

// ── ADMIN: Kelola Fasilitas ───────────────────────────────────────────────────
const uploadFasilitasMulti = createUpload('fasilitas', { maxFiles: 10 }).array('foto', 10);

exports.adminFasilitasIndex = async (req, res) => {
  const [fasilitas] = await db.query(
    'SELECT f.*, (SELECT gambar FROM fasilitas_foto WHERE fasilitas_id=f.id ORDER BY urutan ASC, id ASC LIMIT 1) as cover FROM fasilitas f ORDER BY nama ASC'
  );
  res.render('admin/fasilitas/index', { title: 'Kelola Fasilitas', user: req.session, fasilitas, success: req.query.success });
};

exports.adminFasilitasCreatePage = (req, res) =>
  res.render('admin/fasilitas/create', { title: 'Tambah Fasilitas', user: req.session });

exports.adminFasilitasCreate = (req, res) => {
  uploadFasilitasMulti(req, res, async (err) => {
    if (err) return res.redirect('/admin/fasilitas?error=' + encodeURIComponent(err.message));
    try {
      const { nama, deskripsi, kategori, status } = req.body;
      const slug = createSlug(nama);
      const [result] = await db.query(
        'INSERT INTO fasilitas (nama,slug,deskripsi,kategori,status) VALUES (?,?,?,?,?)',
        [nama, slug, deskripsi||null, kategori||'lainnya', status||'published']
      );
      const fasilitasId = result.insertId;
      if (req.files && req.files.length) {
        for (let i = 0; i < req.files.length; i++) {
          await db.query('INSERT INTO fasilitas_foto (fasilitas_id,gambar,urutan) VALUES (?,?,?)',
            [fasilitasId, req.files[i].filename, i]);
        }
      }
      res.redirect('/admin/fasilitas?success=1');
    } catch (e) { console.error(e); res.redirect('/admin/fasilitas?error=' + encodeURIComponent(e.message)); }
  });
};

exports.adminFasilitasEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM fasilitas WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/fasilitas');
  const [fotos] = await db.query('SELECT * FROM fasilitas_foto WHERE fasilitas_id=? ORDER BY urutan ASC, id ASC', [req.params.id]);
  res.render('admin/fasilitas/edit', { title: 'Edit Fasilitas', user: req.session, item: rows[0], fotos });
};

exports.adminFasilitasUpdate = (req, res) => {
  uploadFasilitasMulti(req, res, async (err) => {
    if (err) return res.redirect('/admin/fasilitas?error=' + encodeURIComponent(err.message));
    try {
      const { nama, deskripsi, kategori, status, hapus_foto } = req.body;
      await db.query('UPDATE fasilitas SET nama=?,deskripsi=?,kategori=?,status=? WHERE id=?',
        [nama, deskripsi||null, kategori||'lainnya', status||'published', req.params.id]);
      // Hapus foto yang dicentang
      if (hapus_foto) {
        const ids = Array.isArray(hapus_foto) ? hapus_foto : [hapus_foto];
        for (const fid of ids) {
          await db.query('DELETE FROM fasilitas_foto WHERE id=? AND fasilitas_id=?', [fid, req.params.id]);
        }
      }
      // Tambah foto baru
      if (req.files && req.files.length) {
        const [lastOrder] = await db.query('SELECT MAX(urutan) as mx FROM fasilitas_foto WHERE fasilitas_id=?', [req.params.id]);
        let startOrder = (lastOrder[0].mx || 0) + 1;
        for (let i = 0; i < req.files.length; i++) {
          await db.query('INSERT INTO fasilitas_foto (fasilitas_id,gambar,urutan) VALUES (?,?,?)',
            [req.params.id, req.files[i].filename, startOrder + i]);
        }
      }
      res.redirect('/admin/fasilitas?success=2');
    } catch (e) { console.error(e); res.redirect('/admin/fasilitas?error=' + encodeURIComponent(e.message)); }
  });
};

exports.adminFasilitasDelete = async (req, res) => {
  await db.query('DELETE FROM fasilitas_foto WHERE fasilitas_id=?', [req.params.id]);
  await db.query('DELETE FROM fasilitas WHERE id=?', [req.params.id]);
  res.redirect('/admin/fasilitas?success=3');
};

// ── FRONTEND ROHIS ────────────────────────────────────────────────────────────
exports.rohisIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM rohis_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM rohis_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM rohis_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/rohis', { title: 'ROHIS', currentPage: 'rohis', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.rohisDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM rohis_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/rohis-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.rohisBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM rohis_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/rohis-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL ROHIS ──────────────────────────────────────────────────────────────
const uploadGaleriRohis = createUpload('rohis-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.rohisDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM rohis_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/rohis/dashboard', { title: 'Dashboard ROHIS', user: req.session, kegiatan, success: req.query.success });
};

exports.rohisCreatePage = (req, res) =>
  portalRender(res, req, 'portal/rohis/create', { title: 'Tambah Kegiatan ROHIS', user: req.session });

exports.rohisCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/rohis/create', { title: 'Tambah Kegiatan ROHIS', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/rohis/create', { title: 'Tambah Kegiatan ROHIS', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO rohis_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/rohis/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/rohis/create', { title: 'Tambah Kegiatan ROHIS', user: req.session, error: e.message }); }
  });
};

exports.rohisEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM rohis_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/rohis/dashboard');
  portalRender(res, req, 'portal/rohis/edit', { title: 'Edit Kegiatan ROHIS', user: req.session, item: rows[0] });
};

exports.rohisUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/rohis/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM rohis_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE rohis_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/rohis/dashboard?success=2');
  });
};

exports.rohisDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/rohis/dashboard?success=3');
};

exports.rohisGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM rohis_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/rohis/galeri', { title: 'Galeri ROHIS', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.rohisGaleriCreate = (req, res) => {
  uploadGaleriRohis(req, res, async (err) => {
    if (err) return res.redirect('/rohis/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/rohis/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO rohis_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri ROHIS', file.filename, keterangan||null]);
      }
      res.redirect('/rohis/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/rohis/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.rohisGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_galeri WHERE id=?', [req.params.id]);
  res.redirect('/rohis/galeri?success=3');
};

// ── PORTAL ROHIS: Berita ──────────────────────────────────────────────────────
exports.rohisBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM rohis_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/rohis/berita', { title: 'Berita & Informasi ROHIS', user: req.session, berita, success: req.query.success });
};

exports.rohisBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session });

exports.rohisBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO rohis_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/rohis/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session, error: e.message }); }
  });
};

exports.rohisBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM rohis_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/rohis/berita');
  portalRender(res, req, 'portal/rohis/berita-edit', { title: 'Edit Berita ROHIS', user: req.session, item: rows[0] });
};

exports.rohisBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/rohis/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM rohis_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE rohis_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/rohis/berita?success=2');
  });
};

exports.rohisBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_berita WHERE id=?', [req.params.id]);
  res.redirect('/rohis/berita?success=3');
};

// ── FRONTEND PMR ──────────────────────────────────────────────────────────────
exports.pmrIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM pmr_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pmr_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pmr_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/pmr', { title: 'PMR', currentPage: 'pmr', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.pmrDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pmr_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pmr-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.pmrBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pmr_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pmr-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── PORTAL PMR ────────────────────────────────────────────────────────────────
const uploadGaleriPmr = createUpload('pmr-galeri', { maxFiles: 20 }).array('gambar', 20);

exports.pmrDashboard = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pmr_kegiatan ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pmr/dashboard', { title: 'Dashboard PMR', user: req.session, kegiatan, success: req.query.success });
};

exports.pmrCreatePage = (req, res) =>
  portalRender(res, req, 'portal/pmr/create', { title: 'Tambah Kegiatan PMR', user: req.session });

exports.pmrCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/pmr/create', { title: 'Tambah Kegiatan PMR', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/pmr/create', { title: 'Tambah Kegiatan PMR', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO pmr_kegiatan (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published', req.session.portalNama]);
      res.redirect('/pmr/dashboard?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/pmr/create', { title: 'Tambah Kegiatan PMR', user: req.session, error: e.message }); }
  });
};

exports.pmrEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pmr_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/pmr/dashboard');
  portalRender(res, req, 'portal/pmr/edit', { title: 'Edit Kegiatan PMR', user: req.session, item: rows[0] });
};

exports.pmrUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/pmr/dashboard');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pmr_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pmr_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/pmr/dashboard?success=2');
  });
};

exports.pmrDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/pmr/dashboard?success=3');
};

exports.pmrGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pmr_galeri ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pmr/galeri', { title: 'Galeri PMR', user: req.session, galeri, success: req.query.success, errorMsg: req.query.error || null });
};

exports.pmrGaleriCreate = (req, res) => {
  uploadGaleriPmr(req, res, async (err) => {
    if (err) return res.redirect('/pmr/galeri?error=' + encodeURIComponent(err.message));
    try {
      if (!req.files || req.files.length === 0) return res.redirect('/pmr/galeri?error=Pilih+minimal+1+foto');
      const { judul, keterangan } = req.body;
      for (const file of req.files) {
        await db.query('INSERT INTO pmr_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
          [judul||'Galeri PMR', file.filename, keterangan||null]);
      }
      res.redirect('/pmr/galeri?success=1');
    } catch (e) { console.error(e); res.redirect('/pmr/galeri?error=' + encodeURIComponent(e.message)); }
  });
};

exports.pmrGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_galeri WHERE id=?', [req.params.id]);
  res.redirect('/pmr/galeri?success=3');
};

// ── PORTAL PMR: Berita ────────────────────────────────────────────────────────
exports.pmrBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pmr_berita ORDER BY created_at DESC');
  portalRender(res, req, 'portal/pmr/berita', { title: 'Berita & Informasi PMR', user: req.session, berita, success: req.query.success });
};

exports.pmrBeritaCreatePage = (req, res) =>
  portalRender(res, req, 'portal/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session });

exports.pmrBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return portalRender(res, req, 'portal/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session, error: err.message });
    try {
      const { judul, konten, kategori, status } = req.body;
      if (!judul) return portalRender(res, req, 'portal/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session, error: 'Judul wajib diisi' });
      const gambar = req.file ? req.file.filename : null;
      const slug = createSlug(judul);
      await db.query('INSERT INTO pmr_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
        [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.portalNama]);
      res.redirect('/pmr/berita?success=1');
    } catch (e) { console.error(e); portalRender(res, req, 'portal/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session, error: e.message }); }
  });
};

exports.pmrBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pmr_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/pmr/berita');
  portalRender(res, req, 'portal/pmr/berita-edit', { title: 'Edit Berita PMR', user: req.session, item: rows[0] });
};

exports.pmrBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/pmr/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pmr_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pmr_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/pmr/berita?success=2');
  });
};

exports.pmrBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_berita WHERE id=?', [req.params.id]);
  res.redirect('/pmr/berita?success=3');
};

// ── ADMIN EKSTRAKURIKULER CONTROLLERS ───────────────────────────────────────

// ── ADMIN PRAMUKA ────────────────────────────────────────────────────────
exports.adminPramukaIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pramuka_kegiatan ORDER BY created_at DESC');
  res.render('admin/pramuka/index', { title: 'Kelola PRAMUKA', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPramukaCreatePage = (req, res) => res.render('admin/pramuka/create', { title: 'Tambah Kegiatan PRAMUKA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPramukaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pramuka');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pramuka_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/pramuka?success=1');
  });
};
exports.adminPramukaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pramuka');
  res.render('admin/pramuka/edit', { title: 'Edit Kegiatan PRAMUKA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPramukaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pramuka');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pramuka_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/pramuka?success=2');
  });
};
exports.adminPramukaDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/pramuka?success=3');
};
exports.adminPramukaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pramuka_berita ORDER BY created_at DESC');
  res.render('admin/pramuka/berita', { title: 'Berita PRAMUKA', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPramukaBeritaCreatePage = (req, res) => res.render('admin/pramuka/berita-create', { title: 'Tambah Berita PRAMUKA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPramukaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/pramuka/berita-create', { title: 'Tambah Berita PRAMUKA', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pramuka_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/pramuka/berita?success=1');
  });
};
exports.adminPramukaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pramuka_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pramuka/berita');
  res.render('admin/pramuka/berita-edit', { title: 'Edit Berita PRAMUKA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPramukaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pramuka/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pramuka_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pramuka_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/pramuka/berita?success=2');
  });
};
exports.adminPramukaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/pramuka/berita?success=3');
};
exports.adminPramukaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pramuka_galeri ORDER BY created_at DESC');
  res.render('admin/pramuka/galeri', { title: 'Galeri PRAMUKA', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminPramukaGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('pramuka-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/pramuka/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/pramuka/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO pramuka_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri PRAMUKA', file.filename, keterangan||null]);
    }
    res.redirect('/admin/pramuka/galeri?success=1');
  });
};
exports.adminPramukaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pramuka_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/pramuka/galeri?success=3');
};

// ── ADMIN OLAHRAGA ────────────────────────────────────────────────────────
exports.adminOlahragaIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM olahraga_kegiatan ORDER BY created_at DESC');
  res.render('admin/olahraga/index', { title: 'Kelola OLAHRAGA', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminOlahragaCreatePage = (req, res) => res.render('admin/olahraga/create', { title: 'Tambah Kegiatan OLAHRAGA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminOlahragaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/olahraga');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO olahraga_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/olahraga?success=1');
  });
};
exports.adminOlahragaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/olahraga');
  res.render('admin/olahraga/edit', { title: 'Edit Kegiatan OLAHRAGA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminOlahragaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/olahraga');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE olahraga_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/olahraga?success=2');
  });
};
exports.adminOlahragaDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/olahraga?success=3');
};
exports.adminOlahragaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM olahraga_berita ORDER BY created_at DESC');
  res.render('admin/olahraga/berita', { title: 'Berita OLAHRAGA', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminOlahragaBeritaCreatePage = (req, res) => res.render('admin/olahraga/berita-create', { title: 'Tambah Berita OLAHRAGA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminOlahragaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/olahraga/berita-create', { title: 'Tambah Berita OLAHRAGA', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO olahraga_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/olahraga/berita?success=1');
  });
};
exports.adminOlahragaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM olahraga_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/olahraga/berita');
  res.render('admin/olahraga/berita-edit', { title: 'Edit Berita OLAHRAGA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminOlahragaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/olahraga/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM olahraga_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE olahraga_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/olahraga/berita?success=2');
  });
};
exports.adminOlahragaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/olahraga/berita?success=3');
};
exports.adminOlahragaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM olahraga_galeri ORDER BY created_at DESC');
  res.render('admin/olahraga/galeri', { title: 'Galeri OLAHRAGA', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminOlahragaGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('olahraga-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/olahraga/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/olahraga/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO olahraga_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri OLAHRAGA', file.filename, keterangan||null]);
    }
    res.redirect('/admin/olahraga/galeri?success=1');
  });
};
exports.adminOlahragaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM olahraga_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/olahraga/galeri?success=3');
};

// ── ADMIN PASKIBRAKA ────────────────────────────────────────────────────────
exports.adminPaskibrakaIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM paskibraka_kegiatan ORDER BY created_at DESC');
  res.render('admin/paskibraka/index', { title: 'Kelola PASKIBRAKA', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPaskibrakaCreatePage = (req, res) => res.render('admin/paskibraka/create', { title: 'Tambah Kegiatan PASKIBRAKA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPaskibrakaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/paskibraka');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO paskibraka_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/paskibraka?success=1');
  });
};
exports.adminPaskibrakaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/paskibraka');
  res.render('admin/paskibraka/edit', { title: 'Edit Kegiatan PASKIBRAKA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPaskibrakaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/paskibraka');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE paskibraka_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/paskibraka?success=2');
  });
};
exports.adminPaskibrakaDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/paskibraka?success=3');
};
exports.adminPaskibrakaBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM paskibraka_berita ORDER BY created_at DESC');
  res.render('admin/paskibraka/berita', { title: 'Berita PASKIBRAKA', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPaskibrakaBeritaCreatePage = (req, res) => res.render('admin/paskibraka/berita-create', { title: 'Tambah Berita PASKIBRAKA', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPaskibrakaBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/paskibraka/berita-create', { title: 'Tambah Berita PASKIBRAKA', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO paskibraka_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/paskibraka/berita?success=1');
  });
};
exports.adminPaskibrakaBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM paskibraka_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/paskibraka/berita');
  res.render('admin/paskibraka/berita-edit', { title: 'Edit Berita PASKIBRAKA', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPaskibrakaBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/paskibraka/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM paskibraka_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE paskibraka_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/paskibraka/berita?success=2');
  });
};
exports.adminPaskibrakaBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/paskibraka/berita?success=3');
};
exports.adminPaskibrakaGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM paskibraka_galeri ORDER BY created_at DESC');
  res.render('admin/paskibraka/galeri', { title: 'Galeri PASKIBRAKA', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminPaskibrakaGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('paskibraka-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/paskibraka/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/paskibraka/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO paskibraka_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri PASKIBRAKA', file.filename, keterangan||null]);
    }
    res.redirect('/admin/paskibraka/galeri?success=1');
  });
};
exports.adminPaskibrakaGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM paskibraka_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/paskibraka/galeri?success=3');
};

// ── ADMIN SENI ────────────────────────────────────────────────────────
exports.adminSeniIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM seni_kegiatan ORDER BY created_at DESC');
  res.render('admin/seni/index', { title: 'Kelola SENI', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminSeniCreatePage = (req, res) => res.render('admin/seni/create', { title: 'Tambah Kegiatan SENI', user: req.session, csrfToken: req.session.csrfToken });
exports.adminSeniCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/seni');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO seni_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/seni?success=1');
  });
};
exports.adminSeniEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM seni_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/seni');
  res.render('admin/seni/edit', { title: 'Edit Kegiatan SENI', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminSeniUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/seni');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM seni_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE seni_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/seni?success=2');
  });
};
exports.adminSeniDelete = async (req, res) => {
  await db.query('DELETE FROM seni_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/seni?success=3');
};
exports.adminSeniBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM seni_berita ORDER BY created_at DESC');
  res.render('admin/seni/berita', { title: 'Berita SENI', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminSeniBeritaCreatePage = (req, res) => res.render('admin/seni/berita-create', { title: 'Tambah Berita SENI', user: req.session, csrfToken: req.session.csrfToken });
exports.adminSeniBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/seni/berita-create', { title: 'Tambah Berita SENI', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO seni_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/seni/berita?success=1');
  });
};
exports.adminSeniBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM seni_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/seni/berita');
  res.render('admin/seni/berita-edit', { title: 'Edit Berita SENI', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminSeniBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/seni/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM seni_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE seni_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/seni/berita?success=2');
  });
};
exports.adminSeniBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM seni_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/seni/berita?success=3');
};
exports.adminSeniGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM seni_galeri ORDER BY created_at DESC');
  res.render('admin/seni/galeri', { title: 'Galeri SENI', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminSeniGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('seni-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/seni/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/seni/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO seni_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri SENI', file.filename, keterangan||null]);
    }
    res.redirect('/admin/seni/galeri?success=1');
  });
};
exports.adminSeniGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM seni_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/seni/galeri?success=3');
};

// ── ADMIN BAHASA ASING ────────────────────────────────────────────────────────
exports.adminBahasaAsingIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM bahasa_asing_kegiatan ORDER BY created_at DESC');
  res.render('admin/bahasa-asing/index', { title: 'Kelola BAHASA ASING', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminBahasaAsingCreatePage = (req, res) => res.render('admin/bahasa-asing/create', { title: 'Tambah Kegiatan BAHASA ASING', user: req.session, csrfToken: req.session.csrfToken });
exports.adminBahasaAsingCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/bahasa-asing');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO bahasa_asing_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/bahasa-asing?success=1');
  });
};
exports.adminBahasaAsingEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/bahasa-asing');
  res.render('admin/bahasa-asing/edit', { title: 'Edit Kegiatan BAHASA ASING', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminBahasaAsingUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/bahasa-asing');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bahasa_asing_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/bahasa-asing?success=2');
  });
};
exports.adminBahasaAsingDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/bahasa-asing?success=3');
};
exports.adminBahasaAsingBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM bahasa_asing_berita ORDER BY created_at DESC');
  res.render('admin/bahasa-asing/berita', { title: 'Berita BAHASA ASING', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminBahasaAsingBeritaCreatePage = (req, res) => res.render('admin/bahasa-asing/berita-create', { title: 'Tambah Berita BAHASA ASING', user: req.session, csrfToken: req.session.csrfToken });
exports.adminBahasaAsingBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/bahasa-asing/berita-create', { title: 'Tambah Berita BAHASA ASING', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO bahasa_asing_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/bahasa-asing/berita?success=1');
  });
};
exports.adminBahasaAsingBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/bahasa-asing/berita');
  res.render('admin/bahasa-asing/berita-edit', { title: 'Edit Berita BAHASA ASING', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminBahasaAsingBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/bahasa-asing/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE bahasa_asing_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/bahasa-asing/berita?success=2');
  });
};
exports.adminBahasaAsingBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/bahasa-asing/berita?success=3');
};
exports.adminBahasaAsingGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM bahasa_asing_galeri ORDER BY created_at DESC');
  res.render('admin/bahasa-asing/galeri', { title: 'Galeri BAHASA ASING', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminBahasaAsingGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('bahasa-asing-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/bahasa-asing/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/bahasa-asing/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO bahasa_asing_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri BAHASA ASING', file.filename, keterangan||null]);
    }
    res.redirect('/admin/bahasa-asing/galeri?success=1');
  });
};
exports.adminBahasaAsingGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM bahasa_asing_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/bahasa-asing/galeri?success=3');
};

// ── ADMIN ROHIS ────────────────────────────────────────────────────────
exports.adminRohisIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM rohis_kegiatan ORDER BY created_at DESC');
  res.render('admin/rohis/index', { title: 'Kelola ROHIS', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminRohisCreatePage = (req, res) => res.render('admin/rohis/create', { title: 'Tambah Kegiatan ROHIS', user: req.session, csrfToken: req.session.csrfToken });
exports.adminRohisCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/rohis');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO rohis_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/rohis?success=1');
  });
};
exports.adminRohisEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM rohis_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/rohis');
  res.render('admin/rohis/edit', { title: 'Edit Kegiatan ROHIS', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminRohisUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/rohis');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM rohis_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE rohis_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/rohis?success=2');
  });
};
exports.adminRohisDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/rohis?success=3');
};
exports.adminRohisBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM rohis_berita ORDER BY created_at DESC');
  res.render('admin/rohis/berita', { title: 'Berita ROHIS', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminRohisBeritaCreatePage = (req, res) => res.render('admin/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session, csrfToken: req.session.csrfToken });
exports.adminRohisBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/rohis/berita-create', { title: 'Tambah Berita ROHIS', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO rohis_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/rohis/berita?success=1');
  });
};
exports.adminRohisBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM rohis_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/rohis/berita');
  res.render('admin/rohis/berita-edit', { title: 'Edit Berita ROHIS', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminRohisBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/rohis/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM rohis_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE rohis_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/rohis/berita?success=2');
  });
};
exports.adminRohisBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/rohis/berita?success=3');
};
exports.adminRohisGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM rohis_galeri ORDER BY created_at DESC');
  res.render('admin/rohis/galeri', { title: 'Galeri ROHIS', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminRohisGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('rohis-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/rohis/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/rohis/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO rohis_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri ROHIS', file.filename, keterangan||null]);
    }
    res.redirect('/admin/rohis/galeri?success=1');
  });
};
exports.adminRohisGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM rohis_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/rohis/galeri?success=3');
};

// ── ADMIN PMR ────────────────────────────────────────────────────────
exports.adminPmrIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pmr_kegiatan ORDER BY created_at DESC');
  res.render('admin/pmr/index', { title: 'Kelola PMR', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPmrCreatePage = (req, res) => res.render('admin/pmr/create', { title: 'Tambah Kegiatan PMR', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPmrCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pmr');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pmr_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/pmr?success=1');
  });
};
exports.adminPmrEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pmr_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pmr');
  res.render('admin/pmr/edit', { title: 'Edit Kegiatan PMR', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPmrUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pmr');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pmr_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pmr_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/pmr?success=2');
  });
};
exports.adminPmrDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/pmr?success=3');
};
exports.adminPmrBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pmr_berita ORDER BY created_at DESC');
  res.render('admin/pmr/berita', { title: 'Berita PMR', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPmrBeritaCreatePage = (req, res) => res.render('admin/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPmrBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/pmr/berita-create', { title: 'Tambah Berita PMR', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pmr_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/pmr/berita?success=1');
  });
};
exports.adminPmrBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pmr_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pmr/berita');
  res.render('admin/pmr/berita-edit', { title: 'Edit Berita PMR', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPmrBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pmr/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pmr_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pmr_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/pmr/berita?success=2');
  });
};
exports.adminPmrBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/pmr/berita?success=3');
};
exports.adminPmrGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pmr_galeri ORDER BY created_at DESC');
  res.render('admin/pmr/galeri', { title: 'Galeri PMR', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminPmrGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('pmr-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/pmr/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/pmr/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO pmr_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri PMR', file.filename, keterangan||null]);
    }
    res.redirect('/admin/pmr/galeri?success=1');
  });
};
exports.adminPmrGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pmr_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/pmr/galeri?success=3');
};


// ── FRONTEND PIK-R ────────────────────────────────────────────────────────────
exports.pikrIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM pikr_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pikr_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pikr_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/pikr', { title: 'PIK-R', currentPage: 'pikr', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.pikrDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pikr_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pikr-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.pikrBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pikr_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pikr-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── FRONTEND PECINTA ALAM ─────────────────────────────────────────────────────
exports.pecintaAlamIndex = async (req, res) => {
  try {
    const common = await getCommon();
    const [[kegiatan], [berita], [galeri]] = await Promise.all([
      db.query("SELECT * FROM pecinta_alam_kegiatan WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pecinta_alam_berita WHERE status='published' ORDER BY created_at DESC"),
      db.query("SELECT * FROM pecinta_alam_galeri ORDER BY created_at DESC")
    ]);
    res.render('frontend/pecintaalam', { title: 'Pecinta Alam', currentPage: 'pecinta-alam', kegiatan, berita, galeri, ...common });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.pecintaAlamDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pecinta_alam_kegiatan WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pecintaalam-detail', { title: rows[0].judul, kegiatan: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

exports.pecintaAlamBeritaDetail = async (req, res) => {
  try {
    const common = await getCommon();
    const [rows] = await db.query("SELECT * FROM pecinta_alam_berita WHERE slug=? AND status='published'", [req.params.slug]);
    if (!rows.length) return res.status(404).render('frontend/404', { title: '404', menuItems: common.menuItems });
    res.render('frontend/pecintaalam-berita-detail', { title: rows[0].judul, berita: rows[0], ...common });
  } catch (err) { res.status(500).send('Terjadi kesalahan'); }
};

// ── ADMIN PIK-R ───────────────────────────────────────────────────────────────
exports.adminPikrIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pikr_kegiatan ORDER BY created_at DESC');
  res.render('admin/pikr/index', { title: 'Kelola PIK-R', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPikrCreatePage = (req, res) => res.render('admin/pikr/create', { title: 'Tambah Kegiatan PIK-R', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPikrCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pikr');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pikr_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/pikr?success=1');
  });
};
exports.adminPikrEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pikr_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pikr');
  res.render('admin/pikr/edit', { title: 'Edit Kegiatan PIK-R', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPikrUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pikr');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pikr_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pikr_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/pikr?success=2');
  });
};
exports.adminPikrDelete = async (req, res) => {
  await db.query('DELETE FROM pikr_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/pikr?success=3');
};
exports.adminPikrBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pikr_berita ORDER BY created_at DESC');
  res.render('admin/pikr/berita', { title: 'Berita PIK-R', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPikrBeritaCreatePage = (req, res) => res.render('admin/pikr/berita-create', { title: 'Tambah Berita PIK-R', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPikrBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/pikr/berita-create', { title: 'Tambah Berita PIK-R', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pikr_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/pikr/berita?success=1');
  });
};
exports.adminPikrBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pikr_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pikr/berita');
  res.render('admin/pikr/berita-edit', { title: 'Edit Berita PIK-R', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPikrBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pikr/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pikr_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pikr_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/pikr/berita?success=2');
  });
};
exports.adminPikrBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pikr_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/pikr/berita?success=3');
};
exports.adminPikrGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pikr_galeri ORDER BY created_at DESC');
  res.render('admin/pikr/galeri', { title: 'Galeri PIK-R', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminPikrGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('pikr-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/pikr/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/pikr/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO pikr_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri PIK-R', file.filename, keterangan||null]);
    }
    res.redirect('/admin/pikr/galeri?success=1');
  });
};
exports.adminPikrGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pikr_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/pikr/galeri?success=3');
};

// ── ADMIN PECINTA ALAM ────────────────────────────────────────────────────────
exports.adminPecintaAlamIndex = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM pecinta_alam_kegiatan ORDER BY created_at DESC');
  res.render('admin/pecintaalam/index', { title: 'Kelola Pecinta Alam', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPecintaAlamCreatePage = (req, res) => res.render('admin/pecintaalam/create', { title: 'Tambah Kegiatan Pecinta Alam', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPecintaAlamCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pecinta-alam');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pecinta_alam_kegiatan (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/pecinta-alam?success=1');
  });
};
exports.adminPecintaAlamEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pecinta_alam_kegiatan WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pecinta-alam');
  res.render('admin/pecintaalam/edit', { title: 'Edit Kegiatan Pecinta Alam', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPecintaAlamUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pecinta-alam');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pecinta_alam_kegiatan WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pecinta_alam_kegiatan SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/pecinta-alam?success=2');
  });
};
exports.adminPecintaAlamDelete = async (req, res) => {
  await db.query('DELETE FROM pecinta_alam_kegiatan WHERE id=?', [req.params.id]);
  res.redirect('/admin/pecinta-alam?success=3');
};
exports.adminPecintaAlamBeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM pecinta_alam_berita ORDER BY created_at DESC');
  res.render('admin/pecintaalam/berita', { title: 'Berita Pecinta Alam', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.adminPecintaAlamBeritaCreatePage = (req, res) => res.render('admin/pecintaalam/berita-create', { title: 'Tambah Berita Pecinta Alam', user: req.session, csrfToken: req.session.csrfToken });
exports.adminPecintaAlamBeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/pecintaalam/berita-create', { title: 'Tambah Berita Pecinta Alam', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO pecinta_alam_berita (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/pecinta-alam/berita?success=1');
  });
};
exports.adminPecintaAlamBeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM pecinta_alam_berita WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/pecinta-alam/berita');
  res.render('admin/pecintaalam/berita-edit', { title: 'Edit Berita Pecinta Alam', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.adminPecintaAlamBeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/pecinta-alam/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM pecinta_alam_berita WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE pecinta_alam_berita SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/pecinta-alam/berita?success=2');
  });
};
exports.adminPecintaAlamBeritaDelete = async (req, res) => {
  await db.query('DELETE FROM pecinta_alam_berita WHERE id=?', [req.params.id]);
  res.redirect('/admin/pecinta-alam/berita?success=3');
};
exports.adminPecintaAlamGaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM pecinta_alam_galeri ORDER BY created_at DESC');
  res.render('admin/pecintaalam/galeri', { title: 'Galeri Pecinta Alam', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.adminPecintaAlamGaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('pecintaalam-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/pecinta-alam/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/pecinta-alam/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO pecinta_alam_galeri (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri Pecinta Alam', file.filename, keterangan||null]);
    }
    res.redirect('/admin/pecinta-alam/galeri?success=1');
  });
};
exports.adminPecintaAlamGaleriDelete = async (req, res) => {
  await db.query('DELETE FROM pecinta_alam_galeri WHERE id=?', [req.params.id]);
  res.redirect('/admin/pecinta-alam/galeri?success=3');
};
