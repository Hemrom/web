const db = require('./config/database');
async function run() {
  const [rows] = await db.query('SELECT kode, SUBSTRING(deskripsi_lengkap,1,300) as dl FROM jurusan WHERE kode="TKJ"');
  console.log(rows[0]);
  process.exit(0);
}
run();
