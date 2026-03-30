# Website Resmi SMKN 1 Kras

Website sekolah berbasis Node.js + Express + MySQL, dilengkapi panel admin, portal guru, dan integrasi database CBT.

---

## Teknologi

- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Template**: EJS
- **Frontend**: Bootstrap 5, SB Admin 2
- **Upload**: Multer + Sharp (kompresi otomatis)
- **Auth**: Express Session + bcrypt
- **Process Manager**: PM2

---

## Fitur Utama

### Frontend Publik
- Beranda dengan slider, berita, galeri, jurusan
- Profil sekolah, visi misi, sejarah, sambutan kepsek
- Halaman berita dengan pagination
- Galeri foto
- Data guru & staff
- Media sosial (YouTube, TikTok, Instagram, Facebook)
- Form kontak
- Halaman dinamis per program keahlian

### Panel Admin (`/admin`)
- Dashboard statistik
- Kelola berita, galeri, slider
- Kelola guru & staff (import/export Excel, sync CBT)
- Kelola siswa
- Kelola jurusan
- Kelola menu navigasi
- Kelola halaman dinamis
- Profil sekolah
- Kontrol website (maintenance mode, tampilan)
- Manajemen user admin

### Portal Guru (`/guru/login`)
- Login khusus guru
- Edit profil sendiri (foto, data diri)
- Ganti password

---

## Instalasi Lokal

### 1. Clone repository
Kalau Anda sudah punya folder yang berisi file, maka jangan clone ke situ langsung. Lebih aman begini:
```
cd /website
git init
git remote add origin https://github.com/Hemrom/web.git
git fetch origin
git checkout -t origin/main
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup database
```bash
mysql -u root -p
```
```sql
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'smkn1kras'@'localhost' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'smkn1kras'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
```bash
mysql -u smkn1kras -p sekolah_db < config/database.sql
```

### 4. Konfigurasi .env
```bash
cp .env.example .env
```
Edit file `.env` sesuai konfigurasi database lokal.

### 5. Setup akun guru
```bash
node setup_guru_login.js
```

### 6. Jalankan
```bash
npm start
```

Akses di `http://localhost:3000`

---

## Akses

| Halaman | URL |
|---------|-----|
| Website | http://localhost:3000 |
| Admin Panel | http://localhost:3000/admin |
| Portal Guru | http://localhost:3000/guru/login |

**Admin default:** username `admin` / password `admin123`

**Guru default:** username = NIP atau `guru{id}` / password = `smkn1kras`

---

## Deploy ke VPS

Lihat panduan lengkap di [TUTORIAL_DEPLOY_VPS.md](TUTORIAL_DEPLOY_VPS.md)

---

## Struktur Folder

```
├── assets/           # CSS, JS, gambar statis
├── config/           # Konfigurasi database
├── controllers/      # Logic controller
├── middleware/       # Auth, CSRF, security, cache
├── routes/           # Definisi route
├── utils/            # Helper (cache, dll)
├── views/            # Template EJS
│   ├── admin/        # Halaman admin
│   ├── frontend/     # Halaman publik
│   └── guru/         # Portal guru
├── uploads/          # File yang diupload
└── logs/             # Log aplikasi
```
---
## Cara update isi GitHub dari Windows

Kalau Anda coding di Windows lalu ingin perubahan naik ke GitHub, alurnya adalah:
Pertama kali, kalau project belum jadi repo Git
Masuk ke folder project Anda di Windows, lalu buka Git Bash atau terminal:
```
git init
git remote add origin https://github.com/Hemrom/web.git
git branch -M main
git add .
git commit -m "Initial commit"
git push -u origin main
```
## Kalau project itu memang hasil clone dari GitHub

Maka setiap ada perubahan, cukup:
```
git add .
git commit -m "Update coding terbaru"
git push origin main
```
## Sebelum push, sebaiknya ambil update dulu

Kalau repo di GitHub mungkin berubah dari tempat lain, lakukan dulu:
```
git pull origin main
```
baru lanjut:
```
git add .
git commit -m "Perubahan terbaru"
git push origin main
```

SMK Negeri 1 Kras — Kediri, Jawa Timur
