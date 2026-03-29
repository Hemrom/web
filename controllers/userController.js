const db = require('../config/database');
const bcrypt = require('bcryptjs');

exports.index = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, username, nama_lengkap, email, role, created_at FROM users ORDER BY created_at DESC');
    res.render('admin/users/index', { title: 'Manajemen User', user: req.session, users, success: req.query.success });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.createPage = (req, res) => {
  res.render('admin/users/create', { title: 'Tambah User', user: req.session, error: null });
};

exports.create = async (req, res) => {
  try {
    const { username, password, nama_lengkap, email, role } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await db.query(
      'INSERT INTO users (username, password, nama_lengkap, email, role) VALUES (?, ?, ?, ?, ?)',
      [username, hash, nama_lengkap, email || null, role]
    );
    res.redirect('/admin/kontrol-website?tab=users&success=1');
  } catch (error) {
    const msg = error.code === 'ER_DUP_ENTRY' ? 'Username sudah digunakan' : 'Terjadi kesalahan';
    res.render('admin/users/create', { title: 'Tambah User', user: req.session, error: msg });
  }
};

exports.editPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT id, username, nama_lengkap, email, role FROM users WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).send('User tidak ditemukan');
    res.render('admin/users/edit', { title: 'Edit User', user: req.session, editUser: rows[0], error: null });
  } catch (error) {
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = async (req, res) => {
  try {
    const { username, password, nama_lengkap, email, role } = req.body;
    if (password && password.trim() !== '') {
      const hash = await bcrypt.hash(password, 10);
      await db.query(
        'UPDATE users SET username=?, password=?, nama_lengkap=?, email=?, role=? WHERE id=?',
        [username, hash, nama_lengkap, email || null, role, req.params.id]
      );
    } else {
      await db.query(
        'UPDATE users SET username=?, nama_lengkap=?, email=?, role=? WHERE id=?',
        [username, nama_lengkap, email || null, role, req.params.id]
      );
    }
    res.redirect('/admin/kontrol-website?tab=users&success=1');
  } catch (error) {
    const [rows] = await db.query('SELECT id, username, nama_lengkap, email, role FROM users WHERE id = ?', [req.params.id]);
    const msg = error.code === 'ER_DUP_ENTRY' ? 'Username sudah digunakan' : 'Terjadi kesalahan';
    res.render('admin/users/edit', { title: 'Edit User', user: req.session, editUser: rows[0], error: msg });
  }
};

exports.delete = async (req, res) => {
  try {
    if (parseInt(req.params.id) === req.session.userId) {
      return res.redirect('/admin/kontrol-website?tab=users');
    }
    await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
    res.redirect('/admin/kontrol-website?tab=users&success=1');
  } catch (error) {
    res.status(500).send('Terjadi kesalahan');
  }
};
