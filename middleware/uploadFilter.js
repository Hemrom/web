const path = require('path');

// Filter hanya izinkan file gambar
const imageFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp|svg/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  if (extname && mimetype) {
    return cb(null, true);
  }
  cb(new Error('Hanya file gambar yang diizinkan (jpg, png, gif, webp)'));
};

// Filter untuk Excel
const excelFilter = (req, file, cb) => {
  const allowedTypes = /xlsx|xls/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  if (extname) return cb(null, true);
  cb(new Error('Hanya file Excel yang diizinkan'));
};

module.exports = { imageFilter, excelFilter };
