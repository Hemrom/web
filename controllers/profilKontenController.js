const db = require('../config/database');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, 'profil-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage }).single('foto');

const TIPE_LABEL = {
  visi_misi: 'Visi & Misi',
  sejarah: 'Sejarah Sekolah',
  sambutan: 'Sambutan Kepala Sekolah'
};

exports.editPage = async (req, res) => {
  const { tipe } = req.params;
  if (!TIPE_LABEL[tipe]) return res.status(404).send('Halaman tidak ditemukan');
  try {
    const [rows] = await db.query('SELECT * FROM profil_konten WHERE tipe = ?', [tipe]);
    const konten = rows[0] || { tipe, judul: TIPE_LABEL[tipe], konten: '', foto: null };
    res.render('admin/profil-konten/edit', {
      title: 'Edit ' + TIPE_LABEL[tipe],
      user: req.session,
      konten,
      label: TIPE_LABEL[tipe],
      success: req.query.success
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  const { tipe } = req.params;
  if (!TIPE_LABEL[tipe]) return res.status(404).send('Halaman tidak ditemukan');
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    try {
      const { judul, konten } = req.body;
      if (!judul || !judul.trim()) {
        const [rows] = await db.query('SELECT * FROM profil_konten WHERE tipe = ?', [tipe]);
        const kontenData = rows[0] || { tipe, judul: TIPE_LABEL[tipe], konten: '', foto: null };
        return res.render('admin/profil-konten/edit', {
          title: 'Edit ' + TIPE_LABEL[tipe],
          user: req.session,
          konten: kontenData,
          label: TIPE_LABEL[tipe],
          success: null,
          error: 'Judul tidak boleh kosong.'
        });
      }
      const foto = req.file ? req.file.filename : null;
      const [rows] = await db.query('SELECT id FROM profil_konten WHERE tipe = ?', [tipe]);
      if (rows.length > 0) {
        if (foto) {
          await db.query('UPDATE profil_konten SET judul=?, konten=?, foto=? WHERE tipe=?', [judul, konten, foto, tipe]);
        } else {
          await db.query('UPDATE profil_konten SET judul=?, konten=? WHERE tipe=?', [judul, konten, tipe]);
        }
      } else {
        await db.query('INSERT INTO profil_konten (tipe, judul, konten, foto) VALUES (?,?,?,?)', [tipe, judul, konten, foto]);
      }
      if (tipe === 'sambutan') {
        res.redirect('/admin/profil?tab=kepsek&success=1');
      } else {
        res.redirect('/admin/profil-konten/' + tipe + '?success=1');
      }
    } catch (err) {
      console.error(err);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};
