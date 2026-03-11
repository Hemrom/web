# Panduan Pengembangan Lanjutan

## Fitur yang Bisa Ditambahkan

### 1. Manajemen User
- Tambah user admin/guru baru
- Edit profil user
- Ganti password
- Role-based access control lebih detail

### 2. Siswa & Alumni
- Database siswa per kelas
- Profil alumni
- Pencarian siswa/alumni

### 3. Prestasi
- Modul khusus prestasi siswa
- Kategori prestasi (akademik, olahraga, seni)
- Timeline prestasi

### 4. Agenda & Kalender
- Kalender akademik
- Jadwal kegiatan
- Reminder otomatis

### 5. Download Center
- Upload file dokumen
- Kategori dokumen
- Download counter

### 6. Pengumuman Pop-up
- Pengumuman penting di homepage
- Auto-show untuk pengunjung baru

### 7. Search & Filter
- Pencarian berita
- Filter berita by kategori
- Filter galeri by kategori

### 8. Comments
- Komentar di berita
- Moderasi komentar
- Anti-spam

### 9. Newsletter
- Subscribe newsletter
- Kirim email blast
- Template email

### 10. Analytics
- Dashboard analytics
- Visitor counter
- Popular content

### 11. Multi-language
- Bahasa Indonesia & Inggris
- Language switcher

### 12. Social Media Integration
- Share button
- Social media feed
- Auto-post ke social media

## Optimasi

### Performance
```javascript
// Caching
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 600 });

// Compression
const compression = require('compression');
app.use(compression());

// Image optimization
const sharp = require('sharp');
```

### Security
```javascript
// Helmet untuk security headers
const helmet = require('helmet');
app.use(helmet());

// Rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// CSRF protection
const csrf = require('csurf');
app.use(csrf());
```

### Database
```javascript
// Connection pooling (sudah ada)
// Indexing untuk performa
ALTER TABLE berita ADD INDEX idx_status (status);
ALTER TABLE berita ADD INDEX idx_slug (slug);

// Full-text search
ALTER TABLE berita ADD FULLTEXT(judul, konten);
```

## Struktur Kode Best Practices

### 1. Validation
```javascript
// Gunakan express-validator
const { body, validationResult } = require('express-validator');

router.post('/berita/create', [
  body('judul').notEmpty().trim(),
  body('konten').notEmpty(),
  body('kategori').isIn(['umum', 'pengumuman', 'kegiatan', 'prestasi'])
], beritaController.create);
```

### 2. Error Handling
```javascript
// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err.message });
});
```

### 3. Logging
```javascript
// Winston untuk logging
const winston = require('winston');
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

### 4. Environment Variables
```javascript
// Validasi env variables
const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_NAME', 'SESSION_SECRET'];
requiredEnv.forEach(key => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
```

## Testing

### Unit Testing
```javascript
// Jest
npm install --save-dev jest supertest

// test/berita.test.js
const request = require('supertest');
const app = require('../server');

describe('Berita API', () => {
  test('GET /berita should return berita list', async () => {
    const response = await request(app).get('/berita');
    expect(response.statusCode).toBe(200);
  });
});
```

### Integration Testing
```javascript
// Test database operations
// Test authentication flow
// Test file uploads
```

## Deployment

### Production Checklist
- [ ] Ganti SESSION_SECRET
- [ ] Set NODE_ENV=production
- [ ] Enable HTTPS
- [ ] Setup backup database
- [ ] Configure firewall
- [ ] Setup monitoring
- [ ] Enable logging
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Setup CDN

### PM2 Process Manager
```bash
npm install -g pm2
pm2 start server.js --name "web-sekolah"
pm2 startup
pm2 save
```

### Nginx Reverse Proxy
```nginx
server {
    listen 80;
    server_name sekolah.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Maintenance

### Backup Database
```bash
# Backup
mysqldump -u root -p sekolah_db > backup_$(date +%Y%m%d).sql

# Restore
mysql -u root -p sekolah_db < backup_20240101.sql
```

### Update Dependencies
```bash
npm outdated
npm update
npm audit fix
```

### Monitor Logs
```bash
pm2 logs web-sekolah
tail -f error.log
```
