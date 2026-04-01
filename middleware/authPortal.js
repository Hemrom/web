const isPortalAuth = (role) => (req, res, next) => {
  if (req.session && req.session.portalId && req.session.portalRole === role) return next();
  res.redirect(`/${role}/login`);
};

const isBKK = isPortalAuth('bkk');
const isOSIS = isPortalAuth('osis');
const isJurusan = (req, res, next) => {
  if (req.session && req.session.portalId && req.session.portalRole === 'jurusan') return next();
  res.redirect('/jurusan-portal/login');
};

module.exports = { isBKK, isOSIS, isJurusan };
