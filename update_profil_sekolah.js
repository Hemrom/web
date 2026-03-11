const mysql = require('mysql2/promise');
require('dotenv').config();

async function updateProfilSekolah() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'sekolah_db'
    });

    console.log('Connected to database...');

    // Update profil sekolah
    await connection.query(`
      UPDATE profil_sekolah SET 
        nama_sekolah = 'SMK Negeri 1 Kras',
        alamat = 'Jl. Raya Kras, Kediri, Jawa Timur',
        telepon = '(0354) 123456',
        email = 'info@smkn1kras.sch.id',
        visi = 'Menjadi SMK unggul yang menghasilkan lulusan berkualitas, berakhlak mulia, dan siap kerja dengan kompetensi global.',
        misi = '1. Menyelenggarakan pendidikan kejuruan berkualitas\n2. Mengembangkan karakter dan soft skills siswa\n3. Meningkatkan kompetensi sesuai kebutuhan industri\n4. Membangun kemitraan dengan dunia usaha dan industri'
      WHERE id = 1
    `);
    
    console.log('✓ Profil sekolah berhasil diupdate menjadi SMK Negeri 1 Kras');

    await connection.end();
    console.log('\n✅ Update profil sekolah selesai!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

updateProfilSekolah();
