const express = require('express');
const session = require('express-session');
const path = require('path');
const compression = require('compression');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

app.set('trust proxy', 1);

// Health check
app.get('/healthz', (req, res) => res.status(200).send('ok'));

// Compression (gzip) — harus sebelum semua middleware lain
app.use(compression({ level: 6, threshold: 1024 }));

// Security middleware
const { generalLimiter, helmetConfig, hpp } = require('./middleware/security');
const { xssSanitize, secureHeaders } = require('./middleware/securityHardening');
const { csrfMiddleware } = require('./middleware/csrf');

app.use(helmetConfig);
app.use(hpp());
app.use(generalLimiter);
app.use(secureHeaders);
app.disable('x-powered-by');

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));
app.use(xssSanitize);

// Static files dengan cache headers
const staticOpts = { maxAge: '7d', etag: true, lastModified: true };
app.use(express.static('public', staticOpts));
app.use('/assets', express.static('assets', staticOpts));
app.use('/uploads', express.static('uploads', { maxAge: '1d', etag: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-dengan-secret-panjang-acak',
  resave: false,
  saveUninitialized: false,
  name: 'sid',
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.COOKIE_SECURE === 'true',
    sameSite: 'lax'
  }
}));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// CSRF token tersedia di semua views
app.use(csrfMiddleware);

const maintenanceMiddleware = require('./middleware/maintenance');
app.use((req, res, next) => {
  if (
    req.path.startsWith('/admin') ||
    req.path.startsWith('/theme.css') ||
    req.path.startsWith('/healthz')
  ) {
    return next();
  }
  maintenanceMiddleware(req, res, next);
});

app.use('/admin', require('./routes/admin'));
app.use('/guru', require('./routes/guru'));
app.use('/', require('./routes/frontend'));

// 404 handler
app.use((req, res) => {
  res.status(404).render('frontend/404', {
    title: 'Halaman Tidak Ditemukan'
  });
});

// Global error handler — jangan bocorkan detail error ke user
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const isDev = process.env.NODE_ENV !== 'production';
  res.status(err.status || 500);
  if (req.xhr || req.headers.accept?.includes('application/json')) {
    return res.json({ success: false, error: isDev ? err.message : 'Terjadi kesalahan server' });
  }
  res.send(isDev ? `<pre>${err.stack}</pre>` : 'Terjadi kesalahan. Silakan coba lagi.');
});

app.listen(PORT, HOST, () => {
  console.log(`Server berjalan di http://${HOST}:${PORT}`);
  console.log(`Admin panel: http://${HOST}:${PORT}/admin`);
});