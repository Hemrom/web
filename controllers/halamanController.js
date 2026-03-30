const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const compressImage = require('../middleware/compressImage');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, 'halaman-' + Date.now() + '-' + Math.random().toString(36).substr(2,6) + path.extname(file.originalname))
});
const uploadFields = multer({ storage }).fields([
  { name: 'foto', maxCount: 1 },
  { name: 'galeri_foto', maxCount: 20 }
]);

const createSlug = (text) => text.toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '')
  .replace(/\s+/g, '-')
  .replace(/-+/g, '-')
  .trim();

// Admin: daftar halaman
exports.index = async (req, res) => {
  try {
    const [halaman] = await db.query('SELECT * FROM halaman ORDER BY created_at DESC');
    res.render('admin/halaman/index', {
      title: 'Kelola Halaman',
      user: req.session,
      halaman,
      success: req.query.success
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Admin: form buat halaman
exports.createPage = (req, res) => {
  res.render('admin/halaman/create', {
    title: 'Buat Halaman Baru',
    user: req.session,
    error: null,
    old: {}
  });
};

// Admin: simpan halaman baru
exports.create = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, status } = req.body;
      if (!judul || !judul.trim()) {
        return res.render('admin/halaman/create', {
          title: 'Buat Halaman Baru', user: req.session,
          error: 'Judul tidak boleh kosong', old: req.body
        });
      }
      const slug = createSlug(judul);
      const foto = req.files && req.files['foto'] ? req.files['foto'][0].filename : null;
      const [result] = await db.query(
        'INSERT INTO halaman (judul, slug, konten, foto, status) VALUES (?,?,?,?,?)',
        [judul.trim(), slug, konten || '', foto, status || 'aktif']
      );
      // Simpan foto galeri
      if (req.files && req.files['galeri_foto']) {
        const keterangans = Array.isArray(req.body.galeri_keterangan) ? req.body.galeri_keterangan : [req.body.galeri_keterangan || ''];
        for (let i = 0; i < req.files['galeri_foto'].length; i++) {
          await db.query('INSERT INTO halaman_galeri (halaman_id, gambar, keterangan, urutan) VALUES (?,?,?,?)',
            [result.insertId, req.files['galeri_foto'][i].filename, keterangans[i] || '', i]);
        }
      }
      // Simpan embed
      if (req.body.embed_url) {
        const urls = Array.isArray(req.body.embed_url) ? req.body.embed_url : [req.body.embed_url];
        const platforms = Array.isArray(req.body.embed_platform) ? req.body.embed_platform : [req.body.embed_platform || 'youtube'];
        const juduls = Array.isArray(req.body.embed_judul) ? req.body.embed_judul : [req.body.embed_judul || ''];
        for (let i = 0; i < urls.length; i++) {
          if (urls[i] && urls[i].trim()) {
            await db.query('INSERT INTO halaman_embed (halaman_id, platform, embed_url, judul, urutan) VALUES (?,?,?,?,?)',
              [result.insertId, platforms[i] || 'youtube', urls[i].trim(), juduls[i] || '', i]);
          }
        }
      }
      res.redirect('/admin/kontrol-website?tab=halaman&success=1');
    } catch (err) {
      const dupSlug = err.code === 'ER_DUP_ENTRY' ? 'Judul sudah digunakan, coba judul lain.' : 'Terjadi kesalahan.';
      res.render('admin/halaman/create', { title: 'Buat Halaman Baru', user: req.session, error: dupSlug, old: req.body });
    }
  });
};

// Admin: form edit halaman
exports.editPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM halaman WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.redirect('/admin/kontrol-website?tab=halaman');
    const [galeri] = await db.query('SELECT * FROM halaman_galeri WHERE halaman_id = ? ORDER BY urutan ASC', [req.params.id]);
    const [embeds] = await db.query('SELECT * FROM halaman_embed WHERE halaman_id = ? ORDER BY urutan ASC', [req.params.id]);
    res.render('admin/halaman/edit', {
      title: 'Edit Halaman',
      user: req.session,
      halaman: rows[0],
      galeri,
      embeds,
      error: null
    });
  } catch (err) {
    res.status(500).send('Terjadi kesalahan');
  }
};

