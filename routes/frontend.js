const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontendController');

router.get('/', frontendController.home);
router.get('/profil', frontendController.profil);
router.get('/berita', frontendController.berita);
router.get('/berita/:slug', frontendController.beritaDetail);
router.get('/galeri', frontendController.galeri);
router.get('/guru', frontendController.guru);
router.get('/kontak', frontendController.kontakPage);
router.post('/kontak', frontendController.kontakSubmit);
router.get('/media-sosial', frontendController.mediaSosial);

module.exports = router;
