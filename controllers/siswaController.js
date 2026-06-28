const db = require('../config/database');
const cbtDb = require('../config/database-cbt');
const XLSX = require('xlsx');
const multer = require('multer');

// Multer memory storage untuk import Excel
const multerExcel = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } }).single('file');

// Ambil data siswa dari database CBT
exports.getSiswaFromCBT = async (req, res) => {
  try {
    // Query untuk mengambil data siswa dari database CBT
    // Menggunakan tabel users dengan role STUDENT dan join dengan classes
    const [siswa] = await cbtDb.query(`
      SELECT 
        u.id as user_id,
        u.username as nis,
        u.full_name as nama,
        c.name as kelas,
        'Unknown' as jurusan,
        u.profile_photo as foto
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.role = 'STUDENT' AND u.is_active = 1
      ORDER BY c.name, u.full_name
    `);
    
    res.json({
      success: true,
      data: siswa,
      total: siswa.length
    });
  } catch (error) {
    console.error('Error fetching siswa from CBT:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa dari database CBT',
      error: error.message
    });
  }
};

// Sinkronisasi data siswa dari CBT ke database lokal
exports.syncSiswaFromCBT = async (req, res) => {
  try {
    // Ambil data siswa dari database CBT
    const [siswaCBT] = await cbtDb.query(`
      SELECT 
        u.id as user_id,
        u.username as nis,
        u.full_name as nama,
        c.name as kelas,
        'Unknown' as jurusan,
        u.profile_photo as foto
      FROM users u
      LEFT JOIN classes c ON u.class_id = c.id
      WHERE u.role = 'STUDENT' AND u.is_active = 1
      ORDER BY c.name, u.full_name
    `);
    
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    
    // Loop setiap siswa dan insert/update ke database lokal
    for (const siswa of siswaCBT) {
      try {
        // Cek apakah siswa sudah ada di database lokal
        const [existing] = await db.query(
          'SELECT id FROM siswa WHERE nis = ?',
          [siswa.nis]
        );
        
        if (existing.length > 0) {
          // Update data siswa yang sudah ada
          await db.query(
            'UPDATE siswa SET nama = ?, kelas = ?, jurusan = ?, foto = ?, updated_at = NOW() WHERE nis = ?',
            [siswa.nama, siswa.kelas || 'Unknown', siswa.jurusan, siswa.foto, siswa.nis]
          );
          updated++;
        } else {
          // Insert siswa baru
          await db.query(
            'INSERT INTO siswa (nis, nama, kelas, jurusan, foto, status) VALUES (?, ?, ?, ?, ?, ?)',
            [siswa.nis, siswa.nama, siswa.kelas || 'Unknown', siswa.jurusan, siswa.foto, 'aktif']
          );
          inserted++;
        }
      } catch (err) {
        console.error(`Error syncing siswa ${siswa.nis}:`, err);
        errors++;
      }
    }
    
    res.json({
      success: true,
      message: 'Sinkronisasi data siswa berhasil',
      stats: {
        total: siswaCBT.length,
        inserted,
        updated,
        errors
      }
    });
  } catch (error) {
    console.error('Error syncing siswa from CBT:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal sinkronisasi data siswa',
      error: error.message
    });
  }
};

