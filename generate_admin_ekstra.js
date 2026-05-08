const fs = require('fs');
const path = require('path');

// Daftar ekstrakurikuler dengan konfigurasi masing-masing
const ekstras = [
  { name: 'pramuka', label: 'PRAMUKA', color: 'success', icon: 'campground', table: 'pramuka_kegiatan', beritaTable: 'pramuka_berita', galeriTable: 'pramuka_galeri' },
  { name: 'olahraga', label: 'OLAHRAGA', color: 'primary', icon: 'running', table: 'olahraga_kegiatan', beritaTable: 'olahraga_berita', galeriTable: 'olahraga_galeri' },
  { name: 'paskibraka', label: 'PASKIBRAKA', color: 'danger', icon: 'flag', table: 'paskibraka_kegiatan', beritaTable: 'paskibraka_berita', galeriTable: 'paskibraka_galeri' },
  { name: 'seni', label: 'SENI', color: 'pink', icon: 'palette', table: 'seni_kegiatan', beritaTable: 'seni_berita', galeriTable: 'seni_galeri' },
  { name: 'bahasa-asing', label: 'BAHASA ASING', color: 'info', icon: 'language', table: 'bahasa_asing_kegiatan', beritaTable: 'bahasa_asing_berita', galeriTable: 'bahasa_asing_galeri' },
  { name: 'rohis', label: 'ROHIS', color: 'success', icon: 'mosque', table: 'rohis_kegiatan', beritaTable: 'rohis_berita', galeriTable: 'rohis_galeri' },
  { name: 'pmr', label: 'PMR', color: 'danger', icon: 'first-aid', table: 'pmr_kegiatan', beritaTable: 'pmr_berita', galeriTable: 'pmr_galeri' }
];

// Template sidebar
const sidebarTemplate = (ekstra) => `<ul class="navbar-nav bg-gradient-${ekstra.color} sidebar sidebar-dark accordion" id="accordionSidebar">
    <a class="sidebar-brand d-flex align-items-center justify-content-center" href="/admin/${ekstra.name}">
        <div class="sidebar-brand-icon"><img src="/uploads/logo-sekolah.png" style="width:36px;height:36px;object-fit:contain;border-radius:6px;" onerror="this.style.display='none'"></div>
        <div class="sidebar-brand-text mx-3">Portal ${ekstra.label}</div>
    </a>
    <hr class="sidebar-divider my-0">
    <li class="nav-item"><a class="nav-link" href="/admin/${ekstra.name}"><i class="fas fa-fw fa-${ekstra.icon}"></i><span>Dashboard (Kegiatan)</span></a></li>
    <li class="nav-item"><a class="nav-link" href="/admin/${ekstra.name}/berita"><i class="fas fa-fw fa-newspaper"></i><span>Berita & Informasi</span></a></li>
    <li class="nav-item"><a class="nav-link" href="/admin/${ekstra.name}/galeri"><i class="fas fa-fw fa-images"></i><span>Galeri ${ekstra.label}</span></a></li>
    <hr class="sidebar-divider">
    <li class="nav-item"><a class="nav-link" href="/admin/dashboard"><i class="fas fa-fw fa-arrow-left"></i><span>Kembali ke Admin</span></a></li>
    <li class="nav-item"><a class="nav-link" href="/"><i class="fas fa-fw fa-globe"></i><span>Lihat Website</span></a></li>
</ul>
`;

