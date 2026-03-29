# Implementation Plan: Dynamic Navbar Menu

## Overview

Implementasi navbar dinamis berbasis database untuk website sekolah. Admin dapat mengelola menu navigasi melalui panel admin, dan frontend akan merender navbar dari data database.

## Tasks

- [x] 1. Buat migration script dan tabel database
  - Buat file `create_menu_navigasi_table.js` dengan CREATE TABLE dan seed data default
  - Seed: Beranda, Profil (dengan sub-menu Visi & Misi, Sejarah, Guru & Karyawan, Sambutan), Berita, Galeri, Guru, Media Sosial, Kontak
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 9.1, 9.2, 9.3, 9.4_

- [x] 2. Buat menuController.js dan admin views
  - [x] 2.1 Buat `controllers/menuController.js` dengan method index, createPage, create, editPage, update, delete, toggleStatus
    - Validasi label dan URL tidak boleh kosong
    - Cascade delete ditangani oleh FK constraint di DB
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 5.1, 6.1, 6.2, 6.3, 6.4_
  - [x] 2.2 Buat `views/admin/menu/index.ejs` — tabel daftar menu hierarki dengan tombol aksi
    - _Requirements: 6.1, 6.2, 6.3, 6.4_
  - [x] 2.3 Buat `views/admin/menu/create.ejs` — form tambah menu dengan dropdown parent
    - _Requirements: 2.1, 2.4, 2.5_
  - [x] 2.4 Buat `views/admin/menu/edit.ejs` — form edit menu
    - _Requirements: 3.1, 3.4_

- [x] 3. Tambah routes admin untuk /admin/menu
  - Modifikasi `routes/admin.js` untuk menambah semua route menu
  - Tambah menu "Kelola Menu" di `views/admin/partials/sidebar.ejs`
  - _Requirements: 6.1_

- [x] 4. Update frontendController.js dengan helper getMenuItems()
  - Tambah helper `getMenuItems()` yang query menu aktif dan susun hierarki parent-children
  - Fallback return `[]` saat DB error
  - Pass `menuItems` ke semua `res.render()` di setiap controller method
  - _Requirements: 7.1, 7.7, 8.1, 8.2, 8.3_

- [x] 5. Update navbar partial menjadi dinamis
  - Modifikasi `views/frontend/partials/navbar.ejs` untuk render dari `menuItems`
  - Render dropdown Bootstrap 5 jika menu punya children
  - Render plain link jika tidak ada children
  - Support icon Font Awesome dan target _blank
  - _Requirements: 7.2, 7.3, 7.4, 7.5, 7.6, 7.7_

- [x] 6. Update semua halaman frontend agar gunakan navbar partial
  - Update `views/frontend/home.ejs`, `profil.ejs`, `berita.ejs`, `galeri.ejs`, `guru.ejs`, `kontak.ejs`, `media-sosial.ejs`, `profil-konten.ejs`
  - Ganti hardcoded navbar dengan `<%- include('partials/navbar') %>`
  - _Requirements: 7.1, 8.3_

- [x] 7. Checkpoint - Pastikan semua komponen terhubung
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Cascade delete ditangani oleh MySQL FK `ON DELETE CASCADE`, tidak perlu logic manual
- `getMenuItems()` selalu return array (tidak pernah throw), sehingga semua view aman
