const db = require('./config/database');

async function check() {
  const [rows] = await db.query('SELECT id, kode, nama, LEFT(deskripsi_lengkap, 100) as preview FROM jurusan');
  for (const r of rows) {
    const hasEscape = r.preview && r.preview.includes('&lt;');
    console.log(`[${r.kode}] ${r.nama}`);
    console.log(`  escaped: ${hasEscape}`);
    console.log(`  preview: ${r.preview ? r.preview.substring(0, 80) : 'NULL'}`);
    console.log('');
  }
  process.exit(0);
}

check().catch(e => { console.error(e.message); process.exit(1); });
