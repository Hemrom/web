const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/portalController');
const { isBKK, isOSIS, isJurusan } = require('../middleware/authPortal');
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

// ── Jurusan Portal ────────────────────────────────────────────────────────────
router.get('/jurusan-portal/login', ctrl.portalLoginPage('jurusan', 'Login Portal Jurusan'));
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

module.exports = router;
