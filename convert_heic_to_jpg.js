// Script konversi foto HEIC yang sudah tersimpan di database ke JPG
const db = require('./config/database');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function run() {
  const [rows] = await db.query("SELECT id, gambar FROM galeri WHERE gambar LIKE '%.heic' OR gambar LIKE '%.HEIC'");
  console.log(`Ditemukan ${rows.length} foto HEIC`);

  for (const row of rows) {
    const oldPath = path.join('./uploads', row.gambar);
    const newFilename = row.gambar.replace(/\.(heic|HEIC)$/, '.jpg');
    const newPath = path.join('./uploads', newFilename);

    if (!fs.existsSync(oldPath)) {
      console.log(`File tidak ditemukan: ${oldPath}`);
      continue;
    }

    try {
      await sharp(oldPath).jpeg({ quality: 80 }).toFile(newPath);
      fs.unlinkSync(oldPath);
      await db.query('UPDATE galeri SET gambar = ? WHERE id = ?', [newFilename, row.id]);
      console.log(`Konversi: ${row.gambar} → ${newFilename}`);
    } catch (err) {
      console.error(`Gagal konversi ${row.gambar}:`, err.message);
    }
  }

  console.log('Selesai!');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
