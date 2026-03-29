const db = require('../config/database');

// Helper: get all menus for dropdown (support nested)
const getParentMenus = async () => {
  const [rows] = await db.query('SELECT * FROM menu_navigasi ORDER BY urutan ASC, id ASC');
  return rows;
};

exports.index = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_navigasi ORDER BY urutan ASC, id ASC');
    const parents = rows.filter(r => r.parent_id === null);
    parents.forEach(p => {
      p.children = rows.filter(r => r.parent_id === p.id);
      p.children.forEach(c => {
        c.children = rows.filter(r => r.parent_id === c.id);
      });
    });
    res.render('admin/menu/index', {
      title: 'Kelola Menu',
      user: req.session,
      menus: parents,
      success: req.query.success,
      error: req.query.error
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/kontrol-website?tab=menu&error=1');
  }
};

exports.createPage = async (req, res) => {
  try {
    const parents = await getParentMenus();
    res.render('admin/menu/create', {
      title: 'Tambah Menu',
      user: req.session,
      parents,
      error: null,
      old: {}
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/kontrol-website?tab=menu&error=1');
  }
};

exports.create = async (req, res) => {
  const { label, url, parent_id, urutan, status, icon, target } = req.body;

  if (!label || !label.trim()) {
    const parents = await getParentMenus();
    return res.render('admin/menu/create', {
      title: 'Tambah Menu',
      user: req.session,
      parents,
      error: 'Label menu tidak boleh kosong.',
      old: req.body
    });
  }
  if (!url || !url.trim()) {
    const parents = await getParentMenus();
    return res.render('admin/menu/create', {
      title: 'Tambah Menu',
      user: req.session,
      parents,
      error: 'URL menu tidak boleh kosong.',
      old: req.body
    });
  }

  try {
    await db.query(
      'INSERT INTO menu_navigasi (label, url, parent_id, urutan, status, icon, target) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [
        label.trim(),
        url.trim(),
        parent_id || null,
        parseInt(urutan) || 0,
        status || 'aktif',
        icon && icon.trim() ? icon.trim() : null,
        target || '_self'
      ]
    );
    res.redirect('/admin/kontrol-website?tab=menu&success=created');
  } catch (err) {
    console.error(err);
    const parents = await getParentMenus();
    res.render('admin/menu/create', {
      title: 'Tambah Menu',
      user: req.session,
      parents,
      error: 'Terjadi kesalahan saat menyimpan menu.',
      old: req.body
    });
  }
};

exports.editPage = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_navigasi WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.redirect('/admin/kontrol-website?tab=menu&error=not_found');
    const parents = await getParentMenus();
    res.render('admin/menu/edit', {
      title: 'Edit Menu',
      user: req.session,
      menu: rows[0],
      parents,
      error: null
    });
  } catch (err) {
    console.error(err);
    res.redirect('/admin/kontrol-website?tab=menu&error=1');
  }
};

exports.update = async (req, res) => {
  const { label, url, parent_id, urutan, status, icon, target } = req.body;
  const { id } = req.params;

  if (!label || !label.trim()) {
    const [rows] = await db.query('SELECT * FROM menu_navigasi WHERE id = ?', [id]);
    const parents = await getParentMenus();
    return res.render('admin/menu/edit', {
      title: 'Edit Menu',
      user: req.session,
      menu: rows[0] || {},
      parents,
      error: 'Label menu tidak boleh kosong.'
    });
  }
  if (!url || !url.trim()) {
    const [rows] = await db.query('SELECT * FROM menu_navigasi WHERE id = ?', [id]);
    const parents = await getParentMenus();
    return res.render('admin/menu/edit', {
      title: 'Edit Menu',
      user: req.session,
      menu: rows[0] || {},
      parents,
      error: 'URL menu tidak boleh kosong.'
    });
  }

  try {
    const [existing] = await db.query('SELECT id FROM menu_navigasi WHERE id = ?', [id]);
    if (existing.length === 0) return res.redirect('/admin/kontrol-website?tab=menu&error=not_found');

    await db.query(
      'UPDATE menu_navigasi SET label=?, url=?, parent_id=?, urutan=?, status=?, icon=?, target=? WHERE id=?',
      [
        label.trim(),
        url.trim(),
        parent_id || null,
        parseInt(urutan) || 0,
        status || 'aktif',
        icon && icon.trim() ? icon.trim() : null,
        target || '_self',
        id
      ]
    );
    res.redirect('/admin/kontrol-website?tab=menu&success=updated');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/kontrol-website?tab=menu&error=1');
  }
};

exports.delete = async (req, res) => {
  try {
    const [existing] = await db.query('SELECT id FROM menu_navigasi WHERE id = ?', [req.params.id]);
    if (existing.length === 0) return res.redirect('/admin/kontrol-website?tab=menu&error=not_found');
    // CASCADE DELETE handled by FK constraint
    await db.query('DELETE FROM menu_navigasi WHERE id = ?', [req.params.id]);
    res.redirect('/admin/kontrol-website?tab=menu&success=deleted');
  } catch (err) {
    console.error(err);
    res.redirect('/admin/kontrol-website?tab=menu&error=1');
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menu_navigasi WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.json({ success: false, message: 'Menu tidak ditemukan' });
    const newStatus = rows[0].status === 'aktif' ? 'nonaktif' : 'aktif';
    await db.query('UPDATE menu_navigasi SET status = ? WHERE id = ?', [newStatus, req.params.id]);
    res.json({ success: true, status: newStatus });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: 'Terjadi kesalahan' });
  }
};
