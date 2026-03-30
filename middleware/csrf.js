const crypto = require('crypto');

// Simple CSRF protection tanpa library deprecated
// Menggunakan Double Submit Cookie pattern

const generateToken = () => crypto.randomBytes(32).toString('hex');

// Middleware: generate CSRF token dan simpan di session
const csrfMiddleware = (req, res, next) => {
  if (!req.session.csrfToken) {
    req.session.csrfToken = generateToken();
  }
  // Expose ke semua views via res.locals
  res.locals.csrfToken = req.session.csrfToken;
  next();
};

// Middleware: validasi CSRF token untuk POST/PUT/DELETE
const csrfProtect = (req, res, next) => {
  // Skip untuk GET, HEAD, OPTIONS
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  const tokenFromBody = req.body._csrf || req.headers['x-csrf-token'];
  const tokenFromSession = req.session.csrfToken;

  if (!tokenFromBody || !tokenFromSession || tokenFromBody !== tokenFromSession) {
    return res.status(403).json({ 
      success: false, 
      error: 'CSRF token tidak valid. Refresh halaman dan coba lagi.' 
    });
  }
  next();
};

module.exports = { csrfMiddleware, csrfProtect };
