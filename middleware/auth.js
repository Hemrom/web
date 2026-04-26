const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    return next();
  }
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'Tidak terautentikasi' });
  }
  res.redirect('/admin/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  }
  res.status(403).render('frontend/404', { title: 'Akses Ditolak', menuItems: [] });
};

const isPengelola = (req, res, next) => {
  if (req.session && req.session.userId && ['admin', 'pengelola'].includes(req.session.role)) {
    return next();
  }
  res.status(403).render('frontend/404', { title: 'Akses Ditolak', menuItems: [] });
};

module.exports = { isAuthenticated, isAdmin, isPengelola };
