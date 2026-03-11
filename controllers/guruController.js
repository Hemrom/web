const db = require('../config/database');
const cbtDb = require('../config/database-cbt');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => {
    cb(null, 'guru-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage }).single('foto');

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
  res.render('admin/guru/create', {
    title: 'Tambah Guru',
    user: req.session
  });
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
      
      res.redirect('/admin/guru');
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
      
      res.redirect('/admin/guru');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.delete = async (req, res) => {
  try {
    await db.query('DELETE FROM guru WHERE id = ?', [req.params.id]);
    res.redirect('/admin/guru');
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
    
    res.redirect('/admin/guru');
  } catch (error) {
    console.error('Error sinkronisasi CBT:', error);
    req.session.message = {
      type: 'error',
      text: 'Gagal sinkronisasi data guru dari CBT. Periksa koneksi database.'
    };
    res.redirect('/admin/guru');
  }
};
