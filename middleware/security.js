const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');

// Rate limiter umum
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 200,
  message: 'Terlalu banyak request, coba lagi nanti.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter ketat untuk login (anti brute force)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: 'Terlalu banyak percobaan login. Coba lagi dalam 15 menit.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limiter untuk upload
const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: 'Terlalu banyak upload, coba lagi nanti.',
});

// Helmet config - HTTP security headers
const helmetConfig = helmet({
  contentSecurityPolicy: false, // Disable CSP agar tidak block CDN (Summernote, Bootstrap, dll)
  crossOriginEmbedderPolicy: false,
});

module.exports = { generalLimiter, loginLimiter, uploadLimiter, helmetConfig, hpp };
