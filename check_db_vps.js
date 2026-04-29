const db = require('./config/database');

async function check() {
  const [rows] = await db.query('SELECT kode, LEFT(deskripsi_lengkap, 200) as preview FROM jurusan WHERE kode IN ("TKJ","TKR")');
  for (const r of rows) {
    console.log('=== ' + r.kode + ' ===');
    console.log(JSON.stringify(r.preview));
    console.log('');
  }
  process.exit(0);
}

check().catch(e => { console.error(e.message); process.exit(1); });