// Generate routes untuk admin.js
const generateRoutes = () => {
  let routes = '\n// ── ADMIN EKSTRAKURIKULER ────────────────────────────────────────────────────\n';
  
  ekstras.forEach(ekstra => {
    const Name = ekstra.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    routes += `
// Admin ${ekstra.label}
router.get('/${ekstra.name}', isAuthenticated, portalController.admin${Name}Index);
router.get('/${ekstra.name}/create', isAuthenticated, portalController.admin${Name}CreatePage);
router.post('/${ekstra.name}/create', isAuthenticated, csrfProtect, portalController.admin${Name}Create);
router.get('/${ekstra.name}/edit/:id', isAuthenticated, validateIdParam, portalController.admin${Name}EditPage);
router.post('/${ekstra.name}/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.admin${Name}Update);
router.post('/${ekstra.name}/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.admin${Name}Delete);
router.get('/${ekstra.name}/berita', isAuthenticated, portalController.admin${Name}BeritaIndex);
router.get('/${ekstra.name}/berita/create', isAuthenticated, portalController.admin${Name}BeritaCreatePage);
router.post('/${ekstra.name}/berita/create', isAuthenticated, csrfProtect, uploadLimiter, portalController.admin${Name}BeritaCreate);
router.get('/${ekstra.name}/berita/edit/:id', isAuthenticated, validateIdParam, portalController.admin${Name}BeritaEditPage);
router.post('/${ekstra.name}/berita/edit/:id', isAuthenticated, csrfProtect, validateIdParam, uploadLimiter, portalController.admin${Name}BeritaUpdate);
router.post('/${ekstra.name}/berita/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.admin${Name}BeritaDelete);
router.get('/${ekstra.name}/galeri', isAuthenticated, portalController.admin${Name}GaleriIndex);
router.post('/${ekstra.name}/galeri/upload', isAuthenticated, csrfProtect, uploadLimiter, portalController.admin${Name}GaleriCreate);
router.post('/${ekstra.name}/galeri/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.admin${Name}GaleriDelete);
`;
  });
  
  console.log('✅ Routes generated. Copy to routes/admin.js');
  fs.writeFileSync('admin_routes_generated.txt', routes);
};

