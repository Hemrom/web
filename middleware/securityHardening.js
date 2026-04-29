const xss = require('xss');
const { validationResult } = require('express-validator');

// XSS Sanitization Middleware
const xssSanitize = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Sanitize tapi jangan terlalu agresif untuk konten HTML editor
        if (key === 'konten' || key === 'deskripsi' || key === 'deskripsi_lengkap') {
          // Untuk konten HTML, allow beberapa tag aman
          req.body[key] = xss(req.body[key], {
            whiteList: {
              p: ['style'], div: ['style'], span: ['style'],
              h1: [], h2: [], h3: [], h4: [], h5: [], h6: [],
              strong: [], em: [], u: [], s: [],
              ul: [], ol: [], li: [],
              a: ['href', 'target', 'rel'],
              img: ['src', 'alt', 'style', 'width', 'height'],
              br: [], hr: [],
              table: ['style'], thead: [], tbody: [], tr: [], th: [], td: ['colspan', 'rowspan'],
              blockquote: [], pre: [], code: []
            }
          });
        } else {
          // Untuk field lain, strip semua HTML
          req.body[key] = xss(req.body[key], { whiteList: {} });
        }
      }
    });
  }
  next();
};

// Validation Error Handler
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array().map(e => ({ field: e.param, message: e.msg }))
    });
  }
  next();
};

// Session Regeneration after login
const regenerateSession = (req) => {
  return new Promise((resolve, reject) => {
    const oldSession = { ...req.session };
    req.session.regenerate((err) => {
      if (err) return reject(err);
      // Restore session data
      Object.assign(req.session, oldSession);
      resolve();
    });
  });
};

// Input Length Limiter
const limitInputLength = (maxLength = 10000) => (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string' && req.body[key].length > maxLength) {
        return res.status(400).json({ 
          success: false, 
          error: `Field ${key} terlalu panjang (max ${maxLength} karakter)` 
        });
      }
    });
  }
  next();
};

// Secure Headers Middleware
const secureHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
};

// SQL Injection Prevention - Validate ID parameters
const validateIdParam = (req, res, next) => {
  const id = req.params.id;
  if (id && !/^\d+$/.test(id)) {
    return res.status(400).json({ success: false, error: 'Invalid ID format' });
  }
  next();
};

// Slug validation — cegah path traversal dan injection
const validateSlugParam = (req, res, next) => {
  const slug = req.params.slug;
  if (slug && !/^[a-z0-9-]+$/.test(slug)) {
    return res.status(400).send('Invalid request');
  }
  next();
};

// Tipe param validation (untuk profil konten)
const ALLOWED_TIPE = new Set(['visi_misi', 'sejarah', 'sambutan']);
const validateTipeParam = (req, res, next) => {
  if (!ALLOWED_TIPE.has(req.params.tipe)) {
    return res.status(400).send('Invalid request');
  }
  next();
};

module.exports = {
  xssSanitize,
  handleValidationErrors,
  regenerateSession,
  limitInputLength,
  secureHeaders,
  validateIdParam,
  validateSlugParam,
  validateTipeParam
};
