const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontendController');
const kontrolWebsiteController = require('../controllers/kontrolWebsiteController');
const { formLimiter } = require('../middleware/security');

// Dynamic theme CSS (tidak kena maintenance)
router.get('/theme.css', kontrolWebsiteController.themeCss);

router.get('/', frontendController.home);
router.get('/profil', frontendController.profil);
router.get('/profil/visi-misi', frontendController.visiMisi);
router.get('/profil/sejarah', frontendController.sejarah);
router.get('/profil/sambutan', frontendController.sambutan);
router.get('/profil/kepala-sekolah', frontendController.sambutanKepsek);
router.get('/berita', frontendController.berita);
router.get('/berita/:slug', frontendController.beritaDetail);
router.get('/galeri', frontendController.galeri);
router.get('/guru', frontendController.guru);
router.get('/kontak', frontendController.kontakPage);
router.post('/kontak', formLimiter, frontendController.kontakSubmit);
router.get('/media-sosial', frontendController.mediaSosial);

// Halaman dinamis - harus di paling bawah
const halamanController = require('../controllers/halamanController');
router.get('/page/:slug', halamanController.show);

module.exports = router;
