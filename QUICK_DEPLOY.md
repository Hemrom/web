# ⚡ QUICK DEPLOY CHECKLIST

## 🚀 Langkah Cepat Deploy ke VPS

### 1. Persiapan Lokal (5 menit)
```bash
# Copy environment template
cp .env.example .env

# Edit .env sesuai kebutuhan lokal
nano .env

# Test aplikasi lokal
npm install
npm start
```

### 2. Push ke GitHub (2 menit)
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Setup VPS (15 menit)
```bash
# Login ke VPS
ssh root@your-vps-ip

# Install dependencies
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
apt-get install -y nodejs mysql-server nginx
npm install -g pm2

# Clone project
cd /var/www
git clone https://github.com/USERNAME/website-sekolah-smkn1kras.git
cd website-sekolah-smkn1kras
npm install
```

### 4. Database Setup (5 menit)
```bash
# Setup MySQL
mysql -u root -p
```
```sql
CREATE DATABASE sekolah_db;
CREATE USER 'sekolah_user'@'localhost' IDENTIFIED BY 'strong_password';
GRANT ALL PRIVILEGES ON sekolah_db.* TO 'sekolah_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```
```bash
# Import database
mysql -u sekolah_user -p sekolah_db < config/database.sql

# Create admin
node create_admin.js
```

### 5. Configure & Start (5 menit)
```bash
# Setup environment
cp .env.example .env
nano .env  # Edit database credentials

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

### 6. Nginx Setup (3 menit)
```bash
# Create nginx config
nano /etc/nginx/sites-available/sekolah
```
Copy config dari DEPLOYMENT_GUIDE.md, lalu:
```bash
ln -s /etc/nginx/sites-available/sekolah /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

## ✅ Verifikasi
- [ ] Website bisa diakses: http://your-domain.com
- [ ] Admin panel bisa diakses: http://your-domain.com/admin
- [ ] Login admin berhasil: admin/admin123
- [ ] Upload gambar berfungsi
- [ ] Database terhubung

## 🔧 Commands Berguna
```bash
# Restart aplikasi
pm2 restart website-sekolah

# Update dari GitHub
git pull origin main && pm2 restart website-sekolah

# Check logs
pm2 logs website-sekolah

# Check status
pm2 status
```

**Total waktu setup**: ~35 menit
**Skill level**: Intermediate