const mysql = require('mysql2/promise');
require('dotenv').config();

async function syncSiswaFromCBT() {
  console.log('🔄 Syncing Students from CBT Database\n');
  
  try {
    // Koneksi ke kedua database
    const mainDb = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });

    const cbtDb = await mysql.createConnection({
      host: process.env.CBT_DB_HOST || 'localhost',
      user: process.env.CBT_DB_USER || 'root',
      password: process.env.CBT_DB_PASSWORD || '',
      database: process.env.CBT_DB_NAME || 'cbt_kras'
    });

    console.log('✅ Database connections established\n');

    // Ambil data siswa dari CBT
    console.log('📥 Fetching student data from CBT...');
    
    // Try different possible queries based on common table structures
    let siswaCBT = [];
    let queryUsed = '';

    const possibleQueries = [
      {
        name: 'CBT users table with classes (recommended)',
        query: `SELECT 
          u.username as nis, 
          u.full_name as nama, 
          c.name as kelas, 
          'Unknown' as jurusan, 
          u.profile_photo as foto 
        FROM users u 
        LEFT JOIN classes c ON u.class_id = c.id 
        WHERE u.role = 'STUDENT' AND u.is_active = 1 
        ORDER BY c.name, u.full_name`
      },
      {
        name: 'CBT users table without classes',
        query: `SELECT 
          u.username as nis, 
          u.full_name as nama, 
          'Unknown' as kelas, 
          'Unknown' as jurusan, 
          u.profile_photo as foto 
        FROM users u 
        WHERE u.role = 'STUDENT' AND u.is_active = 1 
        ORDER BY u.full_name`
      },
      {
        name: 'Standard siswa table with status',
        query: `SELECT nis, nama, kelas, jurusan, foto FROM siswa WHERE status = 'aktif' ORDER BY kelas, nama`
      },
      {
        name: 'Standard siswa table without status filter',
        query: `SELECT nis, nama, kelas, jurusan, foto FROM siswa ORDER BY kelas, nama`
      },
      {
        name: 'All fields from users table',
        query: `SELECT username as nis, full_name as nama FROM users WHERE role = 'STUDENT' ORDER BY full_name`
      }
    ];

    for (const queryOption of possibleQueries) {
      try {
        console.log(`   Trying: ${queryOption.name}...`);
        const [result] = await cbtDb.query(queryOption.query);
        if (result.length > 0) {
          siswaCBT = result;
          queryUsed = queryOption.name;
          console.log(`   ✅ Success! Found ${result.length} students`);
          break;
        }
      } catch (err) {
        console.log(`   ❌ Failed: ${err.message}`);
        continue;
      }
    }

    if (siswaCBT.length === 0) {
      console.log('❌ No student data found or no compatible table structure');
      console.log('   Please check the CBT database and table structure');
      return;
    }

    console.log(`\n📊 Using query: ${queryUsed}`);
    console.log(`📊 Found ${siswaCBT.length} students to sync\n`);

    // Show sample of data that will be synced
    console.log('👥 Sample data (first 3 students):');
    siswaCBT.slice(0, 3).forEach((siswa, index) => {
      console.log(`   ${index + 1}.`, siswa);
    });
    console.log('');

    // Proses sinkronisasi
    console.log('🔄 Starting synchronization...');
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let skipped = 0;

    for (const siswa of siswaCBT) {
      try {
        // Validasi data minimal
        if (!siswa.nis || !siswa.nama) {
          console.log(`   ⚠️  Skipping student: missing NIS or name`);
          skipped++;
          continue;
        }

        // Cek apakah siswa sudah ada
        const [existing] = await mainDb.query(
          'SELECT id FROM siswa WHERE nis = ?',
          [siswa.nis]
        );

        // Prepare data dengan default values
        const studentData = {
          nis: siswa.nis,
          nama: siswa.nama,
          kelas: siswa.kelas || 'Unknown',
          jurusan: siswa.jurusan || 'Unknown',
          foto: siswa.foto || null
        };

        if (existing.length > 0) {
          // Update existing student
          await mainDb.query(
            'UPDATE siswa SET nama = ?, kelas = ?, jurusan = ?, foto = ?, updated_at = NOW() WHERE nis = ?',
            [studentData.nama, studentData.kelas, studentData.jurusan, studentData.foto, studentData.nis]
          );
          updated++;
          console.log(`   ✅ Updated: ${studentData.nama} (${studentData.nis})`);
        } else {
          // Insert new student
          await mainDb.query(
            'INSERT INTO siswa (nis, nama, kelas, jurusan, foto, status) VALUES (?, ?, ?, ?, ?, ?)',
            [studentData.nis, studentData.nama, studentData.kelas, studentData.jurusan, studentData.foto, 'aktif']
          );
          inserted++;
          console.log(`   ➕ Inserted: ${studentData.nama} (${studentData.nis})`);
        }
      } catch (err) {
        console.log(`   ❌ Error syncing ${siswa.nama || 'unknown'} (${siswa.nis || 'no-nis'}): ${err.message}`);
        errors++;
      }
    }

    await mainDb.end();
    await cbtDb.end();

    // Summary
    console.log('\n📊 Synchronization Summary:');
    console.log(`   Total processed: ${siswaCBT.length}`);
    console.log(`   ➕ Inserted: ${inserted}`);
    console.log(`   ✏️  Updated: ${updated}`);
    console.log(`   ⚠️  Skipped: ${skipped}`);
    console.log(`   ❌ Errors: ${errors}`);

    if (errors === 0) {
      console.log('\n🎉 Synchronization completed successfully!');
    } else {
      console.log('\n⚠️  Synchronization completed with some errors');
    }

    console.log('\n💡 Next steps:');
    console.log('   - Check the admin panel: /admin/siswa');
    console.log('   - Verify student data is correct');
    console.log('   - Set up automatic sync if needed');

  } catch (error) {
    console.log('❌ Synchronization failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Check database connections');
    console.log('   - Verify .env configuration');
    console.log('   - Run test_cbt_connection.js first');
  }
}

// Jalankan sinkronisasi
syncSiswaFromCBT();