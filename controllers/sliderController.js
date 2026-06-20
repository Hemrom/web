const db = require('../config/database');
const cache = require('../utils/cache');
const multer = require('multer');
const path = require('path');
const compressImage = require('../middleware/compressImage');

const SLIDER_ANIMATIONS = [
  { value: 'slide-up', label: 'Geser Naik', desc: 'Teks naik halus dari bawah' },
  { value: 'slide-up-bounce', label: 'Geser Naik + Bounce', desc: 'Naik dari bawah dengan pantulan ringan' },
  { value: 'zoom-up', label: 'Zoom Naik', desc: 'Membesar sambil naik dari bawah' },
  { value: 'blur-up', label: 'Blur Naik', desc: 'Muncul dari blur sambil naik' },
  { value: 'elastic-up', label: 'Elastis Naik', desc: 'Efek pegas elastis dari bawah' },
  { value: 'fade-up-fast', label: 'Geser Cepat', desc: 'Animasi cepat dari bawah' },
  { value: 'stagger-up', label: 'Bertahap', desc: 'Subjudul, judul, deskripsi & tombol muncul satu per satu' },
  { value: 'flip-up', label: 'Flip Naik', desc: 'Membalik 3D dari bawah' },
  { value: 'slide-up-long', label: 'Geser Jauh', desc: 'Perjalanan lebih panjang dari bawah' }
];

let sliderSchemaReady = false;

async function ensureSliderSchema() {
  if (sliderSchemaReady) return;
  const columns = [
    "ADD COLUMN `posisi_teks` ENUM('kiri','tengah','kanan') NOT NULL DEFAULT 'tengah' AFTER `link_text`",
    "ADD COLUMN `animasi_teks` VARCHAR(50) NOT NULL DEFAULT 'slide-up' AFTER `posisi_teks`"
  ];
  for (const col of columns) {
    try {
      await db.query(`ALTER TABLE slider ${col}`);
    } catch (error) {
      if (error.code !== 'ER_DUP_FIELDNAME') throw error;
    }
  }
  sliderSchemaReady = true;
}

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'slider-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('gambar');

exports.SLIDER_ANIMATIONS = SLIDER_ANIMATIONS;

exports.index = async (req, res) => {
  try {
    await ensureSliderSchema();
    const [slider] = await db.query('SELECT * FROM slider ORDER BY urutan ASC, created_at DESC');
    res.render('admin/slider/index', {
      title: 'Kelola Slider',
      user: req.session,
      slider,
      animations: SLIDER_ANIMATIONS
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/slider/create', {
    title: 'Tambah Slider',
    user: req.session,
    animations: SLIDER_ANIMATIONS
  });
};

exports.create = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    await compressImage(req, res, () => {});
    try {
      await ensureSliderSchema();
      const { judul, subjudul, deskripsi, link_url, link_text, urutan, status, posisi_teks, animasi_teks } = req.body;
      const gambar = req.file ? req.file.filename : null;
      const animasi = SLIDER_ANIMATIONS.some(a => a.value === animasi_teks) ? animasi_teks : 'slide-up';
      const posisi = ['kiri', 'tengah', 'kanan'].includes(posisi_teks) ? posisi_teks : 'tengah';
      
      if (!gambar) {
        return res.status(400).send('Gambar harus diupload');
      }
      
      await db.query(
        'INSERT INTO slider (judul, subjudul, deskripsi, gambar, link_url, link_text, posisi_teks, animasi_teks, urutan, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [judul, subjudul, deskripsi, gambar, link_url, link_text, posisi, animasi, urutan || 0, status]
      );
      
      cache.del('home_slider');
      res.redirect('/admin/slider');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.editPage = async (req, res) => {
  try {
    await ensureSliderSchema();
    const [slider] = await db.query('SELECT * FROM slider WHERE id = ?', [req.params.id]);
    if (slider.length === 0) {
      return res.status(404).send('Slider tidak ditemukan');
    }
    res.render('admin/slider/edit', {
      title: 'Edit Slider',
      user: req.session,
      slider: slider[0],
      animations: SLIDER_ANIMATIONS
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    await compressImage(req, res, () => {});
    try {
      await ensureSliderSchema();
      const { judul, subjudul, deskripsi, link_url, link_text, urutan, status, posisi_teks, animasi_teks } = req.body;
      const gambar = req.file ? req.file.filename : null;
      const animasi = SLIDER_ANIMATIONS.some(a => a.value === animasi_teks) ? animasi_teks : 'slide-up';
      const posisi = ['kiri', 'tengah', 'kanan'].includes(posisi_teks) ? posisi_teks : 'tengah';
      
      if (gambar) {
        await db.query(
          'UPDATE slider SET judul = ?, subjudul = ?, deskripsi = ?, gambar = ?, link_url = ?, link_text = ?, posisi_teks = ?, animasi_teks = ?, urutan = ?, status = ? WHERE id = ?',
          [judul, subjudul, deskripsi, gambar, link_url, link_text, posisi, animasi, urutan || 0, status, req.params.id]
        );
      } else {
        await db.query(
          'UPDATE slider SET judul = ?, subjudul = ?, deskripsi = ?, link_url = ?, link_text = ?, posisi_teks = ?, animasi_teks = ?, urutan = ?, status = ? WHERE id = ?',
          [judul, subjudul, deskripsi, link_url, link_text, posisi, animasi, urutan || 0, status, req.params.id]
        );
      }
      
      cache.del('home_slider');
      res.redirect('/admin/slider');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM slider WHERE id = ?', [req.params.id]);
    cache.del('home_slider');
    res.redirect('/admin/slider');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.ensureSliderSchema = ensureSliderSchema;
