# Tutorial Deploy Website SMKN 1 Kras ke VPS
## Dari Upload GitHub sampai Website Online

---

## BAGIAN 1 — Upload ke GitHub (dari komputer lokal)

Buka **Git Bash** di folder `E:\WEBSITE\smkn1kras.sch.id`, lalu jalankan:

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/Hemrom/web.git
git push -u origin main
```

Jika diminta login, masukkan username dan password/token GitHub kamu.

> Untuk update berikutnya cukup:
> ```bash
> git add .
> git commit -m "update: deskripsi perubahan"
> git push
> ```

---

## BAGIAN 2 — Persiapan VPS

### Spesifikasi VPS yang Direkomendasikan
- OS: **Ubuntu 22.04 LTS**
- RAM: minimal 1GB (2GB lebih baik)
- Storage: minimal 20GB
- Provider: Niagahoster, Dewaweb, DigitalOcean, Contabo, dll

### Login ke VPS
```bash
ssh root@IP_VPS_KAMU
# Contoh: ssh root@103.xxx.xxx.xxx
```

---

## BAGIAN 3 — Install Semua yang Dibutuhkan di VPS

### 3.1 Update sistem
```bash
apt update && apt upgrade -y
```

### 3.2 Install Node.js 20
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
node -v   # Harus muncul v20.x.x
npm -v    # Harus muncul 10.x.x
```

### 3.3 Install PM2 (process manager)
```bash
npm install -g pm2
pm2 -v    # Harus muncul versi PM2
```

### 3.4 Install MySQL
```bash
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql

# Amankan MySQL
mysql_secure_installation
# Jawab: Y, Y, Y, Y, Y
```

### 3.5 Install Nginx
```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

### 3.6 Install Git
```bash
apt install -y git
git --version
```

### 3.7 Install Certbot (SSL gratis)
```bash
apt install -y certbot python3-certbot-nginx
```

---

## BAGIAN 4 — Setup Database MySQL

```bash
# Masuk ke MySQL
mysql -u root -p

# Jalankan perintah berikut di dalam MySQL:
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
CREATE USER 'smkn1kras'@'localhost' IDENTIFIED BY 'GantiPasswordIni123!';
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'smkn1kras'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

## BAGIAN 5 — Clone dan Setup Website

### 5.1 Clone dari GitHub
```bash
cd /var/www
git clone https://github.com/Hemrom/web.git smkn1kras
cd smkn1kras
```

### 5.2 Buat file .env
```bash
cp .env.example .env
nano .env
```

Isi file `.env` seperti ini:
```env
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

DB_HOST=127.0.0.1
DB_USER=smkn1kras
DB_PASSWORD=GantiPasswordIni123!
DB_NAME=sekolah_db

SESSION_SECRET=isi_dengan_random_string_minimal_64_karakter_contoh_xK9mP2qR7vN4wL1jH8
COOKIE_SECURE=true
```

> Untuk generate SESSION_SECRET yang aman:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 5.3 Import database
```bash
mysql -u smkn1kras -p sekolah_db < config/database.sql
# Masukkan password: GantiPasswordIni123!
```

### 5.4 Install dependencies
```bash
npm install --omit=dev
```

### 5.5 Buat folder yang dibutuhkan
```bash
mkdir -p uploads logs public
touch uploads/.gitkeep
```

### 5.6 Setup akun login guru
```bash
node setup_guru_login.js
```

### 5.7 Jalankan dengan PM2
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
# Jalankan perintah yang muncul dari pm2 startup
```

Cek apakah berjalan:
```bash
pm2 status
# Harus muncul status "online"
```

---

## BAGIAN 6 — Konfigurasi Nginx

### 6.1 Buat config Nginx
```bash
nano /etc/nginx/sites-available/smkn1kras
```

Isi dengan:
```nginx
server {
    listen 80;
    server_name smkn1kras.sch.id www.smkn1kras.sch.id;

    # Redirect HTTP ke HTTPS (aktifkan setelah SSL terpasang)
    # return 301 https://$host$request_uri;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_read_timeout 60s;
    }

    client_max_body_size 10M;
}
```

### 6.2 Aktifkan config
```bash
ln -s /etc/nginx/sites-available/smkn1kras /etc/nginx/sites-enabled/
nginx -t   # Harus muncul "syntax is ok"
systemctl reload nginx
```

### 6.3 Pasang SSL (setelah domain sudah diarahkan ke IP VPS)
```bash
certbot --nginx -d smkn1kras.sch.id -d www.smkn1kras.sch.id
# Ikuti instruksi, pilih redirect HTTP ke HTTPS
```

---

## BAGIAN 7 — Firewall

```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw deny 3000    # Tutup port Node.js dari akses luar
ufw enable
ufw status
```

---

## BAGIAN 8 — Cara Update Website

Setiap kali ada perubahan kode:

**Di komputer lokal:**
```bash
git add .
git commit -m "update: deskripsi perubahan"
git push
```

**Di VPS:**
```bash
cd /var/www/smkn1kras
bash update.sh
```

Script `update.sh` otomatis:
1. Pull kode terbaru dari GitHub
2. Install dependency baru (jika ada)
3. Reload app tanpa downtime

---

## BAGIAN 9 — Perintah Berguna

```bash
# Cek status app
pm2 status

# Lihat log real-time
pm2 logs smkn1kras.sch.id

# Restart app
pm2 restart smkn1kras.sch.id

# Cek Nginx
systemctl status nginx

# Cek MySQL
systemctl status mysql

# Backup database
mysqldump -u smkn1kras -p sekolah_db > backup_$(date +%Y%m%d).sql
```

---

## BAGIAN 10 — Checklist Sebelum Go Live

- [ ] Domain sudah diarahkan ke IP VPS (DNS A record)
- [ ] SSL certificate terpasang (HTTPS aktif)
- [ ] File `.env` sudah diisi dengan benar
- [ ] `COOKIE_SECURE=true` di `.env`
- [ ] Database sudah diimport
- [ ] Akun admin sudah bisa login
- [ ] Upload foto berfungsi
- [ ] Firewall aktif, port 3000 ditutup
- [ ] PM2 startup sudah dijalankan (auto-start saat VPS reboot)

---

## Akses Website

| Halaman | URL |
|---------|-----|
| Website | https://smkn1kras.sch.id |
| Admin Panel | https://smkn1kras.sch.id/admin |
| Portal Guru | https://smkn1kras.sch.id/guru/login |

**Login Admin default:**
- Username: `admin`
- Password: `admin123` ← **Ganti segera setelah login pertama!**

**Login Guru default:**
- Username: NIP atau `guru{id}`
- Password: `smkn1kras` ← **Guru wajib ganti password**
