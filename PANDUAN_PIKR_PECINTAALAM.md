# Panduan Aktivasi: PIK-R & Pecinta Alam

## ✅ Yang Sudah Dibuat

### Views Frontend (public)
- `views/frontend/pikr.ejs` — Halaman utama PIK-R (kegiatan, berita, galeri)
- `views/frontend/pikr-detail.ejs` — Detail kegiatan PIK-R
- `views/frontend/pikr-berita-detail.ejs` — Detail berita PIK-R
- `views/frontend/pecintaalam.ejs` — Halaman utama Pecinta Alam
- `views/frontend/pecintaalam-detail.ejs` — Detail kegiatan Pecinta Alam
- `views/frontend/pecintaalam-berita-detail.ejs` — Detail berita Pecinta Alam

### Views Admin (pengelolaan)
- `views/admin/pikr/` → index, create, edit, berita, berita-create, berita-edit, galeri, _sidebar
- `views/admin/pecintaalam/` → index, create, edit, berita, berita-create, berita-edit, galeri, _sidebar

### Controller
- `controllers/portalController.js` — ditambah 30 fungsi baru (frontend + admin)
- `ekstrakurikulerIndex` diperbarui — PIK-R & Pecinta Alam muncul di halaman `/ekstrakurikuler`

### Routes
- `routes/admin.js` — 18 route baru untuk `/admin/pikr` dan `/admin/pecinta-alam`
- `routes/frontend.js` — 6 route baru untuk `/pikr` dan `/pecinta-alam`
- Sitemap & robots.txt sudah diperbarui

### Sidebar Admin
- `views/admin/partials/sidebar.ejs` — menu PIK-R dan Pecinta Alam ditambah di Kelola Ekstrakurikuler

---

## 🗄️ WAJIB: Buat Tabel Database

**Jalankan SQL berikut di phpMyAdmin / MySQL Workbench / terminal MySQL:**

```sql
-- File: migration_pikr_pecintaalam.sql (sudah ada di root project)
```

Atau salin dari file `migration_pikr_pecintaalam.sql` yang sudah ada di root project.

### Cara cepat via phpMyAdmin:
1. Buka phpMyAdmin → pilih database sekolah
2. Klik tab **SQL**
3. Paste isi file `migration_pikr_pecintaalam.sql`
4. Klik **Go / Jalankan**

### Cara via terminal (jika MySQL tersedia):
```bash
mysql -u root -p nama_database < migration_pikr_pecintaalam.sql
```

### Cara via server yang sudah berjalan (jika node tersedia):
```bash
node add_pikr_pecintaalam_tables.js
```

---

## 🌐 URL yang Tersedia Setelah Aktivasi

### Frontend (publik)
| URL | Keterangan |
|-----|-----------|
| `/pikr` | Halaman utama PIK-R |
| `/pikr/:slug` | Detail kegiatan PIK-R |
| `/pikr/berita/:slug` | Detail berita PIK-R |
| `/pecinta-alam` | Halaman utama Pecinta Alam |
| `/pecinta-alam/:slug` | Detail kegiatan Pecinta Alam |
| `/pecinta-alam/berita/:slug` | Detail berita Pecinta Alam |
| `/ekstrakurikuler` | Otomatis muncul 2 ekskul baru |

### Admin
| URL | Keterangan |
|-----|-----------|
| `/admin/pikr` | Kelola kegiatan PIK-R |
| `/admin/pikr/berita` | Kelola berita PIK-R |
| `/admin/pikr/galeri` | Upload galeri PIK-R |
| `/admin/pecinta-alam` | Kelola kegiatan Pecinta Alam |
| `/admin/pecinta-alam/berita` | Kelola berita Pecinta Alam |
| `/admin/pecinta-alam/galeri` | Upload galeri Pecinta Alam |

---

## 🎨 Tema Warna
- **PIK-R**: Ungu/Violet (`#7c3aed`, `#5b21b6`)
- **Pecinta Alam**: Coklat/Earth (`#78350f`, `#451a03`)
