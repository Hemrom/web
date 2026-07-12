/**
 * skGuruController.js
 * Kelola SK Mengajar & SK Tugas Tambahan
 * - Admin: upload, edit, hapus, tag guru penerima
 * - Guru: lihat & download SK yang ditujukan ke dirinya
 */

const db   = require('../config/database');
const path = require('path');
const fs   = require('fs');
const multer = require('multer');
const crypto = require('crypto');

// ── Storage untuk file SK (bukan gambar, simpan di uploads/sk/) ───────────────
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = './uploads/sk/';
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext  = path.extname(file.originalname).toLowerCase();
    const rand = crypto.randomBytes(12).toString('hex');
    cb(null, `sk-${Date.now()}-${rand}${ext}`);
  }
});

const uploadSK = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.zip', '.rar'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) return cb(null, true);
    cb(new Error('Format file tidak didukung. Gunakan PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, ZIP, atau RAR.'));
  }
}).single('file_sk');

// Helper format ukuran file
const formatSize = (bytes) => {
  if (!bytes) return '-';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

// Label jenis SK
const jenisLabel = {
  sk_mengajar:      'SK Mengajar',
  sk_tugas_tambahan: 'SK Tugas Tambahan',
  lainnya:          'Lainnya'
};

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /admin/sk-guru
 * Daftar semua SK
 */
exports.adminIndex = async (req, res) => {
  try {
    const [skList] = await db.query(`
      SELECT s.*,
             u.nama_lengkap AS nama_pembuat,
             COUNT(DISTINCT p.guru_id) AS jumlah_penerima
      FROM sk_guru s
      LEFT JOIN users u ON s.dibuat_oleh = u.id
      LEFT JOIN sk_guru_penerima p ON p.sk_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `);

    res.render('admin/sk-guru/index', {
      title: 'Kelola SK Guru',
      user: req.session,
      skList,
      jenisLabel,
      success: req.query.success || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

/**
 * GET /admin/sk-guru/create
 * Form upload SK baru
 */
exports.adminCreatePage = async (req, res) => {
  try {
    const [guruList] = await db.query('SELECT id, nama, nip, jabatan FROM guru ORDER BY nama ASC');
    res.render('admin/sk-guru/create', {
      title: 'Upload SK Guru',
      user: req.session,
      guruList,
      jenisLabel,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

/**
 * POST /admin/sk-guru/create
 * Simpan SK baru + assign penerima
 */
exports.adminCreate = (req, res) => {
  uploadSK(req, res, async (err) => {
    if (err) {
      const [guruList] = await db.query('SELECT id, nama, nip, jabatan FROM guru ORDER BY nama ASC');
      return res.render('admin/sk-guru/create', {
        title: 'Upload SK Guru', user: req.session, guruList, jenisLabel,
        error: 'Upload gagal: ' + err.message
      });
    }
    if (!req.file) {
      const [guruList] = await db.query('SELECT id, nama, nip, jabatan FROM guru ORDER BY nama ASC');
      return res.render('admin/sk-guru/create', {
        title: 'Upload SK Guru', user: req.session, guruList, jenisLabel,
        error: 'File SK wajib diupload.'
      });
    }

    try {
      const { judul, jenis, nomor_sk, tahun_ajaran, tanggal_sk, deskripsi, status } = req.body;
      // guru_ids bisa string (satu) atau array (banyak)
      let guruIds = req.body.guru_ids || [];
      if (!Array.isArray(guruIds)) guruIds = [guruIds];
      guruIds = guruIds.map(id => parseInt(id)).filter(id => !isNaN(id) && id > 0);

      const ext = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();

      const [result] = await db.query(
        `INSERT INTO sk_guru
          (judul, jenis, nomor_sk, tahun_ajaran, tanggal_sk, deskripsi,
           nama_file, nama_file_asli, ukuran_file, tipe_file, status, dibuat_oleh)
         VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
        [
          judul, jenis || 'sk_mengajar', nomor_sk || null,
          tahun_ajaran || null, tanggal_sk || null, deskripsi || null,
          req.file.filename, req.file.originalname,
          formatSize(req.file.size), ext,
          status || 'aktif', req.session.userId
        ]
      );

      const skId = result.insertId;

      // Insert relasi penerima
      if (guruIds.length > 0) {
        const values = guruIds.map(gid => [skId, gid]);
        await db.query(
          'INSERT IGNORE INTO sk_guru_penerima (sk_id, guru_id) VALUES ?',
          [values]
        );
      }

      res.redirect('/admin/sk-guru?success=created');
    } catch (e) {
      console.error(e);
      // Hapus file yang sudah terupload jika query gagal
      if (req.file) {
        const fp = path.join('./uploads/sk/', req.file.filename);
        if (fs.existsSync(fp)) fs.unlinkSync(fp);
      }
      const [guruList] = await db.query('SELECT id, nama, nip, jabatan FROM guru ORDER BY nama ASC');
      res.render('admin/sk-guru/create', {
        title: 'Upload SK Guru', user: req.session, guruList, jenisLabel,
        error: 'Terjadi kesalahan saat menyimpan data.'
      });
    }
  });
};

/**
 * GET /admin/sk-guru/edit/:id
 * Form edit SK (judul, meta, ganti file, ganti penerima)
 */
exports.adminEditPage = async (req, res) => {
  try {
    const [[sk], [guruList], [penerimaSaat]] = await Promise.all([
      db.query('SELECT * FROM sk_guru WHERE id = ?', [req.params.id]),
      db.query('SELECT id, nama, nip, jabatan FROM guru ORDER BY nama ASC'),
      db.query('SELECT guru_id FROM sk_guru_penerima WHERE sk_id = ?', [req.params.id])
    ]);

    if (!sk.length) return res.status(404).send('SK tidak ditemukan');

    const selectedGuruIds = penerimaSaat.map(r => r.guru_id);

    res.render('admin/sk-guru/edit', {
      title: 'Edit SK Guru',
      user: req.session,
      sk: sk[0],
      guruList,
      selectedGuruIds,
      jenisLabel,
      error: null,
      success: req.query.success || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

/**
 * POST /admin/sk-guru/edit/:id
 * Update SK + sync penerima
 */
exports.adminUpdate = (req, res) => {
  uploadSK(req, res, async (err) => {
    if (err) {
      return res.redirect(`/admin/sk-guru/edit/${req.params.id}?error=upload`);
    }

    try {
      const skId = parseInt(req.params.id);
      const { judul, jenis, nomor_sk, tahun_ajaran, tanggal_sk, deskripsi, status } = req.body;
      let guruIds = req.body.guru_ids || [];
      if (!Array.isArray(guruIds)) guruIds = [guruIds];
      guruIds = guruIds.map(id => parseInt(id)).filter(id => !isNaN(id) && id > 0);

      const [rows] = await db.query('SELECT * FROM sk_guru WHERE id = ?', [skId]);
      if (!rows.length) return res.status(404).send('SK tidak ditemukan');

      let namaFile    = rows[0].nama_file;
      let namaFileAsli = rows[0].nama_file_asli;
      let ukuranFile  = rows[0].ukuran_file;
      let tipeFile    = rows[0].tipe_file;

      if (req.file) {
        // Hapus file lama
        const lamPath = path.join('./uploads/sk/', rows[0].nama_file);
        if (fs.existsSync(lamPath)) fs.unlinkSync(lamPath);

        namaFile     = req.file.filename;
        namaFileAsli = req.file.originalname;
        ukuranFile   = formatSize(req.file.size);
        tipeFile     = path.extname(req.file.originalname).toLowerCase().replace('.', '').toUpperCase();
      }

      await db.query(
        `UPDATE sk_guru SET
           judul=?, jenis=?, nomor_sk=?, tahun_ajaran=?, tanggal_sk=?,
           deskripsi=?, nama_file=?, nama_file_asli=?, ukuran_file=?, tipe_file=?, status=?
         WHERE id=?`,
        [
          judul, jenis || 'sk_mengajar', nomor_sk || null,
          tahun_ajaran || null, tanggal_sk || null, deskripsi || null,
          namaFile, namaFileAsli, ukuranFile, tipeFile,
          status || 'aktif', skId
        ]
      );

      // Sync penerima: hapus semua lalu insert ulang
      await db.query('DELETE FROM sk_guru_penerima WHERE sk_id = ?', [skId]);
      if (guruIds.length > 0) {
        const values = guruIds.map(gid => [skId, gid]);
        await db.query('INSERT IGNORE INTO sk_guru_penerima (sk_id, guru_id) VALUES ?', [values]);
      }

      res.redirect('/admin/sk-guru?success=updated');
    } catch (e) {
      console.error(e);
      res.redirect(`/admin/sk-guru/edit/${req.params.id}?error=save`);
    }
  });
};

/**
 * POST /admin/sk-guru/delete/:id
 * Hapus SK beserta file fisik dan relasi penerima (cascade)
 */
exports.adminDelete = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT nama_file FROM sk_guru WHERE id = ?', [req.params.id]);
    if (rows.length) {
      const fp = path.join('./uploads/sk/', rows[0].nama_file);
      if (fs.existsSync(fp)) fs.unlinkSync(fp);
    }
    await db.query('DELETE FROM sk_guru WHERE id = ?', [req.params.id]);
    res.redirect('/admin/sk-guru?success=deleted');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

/**
 * GET /admin/sk-guru/detail/:id
 * Detail SK + daftar penerima + status baca
 */
exports.adminDetail = async (req, res) => {
  try {
    const [[skRows], [penerima]] = await Promise.all([
      db.query(`
        SELECT s.*, u.nama_lengkap AS nama_pembuat
        FROM sk_guru s
        LEFT JOIN users u ON s.dibuat_oleh = u.id
        WHERE s.id = ?
      `, [req.params.id]),
      db.query(`
        SELECT g.id, g.nama, g.nip, g.jabatan, g.foto,
               p.dibaca, p.tanggal_dibaca
        FROM sk_guru_penerima p
        JOIN guru g ON g.id = p.guru_id
        WHERE p.sk_id = ?
        ORDER BY g.nama ASC
      `, [req.params.id])
    ]);

    if (!skRows.length) return res.status(404).send('SK tidak ditemukan');

    res.render('admin/sk-guru/detail', {
      title: 'Detail SK Guru',
      user: req.session,
      sk: skRows[0],
      penerima,
      jenisLabel
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// GURU (portal)
// ══════════════════════════════════════════════════════════════════════════════

/**
 * GET /guru/sk-saya
 * Daftar SK yang ditujukan ke guru yang sedang login
 */
exports.guruIndex = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM guru WHERE id = ?', [req.session.guruId]);
    if (!rows.length) return res.redirect('/guru/login');
    const guru = rows[0];

    const [skList] = await db.query(`
      SELECT s.*, p.dibaca, p.tanggal_dibaca
      FROM sk_guru_penerima p
      JOIN sk_guru s ON s.id = p.sk_id
      WHERE p.guru_id = ? AND s.status = 'aktif'
      ORDER BY s.created_at DESC
    `, [req.session.guruId]);

    // Pisahkan per jenis untuk tampilan
    const skMengajar       = skList.filter(s => s.jenis === 'sk_mengajar');
    const skTugasTambahan  = skList.filter(s => s.jenis === 'sk_tugas_tambahan');
    const skLainnya        = skList.filter(s => s.jenis === 'lainnya');

    res.render('guru/sk-saya/index', {
      title: 'SK Saya',
      guru,
      skList,
      skMengajar,
      skTugasTambahan,
      skLainnya,
      jenisLabel
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

/**
 * GET /guru/sk-saya/download/:id
 * Download file SK — tandai sudah dibaca
 */
exports.guruDownload = async (req, res) => {
  try {
    // Pastikan SK ini memang untuk guru yang login
    const [penerima] = await db.query(
      'SELECT * FROM sk_guru_penerima WHERE sk_id = ? AND guru_id = ?',
      [req.params.id, req.session.guruId]
    );
    if (!penerima.length) return res.status(403).send('Akses ditolak');

    const [skRows] = await db.query(
      "SELECT * FROM sk_guru WHERE id = ? AND status = 'aktif'",
      [req.params.id]
    );
    if (!skRows.length) return res.status(404).send('File tidak ditemukan');

    const sk = skRows[0];
    const filePath = path.join(__dirname, '../uploads/sk/', sk.nama_file);
    if (!fs.existsSync(filePath)) return res.status(404).send('File tidak ditemukan di server');

    // Tandai dibaca jika belum
    if (!penerima[0].dibaca) {
      await db.query(
        'UPDATE sk_guru_penerima SET dibaca = 1, tanggal_dibaca = NOW() WHERE sk_id = ? AND guru_id = ?',
        [req.params.id, req.session.guruId]
      );
    }

    // Nama download: judul + ekstensi asli
    const ext = path.extname(sk.nama_file);
    const downloadName = `${sk.judul}${ext}`;
    res.download(filePath, downloadName);
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
