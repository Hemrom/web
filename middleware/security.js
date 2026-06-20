const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Rate limiter umum
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1500,
  message: 'Terlalu banyak request, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    // Skip static assets — tidak perlu di-rate-limit
    if (/^\/(assets|uploads|public)\//.test(req.path)) return true;
    const ip = req.ip || req.connection?.remoteAddress || '';
    return ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  }
});

// Rate limiter ketat untuk login (anti brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Hanya hitung yang gagal
});

// Rate limiter untuk upload
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Terlalu banyak upload, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk form submission publik (kontak, dll)
const formLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: 'Terlalu banyak pengiriman form, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet config
const helmetConfig = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

// MIME type validation untuk upload gambar
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp|svg)$/i;

const imageFileFilter = (req, file, cb) => {
  const extOk = ALLOWED_EXTENSIONS.test(file.originalname);
  const mimeOk = ALLOWED_MIME_TYPES.includes(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  cb(new Error('Hanya file gambar yang diizinkan (jpg, png, gif, webp, svg)'));
};

module.exports = {
  generalLimiter,
  loginLimiter,
  uploadLimiter,
  formLimiter,
  helmetConfig,
  hpp,
  imageFileFilter
};
