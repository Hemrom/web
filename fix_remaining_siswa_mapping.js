const db = require('./config/database');

async function fixRemainingSiswaMapping() {
  try {
    console.log('🔍 Memperbaiki mapping siswa yang belum ter-assign...');
    
    // Cek siswa yang belum ter-mapping
    const [unmappedSiswa] = await db.query(`
      SELECT id, nis, nama, kelas, jurusan 
      FROM siswa 
      WHERE jurusan = 'Unknown' OR jurusan IS NULL OR jurusan = ''
    `);
    
    console.log(`📊 Ditemukan ${unmappedSiswa.length} siswa yang belum ter-mapping`);
    
    if (unmappedSiswa.length > 0) {
      console.log('\n📋 Siswa yang belum ter-mapping:');
      unmappedSiswa.forEach(s => {
        console.log(`   ${s.nis} - ${s.nama} (${s.kelas}) → ${s.jurusan}`);
      });
      
      // Mapping manual untuk kelas yang tidak terdeteksi otomatis
      const manualMappings = [
        { pattern: '%RPL%', jurusan: 'Rekayasa Perangkat Lunak' },
        { pattern: '%MM%', jurusan: 'Multimedia' },
        { pattern: '%MULTIMEDIA%', jurusan: 'Multimedia' },
        { pattern: '%AKL%', jurusan: 'Akuntansi dan Keuangan Lembaga' },
        { pattern: '%AKUNTANSI%', jurusan: 'Akuntansi dan Keuangan Lembaga' },
        { pattern: '%OTKP%', jurusan: 'Otomatisasi dan Tata Kelola Perkantoran' },
        { pattern: '%PERKANTORAN%', jurusan: 'Otomatisasi dan Tata Kelola Perkantoran' },
        { pattern: '%BDP%', jurusan: 'Bisnis Daring dan Pemasaran' },
        { pattern: '%PEMASARAN%', jurusan: 'Bisnis Daring dan Pemasaran' }
      ];
      
      console.log('\n🔄 Melakukan mapping manual...');
      let fixed = 0;
      
      for (const mapping of manualMappings) {
        const [result] = await db.query(
          'UPDATE siswa SET jurusan = ? WHERE kelas LIKE ? AND (jurusan = "Unknown" OR jurusan IS NULL OR jurusan = "")',
          [mapping.jurusan, mapping.pattern]
        );
        
        if (result.affectedRows > 0) {
          console.log(`✅ ${result.affectedRows} siswa diperbaiki untuk jurusan ${mapping.jurusan}`);
          fixed += result.affectedRows;
        }
      }
      
      // Untuk siswa yang masih belum ter-mapping, set sebagai "Jurusan Lain"
      const [remainingResult] = await db.query(
        'UPDATE siswa SET jurusan = ? WHERE jurusan = "Unknown" OR jurusan IS NULL OR jurusan = ""',
        ['Jurusan Lain']
      );
      
      if (remainingResult.affectedRows > 0) {
        console.log(`⚠️  ${remainingResult.affectedRows} siswa ditetapkan sebagai "Jurusan Lain"`);
        fixed += remainingResult.affectedRows;
      }
      
      console.log(`\n✅ Total ${fixed} siswa berhasil diperbaiki mapping-nya`);
    }
    
    // Tampilkan statistik final
    console.log('\n📊 Statistik Final Jurusan:');
    const [finalStats] = await db.query(`
      SELECT jurusan, COUNT(*) as jumlah 
      FROM siswa 
      WHERE status = 'aktif' 
      GROUP BY jurusan 
      ORDER BY jumlah DESC
    `);
    
    finalStats.forEach(stat => {
      console.log(`   ${stat.jurusan}: ${stat.jumlah} siswa`);
    });
    
    console.log('\n✅ Mapping siswa ke jurusan selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    process.exit(0);
  }
}

fixRemainingSiswaMapping();