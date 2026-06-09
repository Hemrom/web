const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/portalController');
const { isBKK, isOSIS, isJurusan, isPramuka, isOlahraga, isPaskibraka, isSeni, isBahasaAsing, isRohis, isPmr, isPikr, isPecintaAlam, isPencakSilat } = require('../middleware/authPortal');
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

// ── Olahraga Portal ───────────────────────────────────────────────────────────
router.get('/olahraga/login', ctrl.portalLoginPage('olahraga', 'Login Portal Olahraga'));router.post('/olahraga/login', loginLimiter, csrfProtect, ctrl.portalLogin('olahraga'));
router.get('/olahraga/logout', ctrl.portalLogout('olahraga'));
router.get('/olahraga/dashboard', isOlahraga, ctrl.olahragaDashboard);
router.get('/olahraga/create', isOlahraga, ctrl.olahragaCreatePage);
router.post('/olahraga/create', isOlahraga, csrfProtect, ctrl.olahragaCreate);
router.get('/olahraga/edit/:id', isOlahraga, validateIdParam, ctrl.olahragaEditPage);
router.post('/olahraga/edit/:id', isOlahraga, csrfProtect, validateIdParam, ctrl.olahragaUpdate);
router.post('/olahraga/delete/:id', isOlahraga, csrfProtect, validateIdParam, ctrl.olahragaDelete);
router.get('/olahraga/berita', isOlahraga, ctrl.olahragaBeritaIndex);
router.get('/olahraga/berita/create', isOlahraga, ctrl.olahragaBeritaCreatePage);
router.post('/olahraga/berita/create', isOlahraga, csrfProtect, ctrl.olahragaBeritaCreate);
router.get('/olahraga/berita/edit/:id', isOlahraga, validateIdParam, ctrl.olahragaBeritaEditPage);
router.post('/olahraga/berita/edit/:id', isOlahraga, csrfProtect, validateIdParam, ctrl.olahragaBeritaUpdate);
router.post('/olahraga/berita/delete/:id', isOlahraga, csrfProtect, validateIdParam, ctrl.olahragaBeritaDelete);
router.get('/olahraga/galeri', isOlahraga, ctrl.olahragaGaleriIndex);
router.post('/olahraga/galeri/upload', isOlahraga, ctrl.olahragaGaleriCreate);
router.post('/olahraga/galeri/delete/:id', isOlahraga, csrfProtect, validateIdParam, ctrl.olahragaGaleriDelete);

// ── Paskibraka Portal ─────────────────────────────────────────────────────────
router.get('/paskibraka/login', ctrl.portalLoginPage('paskibraka', 'Login Portal Paskibraka'));
router.post('/paskibraka/login', loginLimiter, csrfProtect, ctrl.portalLogin('paskibraka'));
router.get('/paskibraka/logout', ctrl.portalLogout('paskibraka'));
router.get('/paskibraka/dashboard', isPaskibraka, ctrl.paskibrakaDashboard);
router.get('/paskibraka/create', isPaskibraka, ctrl.paskibrakaCreatePage);
router.post('/paskibraka/create', isPaskibraka, csrfProtect, ctrl.paskibrakaCreate);
router.get('/paskibraka/edit/:id', isPaskibraka, validateIdParam, ctrl.paskibrakaEditPage);
router.post('/paskibraka/edit/:id', isPaskibraka, csrfProtect, validateIdParam, ctrl.paskibrakaUpdate);
router.post('/paskibraka/delete/:id', isPaskibraka, csrfProtect, validateIdParam, ctrl.paskibrakaDelete);
router.get('/paskibraka/galeri', isPaskibraka, ctrl.paskibrakaGaleriIndex);
router.post('/paskibraka/galeri/upload', isPaskibraka, ctrl.paskibrakaGaleriCreate);
router.post('/paskibraka/galeri/delete/:id', isPaskibraka, csrfProtect, validateIdParam, ctrl.paskibrakaGaleriDelete);
// Berita Paskibraka
router.get('/paskibraka/berita', isPaskibraka, ctrl.paskibrakaBeritaIndex);
router.get('/paskibraka/berita/create', isPaskibraka, ctrl.paskibrakaBeritaCreatePage);
router.post('/paskibraka/berita/create', isPaskibraka, csrfProtect, ctrl.paskibrakaBeritaCreate);
router.get('/paskibraka/berita/edit/:id', isPaskibraka, validateIdParam, ctrl.paskibrakaBeritaEditPage);
router.post('/paskibraka/berita/edit/:id', isPaskibraka, csrfProtect, validateIdParam, ctrl.paskibrakaBeritaUpdate);
router.post('/paskibraka/berita/delete/:id', isPaskibraka, csrfProtect, validateIdParam, ctrl.paskibrakaBeritaDelete);