// Generate controllers
const generateControllers = () => {
  let controllers = '\n// ── ADMIN EKSTRAKURIKULER CONTROLLERS ───────────────────────────────────────\n';
  
  ekstras.forEach(ekstra => {
    const Name = ekstra.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    
    controllers += `
// ── ADMIN ${ekstra.label} ────────────────────────────────────────────────────────
exports.admin${Name}Index = async (req, res) => {
  const [kegiatan] = await db.query('SELECT * FROM ${ekstra.table} ORDER BY created_at DESC');
  res.render('admin/${ekstra.name}/index', { title: 'Kelola ${ekstra.label}', user: req.session, kegiatan, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.admin${Name}CreatePage = (req, res) => res.render('admin/${ekstra.name}/create', { title: 'Tambah Kegiatan ${ekstra.label}', user: req.session, csrfToken: req.session.csrfToken });
exports.admin${Name}Create = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/${ekstra.name}');
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO ${ekstra.table} (judul,slug,konten,gambar,kategori,status) VALUES (?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'kegiatan', status||'published']);
    res.redirect('/admin/${ekstra.name}?success=1');
  });
};
exports.admin${Name}EditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM ${ekstra.table} WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/${ekstra.name}');
  res.render('admin/${ekstra.name}/edit', { title: 'Edit Kegiatan ${ekstra.label}', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.admin${Name}Update = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/${ekstra.name}');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM ${ekstra.table} WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE ${ekstra.table} SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'kegiatan', status||'published', req.params.id]);
    res.redirect('/admin/${ekstra.name}?success=2');
  });
};
exports.admin${Name}Delete = async (req, res) => {
  await db.query('DELETE FROM ${ekstra.table} WHERE id=?', [req.params.id]);
  res.redirect('/admin/${ekstra.name}?success=3');
};
exports.admin${Name}BeritaIndex = async (req, res) => {
  const [berita] = await db.query('SELECT * FROM ${ekstra.beritaTable} ORDER BY created_at DESC');
  res.render('admin/${ekstra.name}/berita', { title: 'Berita ${ekstra.label}', user: req.session, berita, success: req.query.success, csrfToken: req.session.csrfToken });
};
exports.admin${Name}BeritaCreatePage = (req, res) => res.render('admin/${ekstra.name}/berita-create', { title: 'Tambah Berita ${ekstra.label}', user: req.session, csrfToken: req.session.csrfToken });
exports.admin${Name}BeritaCreate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.render('admin/${ekstra.name}/berita-create', { title: 'Tambah Berita ${ekstra.label}', user: req.session, error: err.message, csrfToken: req.session.csrfToken });
    const { judul, konten, kategori, status } = req.body;
    const gambar = req.file ? req.file.filename : null;
    const slug = createSlug(judul);
    await db.query('INSERT INTO ${ekstra.beritaTable} (judul,slug,konten,gambar,kategori,status,penulis) VALUES (?,?,?,?,?,?,?)',
      [judul, slug, konten||null, gambar, kategori||'berita', status||'published', req.session.nama || req.session.username]);
    res.redirect('/admin/${ekstra.name}/berita?success=1');
  });
};
exports.admin${Name}BeritaEditPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM ${ekstra.beritaTable} WHERE id=?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/${ekstra.name}/berita');
  res.render('admin/${ekstra.name}/berita-edit', { title: 'Edit Berita ${ekstra.label}', user: req.session, item: rows[0], csrfToken: req.session.csrfToken });
};
exports.admin${Name}BeritaUpdate = (req, res) => {
  uploadSingle(req, res, async (err) => {
    if (err) return res.redirect('/admin/${ekstra.name}/berita');
    const { judul, konten, kategori, status } = req.body;
    const [rows] = await db.query('SELECT gambar FROM ${ekstra.beritaTable} WHERE id=?', [req.params.id]);
    const gambar = req.file ? req.file.filename : rows[0]?.gambar;
    await db.query('UPDATE ${ekstra.beritaTable} SET judul=?,konten=?,gambar=?,kategori=?,status=? WHERE id=?',
      [judul, konten||null, gambar, kategori||'berita', status||'published', req.params.id]);
    res.redirect('/admin/${ekstra.name}/berita?success=2');
  });
};
exports.admin${Name}BeritaDelete = async (req, res) => {
  await db.query('DELETE FROM ${ekstra.beritaTable} WHERE id=?', [req.params.id]);
  res.redirect('/admin/${ekstra.name}/berita?success=3');
};
exports.admin${Name}GaleriIndex = async (req, res) => {
  const [galeri] = await db.query('SELECT * FROM ${ekstra.galeriTable} ORDER BY created_at DESC');
  res.render('admin/${ekstra.name}/galeri', { title: 'Galeri ${ekstra.label}', user: req.session, galeri, success: req.query.success, query: req.query, csrfToken: req.session.csrfToken });
};
exports.admin${Name}GaleriCreate = (req, res) => {
  const uploadGaleri = createUpload('${ekstra.name}-galeri', { maxFiles: 20 }).array('gambar', 20);
  uploadGaleri(req, res, async (err) => {
    if (err) return res.redirect('/admin/${ekstra.name}/galeri?error=' + encodeURIComponent(err.message));
    if (!req.files || req.files.length === 0) return res.redirect('/admin/${ekstra.name}/galeri?error=Pilih+minimal+1+foto');
    const { judul, keterangan } = req.body;
    for (const file of req.files) {
      await db.query('INSERT INTO ${ekstra.galeriTable} (judul,gambar,keterangan) VALUES (?,?,?)',
        [judul||'Galeri ${ekstra.label}', file.filename, keterangan||null]);
    }
    res.redirect('/admin/${ekstra.name}/galeri?success=1');
  });
};
exports.admin${Name}GaleriDelete = async (req, res) => {
  await db.query('DELETE FROM ${ekstra.galeriTable} WHERE id=?', [req.params.id]);
  res.redirect('/admin/${ekstra.name}/galeri?success=3');
};
`;
  });
  
  console.log('✅ Controllers generated. Copy to controllers/portalController.js');
  fs.writeFileSync('admin_controllers_generated.txt', controllers);
};

// Generate views untuk setiap ekstra
const generateViews = () => {
  ekstras.forEach(ekstra => {
    const dir = `views/admin/${ekstra.name}`;
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Sidebar
    fs.writeFileSync(`${dir}/_sidebar.ejs`, sidebarTemplate(ekstra));
    console.log(`✅ Created ${dir}/_sidebar.ejs`);
  });
  
  console.log('\n✅ All sidebars created. Now copy index.ejs, create.ejs, edit.ejs, berita.ejs, berita-create.ejs, berita-edit.ejs, galeri.ejs from OSIS folder and replace "osis" with each ekstra name and adjust colors.');
};

// Run generators
console.log('🚀 Generating admin ekstrakurikuler files...\n');
generateRoutes();
generateControllers();
generateViews();
console.log('\n✅ Generation complete!');
console.log('\nNext steps:');
console.log('1. Copy content from admin_routes_generated.txt to routes/admin.js');
console.log('2. Copy content from admin_controllers_generated.txt to controllers/portalController.js');
console.log('3. Copy views from views/admin/osis/ to each ekstra folder and adjust');
