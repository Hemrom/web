# Fitur Slider Hero Section

## Deskripsi
Fitur slider telah berhasil ditambahkan ke hero section pada halaman utama website sekolah. Slider ini dapat dikelola melalui admin panel dan menampilkan gambar dengan teks overlay yang menarik.

## Fitur yang Tersedia

### Frontend (Public)
- **Hero Slider**: Menampilkan slider gambar dengan transisi smooth
- **Auto-play**: Slider berubah otomatis setiap 5 detik
- **Navigation**: Tombol prev/next dan dot indicators
- **Responsive**: Tampilan optimal di semua perangkat
- **Fallback**: Jika tidak ada slider, menampilkan hero section default

### Admin Panel
- **Kelola Slider**: CRUD lengkap untuk slider
- **Upload Gambar**: Upload gambar slider dengan validasi
- **Pengaturan Urutan**: Atur urutan tampil slider
- **Status Aktif/Nonaktif**: Kontrol visibility slider
- **Link & CTA**: Tambahkan link dan teks tombol

## Struktur Database
```sql
CREATE TABLE slider (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  subjudul TEXT,
  deskripsi TEXT,
  gambar VARCHAR(255) NOT NULL,
  link_url VARCHAR(255),
  link_text VARCHAR(100),
  urutan INT DEFAULT 0,
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## File yang Dibuat/Dimodifikasi

### Controller
- `controllers/sliderController.js` - CRUD operations untuk slider

### Views Admin
- `views/admin/slider/index.ejs` - Halaman daftar slider
- `views/admin/slider/create.ejs` - Form tambah slider
- `views/admin/slider/edit.ejs` - Form edit slider

### Views Frontend
- `views/frontend/home.ejs` - Ditambahkan slider functionality dan JavaScript

### Routes
- `routes/admin.js` - Ditambahkan routes untuk slider management

### Database
- `config/database.sql` - Ditambahkan tabel slider dan sample data

### Sidebar
- `views/admin/partials/sidebar.ejs` - Ditambahkan menu slider

## Setup Database

Jika tabel slider belum ada, jalankan script berikut:
```bash
node create_slider_table.js
```

Script ini akan:
- Membuat tabel slider di database
- Menambahkan 3 sample data slider
- Siap digunakan langsung

## Cara Menggunakan

### Mengelola Slider (Admin)
1. Login ke admin panel: `http://localhost:3000/admin`
2. Klik menu "Slider" di sidebar
3. Klik "Tambah Slider" untuk menambah slider baru
4. Isi form dengan:
   - Judul (wajib)
   - Subjudul (opsional)
   - Deskripsi (opsional)
   - Upload gambar (wajib)
   - URL link (opsional)
   - Teks link (opsional)
   - Urutan (angka, semakin kecil semakin awal)
   - Status (aktif/nonaktif)

### Rekomendasi Gambar
- Resolusi: 1920x1080px (16:9)
- Format: JPG, PNG, GIF
- Ukuran maksimal: 2MB
- Pastikan teks pada gambar mudah dibaca

## JavaScript Functionality
- **Auto-play**: Slider berubah otomatis setiap 5 detik
- **Manual Navigation**: Tombol prev/next dan dot indicators
- **Smooth Transition**: Transisi opacity dengan durasi 1 detik
- **Responsive**: Menyesuaikan dengan ukuran layar

## CSS Styling
- **Modern Design**: Menggunakan gradient overlay dan shadow effects
- **Responsive**: Media queries untuk mobile dan tablet
- **Smooth Animations**: Hover effects dan transitions
- **Color Scheme**: Menggunakan variabel CSS dengan tema biru

## Sample Data
Database sudah terisi dengan 3 sample slider yang dapat langsung digunakan atau dimodifikasi sesuai kebutuhan.

## Status
✅ **SELESAI** - Fitur slider telah berhasil diimplementasi dan siap digunakan.