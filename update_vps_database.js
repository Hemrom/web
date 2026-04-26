const db = require('./config/database');

async function updateVpsDatabase() {
  try {
    console.log('🔄 Updating VPS database...');
    
    // Update kolom jurusan menjadi NULL untuk role BKK dan OSIS
    const [result] = await db.query(
      "UPDATE portal_users SET jurusan = NULL WHERE role IN ('bkk', 'osis')"
    );
    
    console.log(`✅ Updated ${result.affectedRows} records`);
    
    // Tampilkan data setelah update
    const [users] = await db.query(
      "SELECT id, username, nama, role, jurusan FROM portal_users WHERE role IN ('bkk', 'osis') ORDER BY role, nama"
    );
    
    console.log('\n📋 BKK and OSIS users after update:');
    console.table(users);
    
    console.log('\n✅ Database update completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating database:', error.message);
    process.exit(1);
  }
}

updateVpsDatabase();