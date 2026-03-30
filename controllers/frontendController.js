const db = require('../config/database');
const cache = require('../utils/cache');

// ── Helpers dengan cache ──────────────────────────────────────────────────────

const getMenuItems = async () => {
  const cached = cache.get('menu');
  if (cached) return cached;
  try {
    const [rows] = await db.query(
      "SELECT id, judul, url, parent_id, urutan FROM menu_navigasi WHERE status = 'aktif' ORDER BY urutan ASC"
    );
    const parents = rows.filter(r => r.parent_id === null);
    parents.forEach(p => {
      p.children = rows.filter(r => r.parent_id === p.id);
      p.children.forEach(c => { c.children = rows.filter(r => r.parent_id === c.id); });
    });
    cache.set('menu', parents, 300); // cache 5 menit
    return parents;
  } catch (err) {
    console.error('Error loading menu:', err);
    return [];
  }
};
exports.getMenuItems = getMenuItems;

const getMediaSosialFooter = async () => {
  const cached = cache.get('media_sosial_footer');
  if (cached) return cached;
  const [rows] = await db.query(
    "SELECT id, judul, platform, embed_url FROM media_sosial WHERE status = 'aktif' ORDER BY urutan ASC, created_at DESC"
  );
  cache.set('media_sosial_footer', rows, 300);
  return rows;
};

const getProfilSekolah = async () => {
  const cached = cache.get('profil_sekolah');
  if (cached) return cached;
  const [rows] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
  const profil = rows[0] || {};
  cache.set('profil_sekolah', profil, 600); // cache 10 menit
  return profil;
};

const getRelatedBerita = async (excludeId = null) => {
  const key = `related_berita_${excludeId || 'all'}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const [rows] = excludeId
    ? await db.query('SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 4', [excludeId])
    : await db.query('SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 4');
  cache.set(key, rows, 120); // cache 2 menit
  return rows;
};

const getProfilKonten = async (tipe) => {
  const key = `profil_konten_${tipe}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const [rows] = await db.query('SELECT * FROM profil_konten WHERE tipe = ?', [tipe]);
  const result = rows[0] || { tipe, judul: '', konten: '', foto: null };
  cache.set(key, result, 600);
  return result;
};

// ── Frontend Controllers ──────────────────────────────────────────────────────

