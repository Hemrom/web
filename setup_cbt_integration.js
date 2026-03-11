const mysql = require('mysql2/promise');
require('dotenv').config();

async function setupCBTIntegration() {
  console.log('🚀 CBT Integration Setup\n');
  
  try {
    // Step 1: Test koneksi ke database sekolah
    console.log('📋 Step 1: Testing main database connection...');
    const mainDb = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });
    console.log('✅ Main database connection successful\n');

    // Step 2: Test koneksi ke database CBT
    console.log('📋 Step 2: Testing CBT database connection...');
    const cbtDb = await mysql.createConnection({
      host: process.env.CBT_DB_HOST || 'localhost',
      user: process.env.CBT_DB_USER || 'root',
      password: process.env.CBT_DB_PASSWORD || '',
      database: process.env.CBT_DB_NAME || 'cbt_kras'
    });
    console.log('✅ CBT database connection successful\n');

    // Step 3: Setup tabel siswa dan presensi di database utama
    console.log('📋 Step 3: Setting up siswa and presensi tables...');
    
    // Create siswa table
    await mainDb.execute(`
      CREATE TABLE IF NOT EXISTS siswa (
        id INT PRIMARY KEY AUTO_INCREMENT,
        nis VARCHAR(20) UNIQUE NOT NULL,
        nama VARCHAR(100) NOT NULL,
        kelas VARCHAR(20) NOT NULL,
        jurusan VARCHAR(50),
        foto VARCHAR(255),
        face_descriptor TEXT,
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Siswa table created/verified');

    // Create presensi table
    await mainDb.execute(`
      CREATE TABLE IF NOT EXISTS presensi (
        id INT PRIMARY KEY AUTO_INCREMENT,
        siswa_id INT NOT NULL,
        tanggal DATE NOT NULL,
        waktu_masuk TIME,
        waktu_keluar TIME,
        status ENUM('hadir', 'izin', 'sakit', 'alpha') DEFAULT 'hadir',
        keterangan TEXT,
        foto_presensi VARCHAR(255),
        metode ENUM('face_recognition', 'manual') DEFAULT 'manual',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
        UNIQUE KEY unique_presensi (siswa_id, tanggal)
      )
    `);
    console.log('✅ Presensi table created/verified\n');

    // Step 4: Analisis struktur tabel siswa di CBT
    console.log('📋 Step 4: Analyzing CBT siswa table structure...');
    try {
      const [cbtTables] = await cbtDb.query("SHOW TABLES LIKE '%siswa%' OR SHOW TABLES LIKE '%student%'");
      
      if (cbtTables.length === 0) {
        console.log('⚠️  No siswa/student table found in CBT database');
        console.log('   Available tables:');
        const [allTables] = await cbtDb.query('SHOW TABLES');
        allTables.forEach((table, index) => {
          console.log(`   ${index + 1}. ${Object.values(table)[0]}`);
        });
      } else {
        // Assume first table is the siswa table
        const siswaTableName = Object.values(cbtTables[0])[0];
        console.log(`✅ Found student table: ${siswaTableName}`);
        
        // Show table structure
        const [structure] = await cbtDb.query(`DESCRIBE ${siswaTableName}`);
        console.log('\n📋 Table structure:');
        structure.forEach((col, index) => {
          console.log(`   ${index + 1}. ${col.Field} (${col.Type})`);
        });

        // Show sample data
        const [sampleData] = await cbtDb.query(`SELECT * FROM ${siswaTableName} LIMIT 3`);
        if (sampleData.length > 0) {
          console.log('\n👥 Sample data:');
          sampleData.forEach((row, index) => {
            console.log(`   Student ${index + 1}:`, row);
          });
        }
      }
    } catch (err) {
      console.log('❌ Error analyzing CBT table:', err.message);
    }

    // Step 5: Test sinkronisasi (dry run)
    console.log('\n📋 Step 5: Testing data synchronization (dry run)...');
    try {
      // Try different possible table names and structures
      const possibleQueries = [
        // Standard structure
        `SELECT nis, nama, kelas, jurusan, foto FROM siswa WHERE status = 'aktif' LIMIT 5`,
        // Alternative structure 1
        `SELECT nis, nama, kelas FROM siswa LIMIT 5`,
        // Alternative structure 2
        `SELECT student_id as nis, student_name as nama, class as kelas FROM students LIMIT 5`,
        // Just get any data to test
        `SELECT * FROM siswa LIMIT 5`
      ];

      let testData = null;
      let workingQuery = null;

      for (const query of possibleQueries) {
        try {
          const [result] = await cbtDb.query(query);
          if (result.length > 0) {
            testData = result;
            workingQuery = query;
            break;
          }
        } catch (err) {
          // Try next query
          continue;
        }
      }

      if (testData) {
        console.log('✅ Test query successful!');
        console.log(`   Working query: ${workingQuery}`);
        console.log(`   Found ${testData.length} test records`);
        
        // Show what data we can sync
        console.log('\n📊 Data that can be synchronized:');
        testData.forEach((row, index) => {
          console.log(`   ${index + 1}.`, row);
        });
      } else {
        console.log('⚠️  Could not find compatible data structure');
        console.log('   Manual query customization may be required');
      }
    } catch (err) {
      console.log('❌ Sync test failed:', err.message);
    }

    // Step 6: Create upload folders
    console.log('\n📋 Step 6: Creating upload folders...');
    const fs = require('fs');
    const folders = ['uploads/siswa', 'uploads/presensi'];
    
    folders.forEach(folder => {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
        console.log(`✅ Created folder: ${folder}`);
      } else {
        console.log(`✅ Folder exists: ${folder}`);
      }
    });

    await mainDb.end();
    await cbtDb.end();

    console.log('\n🎉 Setup completed successfully!\n');
    
    // Final recommendations
    console.log('📋 Next Steps:');
    console.log('1. ✅ Database connections are working');
    console.log('2. ✅ Tables are created and ready');
    console.log('3. ✅ Upload folders are created');
    console.log('4. 🔄 Ready for data synchronization');
    console.log('\nTo sync data from CBT:');
    console.log('- Run: node sync_siswa_from_cbt.js');
    console.log('- Or use admin panel: /admin/siswa');

  } catch (error) {
    console.log('❌ Setup failed:', error.message);
    console.log('\n🔧 Please check:');
    console.log('- Database credentials in .env file');
    console.log('- MySQL server is running');
    console.log('- Both databases exist and are accessible');
  }
}

setupCBTIntegration();