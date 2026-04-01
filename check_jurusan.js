const db = require('./config/database');
async function run() {
  const [rows] = await db.query('SELECT kode, LEFT(deskripsi_lengkap, 300) as dl FROM jurusan WHERE kode="TKJ"');
  console.log(rows[0]);
  process.exit(0);
}
run();