// ── Seni Portal ───────────────────────────────────────────────────────────────
router.get('/seni/login', ctrl.portalLoginPage('seni', 'Login Portal Seni'));
router.post('/seni/login', loginLimiter, csrfProtect, ctrl.portalLogin('seni'));
router.get('/seni/logout', ctrl.portalLogout('seni'));
router.get('/seni/dashboard', isSeni, ctrl.seniDashboard);
router.get('/seni/create', isSeni, ctrl.seniCreatePage);
router.post('/seni/create', isSeni, csrfProtect, ctrl.seniCreate);
router.get('/seni/edit/:id', isSeni, validateIdParam, ctrl.seniEditPage);
router.post('/seni/edit/:id', isSeni, csrfProtect, validateIdParam, ctrl.seniUpdate);
router.post('/seni/delete/:id', isSeni, csrfProtect, validateIdParam, ctrl.seniDelete);
router.get('/seni/galeri', isSeni, ctrl.seniGaleriIndex);
router.post('/seni/galeri/upload', isSeni, ctrl.seniGaleriCreate);
router.post('/seni/galeri/delete/:id', isSeni, csrfProtect, validateIdParam, ctrl.seniGaleriDelete);
// Berita Seni
router.get('/seni/berita', isSeni, ctrl.seniBeritaIndex);
router.get('/seni/berita/create', isSeni, ctrl.seniBeritaCreatePage);
router.post('/seni/berita/create', isSeni, csrfProtect, ctrl.seniBeritaCreate);
router.get('/seni/berita/edit/:id', isSeni, validateIdParam, ctrl.seniBeritaEditPage);
router.post('/seni/berita/edit/:id', isSeni, csrfProtect, validateIdParam, ctrl.seniBeritaUpdate);
router.post('/seni/berita/delete/:id', isSeni, csrfProtect, validateIdParam, ctrl.seniBeritaDelete);

// ── Bahasa Asing Portal ───────────────────────────────────────────────────────
router.get('/bahasa-asing/login', ctrl.portalLoginPage('bahasa_asing', 'Login Portal Bahasa Asing'));
router.post('/bahasa-asing/login', loginLimiter, csrfProtect, ctrl.portalLogin('bahasa_asing'));
router.get('/bahasa-asing/logout', ctrl.portalLogout('bahasa_asing'));
router.get('/bahasa-asing/dashboard', isBahasaAsing, ctrl.bahasaAsingDashboard);
router.get('/bahasa-asing/create', isBahasaAsing, ctrl.bahasaAsingCreatePage);
router.post('/bahasa-asing/create', isBahasaAsing, csrfProtect, ctrl.bahasaAsingCreate);
router.get('/bahasa-asing/edit/:id', isBahasaAsing, validateIdParam, ctrl.bahasaAsingEditPage);
router.post('/bahasa-asing/edit/:id', isBahasaAsing, csrfProtect, validateIdParam, ctrl.bahasaAsingUpdate);
router.post('/bahasa-asing/delete/:id', isBahasaAsing, csrfProtect, validateIdParam, ctrl.bahasaAsingDelete);
router.get('/bahasa-asing/galeri', isBahasaAsing, ctrl.bahasaAsingGaleriIndex);
router.post('/bahasa-asing/galeri/upload', isBahasaAsing, ctrl.bahasaAsingGaleriCreate);
router.post('/bahasa-asing/galeri/delete/:id', isBahasaAsing, csrfProtect, validateIdParam, ctrl.bahasaAsingGaleriDelete);
// Berita Bahasa Asing
router.get('/bahasa-asing/berita', isBahasaAsing, ctrl.bahasaAsingBeritaIndex);
router.get('/bahasa-asing/berita/create', isBahasaAsing, ctrl.bahasaAsingBeritaCreatePage);
router.post('/bahasa-asing/berita/create', isBahasaAsing, csrfProtect, ctrl.bahasaAsingBeritaCreate);
router.get('/bahasa-asing/berita/edit/:id', isBahasaAsing, validateIdParam, ctrl.bahasaAsingBeritaEditPage);
router.post('/bahasa-asing/berita/edit/:id', isBahasaAsing, csrfProtect, validateIdParam, ctrl.bahasaAsingBeritaUpdate);
router.post('/bahasa-asing/berita/delete/:id', isBahasaAsing, csrfProtect, validateIdParam, ctrl.bahasaAsingBeritaDelete);

