const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const compressImage = require('./compressImage');

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

  // Cegah double extension berbahaya: file.php.jpg — hanya tolak jika ext kedua adalah script
  const DANGEROUS_EXT = new Set(['.php', '.js', '.exe', '.sh', '.py', '.rb', '.asp', '.aspx', '.jsp']);
  const basename = path.basename(file.originalname, ext);
  const secondExt = path.extname(basename).toLowerCase();
  if (secondExt && DANGEROUS_EXT.has(secondExt)) {
    return cb(new Error('Nama file tidak valid'));
  }

  cb(null, true);
};

const createStorage = (prefix) => multer.diskStorage({
  destination: './uploads/',
  filename: (req, file, cb) => cb(null, safeFilename(prefix, file.originalname))
});

/**
 * Wrapper agar multer handler otomatis menjalankan compressImage sesudah upload.
 * Controller yang sudah memanggil compressImage sendiri tetap aman —
 * kompres kedua akan di-skip karena file sudah .webp (SKIP_EXT di compressImage).
 */
function wrapWithCompress(multerInstance) {
  const originalSingle = multerInstance.single.bind(multerInstance);
  const originalArray  = multerInstance.array.bind(multerInstance);
  const originalFields = multerInstance.fields.bind(multerInstance);

  multerInstance.single = (fieldName) => {
    const handler = originalSingle(fieldName);
    return (req, res, next) => {
      handler(req, res, async (err) => {
        if (err) return next(err);
        await compressImage(req, res, next);
      });
    };
  };

  multerInstance.array = (fieldName, maxCount) => {
    const handler = originalArray(fieldName, maxCount);
    return (req, res, next) => {
      handler(req, res, async (err) => {
        if (err) return next(err);
        await compressImage(req, res, next);
      });
    };
  };

  multerInstance.fields = (fields) => {
    const handler = originalFields(fields);
    return (req, res, next) => {
      handler(req, res, async (err) => {
        if (err) return next(err);
        await compressImage(req, res, next);
      });
    };
  };

  return multerInstance;
}

const createUpload = (prefix, opts = {}) => {
  const instance = multer({
    storage: createStorage(prefix),
    fileFilter: strictImageFilter,
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB max
      files: opts.maxFiles || 10
    }
  });
  return wrapWithCompress(instance);
};

module.exports = { createUpload, strictImageFilter, safeFilename };
