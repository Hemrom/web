const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontendController');
const kontrolWebsiteController = require('../controllers/kontrolWebsiteController');
const { formLimiter } = require('../middleware/security');
const { validateSlugParam } = require('../middleware/securityHardening');

// Dynamic theme CSS (tidak kena maintenance)
router.get('/theme.css', kontrolWebsiteController.themeCss);

router.get('/', frontendController.home);
router.get('/profil', frontendController.profil);
router.get('/profil/visi-misi', frontendController.visiMisi);
router.get('/profil/sejarah', frontendController.sejarah);
router.get('/profil/sambutan', frontendController.sambutan);
router.get('/profil/kepala-sekolah', frontendController.sambutanKepsek);
router.get('/berita', frontendController.berita);
router.get('/berita/:slug', validateSlugParam, frontendController.beritaDetail);
router.get('/galeri', frontendController.galeri);
router.get('/guru', frontendController.guru);
router.get('/kontak', frontendController.kontakPage);
router.post('/kontak', formLimiter, frontendController.kontakSubmit);
router.get('/media-sosial', frontendController.mediaSosial);

// Alumni
const alumniController = require('../controllers/alumniController');
const { csrfProtect } = require('../middleware/csrf');
router.get('/alumni', alumniController.frontendIndex);
router.get('/alumni/daftar', alumniController.registerPage);
router.post('/alumni/daftar', formLimiter, csrfProtect, alumniController.register);
router.get('/alumni/update', (req, res) => {
  if (req.query.token) return res.redirect('/alumni/edit/' + req.query.token);
  res.render('frontend/alumni-update', { title: 'Update Biodata Alumni', currentPage: 'alumni', error: null });
});
router.get('/alumni/edit/:token', alumniController.editPage);
router.post('/alumni/edit/:token', formLimiter, csrfProtect, alumniController.editSubmit);

// Halaman dinamis - harus di paling bawah
const halamanController = require('../controllers/halamanController');
router.get('/page/:slug', validateSlugParam, halamanController.show);

module.exports = router;
