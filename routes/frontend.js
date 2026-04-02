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
router.get('/alumni/update', alumniController.updatePage);
router.get('/alumni/edit/:token', alumniController.editPage);
router.post('/alumni/edit/:token', formLimiter, csrfProtect, alumniController.editSubmit);

// Prestasi, BKK, OSIS
const portalController = require('../controllers/portalController');
router.get('/prestasi', portalController.prestasiIndex);
router.get('/prestasi/:slug', validateSlugParam, portalController.prestasiDetail);
router.get('/bkk', portalController.bkkIndex);
router.get('/bkk/:slug', validateSlugParam, portalController.bkkDetail);
router.get('/osis', portalController.osisIndex);
router.get('/osis/:slug', validateSlugParam, portalController.osisDetail);

// Fasilitas
router.get('/fasilitas', portalController.fasilitasIndex);

// Halaman Jurusan (dinamis dari DB)
router.get('/jurusan', portalController.jurusanListPage);
router.get('/jurusan/:kode', portalController.jurusanDetailPage);
router.get('/jurusan/:kode/berita/:slug', validateSlugParam, portalController.jurusanBeritaDetailPage);

// Halaman dinamis - harus di paling bawah
const halamanController = require('../controllers/halamanController');
router.get('/page/:slug', validateSlugParam, halamanController.show);

// Artikel
const artikelController = require('../controllers/artikelController');
router.get('/artikel', artikelController.frontendIndex);
router.get('/artikel/:slug', validateSlugParam, artikelController.frontendDetail);

// File Download
const fileDownloadController = require('../controllers/fileDownloadController');
router.get('/file-download', fileDownloadController.frontendIndex);
router.get('/file-download/:id', fileDownloadController.frontendDownload);

module.exports = router;