// ── Rohis Portal ──────────────────────────────────────────────────────────────
router.get('/rohis/login', ctrl.portalLoginPage('rohis', 'Login Portal ROHIS'));
router.post('/rohis/login', loginLimiter, csrfProtect, ctrl.portalLogin('rohis'));
router.get('/rohis/logout', ctrl.portalLogout('rohis'));
router.get('/rohis/dashboard', isRohis, ctrl.rohisDashboard);
router.get('/rohis/create', isRohis, ctrl.rohisCreatePage);
router.post('/rohis/create', isRohis, csrfProtect, ctrl.rohisCreate);
router.get('/rohis/edit/:id', isRohis, validateIdParam, ctrl.rohisEditPage);
router.post('/rohis/edit/:id', isRohis, csrfProtect, validateIdParam, ctrl.rohisUpdate);
router.post('/rohis/delete/:id', isRohis, csrfProtect, validateIdParam, ctrl.rohisDelete);
router.get('/rohis/galeri', isRohis, ctrl.rohisGaleriIndex);
router.post('/rohis/galeri/upload', isRohis, ctrl.rohisGaleriCreate);
router.post('/rohis/galeri/delete/:id', isRohis, csrfProtect, validateIdParam, ctrl.rohisGaleriDelete);
// Berita Rohis
router.get('/rohis/berita', isRohis, ctrl.rohisBeritaIndex);
router.get('/rohis/berita/create', isRohis, ctrl.rohisBeritaCreatePage);
router.post('/rohis/berita/create', isRohis, csrfProtect, ctrl.rohisBeritaCreate);
router.get('/rohis/berita/edit/:id', isRohis, validateIdParam, ctrl.rohisBeritaEditPage);
router.post('/rohis/berita/edit/:id', isRohis, csrfProtect, validateIdParam, ctrl.rohisBeritaUpdate);
router.post('/rohis/berita/delete/:id', isRohis, csrfProtect, validateIdParam, ctrl.rohisBeritaDelete);

// ── PMR Portal ────────────────────────────────────────────────────────────────
router.get('/pmr/login', ctrl.portalLoginPage('pmr', 'Login Portal PMR'));
router.post('/pmr/login', loginLimiter, csrfProtect, ctrl.portalLogin('pmr'));
router.get('/pmr/logout', ctrl.portalLogout('pmr'));
router.get('/pmr/dashboard', isPmr, ctrl.pmrDashboard);
router.get('/pmr/create', isPmr, ctrl.pmrCreatePage);
router.post('/pmr/create', isPmr, csrfProtect, ctrl.pmrCreate);
router.get('/pmr/edit/:id', isPmr, validateIdParam, ctrl.pmrEditPage);
router.post('/pmr/edit/:id', isPmr, csrfProtect, validateIdParam, ctrl.pmrUpdate);
router.post('/pmr/delete/:id', isPmr, csrfProtect, validateIdParam, ctrl.pmrDelete);
router.get('/pmr/galeri', isPmr, ctrl.pmrGaleriIndex);
router.post('/pmr/galeri/upload', isPmr, ctrl.pmrGaleriCreate);
router.post('/pmr/galeri/delete/:id', isPmr, csrfProtect, validateIdParam, ctrl.pmrGaleriDelete);
// Berita PMR
router.get('/pmr/berita', isPmr, ctrl.pmrBeritaIndex);
router.get('/pmr/berita/create', isPmr, ctrl.pmrBeritaCreatePage);
router.post('/pmr/berita/create', isPmr, csrfProtect, ctrl.pmrBeritaCreate);
router.get('/pmr/berita/edit/:id', isPmr, validateIdParam, ctrl.pmrBeritaEditPage);
router.post('/pmr/berita/edit/:id', isPmr, csrfProtect, validateIdParam, ctrl.pmrBeritaUpdate);
router.post('/pmr/berita/delete/:id', isPmr, csrfProtect, validateIdParam, ctrl.pmrBeritaDelete);

