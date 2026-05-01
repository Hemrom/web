const isPortalAuth = (role) => (req, res, next) => {
  if (req.session && req.session.portalId && req.session.portalRole === role) return next();
  res.redirect(`/${role}/login`);
};

const isBKK = isPortalAuth('bkk');
const isOSIS = isPortalAuth('osis');
const isPramuka = isPortalAuth('pramuka');
const isOlahraga = isPortalAuth('olahraga');
const isPaskibraka = isPortalAuth('paskibraka');
const isSeni = isPortalAuth('seni');
const isBahasaAsing = (req, res, next) => {
  if (req.session && req.session.portalId && req.session.portalRole === 'bahasa_asing') return next();
  res.redirect('/bahasa-asing/login');
};
const isJurusan = (req, res, next) => {
  if (req.session && req.session.portalId && req.session.portalRole === 'jurusan') return next();
  res.redirect('/jurusan-portal/login');
};
const isRohis = isPortalAuth('rohis');

module.exports = { isBKK, isOSIS, isJurusan, isPramuka, isOlahraga, isPaskibraka, isSeni, isBahasaAsing, isRohis };
