const db = require('../config/database');
const multer = require('multer');
const path = require('path');
const cache = require('../utils/cache');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, 'link-' + Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage, limits: { fileSize: 2 * 1024 * 1024 } }).single('logo');

exports.index = async (req, res) => {
  const [links] = await db.query('SELECT * FROM link_terkait ORDER BY urutan ASC, created_at DESC');
  res.render('admin/link-terkait/index', { title: 'Link Terkait', user: req.session, links, query: req.query });
};

exports.createPage = (req, res) => {
  res.render('admin/link-terkait/create', { title: 'Tambah Link Terkait', user: req.session });
};

exports.create = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    const { nama, url, deskripsi, urutan, status } = req.body;
    const logo = req.file ? req.file.filename : null;
    await db.query('INSERT INTO link_terkait (nama, url, logo, deskripsi, urutan, status) VALUES (?,?,?,?,?,?)',
      [nama, url, logo, deskripsi || null, urutan || 0, status || 'aktif']);
    cache.del('link_terkait');
    res.redirect('/admin/profil?tab=link-terkait&success=1');
  });
};

exports.editPage = async (req, res) => {
  const [rows] = await db.query('SELECT * FROM link_terkait WHERE id = ?', [req.params.id]);
  if (!rows.length) return res.redirect('/admin/profil?tab=link-terkait');
  res.render('admin/link-terkait/edit', { title: 'Edit Link Terkait', user: req.session, link: rows[0] });
};

exports.update = (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    const { nama, url, deskripsi, urutan, status } = req.body;
    const logo = req.file ? req.file.filename : null;
    if (logo) {
      await db.query('UPDATE link_terkait SET nama=?,url=?,logo=?,deskripsi=?,urutan=?,status=? WHERE id=?',
        [nama, url, logo, deskripsi || null, urutan || 0, status || 'aktif', req.params.id]);
    } else {
      await db.query('UPDATE link_terkait SET nama=?,url=?,deskripsi=?,urutan=?,status=? WHERE id=?',
        [nama, url, deskripsi || null, urutan || 0, status || 'aktif', req.params.id]);
    }
    cache.del('link_terkait');
    res.redirect('/admin/profil?tab=link-terkait&success=1');
  });
};

exports.destroy = async (req, res) => {
  await db.query('DELETE FROM link_terkait WHERE id = ?', [req.params.id]);
  cache.del('link_terkait');
  res.redirect('/admin/profil?tab=link-terkait&success=3');
};
