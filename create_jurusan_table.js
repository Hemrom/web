const db = require('./config/database');

async function createJurusanTable() {
  try {
    console.log('🔧 Membuat tabel jurusan...');
    
    // Buat tabel jurusan
    await db.query(`
      CREATE TABLE IF NOT EXISTS jurusan (
        id INT PRIMARY KEY AUTO_INCREMENT,
        kode VARCHAR(10) UNIQUE NOT NULL,
        nama VARCHAR(100) NOT NULL,
        deskripsi TEXT,
        kepala_jurusan VARCHAR(100),
        status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabel jurusan berhasil dibuat');
    
    // Insert data jurusan default
    console.log('📝 Menambahkan data jurusan default...');
    
    const jurusanData = [
      {
        kode: 'TKJ',
        nama: 'Teknik Komputer dan Jaringan',
        deskripsi: 'Program keahlian yang mempelajari tentang cara instalasi PC, instalasi LAN, troubleshooting jaringan dan membuat web.'
      },
      {
        kode: 'KULINER',
        nama: 'Tata Boga / Kuliner',
        deskripsi: 'Program keahlian yang mempelajari tentang pengolahan makanan, penyajian, dan manajemen usaha kuliner.'
      },
      {
        kode: 'TKR',
        nama: 'Teknik Kendaraan Ringan',
        deskripsi: 'Program keahlian yang mempelajari tentang perawatan dan perbaikan kendaraan ringan seperti mobil dan sepeda motor.'
      },
      {
        kode: 'TPTU',
        nama: 'Teknik Pengelasan dan Fabrikasi Logam',
        deskripsi: 'Program keahlian yang mempelajari tentang teknik pengelasan, fabrikasi logam, dan konstruksi baja.'
      }
    ];
    
    for (const jurusan of jurusanData) {
      try {
        await db.query(
          'INSERT INTO jurusan (kode, nama, deskripsi, status) VALUES (?, ?, ?, ?)',
          [jurusan.kode, jurusan.nama, jurusan.deskripsi, 'aktif']
        );
        console.log(`✅ Jurusan ${jurusan.kode} - ${jurusan.nama} ditambahkan`);
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          console.log(`⚠️  Jurusan ${jurusan.kode} sudah ada, dilewati`);
        } else {
          throw err;
        }
      }
    }
    
    // Update jurusan siswa berdasarkan kelas
    console.log('\n🔄 Memperbarui jurusan siswa berdasarkan kelas...');
    
    const updateQueries = [
      { pattern: '%TKJ%', jurusan: 'Teknik Komputer dan Jaringan' },
      { pattern: '%KULINER%', jurusan: 'Tata Boga / Kuliner' },
      { pattern: '%TKR%', jurusan: 'Teknik Kendaraan Ringan' },
      { pattern: '%TPTU%', jurusan: 'Teknik Pengelasan dan Fabrikasi Logam' }
    ];
    
    for (const update of updateQueries) {
      const [result] = await db.query(
        'UPDATE siswa SET jurusan = ? WHERE kelas LIKE ?',
        [update.jurusan, update.pattern]
      );
      console.log(`✅ ${result.affectedRows} siswa diperbarui untuk jurusan ${update.jurusan}`);
    }
    
    // Tampilkan statistik
    console.log('\n📊 Statistik Jurusan:');
    const [stats] = await db.query(`
      SELECT jurusan, COUNT(*) as jumlah 
      FROM siswa 
      WHERE status = 'aktif' 
      GROUP BY jurusan 
      ORDER BY jumlah DESC
    `);
    
    stats.forEach(stat => {
      console.log(`   ${stat.jurusan}: ${stat.jumlah} siswa`);
    });
    
    console.log('\n✅ Setup jurusan selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

createJurusanTable();
