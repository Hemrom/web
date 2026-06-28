const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const siswaController = require('../controllers/siswaController');
const { csrfProtect } = require('../middleware/csrf');
const multer = require('multer');
const path = require('path');

// Setup multer untuk upload foto
const storage = multer.diskStorage({
  destination: './uploads/siswa/',
  filename: (req, file, cb) => {
    cb(null, 'siswa-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('foto');

// Halaman daftar siswa
router.get('/', isAuthenticated, siswaController.index);

// Halaman tambah siswa
router.get('/create', isAuthenticated, siswaController.create);
router.post('/create', isAuthenticated, upload, siswaController.store);

// Halaman edit siswa
router.get('/edit/:id', isAuthenticated, siswaController.edit);
router.post('/edit/:id', isAuthenticated, upload, siswaController.update);

// Hapus siswa
router.post('/delete/:id', isAuthenticated, siswaController.destroy);

// API: Ambil data siswa dari CBT
router.get('/api/cbt-siswa', isAuthenticated, siswaController.getSiswaFromCBT);

// API: Sinkronisasi data siswa dari CBT
router.post('/api/sync-from-cbt', isAuthenticated, siswaController.syncSiswaFromCBT);

// API: Get siswa by kelas
router.get('/api/by-kelas/:kelas', isAuthenticated, siswaController.getSiswaByKelas);

// API: Search siswa
router.get('/api/search', isAuthenticated, siswaController.searchSiswa);

// Export siswa ke Excel
router.get('/export', isAuthenticated, siswaController.exportExcel);

// Download template Excel
router.get('/template', isAuthenticated, siswaController.downloadTemplate);

// Import siswa dari Excel (multer dihandle di dalam controller)
router.post('/import', isAuthenticated, csrfProtect, siswaController.importExcel);

module.exports = router;