exports.home = async (req, res) => {
  try {
    // Semua query paralel
    const [
      profil,
      [beritaTerbaru],
      [galeri],
      [slider],
      [jurusan],
      menuItems,
      mediaSosialFooter
    ] = await Promise.all([
      getProfilSekolah(),
      db.query('SELECT id, judul, slug, gambar, kategori, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 6'),
      db.query('SELECT id, judul, gambar, kategori FROM galeri ORDER BY created_at DESC LIMIT 6'),
      db.query('SELECT * FROM slider WHERE status = "aktif" ORDER BY urutan ASC, created_at DESC'),
      db.query("SELECT id, kode, nama, deskripsi, logo FROM jurusan WHERE status = 'aktif' ORDER BY kode ASC"),
      getMenuItems(),
      getMediaSosialFooter()
    ]);

    res.render('frontend/home', {
      title: 'Beranda', currentPage: 'home',
      profil, berita: beritaTerbaru, galeri, slider, jurusan, menuItems, mediaSosialFooter
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.profil = async (req, res) => {
  try {
    const [profil, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/profil', {
      title: 'Profil Sekolah', currentPage: 'profil',
      profil, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.berita = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = 9;
    const offset = (page - 1) * limit;

    const [[berita], [totalRows], profil, menuItems, mediaSosialFooter] = await Promise.all([
      db.query('SELECT id, judul, slug, gambar, kategori, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]),
      db.query('SELECT COUNT(*) as count FROM berita WHERE status = "published"'),
      getProfilSekolah(),
      getMenuItems(),
      getMediaSosialFooter()
    ]);

    res.render('frontend/berita', {
      title: 'Berita', currentPage: page,
      berita, totalPages: Math.ceil(totalRows[0].count / limit),
      profil, menuItems, mediaSosialFooter, relatedBerita: berita.slice(0, 4)
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.beritaDetail = async (req, res) => {
  try {
    const [[beritaRows], profil, menuItems, mediaSosialFooter] = await Promise.all([
      db.query('SELECT b.*, u.nama_lengkap as penulis FROM berita b LEFT JOIN users u ON b.penulis_id = u.id WHERE b.slug = ? AND b.status = "published"', [req.params.slug]),
      getProfilSekolah(),
      getMenuItems(),
      getMediaSosialFooter()
    ]);

    if (!beritaRows.length) {
      return res.status(404).render('frontend/404', { title: 'Berita Tidak Ditemukan', menuItems });
    }

    const berita = beritaRows[0];
    const [[beritaTerkait], relatedBerita] = await Promise.all([
      db.query('SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 3', [berita.id]),
      getRelatedBerita(berita.id)
    ]);

    res.render('frontend/berita-detail', {
      title: berita.judul, berita, beritaTerkait,
      profil, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.galeri = async (req, res) => {
  try {
    const [[galeri], profil, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      db.query('SELECT * FROM galeri ORDER BY created_at DESC'),
      getProfilSekolah(), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);

    const albumMap = {};
    galeri.forEach(item => {
      const key = item.judul + '|' + (item.kategori || '');
      if (!albumMap[key]) albumMap[key] = { judul: item.judul, kategori: item.kategori, deskripsi: item.deskripsi, cover: item.gambar, fotos: [], created_at: item.created_at };
      albumMap[key].fotos.push(item);
    });

    res.render('frontend/galeri', {
      title: 'Galeri', currentPage: 'galeri',
      galeri, albums: Object.values(albumMap),
      profil, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guru = async (req, res) => {
  try {
    const [[guru], profil, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      db.query('SELECT id, nip, nama, jabatan, mata_pelajaran, foto, email, telepon FROM guru ORDER BY nama ASC'),
      getProfilSekolah(), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);

    const jabatanOrder = [
      { key: 'kepsek',        label: 'Kepala Sekolah',          keywords: ['kepala sekolah', 'kepsek'] },
      { key: 'waka',          label: 'Wakil Kepala Sekolah',    keywords: ['wakil kepala', 'waka'] },
      { key: 'ktu',           label: 'Kepala Tata Usaha',       keywords: ['kepala tata usaha', 'ktu'] },
      { key: 'kaproli',       label: 'Kepala Program Keahlian', keywords: ['kaproli', 'kaprogli', 'kepala program', 'kepala jurusan'] },
      { key: 'guru_normatif', label: 'Guru Normatif & Adaptif', keywords: [] },
      { key: 'guru_tkj',      label: 'Guru Kejuruan TKJ',       keywords: [] },
      { key: 'guru_tkro',     label: 'Guru Kejuruan TKRO',      keywords: [] },
      { key: 'guru_kuliner',  label: 'Guru Kejuruan Kuliner',   keywords: [] },
      { key: 'guru_tptup',    label: 'Guru Kejuruan TPTUP',     keywords: [] },
      { key: 'staff',         label: 'Staff / Karyawan',        keywords: ['staff', 'staf', 'karyawan', 'tata usaha', 'administrasi', 'operator', 'penjaga', 'satpam', 'cleaning', 'toolman', 'caraka', 'bendahara', 'perpus', 'pustakawan', 'security', 'kebersihan'] },
      { key: 'guru',          label: 'Guru',                    keywords: ['guru'] },
    ];

    const grouped = {};
    jabatanOrder.forEach(j => { grouped[j.key] = []; });
    grouped['lainnya'] = [];

    guru.forEach(g => {
      const jab = (g.jabatan || '').toLowerCase();
      const mapel = (g.mata_pelajaran || '').toLowerCase();
      if (['kepala sekolah', 'kepsek'].some(k => jab.includes(k))) { grouped['kepsek'].push(g); return; }
      if (['wakil kepala', 'waka'].some(k => jab.includes(k))) { grouped['waka'].push(g); return; }
      if (['kepala tata usaha', 'ktu'].some(k => jab.includes(k))) { grouped['ktu'].push(g); return; }
      if (['kaproli', 'kaprogli', 'kepala program', 'kepala jurusan'].some(k => jab.includes(k))) { grouped['kaproli'].push(g); return; }
      if (['staff', 'staf', 'karyawan', 'tata usaha', 'administrasi', 'operator', 'penjaga', 'satpam', 'cleaning', 'toolman', 'caraka', 'bendahara', 'perpus', 'pustakawan', 'security', 'kebersihan'].some(k => jab.includes(k) || mapel.includes(k))) { grouped['staff'].push(g); return; }
      if (mapel.includes('tkj')) { grouped['guru_tkj'].push(g); return; }
      if (mapel.includes('tkro')) { grouped['guru_tkro'].push(g); return; }
      if (mapel.includes('kuliner')) { grouped['guru_kuliner'].push(g); return; }
      if (mapel.includes('tptup')) { grouped['guru_tptup'].push(g); return; }
      if (jab.includes('guru')) { grouped['guru_normatif'].push(g); return; }
      grouped['lainnya'].push(g);
    });
    grouped['guru_normatif'] = [...grouped['guru_normatif'], ...grouped['lainnya']];

    res.render('frontend/guru', {
      title: 'Guru & Staff', currentPage: 'guru',
      guru, grouped, jabatanOrder,
      profil, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.kontakPage = async (req, res) => {
  try {
    const [profil, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/kontak', {
      title: 'Kontak', currentPage: 'kontak',
      profil, success: req.query.success, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.kontakSubmit = async (req, res) => {
  try {
    const { nama, email, subjek, pesan } = req.body;
    if (!nama || !email || !pesan) return res.redirect('/kontak?error=1');
    await db.query('INSERT INTO kontak_masuk (nama, email, subjek, pesan) VALUES (?, ?, ?, ?)', [nama, email, subjek, pesan]);
    res.redirect('/kontak?success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.mediaSosial = async (req, res) => {
  try {
    const [[mediaSosial], profil, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      db.query('SELECT * FROM media_sosial WHERE status = "aktif" ORDER BY urutan ASC, created_at DESC'),
      getProfilSekolah(), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/media-sosial', {
      title: 'Media Sosial', currentPage: 'media-sosial',
      mediaSosial, profil, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.visiMisi = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(), getProfilKonten('visi_misi'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/profil-konten', { title: 'Visi & Misi', currentPage: 'profil', profil, konten, activeMenu: 'visi-misi', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sejarah = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(), getProfilKonten('sejarah'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/profil-konten', { title: 'Sejarah Sekolah', currentPage: 'profil', profil, konten, activeMenu: 'sejarah', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sambutan = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(), getProfilKonten('sambutan'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/profil-konten', { title: 'Sambutan Kepala Sekolah', currentPage: 'profil', profil, konten, activeMenu: 'sambutan', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sambutanKepsek = async (req, res) => {
  try {
    const [profil, [kepsekRows], menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(),
      db.query("SELECT * FROM profil_konten WHERE tipe = 'sambutan' LIMIT 1"),
      getMenuItems(), getMediaSosialFooter(), getRelatedBerita()
    ]);
    res.render('frontend/sambutan-kepsek', {
      title: 'Sambutan Kepala Sekolah', currentPage: 'profil',
      profil, kepsek: kepsekRows[0] || null, menuItems, mediaSosialFooter, relatedBerita
    });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};
