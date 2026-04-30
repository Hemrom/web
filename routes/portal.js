const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/portalController');
const { isBKK, isOSIS, isJurusan, isPramuka } = require('../middleware/authPortal');
const { loginLimiter, formLimiter } = require('../middleware/security');
const { csrfProtect } = require('../middleware/csrf');
const { validateIdParam } = require('../middleware/securityHardening');

// ── BKK Portal ────────────────────────────────────────────────────────────────
router.get('/bkk/login', ctrl.portalLoginPage('bkk', 'Login BKK'));
router.post('/bkk/login', loginLimiter, csrfProtect, ctrl.portalLogin('bkk'));
router.get('/bkk/logout', ctrl.portalLogout('bkk'));
router.get('/bkk/dashboard', isBKK, ctrl.bkkDashboard);
router.get('/bkk/create', isBKK, ctrl.bkkCreatePage);
router.post('/bkk/create', isBKK, csrfProtect, ctrl.bkkCreate);
router.get('/bkk/edit/:id', isBKK, validateIdParam, ctrl.bkkEditPage);
router.post('/bkk/edit/:id', isBKK, csrfProtect, validateIdParam, ctrl.bkkUpdate);
router.post('/bkk/delete/:id', isBKK, csrfProtect, validateIdParam, ctrl.bkkDelete);

// ── OSIS Portal ───────────────────────────────────────────────────────────────
router.get('/osis/login', ctrl.portalLoginPage('osis', 'Login OSIS'));
router.post('/osis/login', loginLimiter, csrfProtect, ctrl.portalLogin('osis'));
router.get('/osis/logout', ctrl.portalLogout('osis'));
router.get('/osis/dashboard', isOSIS, ctrl.osisDashboard);
router.get('/osis/create', isOSIS, ctrl.osisCreatePage);
router.post('/osis/create', isOSIS, csrfProtect, ctrl.osisCreate);
router.get('/osis/edit/:id', isOSIS, validateIdParam, ctrl.osisEditPage);
router.post('/osis/edit/:id', isOSIS, csrfProtect, validateIdParam, ctrl.osisUpdate);
router.post('/osis/delete/:id', isOSIS, csrfProtect, validateIdParam, ctrl.osisDelete);
// Berita OSIS
router.get('/osis/berita', isOSIS, ctrl.osisBeritaIndex);
router.get('/osis/berita/create', isOSIS, ctrl.osisBeritaCreatePage);
router.post('/osis/berita/create', isOSIS, csrfProtect, ctrl.osisBeritaCreate);
router.get('/osis/berita/edit/:id', isOSIS, validateIdParam, ctrl.osisBeritaEditPage);
router.post('/osis/berita/edit/:id', isOSIS, csrfProtect, validateIdParam, ctrl.osisBeritaUpdate);
router.post('/osis/berita/delete/:id', isOSIS, csrfProtect, validateIdParam, ctrl.osisBeritaDelete);
// Galeri OSIS
router.get('/osis/galeri', isOSIS, ctrl.osisGaleriIndex);
router.post('/osis/galeri/upload', isOSIS, ctrl.osisGaleriCreate);
router.post('/osis/galeri/delete/:id', isOSIS, csrfProtect, validateIdParam, ctrl.osisGaleriDelete);

// ── Pramuka Portal ────────────────────────────────────────────────────────────
router.get('/pramuka/login', ctrl.portalLoginPage('pramuka', 'Login Portal Pramuka'));
router.post('/pramuka/login', loginLimiter, csrfProtect, ctrl.portalLogin('pramuka'));
router.get('/pramuka/logout', ctrl.portalLogout('pramuka'));
router.get('/pramuka/dashboard', isPramuka, ctrl.pramukaDashboard);
router.get('/pramuka/create', isPramuka, ctrl.pramukaCreatePage);
router.post('/pramuka/create', isPramuka, csrfProtect, ctrl.pramukaCreate);
router.get('/pramuka/edit/:id', isPramuka, validateIdParam, ctrl.pramukaEditPage);
router.post('/pramuka/edit/:id', isPramuka, csrfProtect, validateIdParam, ctrl.pramukaUpdate);
router.post('/pramuka/delete/:id', isPramuka, csrfProtect, validateIdParam, ctrl.pramukaDelete);
router.get('/pramuka/galeri', isPramuka, ctrl.pramukaGaleriIndex);
router.post('/pramuka/galeri/upload', isPramuka, ctrl.pramukaGaleriCreate);
router.post('/pramuka/galeri/delete/:id', isPramuka, csrfProtect, validateIdParam, ctrl.pramukaGaleriDelete);
// Berita Pramuka
router.get('/pramuka/berita', isPramuka, ctrl.pramukaBeritaIndex);
router.get('/pramuka/berita/create', isPramuka, ctrl.pramukaBeritaCreatePage);
router.post('/pramuka/berita/create', isPramuka, csrfProtect, ctrl.pramukaBeritaCreate);
router.get('/pramuka/berita/edit/:id', isPramuka, validateIdParam, ctrl.pramukaBeritaEditPage);
router.post('/pramuka/berita/edit/:id', isPramuka, csrfProtect, validateIdParam, ctrl.pramukaBeritaUpdate);
router.post('/pramuka/berita/delete/:id', isPramuka, csrfProtect, validateIdParam, ctrl.pramukaBeritaDelete);

// ── Jurusan Portal ────────────────────────────────────────────────────────────
router.post('/jurusan-portal/login', loginLimiter, csrfProtect, ctrl.portalLogin('jurusan'));
router.get('/jurusan-portal/logout', ctrl.portalLogout('jurusan'));
router.get('/jurusan-portal/dashboard', isJurusan, ctrl.jurusanDashboard);
router.get('/jurusan-portal/create', isJurusan, ctrl.jurusanCreatePage);
router.post('/jurusan-portal/create', isJurusan, csrfProtect, ctrl.jurusanCreate);
router.get('/jurusan-portal/edit/:id', isJurusan, validateIdParam, ctrl.jurusanEditPage);
router.post('/jurusan-portal/edit/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanUpdate);
router.post('/jurusan-portal/delete/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanDelete);
// Berita/Informasi Jurusan
router.get('/jurusan-portal/berita', isJurusan, ctrl.jurusanBeritaIndex);
router.get('/jurusan-portal/berita/create', isJurusan, ctrl.jurusanBeritaCreatePage);
router.post('/jurusan-portal/berita/create', isJurusan, csrfProtect, ctrl.jurusanBeritaCreate);
router.get('/jurusan-portal/berita/edit/:id', isJurusan, validateIdParam, ctrl.jurusanBeritaEditPage);
router.post('/jurusan-portal/berita/edit/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanBeritaUpdate);
router.post('/jurusan-portal/berita/delete/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanBeritaDelete);
// Edit Halaman Jurusan (deskripsi lengkap)
router.get('/jurusan-portal/halaman', isJurusan, ctrl.jurusanHalamanPage);
router.post('/jurusan-portal/halaman', isJurusan, csrfProtect, ctrl.jurusanHalamanUpdate);
// Galeri Jurusan
router.get('/jurusan-portal/galeri', isJurusan, ctrl.jurusanGaleriIndex);
router.post('/jurusan-portal/galeri/upload', isJurusan, ctrl.jurusanGaleriCreate);
router.post('/jurusan-portal/galeri/delete/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanGaleriDelete);

module.exports = router;
