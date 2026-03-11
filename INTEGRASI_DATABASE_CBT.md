# Integrasi dengan Database CBT Kras

## Overview
Sistem ini dapat mengambil data siswa langsung dari database CBT (Computer Based Test) yang sudah ada, sehingga tidak perlu input data siswa manual.

## Keuntungan Integrasi
- ✅ Tidak perlu input data siswa manual
- ✅ Data selalu sinkron dengan sistem CBT
- ✅ Menghindari duplikasi data
- ✅ Hemat waktu dan tenaga
- ✅ Data lebih akurat dan up-to-date

## Konfigurasi

### 1. Setup Environment Variables
Edit file `.env` dan tambahkan konfigurasi database CBT:

```env
# Database CBT (Sistem CBT Kras)
CBT_DB_HOST=localhost
CBT_DB_USER=root
CBT_DB_PASSWORD=your_password
CBT_DB_NAME=cbt_kras
```

### 2. Struktur Tabel yang Diharapkan
Sistem ini mengharapkan tabel `siswa` di database CBT dengan struktur minimal:

```sql
-- Tabel siswa di database cbt_kras
CREATE TABLE siswa (
  id_siswa INT PRIMARY KEY,
  nis VARCHAR(20),
  nama VARCHAR(100),
  kelas VARCHAR(20),
  jurusan VARCHAR(50),
  foto VARCHAR(255),
  status ENUM('aktif', 'nonaktif')
);
```

**Catatan**: Jika struktur tabel berbeda, sesuaikan query di `controllers/siswaController.js`

## Cara Menggunakan

### Metode 1: Sinkronisasi Manual via Admin Panel

1. Login ke admin panel
2. Buka menu "Data Siswa"
3. Klik tombol "Sinkronisasi dari CBT"
4. Sistem akan:
   - Mengambil semua data siswa aktif dari database CBT
   - Insert siswa baru yang belum ada
   - Update data siswa yang sudah ada
   - Menampilkan statistik hasil sinkronisasi

### Metode 2: Sinkronisasi Otomatis (Scheduled)

Tambahkan cron job untuk sinkronisasi otomatis setiap hari:

```javascript
// Tambahkan di server.js
const cron = require('node-cron');
const siswaController = require('./controllers/siswaController');

// Sinkronisasi setiap hari jam 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('Running automatic siswa sync...');
  try {
    await siswaController.syncSiswaFromCBT();
    console.log('Siswa sync completed');
  } catch (error) {
    console.error('Siswa sync failed:', error);
  }
});
```

Install dependency:
```bash
npm install node-cron
```

### Metode 3: API Endpoint

Gunakan API endpoint untuk sinkronisasi programmatically:

```bash
# Sinkronisasi data siswa
POST http://localhost:3000/admin/siswa/api/sync-from-cbt

# Response:
{
  "success": true,
  "message": "Sinkronisasi data siswa berhasil",
  "stats": {
    "total": 150,
    "inserted": 10,
    "updated": 140,
    "errors": 0
  }
}
```

## Mapping Data

### Dari Database CBT ke Database Lokal

| CBT Database | Local Database | Keterangan |
|--------------|----------------|------------|
| id_siswa | - | Tidak disimpan (auto increment) |
| nis | nis | Primary identifier |
| nama | nama | Nama lengkap siswa |
| kelas | kelas | Kelas siswa (contoh: XII RPL 1) |
| jurusan | jurusan | Jurusan siswa |
| foto | foto | Path foto siswa |
| status | status | Status aktif/nonaktif |

## Customisasi Query

Jika struktur tabel di database CBT berbeda, edit file `controllers/siswaController.js`:

```javascript
// Sesuaikan query ini dengan struktur tabel Anda
const [siswaCBT] = await cbtDb.query(`
  SELECT 
    id_siswa,
    nis,
    nama,
    kelas,
    jurusan,
    foto
  FROM siswa 
  WHERE status = 'aktif'
  ORDER BY kelas, nama
`);
```

### Contoh Customisasi untuk Struktur Berbeda

