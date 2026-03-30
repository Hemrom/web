const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

// MIME types yang benar-benar diizinkan
const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/jpg', 'image/png',
  'image/gif', 'image/webp', 'image/svg+xml'
]);

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

// Nama file aman — random hex, tidak bisa ditebak atau di-traverse
const safeFilename = (prefix, originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const rand = crypto.randomBytes(16).toString('hex');
  return `${prefix}-${Date.now()}-${rand}${ext}`;
};

// File filter ketat: cek MIME + extension
const strictImageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new Error('Hanya file gambar yang diizinkan (jpg, png, gif, webp)'));
  }
  // Cegah double extension: file.php.jpg
  const basename = path.basename(file.originalname, ext);
  if (path.extname(basename)) {
    return cb(new Error('Nama file tidak valid'));
  }
  cb(null, true);
};

// Storage dengan nama file aman
const createStorage = (prefix) => multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, safeFilename(prefix, file.originalname))
});

// Buat multer instance dengan semua proteksi
const createUpload = (prefix, opts = {}) => multer({
  storage: createStorage(prefix),
  fileFilter: strictImageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
    files: opts.maxFiles || 1
  }
});

module.exports = { createUpload, strictImageFilter, safeFilename };
