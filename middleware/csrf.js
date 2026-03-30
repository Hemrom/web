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

  // Skip untuk multipart/form-data (upload file) — dilindungi isAuthenticated
  const contentType = req.headers['content-type'] || '';
  if (contentType.includes('multipart/form-data')) return next();

  // Cek dari berbagai sumber: body, header, atau query
  const tokenFromBody = req.body ? req.body._csrf : null;
  const tokenFromHeader = req.headers['x-csrf-token'];
  const tokenFromQuery = req.query._csrf;
  const tokenFromRequest = tokenFromBody || tokenFromHeader || tokenFromQuery;
  const tokenFromSession = req.session.csrfToken;

  if (!tokenFromRequest || !tokenFromSession || tokenFromRequest !== tokenFromSession) {
    return res.status(403).json({ 
      success: false, 
      error: 'CSRF token tidak valid. Refresh halaman dan coba lagi.' 
    });
  }
  next();
};

module.exports = { csrfMiddleware, csrfProtect };
