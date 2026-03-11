const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const beritaController = require('../controllers/beritaController');
const galeriController = require('../controllers/galeriController');
const guruController = require('../controllers/guruController');
const sliderController = require('../controllers/sliderController');
const mediaSosialController = require('../controllers/mediaSosialController');

// Siswa routes
router.use('/siswa', require('./siswa'));

// Jurusan routes
router.use('/jurusan', require('./jurusan'));

// Login routes
router.get('/login', adminController.loginPage);
router.post('/login', adminController.login);
router.get('/logout', adminController.logout);

// Protected routes
router.get('/', isAuthenticated, adminController.dashboard);
router.get('/dashboard', isAuthenticated, adminController.dashboard);

// Profil Sekolah
router.get('/profil', isAuthenticated, adminController.profilPage);
router.post('/profil', isAuthenticated, adminController.updateProfil);

// Berita
router.get('/berita', isAuthenticated, beritaController.index);
router.get('/berita/create', isAuthenticated, beritaController.createPage);
router.post('/berita/create', isAuthenticated, beritaController.create);
router.get('/berita/edit/:id', isAuthenticated, beritaController.editPage);
router.post('/berita/edit/:id', isAuthenticated, beritaController.update);
router.post('/berita/delete/:id', isAuthenticated, beritaController.delete);

// Galeri
router.get('/galeri', isAuthenticated, galeriController.index);
router.get('/galeri/create', isAuthenticated, galeriController.createPage);
router.post('/galeri/create', isAuthenticated, galeriController.create);
router.post('/galeri/delete/:id', isAuthenticated, galeriController.delete);

// Guru
router.get('/guru', isAuthenticated, guruController.index);
router.get('/guru/create', isAuthenticated, guruController.createPage);
router.post('/guru/create', isAuthenticated, guruController.create);
router.get('/guru/edit/:id', isAuthenticated, guruController.editPage);
router.post('/guru/edit/:id', isAuthenticated, guruController.update);
router.post('/guru/delete/:id', isAuthenticated, guruController.delete);
router.get('/guru/sync-cbt', isAuthenticated, guruController.syncFromCBT);

// Slider
router.get('/slider', isAuthenticated, sliderController.index);
router.get('/slider/create', isAuthenticated, sliderController.createPage);
router.post('/slider/create', isAuthenticated, sliderController.create);
router.get('/slider/edit/:id', isAuthenticated, sliderController.editPage);
router.post('/slider/edit/:id', isAuthenticated, sliderController.update);
router.post('/slider/delete/:id', isAuthenticated, sliderController.delete);

// Media Sosial
router.get('/media-sosial', isAuthenticated, mediaSosialController.index);
router.get('/media-sosial/create', isAuthenticated, mediaSosialController.create);
router.post('/media-sosial/create', isAuthenticated, mediaSosialController.store);
router.get('/media-sosial/edit/:id', isAuthenticated, mediaSosialController.edit);
router.post('/media-sosial/edit/:id', isAuthenticated, mediaSosialController.update);
router.post('/media-sosial/delete/:id', isAuthenticated, mediaSosialController.destroy);

// Kontak Masuk
router.get('/kontak', isAuthenticated, adminController.kontakMasuk);
router.post('/kontak/update-status/:id', isAuthenticated, adminController.updateStatusKontak);

module.exports = router;
