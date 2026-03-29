const db = require('../config/database');

const getSettings = async () => {
  const [rows] = await db.query('SELECT setting_key, setting_value FROM website_settings');
  const s = {};
  rows.forEach(r => { s[r.setting_key] = r.setting_value; });
  return s;
};

exports.getSettings = getSettings;

exports.index = async (req, res) => {
  const activeTab = req.query.tab || 'halaman';
  try {
    const [halaman] = await db.query('SELECT * FROM halaman ORDER BY created_at DESC');
    const [menus] = await db.query('SELECT * FROM menu_navigasi ORDER BY urutan ASC, id ASC');
    const parents = menus.filter(r => r.parent_id === null);
    parents.forEach(p => {
      p.children = menus.filter(r => r.parent_id === p.id);
      p.children.forEach(c => {
        c.children = menus.filter(r => r.parent_id === c.id);
      });
    });
    const [users] = await db.query('SELECT id, username, nama_lengkap, email, role, created_at FROM users ORDER BY created_at DESC');
    const settings = await getSettings();

    res.render('admin/kontrol-website', {
      title: 'Kontrol Website',
      user: req.session,
      activeTab,
      halaman,
      menus: parents,
      users,
      settings,
      success: req.query.success
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.saveTampilan = async (req, res) => {
  try {
    const { theme_mode, primary_color, secondary_color, navbar_bg, footer_bg } = req.body;
    const updates = { theme_mode, primary_color, secondary_color, navbar_bg, footer_bg };
    for (const [key, value] of Object.entries(updates)) {
      if (value) {
        await db.query(
          'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
    }
    res.redirect('/admin/kontrol-website?tab=tampilan&success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.toggleMaintenance = async (req, res) => {
  try {
    const settings = await getSettings();
    const current = settings.maintenance_mode || '0';
    const newVal = current === '1' ? '0' : '1';
    await db.query(
      'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      ['maintenance_mode', newVal, newVal]
    );
    res.redirect('/admin/kontrol-website?tab=tampilan&success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.themeCss = async (req, res) => {
  try {
    const settings = await getSettings();
    const mode = settings.theme_mode || 'light';
    const primary = settings.primary_color || '#0ea5e9';
    const secondary = settings.secondary_color || '#0369a1';
    const navbarBg = settings.navbar_bg || '#ffffff';
    const footerBg = settings.footer_bg || '#0f172a';

    // Derive dark variants
    const isDark = mode === 'dark';
    const bodyBg = isDark ? '#0f172a' : '#ffffff';
    const bodyColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const gray50 = isDark ? '#1e293b' : '#f8fafc';
    const gray100 = isDark ? '#334155' : '#f1f5f9';
    const navbarColor = isDark ? '#e2e8f0' : '#334155';

    const css = `
:root {
  --primary-blue: ${primary};
  --primary-blue-dark: ${secondary};
  --primary-blue-light: ${primary}cc;
  --secondary-blue: ${secondary};
  --accent-blue: ${primary}99;
  --light-blue: ${primary}22;
  --dark-blue: ${secondary};
  --gray-50: ${gray50};
  --gray-100: ${gray100};
  --body-bg: ${bodyBg};
  --body-color: ${bodyColor};
  --card-bg: ${cardBg};
  --navbar-bg: ${navbarBg};
  --footer-bg: ${footerBg};
}
body { background-color: ${bodyBg} !important; color: ${bodyColor} !important; }
.navbar-modern { background: ${navbarBg} !important; }
.footer { background: ${footerBg} !important; }
.card-modern { background: ${cardBg} !important; }
.content-section { background: ${gray50} !important; }
.btn-primary { background: ${primary} !important; border-color: ${primary} !important; }
.btn-primary:hover { background: ${secondary} !important; border-color: ${secondary} !important; }
.navbar-brand { color: ${primary} !important; }
.nav-link:hover, .nav-link.active { color: ${primary} !important; background-color: ${primary}22 !important; }
.page-header { background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%) !important; }
${isDark ? `
section { background-color: ${bodyBg} !important; }
h1,h2,h3,h4,h5,h6,p,span,a { color: ${bodyColor}; }
.text-muted { color: #94a3b8 !important; }
.nav-link { color: ${navbarColor} !important; }
` : ''}
`;

    res.setHeader('Content-Type', 'text/css');
    res.setHeader('Cache-Control', 'no-cache');
    res.send(css);
  } catch (err) {
    res.setHeader('Content-Type', 'text/css');
    res.send('');
  }
};