// ── PIK-R Portal ──────────────────────────────────────────────────────────────
router.get('/pikr/login', ctrl.portalLoginPage('pikr', 'Login Portal PIK-R'));
router.post('/pikr/login', loginLimiter, csrfProtect, ctrl.portalLogin('pikr'));
router.get('/pikr/logout', ctrl.portalLogout('pikr'));
router.get('/pikr/dashboard', isPikr, ctrl.pikrDashboard);
router.get('/pikr/create', isPikr, ctrl.pikrCreatePage);
router.post('/pikr/create', isPikr, csrfProtect, ctrl.pikrCreate);
router.get('/pikr/edit/:id', isPikr, validateIdParam, ctrl.pikrEditPage);
router.post('/pikr/edit/:id', isPikr, csrfProtect, validateIdParam, ctrl.pikrUpdate);
router.post('/pikr/delete/:id', isPikr, csrfProtect, validateIdParam, ctrl.pikrDelete);
router.get('/pikr/galeri', isPikr, ctrl.pikrGaleriIndex);
router.post('/pikr/galeri/upload', isPikr, ctrl.pikrGaleriCreate);
router.post('/pikr/galeri/delete/:id', isPikr, csrfProtect, validateIdParam, ctrl.pikrGaleriDelete);
// Berita PIK-R
router.get('/pikr/berita', isPikr, ctrl.pikrBeritaIndex);
router.get('/pikr/berita/create', isPikr, ctrl.pikrBeritaCreatePage);
router.post('/pikr/berita/create', isPikr, csrfProtect, ctrl.pikrBeritaCreate);
router.get('/pikr/berita/edit/:id', isPikr, validateIdParam, ctrl.pikrBeritaEditPage);
router.post('/pikr/berita/edit/:id', isPikr, csrfProtect, validateIdParam, ctrl.pikrBeritaUpdate);
router.post('/pikr/berita/delete/:id', isPikr, csrfProtect, validateIdParam, ctrl.pikrBeritaDelete);

// ── Pecinta Alam Portal ───────────────────────────────────────────────────────
router.get('/pecinta-alam/login', ctrl.portalLoginPage('pecinta_alam', 'Login Portal Pecinta Alam'));
router.post('/pecinta-alam/login', loginLimiter, csrfProtect, ctrl.portalLogin('pecinta_alam'));
router.get('/pecinta-alam/logout', ctrl.portalLogout('pecinta_alam'));
router.get('/pecinta-alam/dashboard', isPecintaAlam, ctrl.pecintaAlamDashboard);
router.get('/pecinta-alam/create', isPecintaAlam, ctrl.pecintaAlamCreatePage);
router.post('/pecinta-alam/create', isPecintaAlam, csrfProtect, ctrl.pecintaAlamCreate);
router.get('/pecinta-alam/edit/:id', isPecintaAlam, validateIdParam, ctrl.pecintaAlamEditPage);
router.post('/pecinta-alam/edit/:id', isPecintaAlam, csrfProtect, validateIdParam, ctrl.pecintaAlamUpdate);
router.post('/pecinta-alam/delete/:id', isPecintaAlam, csrfProtect, validateIdParam, ctrl.pecintaAlamDelete);
router.get('/pecinta-alam/galeri', isPecintaAlam, ctrl.pecintaAlamGaleriIndex);
router.post('/pecinta-alam/galeri/upload', isPecintaAlam, ctrl.pecintaAlamGaleriCreate);
router.post('/pecinta-alam/galeri/delete/:id', isPecintaAlam, csrfProtect, validateIdParam, ctrl.pecintaAlamGaleriDelete);
// Berita Pecinta Alam
router.get('/pecinta-alam/berita', isPecintaAlam, ctrl.pecintaAlamBeritaIndex);
router.get('/pecinta-alam/berita/create', isPecintaAlam, ctrl.pecintaAlamBeritaCreatePage);
router.post('/pecinta-alam/berita/create', isPecintaAlam, csrfProtect, ctrl.pecintaAlamBeritaCreate);
router.get('/pecinta-alam/berita/edit/:id', isPecintaAlam, validateIdParam, ctrl.pecintaAlamBeritaEditPage);
router.post('/pecinta-alam/berita/edit/:id', isPecintaAlam, csrfProtect, validateIdParam, ctrl.pecintaAlamBeritaUpdate);
router.post('/pecinta-alam/berita/delete/:id', isPecintaAlam, csrfProtect, validateIdParam, ctrl.pecintaAlamBeritaDelete);

