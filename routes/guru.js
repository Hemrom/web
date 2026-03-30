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

module.exports = router;
