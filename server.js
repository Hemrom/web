const express = require('express');
const session = require('express-session');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
const { generalLimiter, helmetConfig, hpp } = require('./middleware/security');
app.use(helmetConfig);
app.use(hpp());
app.use(generalLimiter);

// Sembunyikan info server
app.disable('x-powered-by');

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(express.static('public'));
app.use('/assets', express.static('assets'));
app.use('/uploads', express.static('uploads'));

// Session - konfigurasi aman
app.use(session({
  secret: process.env.SESSION_SECRET || 'ganti-dengan-secret-panjang-acak-di-env',
  resave: false,
  saveUninitialized: false,
  name: 'sid', // Sembunyikan nama default 'connect.sid'
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true,   // Tidak bisa diakses JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only di production
    sameSite: 'strict' // Proteksi CSRF
  }
}));

// View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
const maintenanceMiddleware = require('./middleware/maintenance');
// Maintenance hanya untuk frontend (bukan /admin)
app.use((req, res, next) => {
  if (req.path.startsWith('/admin') || req.path.startsWith('/theme.css')) return next();
  maintenanceMiddleware(req, res, next);
});

app.use('/admin', require('./routes/admin'));
app.use('/', require('./routes/frontend'));

// 404 Handler
app.use((req, res) => {
  res.status(404).render('frontend/404', { title: 'Halaman Tidak Ditemukan' });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
});
