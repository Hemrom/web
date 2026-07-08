const db = require('../config/database');
const cbtDb = require('../config/database-cbt');
const path = require('path');
const fs = require('fs');
const XLSX = require('xlsx');
const compressImage = require('../middleware/compressImage');
const { createUpload } = require('../middleware/uploadSecurity');

const upload = createUpload('guru').single('foto');
const multerExcel = require('multer')({ storage: require('multer').memoryStorage() }).single('file');

exports.index = async (req, res) => {
  try {
    const [guru] = await db.query('SELECT * FROM guru ORDER BY nama ASC');
    
    // Ambil pesan dari session jika ada
    const message = req.session.message;
    delete req.session.message;
    
    res.render('admin/guru/index', {
      title: 'Kelola Guru',
      user: req.session,
      guru,
      message
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.dashboard = async (req, res) => {
  try {
    const [[{ total }]] = await db.query('SELECT COUNT(*) as total FROM guru');
    const [[{ totalFoto }]] = await db.query("SELECT COUNT(*) as totalFoto FROM guru WHERE foto IS NOT NULL AND foto != ''");
    const [perProgli] = await db.query(`
      SELECT mata_pelajaran, COUNT(*) as jumlah
      FROM guru
      WHERE mata_pelajaran IS NOT NULL AND mata_pelajaran != ''
      GROUP BY mata_pelajaran
      ORDER BY jumlah DESC
    `);
    const [perJabatan] = await db.query(`
      SELECT jabatan, COUNT(*) as jumlah
      FROM guru
      WHERE jabatan IS NOT NULL AND jabatan != ''
      GROUP BY jabatan
      ORDER BY jumlah DESC
    `);
    const [guruTerbaru] = await db.query(
      'SELECT id, nama, jabatan, mata_pelajaran, foto, created_at FROM guru ORDER BY created_at DESC LIMIT 8'
    );
    const [kaprogli] = await db.query(
      "SELECT id, nama, jabatan, mata_pelajaran, foto FROM guru WHERE jabatan LIKE '%KAPROGLI%' ORDER BY jabatan ASC"
    );

    res.render('admin/guru/dashboard', {
      title: 'Dashboard Guru',
      user: req.session,
      stats: { total, totalFoto, tanpaFoto: total - totalFoto },
      perProgli,
      perJabatan,
      guruTerbaru,
      kaprogli
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  try {
    res.render('admin/guru/create', {
      title: 'Tambah Guru',
      user: req.session
    });
  } catch (error) {
    console.error('createPage error:', error);
    res.status(500).send('Terjadi kesalahan: ' + error.message);
  }
};

exports.create = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    await compressImage(req, res, () => {});
    try {
      const { nip, nama, mata_pelajaran, jabatan, email, telepon, alamat, guru_username, guru_password, jenis_kelamin } = req.body;
      const foto = req.file ? req.file.filename : null;

      // Hash password jika diisi
      let hashedPassword = null;
      if (guru_password && guru_password.trim()) {
        const bcrypt = require('bcryptjs');
        hashedPassword = await bcrypt.hash(guru_password.trim(), 10);
      }

      await db.query(
        'INSERT INTO guru (nip, nama, foto, mata_pelajaran, jabatan, email, telepon, alamat, jenis_kelamin, guru_username, guru_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nip || null, nama, foto, mata_pelajaran, jabatan, email, telepon, alamat || null, jenis_kelamin || null, guru_username || null, hashedPassword]
      );
      
      res.redirect('/admin/data-sekolah?tab=guru');
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Username sudah digunakan oleh guru lain.');
      }
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.editPage = async (req, res) => {
  try {
    const [guru] = await db.query('SELECT * FROM guru WHERE id = ?', [req.params.id]);
    if (guru.length === 0) {
      return res.status(404).send('Guru tidak ditemukan');
    }
    res.render('admin/guru/edit', {
      title: 'Edit Guru',
      user: req.session,
      guru: guru[0],
      success: req.query.success || null
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(500).send('Error upload file');
    }
    await compressImage(req, res, () => {});
    try {
      const { nip, nama, mata_pelajaran, jabatan, email, telepon, alamat, guru_username, guru_username_lama, guru_password, jenis_kelamin } = req.body;
      const foto = req.file ? req.file.filename : null;

      // Siapkan update akun login
      const bcrypt = require('bcryptjs');
      let loginUpdate = '';
      const params = [nip || null, nama, mata_pelajaran, jabatan, email, telepon, alamat || null, jenis_kelamin || null];

      // Hanya update username kalau benar-benar berubah dari nilai lama
      const usernameBaruBersih = guru_username ? guru_username.trim() : '';
      const usernameLamaBersih = guru_username_lama ? guru_username_lama.trim() : '';
      if (usernameBaruBersih !== '' && usernameBaruBersih !== usernameLamaBersih) {
        loginUpdate += ', guru_username = ?';
        params.push(usernameBaruBersih);
      }
      if (guru_password && guru_password.trim()) {
        const hash = await bcrypt.hash(guru_password.trim(), 10);
        loginUpdate += ', guru_password = ?';
        params.push(hash);
      }

      if (foto) {
        await db.query(
          `UPDATE guru SET nip=?, nama=?, mata_pelajaran=?, jabatan=?, email=?, telepon=?, alamat=?, jenis_kelamin=?, foto=?${loginUpdate} WHERE id=?`,
          [...params, foto, req.params.id]
        );
      } else {
        await db.query(
          `UPDATE guru SET nip=?, nama=?, mata_pelajaran=?, jabatan=?, email=?, telepon=?, alamat=?, jenis_kelamin=?${loginUpdate} WHERE id=?`,
          [...params, req.params.id]
        );
      }
      
      res.redirect('/admin/data-sekolah?tab=guru');
    } catch (error) {
      console.error(error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).send('Username sudah digunakan oleh guru lain.');
      }
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM guru WHERE id = ?', [req.params.id]);
    res.redirect('/admin/data-sekolah?tab=guru');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.deleteFoto = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT foto FROM guru WHERE id = ?', [req.params.id]);
    if (rows.length && rows[0].foto) {
      const filePath = `./uploads/${rows[0].foto}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }
    await db.query('UPDATE guru SET foto = NULL WHERE id = ?', [req.params.id]);
    res.redirect(`/admin/guru/edit/${req.params.id}?success=foto_hapus`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.syncFromCBT = async (req, res) => {
  try {
    console.log('🔄 Memulai sinkronisasi guru dari CBT...');
    
    // Ambil data guru dari CBT
    const [guruCBT] = await cbtDb.query(`
      SELECT 
        u.username as nip, 
        u.full_name as nama, 
        u.profile_photo as foto
      FROM users u 
      WHERE u.role = 'TEACHER' AND u.is_active = 1 
      ORDER BY u.full_name
    `);

    let inserted = 0;
    let updated = 0;
    let skipped = 0;

    for (const guru of guruCBT) {
      try {
        // Validasi data minimal
        if (!guru.nip || !guru.nama) {
          skipped++;
          continue;
        }

        // Cek apakah guru sudah ada
        const [existing] = await db.query(
          'SELECT id FROM guru WHERE nip = ?',
          [guru.nip]
        );

        // Prepare data dengan default values
        const guruData = {
          nip: guru.nip,
          nama: guru.nama,
          foto: guru.foto || null,
          mata_pelajaran: 'Belum Ditentukan',
          jabatan: 'Guru',
          email: null,
          telepon: null
        };

        if (existing.length > 0) {
          // Update guru yang sudah ada (hanya update nama dan foto)
          await db.query(
            'UPDATE guru SET nama = ?, foto = ? WHERE nip = ?',
            [guruData.nama, guruData.foto, guruData.nip]
          );
          updated++;
        } else {
          // Insert guru baru
          await db.query(
            'INSERT INTO guru (nip, nama, foto, mata_pelajaran, jabatan, email, telepon) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [guruData.nip, guruData.nama, guruData.foto, guruData.mata_pelajaran, guruData.jabatan, guruData.email, guruData.telepon]
          );
          inserted++;
        }
      } catch (err) {
        console.error(`Error sync guru ${guru.nama}:`, err.message);
        skipped++;
      }
    }

    console.log(`✅ Sinkronisasi selesai: ${inserted} ditambah, ${updated} diupdate, ${skipped} dilewati`);
    
    // Redirect dengan pesan sukses
    req.session.message = {
      type: 'success',
      text: `Sinkronisasi berhasil! ${inserted} guru ditambahkan, ${updated} guru diupdate.`
    };
    
    res.redirect('/admin/data-sekolah?tab=guru');
  } catch (error) {
    console.error('Error sinkronisasi CBT:', error);
    req.session.message = {
      type: 'error',
      text: 'Gagal sinkronisasi data guru dari CBT. Periksa koneksi database.'
    };
    res.redirect('/admin/data-sekolah?tab=guru');
  }
};

// Reset password massal
exports.resetPasswordMassal = async (req, res) => {
  try {
    const bcrypt = require('bcryptjs');
    const { ids, password_baru } = req.body;

    // ids bisa string (1 guru) atau array (banyak guru)
    const idList = Array.isArray(ids) ? ids : (ids ? [ids] : []);
    if (idList.length === 0) {
      req.session.message = { type: 'error', text: 'Tidak ada guru yang dipilih.' };
      return res.redirect('/admin/guru');
    }

    const passwordPlain = (password_baru || '').trim() || 'Guru@1234';
    if (passwordPlain.length < 6) {
      req.session.message = { type: 'error', text: 'Password minimal 6 karakter.' };
      return res.redirect('/admin/guru');
    }

    const hashed = await bcrypt.hash(passwordPlain, 10);

    // Validasi semua id adalah angka untuk keamanan
    const safeIds = idList.map(id => parseInt(id)).filter(id => !isNaN(id));
    if (safeIds.length === 0) {
      req.session.message = { type: 'error', text: 'ID guru tidak valid.' };
      return res.redirect('/admin/guru');
    }

    const placeholders = safeIds.map(() => '?').join(',');
    await db.query(
      `UPDATE guru SET guru_password = ? WHERE id IN (${placeholders})`,
      [hashed, ...safeIds]
    );

    req.session.message = {
      type: 'success',
      text: `Password berhasil direset untuk ${safeIds.length} guru menjadi "${passwordPlain}".`
    };
    res.redirect('/admin/guru');
  } catch (err) {
    console.error('Reset password massal error:', err);
    req.session.message = { type: 'error', text: 'Gagal reset password: ' + err.message };
    res.redirect('/admin/guru');
  }
};


exports.exportExcel = async (req, res) => {
  try {
    const [guru] = await db.query(
      'SELECT nip, nama, jenis_kelamin, mata_pelajaran, jabatan, email, telepon, alamat, guru_username, guru_password FROM guru ORDER BY nama ASC'
    );

    // Password disimpan sebagai bcrypt hash sehingga tidak bisa dibaca kembali.
    // - Guru yang belum punya password → tampilkan "Guru@1234" (password default)
    // - Guru yang sudah punya password → tampilkan "Guru@1234" sebagai saran reset,
    //   kolom Keterangan akan menandai bahwa password sebelumnya sudah pernah diset.
    // Saat import ulang, kolom Password ini akan diproses dan di-hash ulang.
    const DEFAULT_PASSWORD = 'Guru@1234';

    const data = guru.length > 0
      ? guru.map((g, i) => ({
          No: i + 1,
          NIP: g.nip || '',
          Nama: g.nama,
          'Jenis Kelamin': g.jenis_kelamin || '',
          'Mata Pelajaran': g.mata_pelajaran || '',
          Jabatan: g.jabatan || '',
          Email: g.email || '',
          Telepon: g.telepon || '',
          Alamat: g.alamat || '',
          Username: g.guru_username || '',
          Password: DEFAULT_PASSWORD,
          Keterangan: g.guru_password ? 'Password lama akan direset jika diimport' : 'Belum punya password'
        }))
      : [{
          No: '', NIP: '', Nama: '', 'Jenis Kelamin': '', 'Mata Pelajaran': '',
          Jabatan: '', Email: '', Telepon: '', Alamat: '', Username: '', Password: '', Keterangan: ''
        }];

    const ws = XLSX.utils.json_to_sheet(data);

    // Atur lebar kolom agar lebih mudah dibaca
    ws['!cols'] = [
      { wch: 5 },  // No
      { wch: 20 }, // NIP
      { wch: 30 }, // Nama
      { wch: 12 }, // Jenis Kelamin
      { wch: 25 }, // Mata Pelajaran
      { wch: 20 }, // Jabatan
      { wch: 30 }, // Email
      { wch: 15 }, // Telepon
      { wch: 40 }, // Alamat
      { wch: 20 }, // Username
      { wch: 15 }, // Password
      { wch: 40 }, // Keterangan
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Guru & Staff');
    const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="data-guru.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buf);
  } catch (err) {
    console.error(err);
    res.status(500).send('Gagal export data');
  }
};

// Download template kosong dengan header
exports.downloadTemplate = (req, res) => {
  // Kolom harus sama persis dengan hasil export agar file export bisa langsung diimport
  const data = [
    {
      No: 1,
      NIP: '198001012005011001',
      Nama: 'Contoh Nama Guru',
      'Jenis Kelamin': 'L', // L = Laki-laki, P = Perempuan
      'Mata Pelajaran': 'Matematika',
      Jabatan: 'Guru',
      Email: 'guru@sekolah.sch.id',
      Telepon: '08123456789',
      Alamat: 'Jl. Contoh No. 1, Kota',
      Username: 'budi.santoso',
      Password: 'Guru@1234', // Isi password yang diinginkan, kosongkan untuk tidak mengubah
      Keterangan: '' // Kolom ini diabaikan saat import
    }
  ];

  const ws = XLSX.utils.json_to_sheet(data);

  // Atur lebar kolom agar mudah dibaca
  ws['!cols'] = [
    { wch: 5 },  // No
    { wch: 20 }, // NIP
    { wch: 30 }, // Nama
    { wch: 12 }, // Jenis Kelamin
    { wch: 25 }, // Mata Pelajaran
    { wch: 20 }, // Jabatan
    { wch: 30 }, // Email
    { wch: 15 }, // Telepon
    { wch: 40 }, // Alamat
    { wch: 20 }, // Username
    { wch: 15 }, // Password
    { wch: 40 }, // Keterangan
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Guru & Staff');
  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', 'attachment; filename="template-import-guru.xlsx"');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
};

// Import guru dari Excel
exports.importExcel = (req, res) => {
  console.log('📥 Import request received, session:', req.session?.userId ? 'authenticated' : 'not authenticated');
  multerExcel(req, res, async (err) => {
    console.log('📥 Multer callback, err:', err, 'file:', req.file ? req.file.originalname : 'none');
    if (err) {
      console.error('Multer error:', err);
      req.session.message = { type: 'error', text: 'Gagal upload file: ' + err.message };
      return res.redirect('/admin/data-sekolah?tab=guru');
    }
    if (!req.file) {
      req.session.message = { type: 'error', text: 'Tidak ada file yang dipilih.' };
      return res.redirect('/admin/data-sekolah?tab=guru');
    }
    try {
      const wb = XLSX.read(req.file.buffer, { type: 'buffer' });
      const ws = wb.Sheets[wb.SheetNames[0]];

      // Coba baca dengan header dulu
      const rowsWithHeader = XLSX.utils.sheet_to_json(ws, { defval: '' });
      console.log('📥 Rows parsed:', rowsWithHeader.length, 'Sample keys:', rowsWithHeader[0] ? Object.keys(rowsWithHeader[0]) : 'none');

      // Deteksi apakah ada header yang benar
      const firstKeys = rowsWithHeader[0] ? Object.keys(rowsWithHeader[0]) : [];
      const hasProperHeader = firstKeys.some(k =>
        ['nama', 'Nama', 'NAMA', 'name', 'Name'].includes(k)
      );

      let rows;
      if (hasProperHeader) {
        rows = rowsWithHeader;
      } else {
        // Tidak ada header — baca sebagai array dan mapping manual
        // Format: kolom A=Nama, B=NIP, C=Jabatan, D=Mata Pelajaran, E=Email, F=Telepon
        const rawRows = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' });
        rows = rawRows
          .filter(r => r[0] && r[0].toString().trim()) // skip baris kosong
          .map(r => ({
            'Nama': r[0] || '',
            'NIP': r[1] || '',
            'Jabatan': r[2] || 'Guru',
            'Mata Pelajaran': r[3] || '',
            'Email': r[4] || '',
            'Telepon': r[5] || ''
          }));
        console.log('📥 No header detected, using positional mapping. Rows:', rows.length);
      }

      let inserted = 0, updated = 0, skipped = 0;
      const bcrypt = require('bcryptjs');
      for (const row of rows) {
        const nama = (row['Nama'] || row['nama'] || row['NAMA'] || row['Nama Lengkap'] || '').toString().trim();
        if (!nama) { skipped++; continue; }

        const nip = (row['NIP'] || row['nip'] || row['Nip'] || '').toString().trim() || null;
        const mata_pelajaran = (row['Mata Pelajaran'] || row['mata_pelajaran'] || row['Mapel'] || '').toString().trim();
        const jabatan = (row['Jabatan'] || row['jabatan'] || 'Guru').toString().trim();
        const email = (row['Email'] || row['email'] || '').toString().trim() || null;
        const telepon = (row['Telepon'] || row['telepon'] || row['No HP'] || '').toString().trim() || null;
        const alamat = (row['Alamat'] || row['alamat'] || '').toString().trim() || null;
        const jenis_kelamin_raw = (row['Jenis Kelamin'] || row['jenis_kelamin'] || row['JK'] || '').toString().trim().toUpperCase();
        const jenis_kelamin = ['L', 'P'].includes(jenis_kelamin_raw) ? jenis_kelamin_raw : null;
        const username = (row['Username'] || row['username'] || '').toString().trim() || null;
        const passwordRaw = (row['Password'] || row['password'] || '').toString().trim();
        const hashedPassword = passwordRaw ? await bcrypt.hash(passwordRaw, 10) : null;

        // Cari guru existing by NIP dulu, fallback by nama
        let existing = [];
        if (nip) {
          [existing] = await db.query('SELECT id FROM guru WHERE nip = ?', [nip]);
        }
        if (!existing.length) {
          [existing] = await db.query('SELECT id FROM guru WHERE nama = ?', [nama]);
        }

        if (existing.length > 0) {
          // Update — semua kolom yang ada di file akan di-update
          let updateFields = 'nama=?, mata_pelajaran=?, jabatan=?, email=?, telepon=?';
          const updateVals = [nama, mata_pelajaran, jabatan, email, telepon];

          if (nip !== null) { updateFields += ', nip=?'; updateVals.push(nip); }
          if (jenis_kelamin) { updateFields += ', jenis_kelamin=?'; updateVals.push(jenis_kelamin); }
          if (alamat !== null) { updateFields += ', alamat=?'; updateVals.push(alamat); }
          if (username) { updateFields += ', guru_username=?'; updateVals.push(username); }
          if (hashedPassword) { updateFields += ', guru_password=?'; updateVals.push(hashedPassword); }

          await db.query(`UPDATE guru SET ${updateFields} WHERE id=?`, [...updateVals, existing[0].id]);
          updated++;
        } else {
          await db.query(
            'INSERT INTO guru (nip, nama, jenis_kelamin, mata_pelajaran, jabatan, email, telepon, alamat, guru_username, guru_password) VALUES (?,?,?,?,?,?,?,?,?,?)',
            [nip, nama, jenis_kelamin, mata_pelajaran, jabatan, email, telepon, alamat, username, hashedPassword]
          );
          inserted++;
        }
      }
      req.session.message = { type: 'success', text: `Import berhasil! ${inserted} ditambahkan, ${updated} diupdate, ${skipped} dilewati.` };
      res.redirect('/admin/data-sekolah?tab=guru');
    } catch (e) {
      console.error('Import error:', e);
      req.session.message = { type: 'error', text: 'Gagal import: ' + e.message };
      res.redirect('/admin/data-sekolah?tab=guru');
    }
  });
};
