# Tutorial Upload GitHub & Deploy VPS - SMKN 1 Kras

---

# BAGIAN 1 — UPLOAD KE GITHUB

## Step 1.1 — Buat Repository di GitHub

1. Buka https://github.com → login dengan akun kamu
2. Klik tombol **"+"** pojok kanan atas → pilih **"New repository"**
3. Isi form:
   - Repository name: `web`
   - Visibility: pilih **Private**
   - JANGAN centang "Add a README file"
4. Klik **"Create repository"**

---

## Step 1.2 — Buat Personal Access Token

GitHub tidak menerima password biasa. Harus pakai token.

1. Klik foto profil kanan atas → **Settings**
2. Scroll paling bawah → klik **"Developer settings"**
3. Klik **"Personal access tokens"** → **"Tokens (classic)"**
4. Klik **"Generate new token"** → **"Generate new token (classic)"**
5. Isi:
   - Note: `smkn1kras deploy`
   - Expiration: **No expiration**
   - Centang: **repo** (centang kotak paling atas di bagian repo)
6. Klik **"Generate token"** di bawah
7. **COPY tokennya sekarang** — tidak bisa dilihat lagi setelah halaman ditutup
   - Contoh: `ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ123456`
   - Simpan di Notepad dulu

---

## Step 1.3 — Setup Identitas Git (Sekali Saja)

Buka **Git Bash** di folder `E:\WEBSITE\smkn1kras.sch.id`

Cara buka Git Bash di folder tersebut:
- Buka File Explorer → masuk ke folder `E:\WEBSITE\smkn1kras.sch.id`
- Klik kanan di area kosong → **"Git Bash Here"**

Jalankan:

```bash
git config --global user.email "emailkamu@gmail.com"
git config --global user.name "Hemrom"
```

Ganti dengan email yang dipakai di GitHub.

---

## Step 1.4 — Upload Project ke GitHub

Masih di Git Bash yang sama, jalankan **satu per satu**:

```bash
git remote remove origin
```
> Kalau muncul error "No such remote 'origin'", tidak apa-apa, lanjut ke perintah berikutnya.

```bash
git add .
```

```bash
git commit -m "full project smkn1kras"
```
> Kalau muncul "nothing to commit", berarti sudah pernah commit. Lanjut saja.

```bash
git branch -M main
```

```bash
git remote add origin https://github.com/Hemrom/web.git
```

```bash
git push -u origin main
```

Saat muncul popup login di browser → login dengan akun GitHub kamu.

Kalau muncul prompt di terminal:
- **Username**: `Hemrom`
- **Password**: paste **token** yang sudah dicopy di Step 1.2

Kalau berhasil akan muncul tulisan:
```
* [new branch]      main -> main
branch 'main' set up to track 'origin/main'.
```

---

## Step 1.5 — Verifikasi Upload Berhasil

Buka https://github.com/Hemrom/web — semua file project harus terlihat di sana.

---

## Step 1.6 — Cara Update Setelah Ada Perubahan Kode

Setiap kali ada perubahan, buka Git Bash di folder project lalu jalankan:

```bash
git add .
git commit -m "update: deskripsi perubahan"
git push
```

---

# BAGIAN 2 — SETUP VPS

## Step 2.1 — Spesifikasi VPS yang Direkomendasikan

- OS: **Ubuntu 22.04 LTS** (pilih ini saat order VPS)
- RAM: minimal 1GB (2GB lebih baik)
- Storage: minimal 20GB SSD
- Provider: Niagahoster, Dewaweb, DigitalOcean, Contabo, Vultr

---

## Step 2.2 — Login ke VPS

Buka **PowerShell** atau **Git Bash** di komputer lokal:

```bash
ssh root@IP_VPS_KAMU
```

Contoh: `ssh root@103.12.34.56`

Masukkan password VPS yang diberikan provider.

---

## Step 2.3 — Update Sistem

```bash
apt update && apt upgrade -y
```

Tunggu sampai selesai (bisa 2-5 menit).

---

## Step 2.4 — Install Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
```

Verifikasi:
```bash
node -v
npm -v
```
Harus muncul `v20.x.x` dan `10.x.x`

---

## Step 2.5 — Install PM2

```bash
npm install -g pm2
pm2 -v
```

---

## Step 2.6 — Install MySQL

```bash
apt install -y mysql-server
systemctl start mysql
systemctl enable mysql
```

Amankan MySQL:
```bash
mysql_secure_installation
```
Jawab semua pertanyaan dengan **Y** (tekan Y lalu Enter).

---

## Step 2.7 — Install Nginx

```bash
apt install -y nginx
systemctl start nginx
systemctl enable nginx
```

---

## Step 2.8 — Install Git dan Certbot

```bash
apt install -y git certbot python3-certbot-nginx
```

---

# BAGIAN 3 — SETUP DATABASE DI VPS

```bash
mysql -u root -p
```

Masukkan password root MySQL. Lalu jalankan perintah berikut **satu per satu** di dalam MySQL:

```sql
CREATE DATABASE sekolah_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

```sql
CREATE USER 'smkn1kras'@'localhost' IDENTIFIED BY 'GantiPasswordIni123!';
```

```sql
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'smkn1kras'@'localhost';
```

