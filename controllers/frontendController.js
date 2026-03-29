const db = require('../config/database');

const getMenuItems = async () => {
  try {
    const [rows] = await db.query(
      "SELECT * FROM menu_navigasi WHERE status = 'aktif' ORDER BY urutan ASC"
    );
    const parents = rows.filter(r => r.parent_id === null);
    parents.forEach(p => {
      p.children = rows.filter(r => r.parent_id === p.id);
      p.children.forEach(c => {
        c.children = rows.filter(r => r.parent_id === c.id);
      });
    });
    return parents;
  } catch (err) {
    console.error('Error loading menu:', err);
    return [];
  }
};

exports.getMenuItems = getMenuItems;

const getMediaSosialFooter = async () => {
  const [rows] = await db.query(
    "SELECT id, judul, platform, embed_url FROM media_sosial WHERE status = 'aktif' ORDER BY urutan ASC, created_at DESC"
  );
  return rows;
};

const getRelatedBerita = async (excludeId = null) => {
  if (excludeId) {
    const [rows] = await db.query(
      'SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" AND id != ? ORDER BY created_at DESC LIMIT 4',
      [excludeId]
    );
    return rows;
  }
  const [rows] = await db.query(
    'SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 4'
  );
  return rows;
};

exports.home = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [beritaTerbaru] = await db.query(
      'SELECT * FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 6'
    );
    const [galeri] = await db.query('SELECT * FROM galeri ORDER BY created_at DESC LIMIT 6');
    const [slider] = await db.query('SELECT * FROM slider WHERE status = "aktif" ORDER BY urutan ASC, created_at DESC');
    const [jurusan] = await db.query("SELECT * FROM jurusan WHERE status = 'aktif' ORDER BY kode ASC");
    const [menuItems, mediaSosialFooter] = await Promise.all([getMenuItems(), getMediaSosialFooter()]);
    
    res.render('frontend/home', {
      title: 'Beranda',
      currentPage: 'home',
      profil: profil[0] || {},
      berita: beritaTerbaru,
      galeri,
      slider,
      jurusan,
      menuItems,
      mediaSosialFooter
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.profil = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/profil', {
      title: 'Profil Sekolah',
      currentPage: 'profil',
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
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
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    
    res.render('frontend/berita', {
      title: 'Berita',
      currentPage: page,
      berita,
      totalPages: Math.ceil(total[0].count / limit),
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
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
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita(berita[0].id)]);
    
    res.render('frontend/berita-detail', {
      title: berita[0].judul,
      berita: berita[0],
      beritaTerkait,
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.galeri = async (req, res) => {
  try {
    const [galeri] = await db.query('SELECT * FROM galeri ORDER BY created_at DESC');
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);

    // Group by judul
    const albumMap = {};
    galeri.forEach(item => {
      const key = item.judul + '|' + (item.kategori || '');
      if (!albumMap[key]) {
        albumMap[key] = { judul: item.judul, kategori: item.kategori, deskripsi: item.deskripsi, cover: item.gambar, fotos: [], created_at: item.created_at };
      }
      albumMap[key].fotos.push(item);
    });
    const albums = Object.values(albumMap);

    res.render('frontend/galeri', {
      title: 'Galeri',
      currentPage: 'galeri',
      galeri,
      albums,
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.guru = async (req, res) => {
  try {
    const [guru] = await db.query('SELECT * FROM guru ORDER BY nama ASC');
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);

    // Urutan kelompok jabatan
    const jabatanOrder = [
      { key: 'kepsek',       label: 'Kepala Sekolah',         keywords: ['kepala sekolah', 'kepsek'] },
      { key: 'waka',         label: 'Wakil Kepala Sekolah',   keywords: ['wakil kepala', 'waka'] },
      { key: 'ktu',          label: 'Kepala Tata Usaha',      keywords: ['kepala tata usaha', 'ktu'] },
      { key: 'kaproli',      label: 'Kepala Program Keahlian',keywords: ['kaproli', 'kaprogli', 'kepala program', 'kepala jurusan'] },
      { key: 'guru_normatif',label: 'Guru Normatif & Adaptif',keywords: [] }, // diisi manual
      { key: 'guru_tkj',     label: 'Guru Kejuruan TKJ',      keywords: [] },
      { key: 'guru_tkro',    label: 'Guru Kejuruan TKRO',     keywords: [] },
      { key: 'guru_kuliner', label: 'Guru Kejuruan Kuliner',  keywords: [] },
      { key: 'guru_tptup',   label: 'Guru Kejuruan TPTUP',   keywords: [] },
      { key: 'staff',        label: 'Staff / Karyawan',       keywords: ['staff', 'staf', 'karyawan', 'tata usaha', 'administrasi', 'operator', 'penjaga', 'satpam', 'cleaning', 'toolman', 'caraka', 'bendahara', 'perpus', 'pustakawan', 'security', 'kebersihan', 'tu '] },
      { key: 'guru',         label: 'Guru',                   keywords: ['guru'] },
    ];

    const grouped = {};
    jabatanOrder.forEach(j => { grouped[j.key] = []; });
    grouped['lainnya'] = [];

    guru.forEach(g => {
      const jab = (g.jabatan || '').toLowerCase();
      const mapel = (g.mata_pelajaran || '').toLowerCase();

      // Cek jabatan struktural dulu
      if (['kepala sekolah', 'kepsek'].some(k => jab.includes(k))) { grouped['kepsek'].push(g); return; }
      if (['wakil kepala', 'waka'].some(k => jab.includes(k))) { grouped['waka'].push(g); return; }
      if (['kepala tata usaha', 'ktu'].some(k => jab.includes(k))) { grouped['ktu'].push(g); return; }
      if (['kaproli', 'kaprogli', 'kepala program', 'kepala jurusan'].some(k => jab.includes(k))) { grouped['kaproli'].push(g); return; }

      // Cek staff/karyawan
      if (['staff', 'staf', 'karyawan', 'tata usaha', 'administrasi', 'operator', 'penjaga', 'satpam', 'cleaning', 'toolman', 'caraka', 'bendahara', 'perpus', 'pustakawan', 'security', 'kebersihan'].some(k => jab.includes(k) || mapel.includes(k))) {
        grouped['staff'].push(g); return;
      }

      // Kelompok guru produktif berdasarkan mata_pelajaran
      if (mapel.includes('tkj')) { grouped['guru_tkj'].push(g); return; }
      if (mapel.includes('tkro')) { grouped['guru_tkro'].push(g); return; }
      if (mapel.includes('kuliner')) { grouped['guru_kuliner'].push(g); return; }
      if (mapel.includes('tptup')) { grouped['guru_tptup'].push(g); return; }

      // Guru normatif/adaptif (bukan produktif)
      if (jab.includes('guru')) { grouped['guru_normatif'].push(g); return; }

      grouped['lainnya'].push(g);
    });

    // Gabungkan lainnya ke guru normatif
    grouped['guru_normatif'] = [...grouped['guru_normatif'], ...grouped['lainnya']];

    res.render('frontend/guru', {
      title: 'Guru & Staff',
      currentPage: 'guru',
      guru,
      grouped,
      jabatanOrder,
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.kontakPage = async (req, res) => {
  try {
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/kontak', {
      title: 'Kontak',
      currentPage: 'kontak',
      profil: profil[0] || {},
      success: req.query.success,
      menuItems,
      mediaSosialFooter,
      relatedBerita
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
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/media-sosial', {
      title: 'Media Sosial',
      currentPage: 'media-sosial',
      mediaSosial,
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

const getProfilKonten = async (tipe) => {
  const [rows] = await db.query('SELECT * FROM profil_konten WHERE tipe = ?', [tipe]);
  return rows[0] || { tipe, judul: '', konten: '', foto: null };
};

const getProfilSekolah = async () => {
  const [rows] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
  return rows[0] || {};
};

exports.visiMisi = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getProfilSekolah(), getProfilKonten('visi_misi'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/profil-konten', { title: 'Visi & Misi', currentPage: 'profil', profil, konten, activeMenu: 'visi-misi', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sejarah = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getProfilSekolah(), getProfilKonten('sejarah'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/profil-konten', { title: 'Sejarah Sekolah', currentPage: 'profil', profil, konten, activeMenu: 'sejarah', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sambutan = async (req, res) => {
  try {
    const [profil, konten, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([getProfilSekolah(), getProfilKonten('sambutan'), getMenuItems(), getMediaSosialFooter(), getRelatedBerita()]);
    res.render('frontend/profil-konten', { title: 'Sambutan Kepala Sekolah', currentPage: 'profil', profil, konten, activeMenu: 'sambutan', menuItems, mediaSosialFooter, relatedBerita });
  } catch (err) { console.error(err); res.status(500).send('Terjadi kesalahan'); }
};

exports.sambutanKepsek = async (req, res) => {
  try {
    const [profil, kepsekRows, menuItems, mediaSosialFooter, relatedBerita] = await Promise.all([
      getProfilSekolah(),
      db.query("SELECT * FROM profil_konten WHERE tipe = 'sambutan' LIMIT 1"),
      getMenuItems(),
      getMediaSosialFooter(),
      getRelatedBerita()
    ]);
    res.render('frontend/sambutan-kepsek', {
      title: 'Sambutan Kepala Sekolah',
      currentPage: 'profil',
      profil,
      kepsek: kepsekRows[0][0] || null,
      menuItems,
      mediaSosialFooter,
      relatedBerita
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
