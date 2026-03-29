const db = require('../config/database');
const cbtDb = require('../config/database-cbt');
const multer = require('multer');
const path = require('path');
const XLSX = require('xlsx');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'guru-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('foto');
const multerExcel = multer({ storage: multer.memoryStorage() }).single('file');

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
    
    try {
      const { nip, nama, mata_pelajaran, jabatan, email, telepon } = req.body;
      const foto = req.file ? req.file.filename : null;
      
      await db.query(
        'INSERT INTO guru (nip, nama, foto, mata_pelajaran, jabatan, email, telepon) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [nip, nama, foto, mata_pelajaran, jabatan, email, telepon]
      );
      
      res.redirect('/admin/data-sekolah?tab=guru');
    } catch (error) {
      console.error(error);
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
      guru: guru[0]
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
    
    try {
      const { nip, nama, mata_pelajaran, jabatan, email, telepon } = req.body;
      const foto = req.file ? req.file.filename : null;
      
      if (foto) {
        await db.query(
          'UPDATE guru SET nip = ?, nama = ?, foto = ?, mata_pelajaran = ?, jabatan = ?, email = ?, telepon = ? WHERE id = ?',
          [nip, nama, foto, mata_pelajaran, jabatan, email, telepon, req.params.id]
        );
      } else {
        await db.query(
          'UPDATE guru SET nip = ?, nama = ?, mata_pelajaran = ?, jabatan = ?, email = ?, telepon = ? WHERE id = ?',
          [nip, nama, mata_pelajaran, jabatan, email, telepon, req.params.id]
        );
      }
      
      res.redirect('/admin/data-sekolah?tab=guru');
    } catch (error) {
      console.error(error);
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

// Export guru ke Excel
exports.exportExcel = async (req, res) => {
  try {
    const [guru] = await db.query('SELECT nip, nama, mata_pelajaran, jabatan, email, telepon FROM guru ORDER BY nama ASC');
    const data = guru.length > 0
      ? guru.map((g, i) => ({
          No: i + 1,
          NIP: g.nip || '',
          Nama: g.nama,
          'Mata Pelajaran': g.mata_pelajaran || '',
          Jabatan: g.jabatan || '',
          Email: g.email || '',
          Telepon: g.telepon || ''
        }))
      : [{ No: '', NIP: '', Nama: '', 'Mata Pelajaran': '', Jabatan: '', Email: '', Telepon: '' }];
    const ws = XLSX.utils.json_to_sheet(data);
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
  const data = [
    { No: 1, NIP: '198001012005011001', Nama: 'Contoh Nama Guru', 'Mata Pelajaran': 'Matematika', Jabatan: 'Guru', Email: 'guru@sekolah.sch.id', Telepon: '08123456789' }
  ];
  const ws = XLSX.utils.json_to_sheet(data);
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
      for (const row of rows) {
        const nama = (row['Nama'] || row['nama'] || row['NAMA'] || row['Nama Lengkap'] || '').toString().trim();
        if (!nama) { skipped++; continue; }

        const nip = (row['NIP'] || row['nip'] || row['Nip'] || '').toString().trim() || null;
        const mata_pelajaran = (row['Mata Pelajaran'] || row['mata_pelajaran'] || row['Mapel'] || '').toString().trim();
        const jabatan = (row['Jabatan'] || row['jabatan'] || 'Guru').toString().trim();
        const email = (row['Email'] || row['email'] || '').toString().trim() || null;
        const telepon = (row['Telepon'] || row['telepon'] || row['No HP'] || '').toString().trim() || null;

        if (nip) {
          const [ex] = await db.query('SELECT id FROM guru WHERE nip = ?', [nip]);
          if (ex.length > 0) {
            await db.query('UPDATE guru SET nama=?, mata_pelajaran=?, jabatan=?, email=?, telepon=? WHERE nip=?',
              [nama, mata_pelajaran, jabatan, email, telepon, nip]);
            updated++;
          } else {
            await db.query('INSERT INTO guru (nip, nama, mata_pelajaran, jabatan, email, telepon) VALUES (?,?,?,?,?,?)',
              [nip, nama, mata_pelajaran, jabatan, email, telepon]);
            inserted++;
          }
        } else {
          await db.query('INSERT INTO guru (nama, mata_pelajaran, jabatan, email, telepon) VALUES (?,?,?,?,?)',
            [nama, mata_pelajaran, jabatan, email, telepon]);
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
