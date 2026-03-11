# Quick Start - Website Sekolah

## 🚀 Langkah Cepat

### 1. Setup Database
Buka MySQL (phpMyAdmin/MySQL Workbench) dan jalankan semua query di file `config/database.sql`

**ATAU** gunakan script otomatis:
```bash
node create_slider_table.js
```

### 2. Jalankan Server
```bash
npm start
```

### 3. Akses Website
- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 4. Login Admin
- Username: `admin`
- Password: `admin123`

## ✅ Yang Sudah Bisa Digunakan

### Frontend (Public)
- ✅ Halaman beranda dengan hero slider
- ✅ Profil sekolah
- ✅ Berita & artikel
- ✅ Galeri foto
- ✅ Daftar guru & staff
- ✅ Form kontak
- ✅ Responsive design

### Admin Panel
- ✅ Login & logout
- ✅ Dashboard dengan statistik
- ✅ Kelola profil sekolah
- ✅ Kelola slider hero section
- ✅ Kelola berita (CRUD)
- ✅ Kelola galeri foto
- ✅ Kelola data guru
- ✅ Lihat kontak masuk
- ✅ Upload gambar

## 🔧 Troubleshooting

**Error: Unknown database 'sekolah_db'**
→ Jalankan file `config/database.sql` di MySQL

**Error: ECONNREFUSED**
→ Pastikan MySQL service running

**Error: Cannot find module**
→ Jalankan: `npm install`

## 📁 Struktur Project

```
├── assets/              # Template SB Admin 2
├── config/              # Database config & SQL
├── controllers/         # Logic aplikasi
├── middleware/          # Auth middleware
├── routes/              # Route definitions
├── views/               # EJS templates
│   ├── admin/          # Admin panel views
│   └── frontend/       # Public website views
├── uploads/            # File upload folder
└── server.js           # Entry point
```

## 🎯 Fitur Utama

- **Multi-role**: Admin & Guru (extensible)
- **File Upload**: Logo, foto guru, gambar berita/galeri
- **SEO Friendly**: Clean URLs dengan slug
- **Responsive**: Mobile-friendly design
- **Security**: Password hashing, session management
- **Database**: Relational design dengan foreign keys

## 🚀 Ready to Use!

Website sudah siap digunakan untuk sekolah dengan fitur lengkap!