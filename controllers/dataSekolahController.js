const db = require('../config/database');

exports.index = async (req, res) => {
  const activeTab = req.query.tab || 'guru';
  try {
    const [guru] = await db.query('SELECT * FROM guru ORDER BY nama ASC');
    const [siswa] = await db.query('SELECT * FROM siswa ORDER BY nama ASC');
    const [jurusan] = await db.query('SELECT * FROM jurusan ORDER BY kode ASC');

    res.render('admin/data-sekolah', {
      title: 'Data Sekolah',
      user: req.session,
      activeTab,
      guru,
      siswa,
      jurusan,
      success: req.query.success,
      error: req.query.error || null,
      message: req.session.message || null
    });
    delete req.session.message;
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};
