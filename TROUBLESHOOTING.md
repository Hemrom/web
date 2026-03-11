# Troubleshooting Guide

## Error: Cannot read properties of undefined (reading 'nama')

### Penyebab:
Error ini terjadi ketika mengakses halaman admin tanpa login terlebih dahulu.

### Solusi:
1. **Login terlebih dahulu** ke admin panel:
   - URL: `http://localhost:3000/admin/login`
   - Username: `admin`
   - Password: `admin123`

2. **Setelah login**, semua halaman admin akan berfungsi dengan baik

### Penjelasan Teknis:
- Halaman admin memerlukan data user dari session
- Session hanya terisi setelah login berhasil
- Middleware `isAuthenticated` seharusnya redirect ke login jika belum login
- Pastikan semua route admin menggunakan middleware `isAuthenticated`

## Error: Table doesn't exist

### Penyebab:
Tabel database belum dibuat.

### Solusi:
Jalankan script setup database:
```bash
node create_media_sosial_table.js
```

## Error: Failed to lookup view

### Penyebab:
Format view file tidak sesuai dengan struktur yang diharapkan.

### Solusi:
Pastikan view admin menggunakan format lengkap dengan include sidebar, topbar, dan footer:
```html
<!DOCTYPE html>
<html>
<head>...</head>
<body id="page-top">
    <div id="wrapper">
        <%- include('../partials/sidebar') %>
        <div id="content-wrapper" class="d-flex flex-column">
            <div id="content">
                <%- include('../partials/topbar', { user }) %>
                <!-- Content -->
            </div>
            <%- include('../partials/footer') %>
        </div>
    </div>
</body>
</html>
```

## Tips Debugging:
1. Selalu cek console untuk error messages
2. Pastikan sudah login sebelum mengakses halaman admin
3. Cek apakah tabel database sudah dibuat
4. Restart server setelah perubahan besar
5. Clear browser cache jika ada masalah tampilan