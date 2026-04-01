const db = require('./config/database');
async function run() {
  const [r] = await db.query("DELETE FROM galeri WHERE gambar LIKE '%.heic' OR gambar LIKE '%.HEIC'");
  console.log('Record HEIC dihapus:', r.affectedRows);
  process.exit(0);
}
run();
