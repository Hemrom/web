# Implementation Plan: School Welcome & Vision Mission

## Overview

Implementasi incremental untuk memastikan halaman Sambutan Kepala Sekolah dan Visi Misi berfungsi end-to-end: validasi input admin, placeholder view yang tepat, navigasi admin, script inisialisasi idempoten, dan property-based tests dengan Jest + fast-check.

## Tasks

- [x] 1. Tambahkan validasi judul kosong di `profilKontenController.update()`
  - Di `controllers/profilKontenController.js`, dalam fungsi `update()`, setelah `upload()` callback dan sebelum query DB, tambahkan pengecekan `if (!judul || !judul.trim())` yang me-render ulang form edit dengan pesan error tanpa menyimpan ke DB
  - Gunakan `res.render('admin/profil-konten/edit', { ..., error: 'Judul tidak boleh kosong.' })` untuk menampilkan error
  - _Requirements: 3.5, 4.3_

  - [ ]* 1.1 Tulis property test untuk Property 5: judul kosong ditolak
    - **Property 5: Judul kosong atau whitespace ditolak oleh admin controller**
    - **Validates: Requirements 3.5, 4.3**
    - Gunakan `fc.string()` yang difilter agar hanya menghasilkan string kosong/whitespace
    - Assert bahwa DB tidak dimodifikasi dan response mengandung pesan error

- [x] 2. Perbarui placeholder spesifik per tipe di view EJS
  - Di view `views/frontend/profil-konten.ejs`, ubah pesan placeholder agar spesifik per tipe: jika `konten.tipe === 'sambutan'` tampilkan "Sambutan kepala sekolah belum tersedia.", jika `konten.tipe === 'visi_misi'` tampilkan "Konten visi misi belum tersedia."
  - Pastikan kondisi pengecekan konten kosong menggunakan `!konten.konten || !konten.konten.trim()`
  - _Requirements: 1.3, 2.3_

  - [ ]* 2.1 Tulis property test untuk Property 2: placeholder ditampilkan saat konten kosong/null
    - **Property 2: Halaman menampilkan konten atau placeholder, tidak pernah kosong tanpa pesan**
    - **Validates: Requirements 1.2, 1.3, 2.2, 2.3**
    - Gunakan `fc.oneof(fc.constant(''), fc.constant(null), fc.string().filter(s => !s.trim()))` untuk nilai konten
    - Assert bahwa rendered output mengandung teks placeholder yang sesuai per tipe

- [x] 3. Tambahkan tautan navigasi admin ke halaman edit konten
  - Di `controllers/kontrolWebsiteController.js`, tambahkan query untuk mengambil data `profil_konten` (sambutan dan visi_misi) dan kirim ke view
  - Di view `views/admin/kontrol-website.ejs` (atau sidebar admin), tambahkan tautan ke `/admin/profil-konten/sambutan` dan `/admin/profil-konten/visi_misi`
  - _Requirements: 3.6, 4.4_

  - [ ]* 3.1 Tulis unit test untuk tautan navigasi admin
    - Test bahwa GET `/admin/kontrol-website` merender view yang mengandung href `/admin/profil-konten/sambutan` dan `/admin/profil-konten/visi_misi`
    - _Requirements: 3.6, 4.4_

- [x] 4. Perbarui script inisialisasi `create_profil_konten_table.js` menggunakan `INSERT IGNORE`
  - Ganti query `INSERT INTO profil_konten` yang ada dengan `INSERT IGNORE INTO profil_konten` untuk data default `sambutan` dan `visi_misi`
  - Pastikan script dapat dijalankan berulang kali tanpa menghasilkan baris duplikat
  - _Requirements: 6.1, 6.3_

  - [ ]* 4.1 Tulis property test untuk Property 8: script inisialisasi idempoten
    - **Property 8: Menjalankan script inisialisasi N kali tidak menghasilkan duplikat**
    - **Validates: Requirements 6.3**
    - Gunakan `fc.integer({ min: 1, max: 10 })` untuk jumlah eksekusi
    - Assert bahwa COUNT baris untuk setiap tipe tetap 1 setelah N eksekusi

- [x] 5. Checkpoint — Pastikan semua tests lulus
  - Pastikan semua tests lulus, tanyakan ke user jika ada pertanyaan.

- [x] 6. Implementasi property-based tests untuk semua 8 correctness properties
  - Buat file `tests/school-welcome-vision-mission.test.js` dengan Jest + fast-check
  - Setup mock untuk `db.query` menggunakan `jest.mock('../config/database')`

  - [x] 6.1 Tulis property test untuk Property 1: frontend controller merender view dengan data yang benar
    - **Property 1: Controller selalu merender view dengan objek konten yang memiliki field tipe, judul, konten, foto**
    - **Validates: Requirements 1.1, 2.1, 6.2**
    - Gunakan `fc.record({ tipe: fc.constantFrom('sambutan', 'visi_misi'), judul: fc.string(), konten: fc.string(), foto: fc.option(fc.string()) })` untuk mock DB result

  - [x] 6.2 Tulis property test untuk Property 3: navbar hanya menampilkan menu aktif
    - **Property 3: getMenuItems hanya mengembalikan menu dengan status aktif**
    - **Validates: Requirements 1.5, 2.4, 5.3, 5.4**
    - Gunakan `fc.array(fc.record({ id: fc.integer({ min: 1 }), label: fc.string({ minLength: 1 }), url: fc.string({ minLength: 1 }), parent_id: fc.constant(null), status: fc.oneof(fc.constant('aktif'), fc.constant('nonaktif')) }))` untuk generate data menu

  - [x] 6.3 Tulis property test untuk Property 4: update valid tersimpan ke database
    - **Property 4: Update dengan tipe valid dan judul tidak kosong selalu tersimpan**
    - **Validates: Requirements 3.2, 4.2**
    - Gunakan `fc.constantFrom('sambutan', 'visi_misi')` untuk tipe dan `fc.string({ minLength: 1 })` untuk judul

  - [x] 6.4 Tulis property test untuk Property 6: upload foto memperbarui kolom foto
    - **Property 6: File yang diunggah tersimpan di kolom foto; tanpa file, foto lama dipertahankan**
    - **Validates: Requirements 3.3, 3.4**
    - Gunakan `fc.option(fc.string({ minLength: 1 }))` untuk simulasi file upload (ada/tidak ada)

  - [x] 6.5 Tulis property test untuk Property 7: menu baru aktif muncul di getMenuItems
    - **Property 7: Menu baru dengan status aktif muncul di hasil getMenuItems**
    - **Validates: Requirements 5.1, 5.2**
    - Gunakan `fc.record({ label: fc.string({ minLength: 1 }), url: fc.string({ minLength: 1 }), status: fc.constant('aktif') })` untuk menu baru

- [x] 7. Final checkpoint — Pastikan semua tests lulus
  - Jalankan `npx jest tests/school-welcome-vision-mission.test.js --run` dan pastikan semua tests lulus, tanyakan ke user jika ada pertanyaan.

## Notes

- Tasks bertanda `*` bersifat opsional dan dapat dilewati untuk MVP yang lebih cepat
- Setiap task mereferensikan requirements spesifik untuk traceability
- Property-based tests menggunakan minimum 100 iterasi (`numRuns: 100`)
- Mock DB menggunakan `jest.mock` agar tests tidak memerlukan koneksi database nyata