// Daftar siswa dari database lokal
exports.index = async (req, res) => {
  try {
    const [siswa] = await db.query(`
      SELECT * FROM siswa 
      ORDER BY kelas, nama
    `);
    
    res.render('admin/siswa/index', {
      title: 'Data Siswa',
      user: req.session,
      siswa,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Halaman tambah siswa manual (jika diperlukan)
exports.create = async (req, res) => {
  try {
    // Ambil daftar jurusan
    const [jurusan] = await db.query('SELECT * FROM jurusan WHERE status = "aktif" ORDER BY kode');
    
    res.render('admin/siswa/create', {
      title: 'Tambah Siswa',
      user: req.session,
      jurusan
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Simpan siswa baru
exports.store = async (req, res) => {
  try {
    const { nis, nama, kelas, jurusan } = req.body;
    const foto = req.file ? req.file.filename : null;
    
    await db.query(
      'INSERT INTO siswa (nis, nama, kelas, jurusan, foto, status) VALUES (?, ?, ?, ?, ?, ?)',
      [nis, nama, kelas, jurusan, foto, 'aktif']
    );
    
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Halaman edit siswa
exports.edit = async (req, res) => {
  try {
    const [siswa] = await db.query('SELECT * FROM siswa WHERE id = ?', [req.params.id]);
    
    if (siswa.length === 0) {
      return res.status(404).send('Siswa tidak ditemukan');
    }
    
    // Ambil daftar jurusan
    const [jurusan] = await db.query('SELECT * FROM jurusan WHERE status = "aktif" ORDER BY kode');
    
    res.render('admin/siswa/edit', {
      title: 'Edit Siswa',
      user: req.session,
      siswa: siswa[0],
      jurusan
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Update siswa
exports.update = async (req, res) => {
  try {
    const { nis, nama, kelas, jurusan, status } = req.body;
    const foto = req.file ? req.file.filename : null;
    
    if (foto) {
      await db.query(
        'UPDATE siswa SET nis = ?, nama = ?, kelas = ?, jurusan = ?, foto = ?, status = ? WHERE id = ?',
        [nis, nama, kelas, jurusan, foto, status, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE siswa SET nis = ?, nama = ?, kelas = ?, jurusan = ?, status = ? WHERE id = ?',
        [nis, nama, kelas, jurusan, status, req.params.id]
      );
    }
    
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Hapus siswa
exports.destroy = async (req, res) => {
  try {
    await db.query('DELETE FROM siswa WHERE id = ?', [req.params.id]);
    res.redirect('/admin/data-sekolah?tab=siswa&success=1');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// API: Get siswa by kelas
exports.getSiswaByKelas = async (req, res) => {
  try {
    const [siswa] = await db.query(
      'SELECT id, nis, nama FROM siswa WHERE kelas = ? AND status = "aktif" ORDER BY nama',
      [req.params.kelas]
    );
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mengambil data siswa'
    });
  }
};

// API: Search siswa
exports.searchSiswa = async (req, res) => {
  try {
    const { q } = req.query;
    const [siswa] = await db.query(
      'SELECT id, nis, nama, kelas FROM siswa WHERE (nama LIKE ? OR nis LIKE ?) AND status = "aktif" ORDER BY nama LIMIT 20',
      [`%${q}%`, `%${q}%`]
    );
    
    res.json({
      success: true,
      data: siswa
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Gagal mencari siswa'
    });
  }
};

// ─── Export siswa ke Excel ───────────────────────────────────────────────────
exports.exportExcel = async (req, res) => {
  try {
    const [siswa] = await db.query(
      'SELECT nis, nama, jenis_kelamin, tempat_lahir, tanggal_lahir, alamat, telepon, kelas, jurusan, tahun_masuk, status FROM siswa ORDER BY kelas, nama'
    );

    const data = siswa.length > 0
      ? siswa.map((s, i) => ({
          No: i + 1,
          NIS: s.nis || '',
          Nama: s.nama,
          'Jenis Kelamin': s.jenis_kelamin === 'L' ? 'L' : 'P',
          'Tempat Lahir': s.tempat_lahir || '',
          'Tanggal Lahir': s.tanggal_lahir ? new Date(s.tanggal_lahir).toISOString().slice(0, 10) : '',
          Alamat: s.alamat || '',
          Telepon: s.telepon || '',
          Kelas: s.kelas || '',
          Jurusan: s.jurusan || '',
          'Tahun Masuk': s.tahun_masuk || '',
          Status: s.status || 'aktif'
        }))
      : [{ No: '', NIS: '', Nama: '', 'Jenis Kelamin': '', 'Tempat Lahir': '', 'Tanggal Lahir': '', Alamat: '', Telepon: '', Kelas: '', Jurusan: '', 'Tahun Masuk': '', Status: '' }];

    const ws = XLSX.utils.json_to_sheet(data);
    // Set lebar kolom
    ws['!cols'] = [
      { wch: 4 }, { wch: 15 }, { wch: 30 }, { wch: 14 }, { wch: 18 },
      { wch: 14 }, { wch: 35 }, { wch: 16 }, { wch: 10 }, { wch: 15 }, { wch: 12 }, { wch: 10 }
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Data Siswa');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="data-siswa.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export data siswa');
  }
};

// ─── Download template Excel kosong ─────────────────────────────────────────
exports.downloadTemplate = (req, res) => {
  // Baris 1: header instruksi (warna berbeda di Excel tidak bisa via xlsx saja, tapi kita beri contoh data)
  const contoh = [
    {
      NIS: '12345',
      Nama: 'Contoh Nama Siswa',
      'Jenis Kelamin (L/P)': 'L',
      'Tempat Lahir': 'Kediri',
      'Tanggal Lahir (YYYY-MM-DD)': '2008-05-15',
      Alamat: 'Jl. Contoh No.1, Kras, Kediri',
      'Telepon / No HP': '08123456789',
      Kelas: 'XI',
      Jurusan: 'TKJ',
      'Tahun Masuk': 2023,
      'Status (aktif/nonaktif)': 'aktif'
    }
  ];

  const ws = XLSX.utils.json_to_sheet(contoh);
  ws['!cols'] = [
    { wch: 15 }, { wch: 30 }, { wch: 20 }, { wch: 18 }, { wch: 26 },
    { wch: 35 }, { wch: 20 }, { wch: 8 }, { wch: 15 }, { wch: 12 }, { wch: 24 }
  ];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="template-import-siswa.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

// ─── Import siswa dari Excel ─────────────────────────────────────────────────
exports.importExcel = (req, res) => {
  multerExcel(req, res, async (err) => {
    if (err) {
      req.session.message = { type: 'error', text: 'Gagal upload file: ' + err.message };
      return res.redirect('/admin/data-sekolah?tab=siswa');
    }
    if (!req.file) {
      req.session.message = { type: 'error', text: 'Tidak ada file yang dipilih.' };
      return res.redirect('/admin/data-sekolah?tab=siswa');
    }
    try {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(ws, { defval: '' });

      if (!rows.length) {
        req.session.message = { type: 'error', text: 'File Excel kosong atau format tidak dikenali.' };
        return res.redirect('/admin/data-sekolah?tab=siswa');
      }

      let inserted = 0, updated = 0, skipped = 0;
      const errors = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const rowNum = i + 2; // baris Excel (baris 1 = header)

        // Ambil nama — wajib ada
        const nama = (row['Nama'] || row['nama'] || row['NAMA'] || row['Nama Lengkap'] || '').toString().trim();
        if (!nama) { skipped++; continue; }

        // Ambil field lainnya
        const nis        = (row['NIS'] || row['nis'] || row['Nis'] || '').toString().trim() || null;
        const rawJK      = (row['Jenis Kelamin (L/P)'] || row['Jenis Kelamin'] || row['jenis_kelamin'] || row['JK'] || '').toString().trim().toUpperCase();
        const jenis_kelamin = rawJK === 'L' ? 'L' : rawJK === 'P' ? 'P' : 'L'; // default L jika tidak diisi
        const tempat_lahir  = (row['Tempat Lahir'] || row['tempat_lahir'] || '').toString().trim() || null;
        const rawTgl        = (row['Tanggal Lahir (YYYY-MM-DD)'] || row['Tanggal Lahir'] || row['tanggal_lahir'] || '').toString().trim();
        let tanggal_lahir   = null;
        if (rawTgl) {
          // Coba parse tanggal — bisa string YYYY-MM-DD atau angka serial Excel
          const parsed = new Date(rawTgl);
          if (!isNaN(parsed.getTime())) {
            tanggal_lahir = parsed.toISOString().slice(0, 10);
          }
        }
        const alamat        = (row['Alamat'] || row['alamat'] || '').toString().trim() || null;
        const telepon       = (row['Telepon / No HP'] || row['Telepon'] || row['telepon'] || row['No HP'] || '').toString().trim() || null;
        const kelas         = (row['Kelas'] || row['kelas'] || '').toString().trim() || null;
        const jurusan       = (row['Jurusan'] || row['jurusan'] || '').toString().trim() || null;
        const rawTahun      = (row['Tahun Masuk'] || row['tahun_masuk'] || '').toString().trim();
        const tahun_masuk   = rawTahun && !isNaN(parseInt(rawTahun)) ? parseInt(rawTahun) : null;
        const rawStatus     = (row['Status (aktif/nonaktif)'] || row['Status'] || row['status'] || 'aktif').toString().trim().toLowerCase();
        const status        = rawStatus === 'nonaktif' ? 'nonaktif' : 'aktif';

        try {
          // Cek duplikat: cari by NIS dulu, lalu by nama+kelas
          let existing = [];
          if (nis) {
            [existing] = await db.query('SELECT id FROM siswa WHERE nis = ?', [nis]);
          }
          if (!existing.length && nama && kelas) {
            [existing] = await db.query('SELECT id FROM siswa WHERE nama = ? AND kelas = ?', [nama, kelas]);
          }

          if (existing.length > 0) {
            // Update
            await db.query(
              `UPDATE siswa SET nis=?, nama=?, jenis_kelamin=?, tempat_lahir=?, tanggal_lahir=?,
               alamat=?, telepon=?, kelas=?, jurusan=?, tahun_masuk=?, status=?
               WHERE id=?`,
              [nis, nama, jenis_kelamin, tempat_lahir, tanggal_lahir,
               alamat, telepon, kelas, jurusan, tahun_masuk, status, existing[0].id]
            );
            updated++;
          } else {
            // Insert baru
            await db.query(
              `INSERT INTO siswa (nis, nama, jenis_kelamin, tempat_lahir, tanggal_lahir,
               alamat, telepon, kelas, jurusan, tahun_masuk, status)
               VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
              [nis, nama, jenis_kelamin, tempat_lahir, tanggal_lahir,
               alamat, telepon, kelas, jurusan, tahun_masuk, status]
            );
            inserted++;
          }
        } catch (rowErr) {
          console.error(`Import error baris ${rowNum}:`, rowErr.message);
          errors.push(`Baris ${rowNum} (${nama}): ${rowErr.message}`);
          skipped++;
        }
      }

      let msg = `Import selesai! ${inserted} siswa ditambahkan, ${updated} diperbarui, ${skipped} dilewati.`;
      if (errors.length) msg += ` Error: ${errors.slice(0, 3).join('; ')}${errors.length > 3 ? '...' : ''}`;
      req.session.message = { type: 'success', text: msg };
      res.redirect('/admin/data-sekolah?tab=siswa');
    } catch (e) {
      console.error('Import Excel error:', e);
      req.session.message = { type: 'error', text: 'Gagal import: ' + e.message };
      res.redirect('/admin/data-sekolah?tab=siswa');
    }
  });
};
