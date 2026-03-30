const isGuruAuthenticated = (req, res, next) => {
  if (req.session && req.session.guruId) return next();
  res.redirect('/guru/login');
};

module.exports = { isGuruAuthenticated };
