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
const linkTerkaitController = require('../controllers/linkTerkaitController');
const alumniController = require('../controllers/alumniController');
const portalController = require('../controllers/portalController');
const artikelController = require('../controllers/artikelController');
const fileDownloadController = require('../controllers/fileDownloadController');

const { loginLimiter, uploadLimiter, formLimiter } = require('../middleware/security');
const { csrfProtect } = require('../middleware/csrf');
const { validateIdParam, validateTipeParam } = require('../middleware/securityHardening');

// Siswa routes
router.use('/siswa', require('./siswa'));

// Jurusan routes
router.use('/jurusan', require('./jurusan'));

// Login routes - dilindungi rate limiter
router.get('/login', adminController.loginPage);
router.post('/login', loginLimiter, csrfProtect, adminController.login);
router.get('/logout', adminController.logout);

// Protected routes
router.get('/', isAuthenticated, adminController.dashboard);
router.get('/dashboard', isAuthenticated, adminController.dashboard);

// Profil Sekolah
router.get('/profil', isAuthenticated, adminController.profilPage);
router.post('/profil', isAuthenticated, csrfProtect, adminController.updateProfil);

// Berita
router.get('/berita', isAuthenticated, beritaController.index);
router.get('/berita/create', isAuthenticated, beritaController.createPage);
router.post('/berita/create', isAuthenticated, csrfProtect, uploadLimiter, beritaController.create);
router.get('/berita/edit/:id', isAuthenticated, validateIdParam, beritaController.editPage);
router.post('/berita/edit/:id', isAuthenticated, csrfProtect, validateIdParam, uploadLimiter, beritaController.update);
router.post('/berita/delete/:id', isAuthenticated, csrfProtect, validateIdParam, beritaController.delete);
router.post('/berita/upload-gambar', isAuthenticated, uploadLimiter, beritaController.uploadGambar);

// Galeri
router.get('/galeri', isAuthenticated, galeriController.index);
router.get('/galeri/create', isAuthenticated, galeriController.createPage);
router.post('/galeri/create', isAuthenticated, csrfProtect, galeriController.create);
router.get('/galeri/edit/:id', isAuthenticated, validateIdParam, galeriController.editPage);
router.post('/galeri/edit/:id', isAuthenticated, csrfProtect, validateIdParam, galeriController.update);
router.post('/galeri/delete/:id', isAuthenticated, csrfProtect, validateIdParam, galeriController.delete);
router.post('/galeri/delete-album', isAuthenticated, csrfProtect, galeriController.deleteAlbum);

// Guru
router.get('/guru', isAuthenticated, guruController.index);
router.get('/guru/create', isAuthenticated, guruController.createPage);
router.post('/guru/create', isAuthenticated, csrfProtect, guruController.create);
router.get('/guru/edit/:id', isAuthenticated, validateIdParam, guruController.editPage);
router.post('/guru/edit/:id', isAuthenticated, csrfProtect, validateIdParam, guruController.update);
router.post('/guru/delete/:id', isAuthenticated, csrfProtect, validateIdParam, guruController.delete);
router.get('/guru/sync-cbt', isAuthenticated, guruController.syncFromCBT);
router.get('/guru/export', isAuthenticated, guruController.exportExcel);
router.get('/guru/template', isAuthenticated, guruController.downloadTemplate);
router.post('/guru/import', isAuthenticated, csrfProtect, guruController.importExcel);

// Slider
router.get('/slider', isAuthenticated, sliderController.index);
router.get('/slider/create', isAuthenticated, sliderController.createPage);
router.post('/slider/create', isAuthenticated, csrfProtect, sliderController.create);
router.get('/slider/edit/:id', isAuthenticated, validateIdParam, sliderController.editPage);
router.post('/slider/edit/:id', isAuthenticated, csrfProtect, validateIdParam, sliderController.update);
router.post('/slider/delete/:id', isAuthenticated, csrfProtect, validateIdParam, sliderController.delete);

// Media Sosial
router.get('/media-sosial', isAuthenticated, mediaSosialController.index);
router.get('/media-sosial/create', isAuthenticated, mediaSosialController.create);
router.post('/media-sosial/create', isAuthenticated, csrfProtect, mediaSosialController.store);
router.get('/media-sosial/edit/:id', isAuthenticated, validateIdParam, mediaSosialController.edit);
router.post('/media-sosial/edit/:id', isAuthenticated, csrfProtect, validateIdParam, mediaSosialController.update);
router.post('/media-sosial/delete/:id', isAuthenticated, csrfProtect, validateIdParam, mediaSosialController.destroy);

