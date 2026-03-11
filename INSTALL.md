# Panduan Instalasi Website Sekolah

## Persiapan

### 1. Install Node.js
Download dan install Node.js dari https://nodejs.org (versi LTS)

### 2. Install MySQL
Pastikan MySQL sudah terinstall dan running di komputer Anda.

## Langkah Instalasi

### 1. Install Dependencies
Buka terminal/command prompt di folder project, lalu jalankan:
```bash
npm install
```

### 2. Setup Database

#### Cara 1: Menggunakan MySQL Command Line
```bash
mysql -u root -p
```
Lalu copy-paste isi file `config/database.sql`

#### Cara 2: Menggunakan phpMyAdmin
- Buka phpMyAdmin
- Buat database baru bernama `sekolah_db`
- Import file `config/database.sql`

#### Cara 3: Manual
Buka MySQL Workbench atau tool MySQL lainnya, lalu jalankan query dari file `config/database.sql`

### 3. Konfigurasi Database
File `.env` sudah dibuat dengan konfigurasi default:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sekolah_db
```

Jika konfigurasi MySQL Anda berbeda, edit file `.env` sesuai kebutuhan.

### 4. Jalankan Aplikasi

#### Development Mode (dengan auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 5. Akses Aplikasi

- **Website Public**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

**Login Admin:**
- Username: `admin`
- Password: `admin123`

## Troubleshooting

### Error: Cannot find module
Jalankan: `npm install`

### Error: ECONNREFUSED MySQL
- Pastikan MySQL service sudah running
- Cek konfigurasi di file `.env`

### Error: ER_BAD_DB_ERROR
- Database belum dibuat
- Jalankan script `config/database.sql`

### Error: ENOENT uploads
Buat folder uploads: `mkdir uploads`

### Port 3000 sudah digunakan
Edit file `.env`, ubah `PORT=3000` ke port lain, misalnya `PORT=3001`

## Tips

1. Untuk development, gunakan `npm run dev` agar server auto-reload saat ada perubahan
2. Ganti password admin default setelah instalasi
3. Backup database secara berkala
4. Untuk production, gunakan process manager seperti PM2

## Kontak

Jika ada pertanyaan atau masalah, silakan hubungi administrator.
