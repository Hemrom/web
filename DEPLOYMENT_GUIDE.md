# 🚀 PANDUAN DEPLOYMENT KE VPS

## 📋 Persiapan Sebelum Deploy

### 1. Persiapan File untuk GitHub
Sebelum push ke GitHub, pastikan file-file sensitif tidak ikut terupload:

#### A. Update .gitignore
```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment variables
.env

# Uploads folder (opsional, tergantung kebutuhan)
uploads/*
!uploads/.gitkeep

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage/

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Test files (opsional)
test_*.js
analyze_*.js
```

#### B. Buat .env.example
Template environment variables untuk VPS:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=sekolah_db

# CBT Database Configuration (opsional)
CBT_DB_HOST=localhost
CBT_DB_USER=your_cbt_db_user
CBT_DB_PASSWORD=your_cbt_db_password
CBT_DB_NAME=cbt_kras

# Session Secret
SESSION_SECRET=your_super_secret_key_here

# Server Configuration
PORT=3000
NODE_ENV=production
```

### 2. Persiapan VPS

#### A. Spesifikasi VPS Minimum:
- **RAM**: 1GB (2GB recommended)
- **Storage**: 20GB
- **OS**: Ubuntu 20.04/22.04 LTS
- **CPU**: 1 vCPU

#### B. Software yang Dibutuhkan di VPS:
- Node.js (v16 atau lebih baru)
- MySQL/MariaDB
- Nginx (web server)
- PM2 (process manager)
- Git

## 🛠️ LANGKAH-LANGKAH DEPLOYMENT

### STEP 1: Setup GitHub Repository

1. **Inisialisasi Git** (jika belum):
```bash
git init
git add .
git commit -m "Initial commit - Website Sekolah SMK N 1 Kras"
```

2. **Buat Repository di GitHub**:
- Buka github.com
- Klik "New repository"
- Nama: `website-sekolah-smkn1kras`
- Set sebagai Private (recommended)
- Jangan centang "Initialize with README"

3. **Push ke GitHub**:
```bash
git remote add origin https://github.com/USERNAME/website-sekolah-smkn1kras.git
git branch -M main
git push -u origin main
```

### STEP 2: Setup VPS

1. **Login ke VPS**:
```bash
ssh root@your-vps-ip
```

2. **Update System**:
```bash
apt update && apt upgrade -y
```

3. **Install Node.js**:
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs
```

4. **Install MySQL**:
```bash
apt install mysql-server -y
mysql_secure_installation
```

5. **Install Nginx**:
```bash
apt install nginx -y
systemctl start nginx
systemctl enable nginx
```

6. **Install PM2**:
```bash
npm install -g pm2
```

### STEP 3: Deploy Aplikasi

1. **Clone Repository**:
```bash
cd /var/www
git clone https://github.com/USERNAME/website-sekolah-smkn1kras.git
cd website-sekolah-smkn1kras
```

2. **Install Dependencies**:
```bash
npm install
```

3. **Setup Environment**:
```bash
cp .env.example .env
nano .env
```
Edit sesuai konfigurasi VPS Anda.

4. **Setup Database**:
```bash
mysql -u root -p
```
```sql
CREATE DATABASE sekolah_db;
CREATE USER 'sekolah_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'sekolah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

5. **Import Database**:
```bash
mysql -u sekolah_user -p sekolah_db < config/database.sql
```

6. **Create Admin User**:
```bash
node create_admin.js
```

7. **Setup Folder Uploads**:
```bash
mkdir -p uploads
chmod 755 uploads
```

### STEP 4: Configure Nginx

1. **Buat Nginx Config**:
```bash
nano /etc/nginx/sites-available/sekolah
```

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /assets {
        alias /var/www/website-sekolah-smkn1kras/assets;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    location /uploads {
        alias /var/www/website-sekolah-smkn1kras/uploads;
        expires 1y;
        add_header Cache-Control "public";
    }
}
```

2. **Enable Site**:
```bash
ln -s /etc/nginx/sites-available/sekolah /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### STEP 5: Start Application dengan PM2

1. **Buat PM2 Ecosystem File**:
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'website-sekolah',
    script: 'server.js',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
};
```

2. **Start dengan PM2**:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### STEP 6: Setup SSL (Opsional tapi Recommended)

1. **Install Certbot**:
```bash
apt install certbot python3-certbot-nginx -y
```

2. **Generate SSL Certificate**:
```bash
certbot --nginx -d your-domain.com -d www.your-domain.com
```

## 🔄 UPDATE & MAINTENANCE

### Update Aplikasi dari GitHub:
```bash
cd /var/www/website-sekolah-smkn1kras
git pull origin main
npm install
pm2 restart website-sekolah
```

### Backup Database:
```bash
mysqldump -u sekolah_user -p sekolah_db > backup_$(date +%Y%m%d).sql
```

### Monitor Aplikasi:
```bash
pm2 status
pm2 logs website-sekolah
pm2 monit
```

## 🔧 TROUBLESHOOTING

### Jika Aplikasi Tidak Bisa Diakses:
1. Cek status PM2: `pm2 status`
2. Cek logs: `pm2 logs website-sekolah`
3. Cek Nginx: `nginx -t && systemctl status nginx`
4. Cek firewall: `ufw status`

### Jika Database Error:
1. Cek koneksi MySQL: `mysql -u sekolah_user -p`
2. Cek konfigurasi .env
3. Pastikan database dan tabel sudah dibuat

### Performance Optimization:
1. Enable Nginx gzip compression
2. Setup Redis untuk session storage
3. Optimize MySQL queries
4. Use CDN for static assets

## 📱 AKSES WEBSITE

Setelah deployment berhasil:
- **Frontend**: http://your-domain.com
- **Admin Panel**: http://your-domain.com/admin
- **Login Admin**: admin / admin123

## 🔐 KEAMANAN

1. **Ganti Password Default**:
   - Admin panel password
   - MySQL root password
   - Database user password

2. **Setup Firewall**:
```bash
ufw allow ssh
ufw allow 'Nginx Full'
ufw enable
```

3. **Regular Updates**:
```bash
apt update && apt upgrade -y
npm audit fix
```

## 📞 SUPPORT

Jika mengalami kesulitan deployment, pastikan:
1. VPS memiliki spesifikasi minimum
2. Domain sudah pointing ke IP VPS
3. Semua dependencies terinstall
4. File .env sudah dikonfigurasi dengan benar
5. Database sudah dibuat dan diimport

---

**Status**: Ready for deployment 🚀
**Estimated Setup Time**: 30-60 menit
**Difficulty**: Intermediate