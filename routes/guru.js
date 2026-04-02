const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/guruPortalController');
const { isGuruAuthenticated } = require('../middleware/authGuru');
const { loginLimiter } = require('../middleware/security');
const { csrfProtect } = require('../middleware/csrf');

router.get('/login', ctrl.loginPage);
router.post('/login', loginLimiter, csrfProtect, ctrl.login);
router.get('/logout', ctrl.logout);

router.get('/dashboard', isGuruAuthenticated, ctrl.dashboard);
router.get('/profil', isGuruAuthenticated, ctrl.profilPage);
router.post('/profil', isGuruAuthenticated, csrfProtect, ctrl.updateProfil);
router.get('/password', isGuruAuthenticated, ctrl.passwordPage);
router.post('/password', isGuruAuthenticated, csrfProtect, ctrl.updatePassword);

// Artikel Guru
const artikelCtrl = require('../controllers/artikelController');
router.get('/artikel', isGuruAuthenticated, artikelCtrl.guruIndex);
router.get('/artikel/create', isGuruAuthenticated, artikelCtrl.guruCreatePage);
router.post('/artikel/create', isGuruAuthenticated, csrfProtect, artikelCtrl.guruCreate);
router.get('/artikel/edit/:id', isGuruAuthenticated, artikelCtrl.guruEditPage);
router.post('/artikel/edit/:id', isGuruAuthenticated, csrfProtect, artikelCtrl.guruUpdate);
router.post('/artikel/delete/:id', isGuruAuthenticated, csrfProtect, artikelCtrl.guruDelete);

// File Download Guru
const fileCtrl = require('../controllers/fileDownloadController');
router.get('/file-download', isGuruAuthenticated, fileCtrl.guruIndex);
router.get('/file-download/create', isGuruAuthenticated, fileCtrl.guruCreatePage);
router.post('/file-download/create', isGuruAuthenticated, csrfProtect, fileCtrl.guruCreate);
router.get('/file-download/edit/:id', isGuruAuthenticated, fileCtrl.guruEditPage);
router.post('/file-download/edit/:id', isGuruAuthenticated, csrfProtect, fileCtrl.guruUpdate);
router.post('/file-download/delete/:id', isGuruAuthenticated, csrfProtect, fileCtrl.guruDelete);

module.exports = router;
