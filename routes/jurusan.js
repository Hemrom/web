const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/auth');
const jurusanController = require('../controllers/jurusanController');

// Halaman daftar jurusan
router.get('/', isAuthenticated, jurusanController.index);

// Halaman tambah jurusan
router.get('/create', isAuthenticated, jurusanController.create);
router.post('/create', isAuthenticated, jurusanController.store);

// Halaman edit jurusan
router.get('/edit/:id', isAuthenticated, jurusanController.edit);
router.post('/edit/:id', isAuthenticated, jurusanController.update);

// Hapus jurusan
router.post('/delete/:id', isAuthenticated, jurusanController.destroy);

// API: Get siswa by jurusan
router.get('/api/siswa/:id', isAuthenticated, jurusanController.getSiswaByJurusan);

// API: Get statistik jurusan
router.get('/api/statistik', isAuthenticated, jurusanController.getStatistik);

module.exports = router;