```sql
FLUSH PRIVILEGES;
```

```sql
EXIT;
```

---

# BAGIAN 4 — CLONE DAN SETUP WEBSITE DI VPS

## Step 4.1 — Clone dari GitHub

```bash
cd /var/www
git clone https://github.com/Hemrom/web.git smkn1kras
cd smkn1kras
```

Saat diminta login:
- Username: `Hemrom`
- Password: token GitHub kamu

---

## Step 4.2 — Buat File .env

```bash
cp .env.example .env
nano .env
```

Hapus semua isinya dan ganti dengan ini:

```
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

DB_HOST=127.0.0.1
DB_USER=smkn1kras
DB_PASSWORD=GantiPasswordIni123!
DB_NAME=sekolah_db

SESSION_SECRET=GANTI_INI_DENGAN_HASIL_PERINTAH_DI_BAWAH
COOKIE_SECURE=true
```

Untuk mengisi SESSION_SECRET, buka terminal baru dan jalankan:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
Copy hasilnya → paste ke SESSION_SECRET.

Simpan file: tekan `Ctrl+X` → tekan `Y` → tekan `Enter`

---

## Step 4.3 — Import Database

```bash
mysql -u smkn1kras -p sekolah_db < config/database.sql
```

Masukkan password: `GantiPasswordIni123!`

---

## Step 4.4 — Install Dependencies

```bash
npm install --omit=dev
```

---

## Step 4.5 — Buat Folder yang Dibutuhkan

```bash
mkdir -p uploads logs public
touch uploads/.gitkeep
```

---

## Step 4.6 — Setup Akun Login Guru

```bash
node setup_guru_login.js
```

---

## Step 4.7 — Jalankan dengan PM2

```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

Setelah `pm2 startup`, akan muncul perintah panjang yang harus dijalankan. Copy dan jalankan perintah tersebut.

Cek status:
```bash
pm2 status
```

Harus muncul status **online**.

---

# BAGIAN 5 — KONFIGURASI NGINX

## Step 5.1 — Buat Config Nginx

```bash
nano /etc/nginx/sites-available/smkn1kras
```

Paste isi berikut (ganti `smkn1kras.sch.id` dengan domain kamu):

```nginx
server {
    listen 80;
    server_name smkn1kras.sch.id www.smkn1kras.sch.id;

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

Simpan: `Ctrl+X` → `Y` → `Enter`

---

## Step 5.2 — Aktifkan Config

```bash
ln -s /etc/nginx/sites-available/smkn1kras /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

`nginx -t` harus muncul **"syntax is ok"**.

---

## Step 5.3 — Pasang SSL (Setelah Domain Aktif)

Pastikan domain sudah diarahkan ke IP VPS dulu (DNS A record di panel domain).

```bash
certbot --nginx -d smkn1kras.sch.id -d www.smkn1kras.sch.id
```

Ikuti instruksi, pilih opsi redirect HTTP ke HTTPS.

---

# BAGIAN 6 — FIREWALL

```bash
ufw allow ssh
ufw allow 80
ufw allow 443
ufw deny 3000
ufw enable
```

Ketik `y` saat diminta konfirmasi.

---

# BAGIAN 7 — CARA UPDATE WEBSITE

Setiap ada perubahan kode:

**Di komputer lokal (Git Bash):**
```bash
git add .
git commit -m "update: deskripsi"
git push
```

**Di VPS:**
```bash
cd /var/www/smkn1kras
bash update.sh
```

Selesai — website otomatis update tanpa downtime.

---

# BAGIAN 8 — PERINTAH BERGUNA DI VPS

```bash
pm2 status                          # Cek status app
pm2 logs smkn1kras.sch.id           # Lihat log real-time
pm2 restart smkn1kras.sch.id        # Restart app
pm2 reload smkn1kras.sch.id         # Reload tanpa downtime
systemctl status nginx              # Cek Nginx
systemctl reload nginx              # Reload Nginx
systemctl status mysql              # Cek MySQL
```

Backup database:
```bash
mysqldump -u smkn1kras -p sekolah_db > backup_$(date +%Y%m%d).sql
```

---

# BAGIAN 9 — CHECKLIST SEBELUM GO LIVE

- [ ] Domain sudah diarahkan ke IP VPS (DNS A record)
- [ ] SSL certificate terpasang (HTTPS aktif)
- [ ] File `.env` sudah diisi dengan benar
- [ ] `COOKIE_SECURE=true` di `.env`
- [ ] Database sudah diimport
- [ ] `pm2 startup` sudah dijalankan
- [ ] Firewall aktif, port 3000 ditutup
- [ ] Login admin berhasil
- [ ] Upload foto berfungsi
- [ ] Website bisa diakses dari browser

---

# AKSES WEBSITE

| Halaman | URL |
|---------|-----|
| Website | https://smkn1kras.sch.id |
| Admin Panel | https://smkn1kras.sch.id/admin |
| Portal Guru | https://smkn1kras.sch.id/guru/login |

**Login Admin:** username `admin` / password `admin123`
Ganti password segera setelah login pertama!

**Login Guru:** username = NIP atau `guru{id}` / password = `smkn1kras`
Guru wajib ganti password setelah login pertama.
