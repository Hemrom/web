# 🏫 Website Sekolah SMK N 1 Kras

Website resmi SMK Negeri 1 Kras yang dibangun dengan Node.js, Express, dan MySQL. Dilengkapi dengan panel admin untuk manajemen konten dan integrasi database CBT untuk data siswa dan guru.

## ✨ Fitur Utama

### 🌐 Frontend Publik
- **Beranda**: Slider, berita terbaru, informasi sekolah
- **Profil Sekolah**: Visi, misi, sejarah sekolah
- **Berita**: Artikel dan pengumuman sekolah
- **Galeri**: Foto kegiatan sekolah
- **Data Guru**: Profil guru dan staff
- **Media Sosial**: Embed konten dari TikTok, YouTube, Instagram, Facebook, Twitter
- **Kontak**: Form kontak dan informasi sekolah
- **Responsive Design**: Optimal di desktop dan mobile

### 🔧 Panel Admin
- **Dashboard**: Statistik dan overview
- **Manajemen Berita**: CRUD berita dengan upload gambar
- **Manajemen Galeri**: Upload dan kelola foto
- **Manajemen Guru**: Data guru dengan foto profil
- **Manajemen Siswa**: Data siswa dengan integrasi CBT
- **Manajemen Jurusan**: TKJ, KULINER, TKR, TPTU
- **Manajemen Slider**: Banner beranda
- **Media Sosial**: Kelola konten embed
- **Profil Sekolah**: Update informasi sekolah
- **Kontak Masuk**: Kelola pesan dari form kontak

### 🔗 Integrasi Database CBT
- **Sinkronisasi Siswa**: Import otomatis data siswa dari database CBT
- **Sinkronisasi Guru**: Import otomatis data guru dari database CBT
- **Mapping Otomatis**: Siswa ke jurusan berdasarkan kelas
- **Update Real-time**: Sinkronisasi data terbaru

## 🛠️ Teknologi

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Template Engine**: EJS
- **Frontend**: Bootstrap 4, SB Admin 2
- **File Upload**: Multer
- **Authentication**: Express Session
- **Password Hashing**: bcrypt

## 📋 Persyaratan Sistem

- Node.js v16 atau lebih baru
- MySQL 5.7 atau lebih baru
- RAM minimum 1GB
- Storage minimum 2GB

## 🚀 Instalasi & Setup

### 1. Clone Repository
```bash
git clone https://github.com/USERNAME/website-sekolah-smkn1kras.git
cd website-sekolah-smkn1kras
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Database
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE sekolah_db;
CREATE USER 'sekolah_user'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'sekolah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;

# Import struktur database
mysql -u sekolah_user -p sekolah_db < config/database.sql
```

### 4. Konfigurasi Environment
```bash
cp .env.example .env
nano .env  # Edit sesuai konfigurasi Anda
```

### 5. Buat Admin User
```bash
node create_admin.js
```

### 6. Jalankan Aplikasi
```bash
# Development
npm start

# Production dengan PM2
npm install -g pm2
pm2 start ecosystem.config.js --env production
```

## 🌐 Deployment ke VPS

### Quick Deploy
```bash
# Jalankan script deployment
./deploy.sh production
# atau di Windows
deploy.bat production
```

### Manual Deploy
Ikuti panduan lengkap di [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)

## 📱 Akses Website

- **Frontend**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin
- **Login Admin**: 
  - Username: `admin`
  - Password: `admin123`

## 📊 Struktur Database

### Tabel Utama:
- `admin` - Data administrator
- `berita` - Artikel dan berita
- `galeri` - Foto galeri
- `guru` - Data guru dan staff
- `siswa` - Data siswa
- `jurusan` - Data jurusan (TKJ, KULINER, TKR, TPTU)
- `slider` - Banner beranda
- `media_sosial` - Konten media sosial
- `profil_sekolah` - Informasi sekolah
- `kontak_masuk` - Pesan dari form kontak

### Integrasi CBT:
- Sinkronisasi dari tabel `users` dengan role `STUDENT` dan `TEACHER`
- Mapping otomatis ke tabel lokal

## 🔧 Fitur Khusus

### Integrasi Database CBT
```bash
# Sinkronisasi siswa
node sync_siswa_from_cbt.js

# Sinkronisasi guru  
node sync_guru_from_cbt.js

# Atau melalui admin panel dengan tombol "Sinkronisasi CBT"
```

### Media Sosial Embed
Mendukung embed dari:
- TikTok
- YouTube
- Instagram
- Facebook
- Twitter

### Upload & File Management
- Upload gambar untuk berita, galeri, guru
- Resize otomatis untuk optimasi
- Validasi tipe file
- Folder terorganisir

## 🔐 Keamanan

- Password hashing dengan bcrypt
- Session-based authentication
- File upload validation
- SQL injection protection
- XSS protection

## 📈 Performance

- Optimized database queries
- Image compression
- Static file caching
- Gzip compression (Nginx)
- PM2 process management

## 🛠️ Development

### Struktur Folder
```
├── assets/          # Static files (CSS, JS, images)
├── config/          # Database configuration
├── controllers/     # Route controllers
├── middleware/      # Custom middleware
├── routes/          # Route definitions
├── views/           # EJS templates
├── uploads/         # Uploaded files
└── logs/           # Application logs
```

### Commands Berguna
```bash
# Development
npm run dev          # Start with nodemon

# Production
pm2 start ecosystem.config.js
pm2 logs website-sekolah
pm2 restart website-sekolah

# Database
node create_admin.js           # Create admin user
node sync_siswa_from_cbt.js   # Sync students
node sync_guru_from_cbt.js    # Sync teachers
```

## 📞 Support & Maintenance

### Backup Database
```bash
mysqldump -u sekolah_user -p sekolah_db > backup_$(date +%Y%m%d).sql
```

### Update Aplikasi
```bash
git pull origin main
npm install
pm2 restart website-sekolah
```

### Monitor Logs
```bash
pm2 logs website-sekolah
tail -f logs/combined.log
```

## 📄 Lisensi

Proyek ini dibuat khusus untuk SMK Negeri 1 Kras.

## 👥 Tim Pengembang

- **Developer**: [Nama Developer]
- **Sekolah**: SMK Negeri 1 Kras
- **Tahun**: 2024

## 📚 Dokumentasi Tambahan

- [Panduan Deployment](DEPLOYMENT_GUIDE.md)
- [Quick Deploy](QUICK_DEPLOY.md)
- [Integrasi CBT](INTEGRASI_DATABASE_CBT.md)
- [Manajemen Jurusan](MANAJEMEN_JURUSAN_COMPLETED.md)
- [Fitur Media Sosial](MEDIA_SOSIAL_FEATURE.md)

---

**Status**: Production Ready ✅  
**Version**: 1.0.0  
**Last Updated**: 2024
# website
# web
# web