**Jika nama kolom berbeda:**
```javascript
const [siswaCBT] = await cbtDb.query(`
  SELECT 
    student_id as id_siswa,
    student_nis as nis,
    student_name as nama,
    class_name as kelas,
    major as jurusan,
    photo_path as foto
  FROM students 
  WHERE is_active = 1
  ORDER BY class_name, student_name
`);
```

**Jika ada join dengan tabel lain:**
```javascript
const [siswaCBT] = await cbtDb.query(`
  SELECT 
    s.id_siswa,
    s.nis,
    s.nama,
    k.nama_kelas as kelas,
    j.nama_jurusan as jurusan,
    s.foto
  FROM siswa s
  LEFT JOIN kelas k ON s.kelas_id = k.id
  LEFT JOIN jurusan j ON s.jurusan_id = j.id
  WHERE s.status = 'aktif'
  ORDER BY k.nama_kelas, s.nama
`);
```

## Troubleshooting

### Error: Cannot connect to CBT database

**Penyebab**: Konfigurasi database CBT salah atau database tidak bisa diakses

**Solusi**:
1. Cek konfigurasi di file `.env`
2. Pastikan database CBT berjalan
3. Cek username dan password
4. Cek firewall/network access

### Error: Table 'siswa' doesn't exist

**Penyebab**: Nama tabel di database CBT berbeda

**Solusi**:
1. Cek nama tabel yang benar di database CBT
2. Update query di `controllers/siswaController.js`

### Error: Column not found

**Penyebab**: Nama kolom di database CBT berbeda

**Solusi**:
1. Cek struktur tabel di database CBT
2. Sesuaikan query dengan nama kolom yang benar
3. Gunakan alias (AS) jika perlu

### Data tidak sinkron

**Penyebab**: Query filter tidak sesuai

**Solusi**:
1. Cek kondisi WHERE di query
2. Pastikan filter status sudah benar
3. Cek apakah ada data yang memenuhi kriteria

## Keamanan

### Best Practices

1. **Gunakan User Database Terpisah**
   ```sql
   -- Buat user khusus untuk read-only access
   CREATE USER 'web_readonly'@'localhost' IDENTIFIED BY 'password';
   GRANT SELECT ON cbt_kras.siswa TO 'web_readonly'@'localhost';
   ```

2. **Batasi Akses**
   - Hanya berikan akses SELECT (read-only)
   - Jangan gunakan user root untuk koneksi
   - Gunakan password yang kuat

3. **Validasi Data**
   - Validasi data sebelum insert/update
   - Sanitize input untuk mencegah SQL injection
   - Log semua aktivitas sinkronisasi

4. **Backup Data**
   - Backup database sebelum sinkronisasi besar
   - Simpan log sinkronisasi
   - Buat rollback plan jika terjadi error

## Monitoring

### Log Sinkronisasi

Sistem akan mencatat setiap sinkronisasi:
- Waktu sinkronisasi
- Jumlah data yang diproses
- Jumlah insert/update/error
- Detail error jika ada

### Dashboard Statistik

Admin panel menampilkan:
- Total siswa di database lokal
- Total siswa di database CBT
- Terakhir sinkronisasi
- Status sinkronisasi

## FAQ

**Q: Apakah data di database CBT akan berubah?**
A: Tidak. Sistem hanya membaca (SELECT) data dari database CBT, tidak mengubah apapun.

**Q: Bagaimana jika ada siswa yang dihapus di CBT?**
A: Siswa yang tidak aktif di CBT tidak akan disinkronkan. Siswa yang sudah ada di database lokal tidak akan dihapus otomatis.

**Q: Apakah bisa sinkronisasi data guru juga?**
A: Ya, bisa. Tinggal buat controller dan query yang sama untuk tabel guru.

**Q: Bagaimana jika database CBT down?**
A: Sistem akan menampilkan error, tapi tidak mempengaruhi fungsi lain. Data di database lokal tetap bisa digunakan.

**Q: Apakah bisa sinkronisasi dua arah?**
A: Bisa, tapi tidak disarankan. Lebih baik database CBT sebagai master data, dan website hanya membaca.

## Support

Jika ada pertanyaan atau masalah dalam integrasi, silakan:
1. Cek dokumentasi ini
2. Cek log error di console
3. Hubungi tim development