// Admin: update halaman
exports.update = (req, res) => {
  uploadFields(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    await compressImage(req, res, () => {});
    try {
      const { judul, konten, status, hapus_galeri } = req.body;
      const foto = req.files && req.files['foto'] ? req.files['foto'][0].filename : null;
      if (foto) {
        await db.query('UPDATE halaman SET judul=?, konten=?, foto=?, status=? WHERE id=?',
          [judul, konten, foto, status, req.params.id]);
      } else {
        await db.query('UPDATE halaman SET judul=?, konten=?, status=? WHERE id=?',
          [judul, konten, status, req.params.id]);
      }
      // Hapus foto galeri yang dipilih
      if (hapus_galeri) {
        const ids = Array.isArray(hapus_galeri) ? hapus_galeri : [hapus_galeri];
        for (const gid of ids) {
          await db.query('DELETE FROM halaman_galeri WHERE id = ? AND halaman_id = ?', [gid, req.params.id]);
        }
      }
      // Tambah foto galeri baru
      if (req.files && req.files['galeri_foto']) {
        const keterangans = Array.isArray(req.body.galeri_keterangan) ? req.body.galeri_keterangan : [req.body.galeri_keterangan || ''];
        const [existing] = await db.query('SELECT COUNT(*) as cnt FROM halaman_galeri WHERE halaman_id = ?', [req.params.id]);
        let startUrutan = existing[0].cnt;
        for (let i = 0; i < req.files['galeri_foto'].length; i++) {
          await db.query('INSERT INTO halaman_galeri (halaman_id, gambar, keterangan, urutan) VALUES (?,?,?,?)',
            [req.params.id, req.files['galeri_foto'][i].filename, keterangans[i] || '', startUrutan + i]);
        }
      }
      // Hapus embed yang dipilih
      if (req.body.hapus_embed) {
        const ids = Array.isArray(req.body.hapus_embed) ? req.body.hapus_embed : [req.body.hapus_embed];
        for (const eid of ids) {
          await db.query('DELETE FROM halaman_embed WHERE id = ? AND halaman_id = ?', [eid, req.params.id]);
        }
      }
      // Tambah embed baru
      if (req.body.embed_url) {
        const urls = Array.isArray(req.body.embed_url) ? req.body.embed_url : [req.body.embed_url];
        const platforms = Array.isArray(req.body.embed_platform) ? req.body.embed_platform : [req.body.embed_platform || 'youtube'];
        const juduls = Array.isArray(req.body.embed_judul) ? req.body.embed_judul : [req.body.embed_judul || ''];
        const [existingEmbed] = await db.query('SELECT COUNT(*) as cnt FROM halaman_embed WHERE halaman_id = ?', [req.params.id]);
        let startUrutan = existingEmbed[0].cnt;
        for (let i = 0; i < urls.length; i++) {
          if (urls[i] && urls[i].trim()) {
            await db.query('INSERT INTO halaman_embed (halaman_id, platform, embed_url, judul, urutan) VALUES (?,?,?,?,?)',
              [req.params.id, platforms[i] || 'youtube', urls[i].trim(), juduls[i] || '', startUrutan + i]);
          }
        }
      }
      res.redirect('/admin/kontrol-website?tab=halaman&success=1');
    } catch (err) {
      console.error(err);
      const [rows] = await db.query('SELECT * FROM halaman WHERE id = ?', [req.params.id]);
      const [galeri] = await db.query('SELECT * FROM halaman_galeri WHERE halaman_id = ? ORDER BY urutan ASC', [req.params.id]);
      const [embeds] = await db.query('SELECT * FROM halaman_embed WHERE halaman_id = ? ORDER BY urutan ASC', [req.params.id]);
      res.render('admin/halaman/edit', { title: 'Edit Halaman', user: req.session, halaman: rows[0], galeri, embeds, error: 'Terjadi kesalahan.' });
    }
  });
};

// Admin: hapus halaman
exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM halaman WHERE id = ?', [req.params.id]);
    res.redirect('/admin/kontrol-website?tab=halaman&success=1');
  } catch (err) {
    res.redirect('/admin/kontrol-website?tab=halaman');
  }
};

// Mapping slug halaman progli ke keyword mata_pelajaran di tabel guru
const PROGLI_SLUG_MAP = {
  'progli-tkj': 'Produktif TKJ',
  'progli-tkro': 'Produktif TKRO',
  'progli-kuliner': 'Produktif Kuliner',
  'progli-tptup': 'Produktif TPTUP',
};

// Frontend: tampilkan halaman berdasarkan slug
exports.show = async (req, res) => {
  try {
    const { getMenuItems } = require('./frontendController');
    const [rows] = await db.query("SELECT * FROM halaman WHERE slug = ? AND status = 'aktif'", [req.params.slug]);
    if (rows.length === 0) {
      return res.status(404).render('frontend/404', { title: 'Halaman Tidak Ditemukan', menuItems: await getMenuItems() });
    }
    const [profil] = await db.query('SELECT * FROM profil_sekolah LIMIT 1');
    const [mediaSosialFooter] = await db.query(
      "SELECT id, judul, platform, embed_url FROM media_sosial WHERE status = 'aktif' ORDER BY urutan ASC, created_at DESC"
    );
    const [relatedBerita] = await db.query(
      'SELECT id, judul, slug, gambar, created_at FROM berita WHERE status = "published" ORDER BY created_at DESC LIMIT 4'
    );
    const [galeri] = await db.query('SELECT * FROM halaman_galeri WHERE halaman_id = ? ORDER BY urutan ASC', [rows[0].id]);
    const [embeds] = await db.query('SELECT * FROM halaman_embed WHERE halaman_id = ? ORDER BY urutan ASC', [rows[0].id]);
    const menuItems = await getMenuItems();

    // Ambil pengajar jika halaman ini adalah halaman progli
    let pengajar = [];
    const mataPelajaranKeyword = PROGLI_SLUG_MAP[req.params.slug];
    if (mataPelajaranKeyword) {
      const [guruRows] = await db.query(
        "SELECT id, nama, jabatan, foto, mata_pelajaran FROM guru WHERE mata_pelajaran = ? ORDER BY jabatan DESC, nama ASC",
        [mataPelajaranKeyword]
      );
      pengajar = guruRows;
    }

    res.render('frontend/halaman', {
      title: rows[0].judul,
      currentPage: req.params.slug,
      halaman: rows[0],
      galeri,
      embeds,
      profil: profil[0] || {},
      menuItems,
      mediaSosialFooter,
      relatedBerita,
      pengajar
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
