const mysql = require('mysql2/promise');
require('dotenv').config();

async function syncGuruFromCBT() {
  console.log('🔄 Sinkronisasi Data Guru dari Database CBT\n');
  
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

    console.log('✅ Koneksi database berhasil\n');

    // Ambil data guru dari CBT
    console.log('📥 Mengambil data guru dari CBT...');
    
    const [guruCBT] = await cbtDb.query(`
      SELECT 
        u.username as nip, 
        u.full_name as nama, 
        u.profile_photo as foto
      FROM users u 
      WHERE u.role = 'TEACHER' AND u.is_active = 1 
      ORDER BY u.full_name
    `);

    console.log(`📊 Ditemukan ${guruCBT.length} guru untuk disinkronkan\n`);

    // Tampilkan sample data
    console.log('👥 Sample data (3 guru pertama):');
    guruCBT.slice(0, 3).forEach((guru, index) => {
      console.log(`   ${index + 1}. ${guru.nama} (NIP: ${guru.nip})`);
    });
    console.log('');

    // Proses sinkronisasi
    console.log('🔄 Memulai sinkronisasi...');
    let inserted = 0;
    let updated = 0;
    let errors = 0;
    let skipped = 0;

    for (const guru of guruCBT) {
      try {
        // Validasi data minimal
        if (!guru.nip || !guru.nama) {
          console.log(`   ⚠️  Melewati guru: NIP atau nama kosong`);
          skipped++;
          continue;
        }

        // Cek apakah guru sudah ada
        const [existing] = await mainDb.query(
          'SELECT id FROM guru WHERE nip = ?',
          [guru.nip]
        );

        // Prepare data dengan default values
        const guruData = {
          nip: guru.nip,
          nama: guru.nama,
          foto: guru.foto || null,
          mata_pelajaran: 'Belum Ditentukan',
          jabatan: 'Guru',
          email: null,
          telepon: null
        };

        if (existing.length > 0) {
          // Update guru yang sudah ada (hanya update nama dan foto, biarkan data lain tetap)
          await mainDb.query(
            'UPDATE guru SET nama = ?, foto = ? WHERE nip = ?',
            [guruData.nama, guruData.foto, guruData.nip]
          );
          updated++;
          console.log(`   ✅ Update: ${guruData.nama} (${guruData.nip})`);
        } else {
          // Insert guru baru
          await mainDb.query(
            'INSERT INTO guru (nip, nama, foto, mata_pelajaran, jabatan, email, telepon) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [guruData.nip, guruData.nama, guruData.foto, guruData.mata_pelajaran, guruData.jabatan, guruData.email, guruData.telepon]
          );
          inserted++;
          console.log(`   ➕ Tambah: ${guruData.nama} (${guruData.nip})`);
        }
      } catch (err) {
        console.log(`   ❌ Error sinkronisasi ${guru.nama || 'unknown'} (${guru.nip || 'no-nip'}): ${err.message}`);
        errors++;
      }
    }

    await mainDb.end();
    await cbtDb.end();

    // Ringkasan
    console.log('\n📊 Ringkasan Sinkronisasi:');
    console.log(`   Total diproses: ${guruCBT.length}`);
    console.log(`   ➕ Ditambahkan: ${inserted}`);
    console.log(`   ✏️  Diupdate: ${updated}`);
    console.log(`   ⚠️  Dilewati: ${skipped}`);
    console.log(`   ❌ Error: ${errors}`);

    if (errors === 0) {
      console.log('\n🎉 Sinkronisasi berhasil!');
    } else {
      console.log('\n⚠️  Sinkronisasi selesai dengan beberapa error');
    }

    console.log('\n💡 Langkah selanjutnya:');
    console.log('   - Cek panel admin: /admin/guru');
    console.log('   - Verifikasi data guru sudah benar');
    console.log('   - Update mata pelajaran dan data lainnya secara manual');
    console.log('   - Foto guru akan otomatis muncul jika path foto valid');

  } catch (error) {
    console.log('❌ Sinkronisasi gagal:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   - Cek koneksi database');
    console.log('   - Verifikasi konfigurasi .env');
    console.log('   - Jalankan test_cbt_connection.js terlebih dahulu');
  }
}

// Jalankan sinkronisasi
syncGuruFromCBT();