// ── Pencak Silat Portal ───────────────────────────────────────────────────────
router.get('/pencak-silat/login', ctrl.portalLoginPage('pencak_silat', 'Login Portal Pencak Silat'));
router.post('/pencak-silat/login', loginLimiter, csrfProtect, ctrl.portalLogin('pencak_silat'));
router.get('/pencak-silat/logout', ctrl.portalLogout('pencak_silat'));
router.get('/pencak-silat/dashboard', isPencakSilat, ctrl.pencakSilatDashboard);
router.get('/pencak-silat/create', isPencakSilat, ctrl.pencakSilatCreatePage);
router.post('/pencak-silat/create', isPencakSilat, csrfProtect, ctrl.pencakSilatCreate);
router.get('/pencak-silat/edit/:id', isPencakSilat, validateIdParam, ctrl.pencakSilatEditPage);
router.post('/pencak-silat/edit/:id', isPencakSilat, csrfProtect, validateIdParam, ctrl.pencakSilatUpdate);
router.post('/pencak-silat/delete/:id', isPencakSilat, csrfProtect, validateIdParam, ctrl.pencakSilatDelete);
router.get('/pencak-silat/galeri', isPencakSilat, ctrl.pencakSilatGaleriIndex);
router.post('/pencak-silat/galeri/upload', isPencakSilat, ctrl.pencakSilatGaleriCreate);
router.post('/pencak-silat/galeri/delete/:id', isPencakSilat, csrfProtect, validateIdParam, ctrl.pencakSilatGaleriDelete);
// Berita Pencak Silat
router.get('/pencak-silat/berita', isPencakSilat, ctrl.pencakSilatBeritaIndex);
router.get('/pencak-silat/berita/create', isPencakSilat, ctrl.pencakSilatBeritaCreatePage);
router.post('/pencak-silat/berita/create', isPencakSilat, csrfProtect, ctrl.pencakSilatBeritaCreate);
router.get('/pencak-silat/berita/edit/:id', isPencakSilat, validateIdParam, ctrl.pencakSilatBeritaEditPage);
router.post('/pencak-silat/berita/edit/:id', isPencakSilat, csrfProtect, validateIdParam, ctrl.pencakSilatBeritaUpdate);
router.post('/pencak-silat/berita/delete/:id', isPencakSilat, csrfProtect, validateIdParam, ctrl.pencakSilatBeritaDelete);

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
// Edit Halaman Jurusan (deskripsi lengkap)
router.get('/jurusan-portal/halaman', isJurusan, ctrl.jurusanHalamanPage);
router.post('/jurusan-portal/halaman', isJurusan, csrfProtect, ctrl.jurusanHalamanUpdate);
// Galeri Jurusan
router.get('/jurusan-portal/galeri', isJurusan, ctrl.jurusanGaleriIndex);
router.post('/jurusan-portal/galeri/upload', isJurusan, ctrl.jurusanGaleriCreate);
router.post('/jurusan-portal/galeri/delete/:id', isJurusan, csrfProtect, validateIdParam, ctrl.jurusanGaleriDelete);

// Fasilitas Jurusan
router.get('/jurusan-portal/fasilitas', isJurusan, ctrl.jurusanFasilitasIndex);
router.post('/jurusan-portal/fasilitas/create', isJurusan, ctrl.jurusanFasilitasCreate);
router.post('/jurusan-portal/fasilitas/edit/:id', isJurusan, validateIdParam, ctrl.jurusanFasilitasUpdate);
router.post('/jurusan-portal/fasilitas/delete/:id', isJurusan, validateIdParam, ctrl.jurusanFasilitasDelete);

module.exports = router;
