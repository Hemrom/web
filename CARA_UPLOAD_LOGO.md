# Cara Upload Logo Sekolah

## Untuk Halaman Login Admin

Logo sekolah akan ditampilkan di halaman login admin di sebelah kiri form login.

### Langkah-langkah:

1. **Siapkan file logo sekolah**
   - Format yang didukung: PNG, JPG, JPEG
   - Ukuran yang disarankan: 500x500 px atau lebih
   - Background transparan (PNG) lebih baik

2. **Upload logo ke folder uploads**
   - Simpan file logo dengan nama: `logo-sekolah.png`
   - Lokasi: `uploads/logo-sekolah.png`
   
3. **Cara upload:**
   
   **Opsi 1: Manual (Copy file)**
   - Copy file logo Anda
   - Paste ke folder `uploads/` di project
   - Rename menjadi `logo-sekolah.png`
   
   **Opsi 2: Melalui Admin Panel**
   - Login ke admin panel
   - Buka menu "Profil Sekolah"
   - Upload logo di bagian logo sekolah
   - Copy file dari uploads ke `logo-sekolah.png`

4. **Verifikasi**
   - Buka halaman login: `http://localhost:3000/admin/login`
   - Logo sekolah akan muncul di sebelah kiri form login
   - Jika logo tidak muncul, akan menampilkan gambar default

### Catatan:
- Jika file logo tidak ditemukan, sistem akan menampilkan gambar default
- Logo akan ditampilkan dengan background putih dan border radius
- Logo akan di-resize otomatis agar pas di container
- Nama sekolah "SMK Negeri 1 Kras" akan ditampilkan di bawah logo

### Troubleshooting:
- **Logo tidak muncul**: Pastikan nama file adalah `logo-sekolah.png` (huruf kecil semua)
- **Logo terlalu besar/kecil**: Logo akan di-resize otomatis, max height 300px
- **Logo terpotong**: Gunakan logo dengan aspect ratio square (1:1) untuk hasil terbaik