// Kontak Masuk
router.get('/kontak', isAuthenticated, adminController.kontakMasuk);
router.post('/kontak/update-status/:id', isAuthenticated, csrfProtect, validateIdParam, adminController.updateStatusKontak);
router.post('/kontak/delete/:id', isAuthenticated, csrfProtect, validateIdParam, adminController.deleteKontak);
router.post('/kontak/bulk-delete', isAuthenticated, csrfProtect, adminController.bulkDeleteKontak);

// Manajemen User
router.get('/users', isAuthenticated, isAdmin, userController.index);
router.get('/users/create', isAuthenticated, isAdmin, userController.createPage);
router.post('/users/create', isAuthenticated, isAdmin, csrfProtect, userController.create);
router.get('/users/edit/:id', isAuthenticated, isAdmin, validateIdParam, userController.editPage);
router.post('/users/edit/:id', isAuthenticated, isAdmin, csrfProtect, validateIdParam, userController.update);
router.post('/users/delete/:id', isAuthenticated, isAdmin, csrfProtect, validateIdParam, userController.delete);

// Profil Konten
router.get('/profil-konten/:tipe', isAuthenticated, validateTipeParam, profilKontenController.editPage);
router.post('/profil-konten/:tipe', isAuthenticated, csrfProtect, validateTipeParam, profilKontenController.update);

// Data Sekolah
router.get('/data-sekolah', isAuthenticated, dataSekolahController.index);

// Kontrol Website
router.get('/kontrol-website', isAuthenticated, isAdmin, kontrolWebsiteController.index);
router.post('/kontrol-website/tampilan', isAuthenticated, isAdmin, csrfProtect, kontrolWebsiteController.saveTampilan);
router.post('/kontrol-website/editorial', isAuthenticated, isAdmin, csrfProtect, kontrolWebsiteController.saveEditorial);
router.post('/kontrol-website/maintenance', isAuthenticated, isAdmin, csrfProtect, kontrolWebsiteController.toggleMaintenance);

// Kelola Halaman Dinamis
router.get('/halaman', isAuthenticated, halamanController.index);
router.get('/halaman/create', isAuthenticated, halamanController.createPage);
router.post('/halaman/create', isAuthenticated, csrfProtect, halamanController.create);
router.get('/halaman/edit/:id', isAuthenticated, validateIdParam, halamanController.editPage);
router.post('/halaman/edit/:id', isAuthenticated, csrfProtect, validateIdParam, halamanController.update);
router.post('/halaman/delete/:id', isAuthenticated, csrfProtect, validateIdParam, halamanController.delete);

