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
    const fields = ['theme_mode','primary_color','secondary_color','navbar_bg','footer_bg','font_family','border_radius','hero_style'];
    for (const key of fields) {
      const value = req.body[key];
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
    const fontFamily = settings.font_family || 'Inter';
    const borderRadius = settings.border_radius || '16';
    const heroStyle = settings.hero_style || 'gradient';

    const isDark = mode === 'dark';
    const bodyBg = isDark ? '#0f172a' : '#ffffff';
    const bodyColor = isDark ? '#e2e8f0' : '#334155';
    const cardBg = isDark ? '#1e293b' : '#ffffff';
    const gray50 = isDark ? '#1e293b' : '#f8fafc';
    const gray100 = isDark ? '#334155' : '#f1f5f9';
    const navbarColor = isDark ? '#e2e8f0' : '#334155';

    // Derive lighter/darker variants
    const primaryLight = primary + '22';
    const primaryMid = primary + '44';

    const css = `
@import url('https://fonts.googleapis.com/css2?family=${fontFamily.replace(/ /g,'+')}:wght@300;400;500;600;700;800&display=swap');
:root {
  --primary-blue: ${primary};
  --primary-blue-dark: ${secondary};
  --primary-blue-light: ${primary}cc;
  --secondary-blue: ${secondary};
  --accent-blue: ${primary}99;
  --light-blue: ${primaryLight};
  --dark-blue: ${secondary};
  --gray-50: ${gray50};
  --gray-100: ${gray100};
  --body-bg: ${bodyBg};
  --body-color: ${bodyColor};
  --card-bg: ${cardBg};
  --navbar-bg: ${navbarBg};
  --footer-bg: ${footerBg};
  --border-radius-card: ${borderRadius}px;
  --font-main: '${fontFamily}', sans-serif;
}
/* Hanya override font untuk elemen teks, BUKAN icon font */
body, p, h1, h2, h3, h4, h5, h6, span:not(.fa):not(.fas):not(.far):not(.fab):not(.fal), a, div, li, td, th, label, input, textarea, select, button {
  font-family: var(--font-main) !important;
}
body { background-color: ${bodyBg} !important; color: ${bodyColor} !important; }
.navbar-modern { background: ${navbarBg}f5 !important; backdrop-filter: blur(12px); }
.footer { background: ${footerBg} !important; }
.news-card, .feature-card, .stat-card { background: ${cardBg} !important; border-radius: var(--border-radius-card) !important; }
.stats-section, .news-section { background: ${gray50} !important; }
.features-section, .gallery-section { background: ${cardBg} !important; }
.btn-primary { background: ${primary} !important; border-color: ${primary} !important; }
.btn-primary:hover { background: ${secondary} !important; border-color: ${secondary} !important; }
.btn-outline-primary { color: ${primary} !important; border-color: ${primary} !important; }
.btn-outline-primary:hover { background: ${primary} !important; color: white !important; }
.navbar-brand { color: ${primary} !important; }
.nav-link:hover, .nav-link.active { color: ${primary} !important; background-color: ${primaryLight} !important; }
.page-header, .hero-default, .cta-section { background: linear-gradient(135deg, ${primary} 0%, ${secondary} 100%) !important; }
.stat-number, .news-meta a { color: ${primary} !important; }
.feature-icon { background: linear-gradient(135deg, ${primary}, ${secondary}) !important; }
.news-badge { background: ${primary} !important; }
.link-terkait-header { background: ${primary} !important; }
.medsos-section { background: linear-gradient(135deg, ${secondary}dd 0%, ${primary}cc 100%) !important; }
${isDark ? `
.stat-card, .feature-card, .news-card { background: ${cardBg} !important; border-color: ${gray100} !important; }
.section-title, .feature-title, .news-title { color: #f1f5f9 !important; }
.section-subtitle, .feature-desc, .news-excerpt { color: #94a3b8 !important; }
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
