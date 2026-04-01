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

    const failed = [];
    await Promise.all(files.map(async file => {
      const ok = await compressFile(file);
      if (!ok) failed.push(file.originalname);
    }));

    if (failed.length > 0) {
      // Hapus semua file yang sudah terupload
      getUploadedFiles(req).forEach(f => {
        if (fs.existsSync(f.path)) fs.unlinkSync(f.path);
      });
      return res.status(400).send(`
        <div style="font-family:sans-serif;padding:2rem;max-width:600px;margin:2rem auto;background:#fff3cd;border:1px solid #ffc107;border-radius:8px;">
          <h3 style="color:#856404;">⚠️ Format Foto Tidak Didukung</h3>
          <p>File berikut tidak bisa diproses: <strong>${failed.join(', ')}</strong></p>
          <p>Foto dari iPhone meskipun berekstensi .jpg kadang masih berformat HEIC di dalamnya.</p>
          <p><strong>Solusi:</strong> Di iPhone buka foto → Share → Save to Files → pilih format JPEG. Atau screenshot foto tersebut lalu upload hasilnya.</p>
          <a href="javascript:history.back()" style="color:#0ea5e9;">← Kembali</a>
        </div>
      `);
    }

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
  if (ext === '.svg' || ext === '.gif') return true;

  const filePath = file.path;
  const isHeic = ext === '.heic' || ext === '.heif';
  const outPath = isHeic ? filePath.replace(/\.(heic|heif)$/i, '.jpg') : filePath + '.tmp';

  try {
    const sharpInstance = sharp(filePath).rotate();

    if (ext === '.png' && !isHeic) {
      await sharpInstance
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 8 })
        .toFile(outPath);
    } else {
      await sharpInstance
        .resize({ width: 1920, height: 1080, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, progressive: true })
        .toFile(outPath);
    }

    if (isHeic) {
      fs.unlinkSync(filePath);
      file.filename = path.basename(outPath);
      file.path = outPath;
    } else {
      fs.renameSync(outPath, filePath);
    }
    return true;
  } catch (err) {
    if (fs.existsSync(outPath)) fs.unlinkSync(outPath);
    // Hapus file asli juga agar tidak tersimpan ke DB
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error('Gagal kompres gambar:', file.filename, err.message);
    return false;
  }
}

module.exports = compressImage;