// Prestasi
router.get('/prestasi', isAuthenticated, portalController.adminPrestasiIndex);
router.get('/prestasi/create', isAuthenticated, portalController.adminPrestasiCreatePage);
router.post('/prestasi/create', isAuthenticated, csrfProtect, portalController.adminPrestasiCreate);
router.get('/prestasi/edit/:id', isAuthenticated, validateIdParam, portalController.adminPrestasiEditPage);
router.post('/prestasi/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminPrestasiUpdate);
router.post('/prestasi/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminPrestasiDelete);

// Admin kelola BKK
router.get('/bkk', isAuthenticated, portalController.adminBkkIndex);
router.get('/bkk/create', isAuthenticated, portalController.adminBkkCreatePage);
router.post('/bkk/create', isAuthenticated, csrfProtect, portalController.adminBkkCreate);
router.get('/bkk/edit/:id', isAuthenticated, validateIdParam, portalController.adminBkkEditPage);
router.post('/bkk/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminBkkUpdate);
router.post('/bkk/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminBkkDelete);

// Admin kelola OSIS
router.get('/osis', isAuthenticated, portalController.adminOsisIndex);
router.get('/osis/create', isAuthenticated, portalController.adminOsisCreatePage);
router.post('/osis/create', isAuthenticated, csrfProtect, portalController.adminOsisCreate);
router.get('/osis/edit/:id', isAuthenticated, validateIdParam, portalController.adminOsisEditPage);
router.post('/osis/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminOsisUpdate);
router.post('/osis/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminOsisDelete);

// Admin kelola Berita Jurusan
router.get('/jurusan-berita', isAuthenticated, portalController.adminJurusanBeritaIndex);
router.get('/jurusan-berita/create', isAuthenticated, portalController.adminJurusanBeritaCreatePage);
router.post('/jurusan-berita/create', isAuthenticated, csrfProtect, portalController.adminJurusanBeritaCreate);
router.get('/jurusan-berita/edit/:id', isAuthenticated, validateIdParam, portalController.adminJurusanBeritaEditPage);
router.post('/jurusan-berita/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminJurusanBeritaUpdate);
router.post('/jurusan-berita/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminJurusanBeritaDelete);

// Fasilitas
router.get('/fasilitas', isAuthenticated, portalController.adminFasilitasIndex);
router.get('/fasilitas/create', isAuthenticated, portalController.adminFasilitasCreatePage);
router.post('/fasilitas/create', isAuthenticated, csrfProtect, portalController.adminFasilitasCreate);
router.get('/fasilitas/edit/:id', isAuthenticated, validateIdParam, portalController.adminFasilitasEditPage);
router.post('/fasilitas/edit/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminFasilitasUpdate);
router.post('/fasilitas/delete/:id', isAuthenticated, csrfProtect, validateIdParam, portalController.adminFasilitasDelete);

// Portal Users (BKK, OSIS, Jurusan)
router.get('/portal-users', isAuthenticated, isAdmin, portalController.adminPortalUsers);
router.post('/portal-users/create', isAuthenticated, isAdmin, csrfProtect, portalController.adminPortalUserCreate);
router.post('/portal-users/delete/:id', isAuthenticated, isAdmin, csrfProtect, validateIdParam, portalController.adminPortalUserDelete);
router.post('/portal-users/toggle/:id', isAuthenticated, isAdmin, csrfProtect, validateIdParam, portalController.adminPortalUserToggle);

// Alumni
router.get('/alumni', isAuthenticated, alumniController.adminIndex);
router.get('/alumni/edit/:id', isAuthenticated, validateIdParam, alumniController.adminEditPage);
router.post('/alumni/edit/:id', isAuthenticated, csrfProtect, validateIdParam, alumniController.adminUpdate);
router.post('/alumni/setujui/:id', isAuthenticated, csrfProtect, validateIdParam, alumniController.adminSetujui);
router.post('/alumni/tolak/:id', isAuthenticated, csrfProtect, validateIdParam, alumniController.adminTolak);
router.post('/alumni/delete/:id', isAuthenticated, csrfProtect, validateIdParam, alumniController.adminDelete);

// Link Terkait
router.get('/link-terkait', isAuthenticated, linkTerkaitController.index);
router.get('/link-terkait/create', isAuthenticated, linkTerkaitController.createPage);
router.post('/link-terkait/create', isAuthenticated, csrfProtect, linkTerkaitController.create);
router.get('/link-terkait/edit/:id', isAuthenticated, validateIdParam, linkTerkaitController.editPage);
router.post('/link-terkait/edit/:id', isAuthenticated, csrfProtect, validateIdParam, linkTerkaitController.update);
router.post('/link-terkait/delete/:id', isAuthenticated, csrfProtect, validateIdParam, linkTerkaitController.destroy);

// Kelola Menu Navigasi
router.get('/menu', isAuthenticated, menuController.index);
router.get('/menu/create', isAuthenticated, menuController.createPage);
router.post('/menu/create', isAuthenticated, csrfProtect, menuController.create);
router.get('/menu/edit/:id', isAuthenticated, validateIdParam, menuController.editPage);
router.post('/menu/edit/:id', isAuthenticated, csrfProtect, validateIdParam, menuController.update);
router.post('/menu/delete/:id', isAuthenticated, csrfProtect, validateIdParam, menuController.delete);
router.post('/menu/toggle/:id', isAuthenticated, csrfProtect, validateIdParam, menuController.toggleStatus);

// Artikel
router.get('/artikel', isAuthenticated, artikelController.adminIndex);
router.get('/artikel/create', isAuthenticated, artikelController.adminCreatePage);
router.post('/artikel/create', isAuthenticated, csrfProtect, uploadLimiter, artikelController.adminCreate);
router.get('/artikel/edit/:id', isAuthenticated, validateIdParam, artikelController.adminEditPage);
router.post('/artikel/edit/:id', isAuthenticated, csrfProtect, validateIdParam, uploadLimiter, artikelController.adminUpdate);
router.post('/artikel/delete/:id', isAuthenticated, csrfProtect, validateIdParam, artikelController.adminDelete);

// File Download
router.get('/file-download', isAuthenticated, fileDownloadController.adminIndex);
router.get('/file-download/create', isAuthenticated, fileDownloadController.adminCreatePage);
router.post('/file-download/create', isAuthenticated, csrfProtect, uploadLimiter, fileDownloadController.adminCreate);
router.get('/file-download/edit/:id', isAuthenticated, validateIdParam, fileDownloadController.adminEditPage);
router.post('/file-download/edit/:id', isAuthenticated, csrfProtect, validateIdParam, uploadLimiter, fileDownloadController.adminUpdate);
router.post('/file-download/delete/:id', isAuthenticated, csrfProtect, validateIdParam, fileDownloadController.adminDelete);

module.exports = router;
