const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const ALLOWED_MIME = new Set([
  'image/jpeg', 'image/jpg', 'image/png',
  'image/gif', 'image/webp', 'image/svg+xml'
]);

const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']);

const safeFilename = (prefix, originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const rand = crypto.randomBytes(16).toString('hex');
  return `${prefix}-${Date.now()}-${rand}${ext}`;
};

const strictImageFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // Tolak HEIC — browser tidak bisa render
  if (ext === '.heic' || ext === '.heif') {
    return cb(new Error('Format HEIC tidak didukung. Di iPhone: Settings → Camera → Formats → Most Compatible, lalu foto ulang dengan format JPG.'));
  }

  if (!ALLOWED_MIME.has(file.mimetype) || !ALLOWED_EXT.has(ext)) {
    return cb(new Error('Hanya file gambar yang diizinkan (jpg, png, gif, webp)'));
  }

  const basename = path.basename(file.originalname, ext);
  if (path.extname(basename)) {
    return cb(new Error('Nama file tidak valid'));
  }
  cb(null, true);
};

const createStorage = (prefix) => multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, safeFilename(prefix, file.originalname))
});

const createUpload = (prefix, opts = {}) => multer({
  storage: createStorage(prefix),
  fileFilter: strictImageFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
    files: opts.maxFiles || 1
  }
});

module.exports = { createUpload, strictImageFilter, safeFilename };
