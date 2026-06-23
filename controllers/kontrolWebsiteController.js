const db = require('../config/database');
const cache = require('../utils/cache');

const invalidateSettingsCache = () => {
  cache.del('website_settings');
  cache.del('maintenance_mode');
};

const getSettings = async () => {
  const cached = cache.get('website_settings');
  if (cached) return cached;
  const [rows] = await db.query('SELECT setting_key, setting_value FROM website_settings');
  const s = {};
  rows.forEach(r => { s[r.setting_key] = r.setting_value; });
  cache.set('website_settings', s, 300);
  return s;
};

exports.getSettings = getSettings;
exports.invalidateSettingsCache = invalidateSettingsCache;

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
    const fields = ['theme_mode','primary_color','secondary_color','navbar_bg','footer_bg','font_family','border_radius','hero_style','hero_bg_style'];
    for (const key of fields) {
      const value = req.body[key];
      if (value) {
        await db.query(
          'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
    }
    invalidateSettingsCache();
    res.redirect('/admin/kontrol-website?tab=tampilan&success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.saveEditorial = async (req, res) => {
  try {
    const fields = ['footer_tagline','footer_copyright_suffix','footer_label','ticker_items'];
    for (const key of fields) {
      const value = req.body[key] !== undefined ? req.body[key] : '';
      await db.query(
        'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    invalidateSettingsCache();
    res.redirect('/admin/kontrol-website?tab=editorial&success=1');
  } catch (err) {
    console.error(err);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.saveStats = async (req, res) => {
  try {
    const fields = [
      'stat1_value','stat1_suffix','stat1_label',
      'stat2_value','stat2_suffix','stat2_label',
      'stat3_value','stat3_suffix','stat3_label',
      'stat4_value','stat4_suffix','stat4_label',
    ];
    for (const key of fields) {
      const value = req.body[key] !== undefined ? req.body[key] : '';
      await db.query(
        'INSERT INTO website_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
        [key, value, value]
      );
    }
    invalidateSettingsCache();
    res.redirect('/admin/kontrol-website?tab=statistik&success=1');
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
    invalidateSettingsCache();
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
    const heroBgStyle = settings.hero_bg_style || 'dark-space';

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

    // Hero background styles
    const heroBgMap = {
      'dark-space': `background: linear-gradient(135deg, #0f0c29 0%, #302b63 40%, #24243e 100%);`,
      'light-aurora': `background: linear-gradient(135deg, #e0f2fe 0%, #f0fdf4 40%, #fdf4ff 100%);`,
      'soft-blue': `background: linear-gradient(135deg, #dbeafe 0%, #ede9fe 50%, #e0f2fe 100%);`,
      'warm-sunrise': `background: linear-gradient(135deg, #fff7ed 0%, #fef3c7 40%, #fce7f3 100%);`,
      'mint-fresh': `background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 40%, #e0f2fe 100%);`,
      'royal-purple': `background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1e1b4b 100%);`,
      'ocean-deep': `background: linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%);`,
      'rose-gold': `background: linear-gradient(135deg, #fff1f2 0%, #fce7f3 40%, #fdf4ff 100%);`,
      'custom-primary': `background: linear-gradient(135deg, ${secondary} 0%, ${primary} 100%);`,
    };

    const heroTextMap = {
      'dark-space': 'light',
      'light-aurora': 'dark',
      'soft-blue': 'dark',
      'warm-sunrise': 'dark',
      'mint-fresh': 'dark',
      'royal-purple': 'light',
      'ocean-deep': 'light',
      'rose-gold': 'dark',
      'custom-primary': 'light',
    };

    const heroBgCss = heroBgMap[heroBgStyle] || heroBgMap['dark-space'];
    const heroTextMode = heroTextMap[heroBgStyle] || 'light';

    // Light hero text overrides
    const heroLightOverrides = heroTextMode === 'dark' ? `
.hero-default { ${heroBgCss} }
.hero-title-main { color: #1e293b !important; text-shadow: none !important; }
.hero-desc-main { color: #475569 !important; }
.hero-eyebrow { background: rgba(0,0,0,.07) !important; border-color: rgba(0,0,0,.12) !important; color: #334155 !important; }
.hero-card-float { background: rgba(255,255,255,.7) !important; border-color: rgba(0,0,0,.1) !important; backdrop-filter: blur(12px); }
.hero-card-label { color: #64748b !important; }
.hero-card-value { color: #1e293b !important; }
.hero-orb-1 { background: rgba(99,102,241,.2) !important; }
.hero-orb-2 { background: rgba(14,165,233,.15) !important; }
.hero-orb-3 { background: rgba(236,72,153,.12) !important; }
.hero-orb-4 { background: rgba(16,185,129,.1) !important; }
.hero-grid { background-image: linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px) !important; }
.btn-hero-outline { background: rgba(0,0,0,.06) !important; border-color: rgba(0,0,0,.2) !important; color: #1e293b !important; }
.btn-hero-outline:hover { background: rgba(0,0,0,.12) !important; color: #1e293b !important; }
.hero-scroll-hint { color: rgba(0,0,0,.4) !important; }
.scroll-mouse { border-color: rgba(0,0,0,.25) !important; }
.scroll-wheel { background: rgba(0,0,0,.4) !important; }
.gradient-text { background: linear-gradient(135deg, ${primary}, ${secondary}, #6366f1) !important; -webkit-background-clip: text !important; -webkit-text-fill-color: transparent !important; background-clip: text !important; }
` : `
.hero-default { ${heroBgCss} }
`;

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
.footer-title { color: white !important; }
.footer-link { color: rgba(255,255,255,.75) !important; }
.footer-link:hover { color: white !important; }
.news-card, .stat-card { background: ${cardBg} !important; border-radius: var(--border-radius-card) !important; }
.feature-card { border-radius: var(--border-radius-card) !important; }
.feature-card-blue, .feature-card-indigo, .feature-card-amber { background: ${primary} !important; box-shadow: 0 8px 32px ${primary}55 !important; border: none !important; }
.feature-card-blue:hover, .feature-card-indigo:hover, .feature-card-amber:hover { background: ${secondary} !important; }
.feature-card-blue .feature-title, .feature-card-indigo .feature-title, .feature-card-amber .feature-title { color: #fff !important; }
.feature-card-blue .feature-desc, .feature-card-indigo .feature-desc, .feature-card-amber .feature-desc { color: rgba(255,255,255,.88) !important; }
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
.feature-icon { background: rgba(255,255,255,.25) !important; box-shadow: none !important; }
.news-badge { background: ${primary} !important; }
.link-terkait-header { background: ${primary} !important; }
.medsos-section { background: linear-gradient(135deg, ${secondary}dd 0%, ${primary}cc 100%) !important; }
${heroLightOverrides}
${isDark ? `
.stat-card, .news-card { background: ${cardBg} !important; border-color: ${gray100} !important; }
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
