# Panduan Deploy & Keamanan VPS

## 1. Konfigurasi .env untuk Production

```env
NODE_ENV=production
PORT=3000
HOST=127.0.0.1

DB_HOST=127.0.0.1
DB_USER=user_db_khusus        # JANGAN pakai root!
DB_PASSWORD=password_kuat_123!
DB_NAME=sekolah_db

SESSION_SECRET=ganti_dengan_random_string_64_karakter_atau_lebih
COOKIE_SECURE=true             # Wajib true jika pakai HTTPS
```

## 2. Setup VPS (Ubuntu/Debian)

```bash
# Update sistem
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx
sudo apt install -y nginx

# Install Certbot (SSL gratis)
sudo apt install -y certbot python3-certbot-nginx
```

## 3. Nginx Config (Reverse Proxy + SSL)

```nginx
# /etc/nginx/sites-available/smkn1kras
server {
    listen 80;
    server_name smkn1kras.sch.id www.smkn1kras.sch.id;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl;
    server_name smkn1kras.sch.id www.smkn1kras.sch.id;

    ssl_certificate /etc/letsencrypt/live/smkn1kras.sch.id/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/smkn1kras.sch.id/privkey.pem;

    # Security headers
    add_header X-Frame-Options "DENY";
    add_header X-Content-Type-Options "nosniff";
    add_header X-XSS-Protection "1; mode=block";

    # Batasi ukuran upload
    client_max_body_size 10M;

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
    }
}
```

## 4. Database - Buat User Khusus (JANGAN pakai root)

```sql
CREATE USER 'smkn1kras_user'@'localhost' IDENTIFIED BY 'password_kuat!';
GRANT SELECT, INSERT, UPDATE, DELETE ON sekolah_db.* TO 'smkn1kras_user'@'localhost';
FLUSH PRIVILEGES;
```

## 5. Jalankan dengan PM2

```bash
cd /var/www/smkn1kras
npm install --production
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

## 6. SSL Certificate

```bash
sudo certbot --nginx -d smkn1kras.sch.id -d www.smkn1kras.sch.id
```

## 7. Firewall

```bash
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443
sudo ufw deny 3000    # Tutup port Node.js dari luar
sudo ufw enable
```

## 8. Backup Otomatis Database

```bash
# Tambahkan ke crontab (crontab -e)
0 2 * * * mysqldump -u smkn1kras_user -p'password' sekolah_db > /backup/db_$(date +\%Y\%m\%d).sql
```
