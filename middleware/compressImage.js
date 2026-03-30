const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

/**
 * Kompres gambar setelah upload multer selesai.
 * Mendukung req.file (single) dan req.files (array atau object fields).
 * SVG tidak dikompres karena sudah vector.
 */
const compressImage = async (req, res, next) => {
  try {
    const files = getUploadedFiles(req);
    if (!files.length) return next();

    await Promise.all(files.map(file => compressFile(file)));
    next();
  } catch (err) {
    next(err);
  }
};

function getUploadedFiles(req) {
  if (req.file) return [req.file];
  if (!req.files) return [];
  if (Array.isArray(req.files)) return req.files;
  // multer fields: { fieldname: [file, ...], ... }
  return Object.values(req.files).flat();
}

async function compressFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  // Lewati SVG dan GIF (animasi)
  if (ext === '.svg' || ext === '.gif') return;

  const filePath = file.path;
  const tmpPath = filePath + '.tmp';

  try {
    const sharpInstance = sharp(filePath).rotate(); // rotate() fix orientasi EXIF

    if (ext === '.png') {
      await sharpInstance
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 8 })
        .toFile(tmpPath);
    } else {
      // jpg, jpeg, webp, dll
      await sharpInstance
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(tmpPath);
    }

    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    // Kalau gagal kompres, biarkan file asli tetap ada
    if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    console.error('Gagal kompres gambar:', file.filename, err.message);
  }
}

module.exports = compressImage;
