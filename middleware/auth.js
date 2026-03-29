const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.userId) {
    // Regenerate session ID secara berkala untuk mencegah session fixation
    return next();
  }
  // Jika AJAX request, kirim 401
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.status(401).json({ error: 'Tidak terautentikasi' });
  }
  res.redirect('/admin/login');
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.userId && req.session.role === 'admin') {
    return next();
  }
  res.status(403).render('frontend/404', { title: 'Akses Ditolak' });
};

module.exports = { isAuthenticated, isAdmin };
