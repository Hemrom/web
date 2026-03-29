const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/auth');
const adminController = require('../controllers/adminController');
const beritaController = require('../controllers/beritaController');
const galeriController = require('../controllers/galeriController');
const guruController = require('../controllers/guruController');
const sliderController = require('../controllers/sliderController');
const mediaSosialController = require('../controllers/mediaSosialController');
const userController = require('../controllers/userController');
const profilKontenController = require('../controllers/profilKontenController');
const halamanController = require('../controllers/halamanController');
const dataSekolahController = require('../controllers/dataSekolahController');
const kontrolWebsiteController = require('../controllers/kontrolWebsiteController');
const menuController = require('../controllers/menuController');

const { loginLimiter, uploadLimiter } = require('../middleware/security');

// Siswa routes
router.use('/siswa', require('./siswa'));

// Jurusan routes
router.use('/jurusan', require('./jurusan'));

// Login routes - dilindungi rate limiter
router.get('/login', adminController.loginPage);
router.post('/login', loginLimiter, adminController.login);
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
router.post('/berita/create', isAuthenticated, uploadLimiter, beritaController.create);
router.get('/berita/edit/:id', isAuthenticated, beritaController.editPage);
router.post('/berita/edit/:id', isAuthenticated, uploadLimiter, beritaController.update);
router.post('/berita/delete/:id', isAuthenticated, beritaController.delete);
router.post('/berita/upload-gambar', isAuthenticated, uploadLimiter, beritaController.uploadGambar);

// Galeri
router.get('/galeri', isAuthenticated, galeriController.index);
router.get('/galeri/create', isAuthenticated, galeriController.createPage);
router.post('/galeri/create', isAuthenticated, galeriController.create);
router.get('/galeri/edit/:id', isAuthenticated, galeriController.editPage);
router.post('/galeri/edit/:id', isAuthenticated, galeriController.update);
router.post('/galeri/delete/:id', isAuthenticated, galeriController.delete);
router.post('/galeri/delete-album', isAuthenticated, galeriController.deleteAlbum);

// Guru
router.get('/guru', isAuthenticated, guruController.index);
router.get('/guru/create', isAuthenticated, guruController.createPage);
router.post('/guru/create', isAuthenticated, guruController.create);
router.get('/guru/edit/:id', isAuthenticated, guruController.editPage);
router.post('/guru/edit/:id', isAuthenticated, guruController.update);
router.post('/guru/delete/:id', isAuthenticated, guruController.delete);
router.get('/guru/sync-cbt', isAuthenticated, guruController.syncFromCBT);
router.get('/guru/export', isAuthenticated, guruController.exportExcel);
router.get('/guru/template', isAuthenticated, guruController.downloadTemplate);
router.post('/guru/import', isAuthenticated, guruController.importExcel);

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

// Manajemen User
router.get('/users', isAuthenticated, isAdmin, userController.index);
router.get('/users/create', isAuthenticated, isAdmin, userController.createPage);
router.post('/users/create', isAuthenticated, isAdmin, userController.create);
router.get('/users/edit/:id', isAuthenticated, isAdmin, userController.editPage);
router.post('/users/edit/:id', isAuthenticated, isAdmin, userController.update);
router.post('/users/delete/:id', isAuthenticated, isAdmin, userController.delete);

// Profil Konten (Visi Misi, Sejarah, Sambutan)
router.get('/profil-konten/:tipe', isAuthenticated, profilKontenController.editPage);
router.post('/profil-konten/:tipe', isAuthenticated, profilKontenController.update);

// Data Sekolah (Guru, Siswa, Jurusan)
router.get('/data-sekolah', isAuthenticated, dataSekolahController.index);

// Kontrol Website
router.get('/kontrol-website', isAuthenticated, isAdmin, kontrolWebsiteController.index);
router.post('/kontrol-website/tampilan', isAuthenticated, isAdmin, kontrolWebsiteController.saveTampilan);
router.post('/kontrol-website/maintenance', isAuthenticated, isAdmin, kontrolWebsiteController.toggleMaintenance);

// Kelola Halaman Dinamis
router.get('/halaman', isAuthenticated, halamanController.index);
router.get('/halaman/create', isAuthenticated, halamanController.createPage);
router.post('/halaman/create', isAuthenticated, halamanController.create);
router.get('/halaman/edit/:id', isAuthenticated, halamanController.editPage);
router.post('/halaman/edit/:id', isAuthenticated, halamanController.update);
router.post('/halaman/delete/:id', isAuthenticated, halamanController.delete);

// Kelola Menu Navigasi
router.get('/menu', isAuthenticated, menuController.index);
router.get('/menu/create', isAuthenticated, menuController.createPage);
router.post('/menu/create', isAuthenticated, menuController.create);
router.get('/menu/edit/:id', isAuthenticated, menuController.editPage);
router.post('/menu/edit/:id', isAuthenticated, menuController.update);
router.post('/menu/delete/:id', isAuthenticated, menuController.delete);
router.post('/menu/toggle/:id', isAuthenticated, menuController.toggleStatus);

module.exports = router;
