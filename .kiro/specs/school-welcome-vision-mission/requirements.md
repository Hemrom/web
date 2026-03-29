# Requirements Document

## Introduction

Fitur ini menambahkan dua halaman publik pada website sekolah: **Sambutan Kepala Sekolah** dan **Visi Misi**. Kedua halaman menampilkan konten yang dikelola admin melalui tab "Kelola Menu" di dashboard admin yang sudah ada. Konten disimpan di tabel `profil_konten` yang sudah tersedia, dengan tipe `sambutan` dan `visi_misi`. Frontend menggunakan template EJS dengan desain Bootstrap 5 yang konsisten dengan halaman lain di website.

Berdasarkan analisis kode yang ada:
- `frontendController.js` sudah memiliki handler `sambutan`, `sambutanKepsek`, dan `visiMisi`
- Tabel `profil_konten` sudah ada dengan kolom: `id`, `tipe`, `judul`, `konten`, `foto`
- Route `/profil/sambutan` dan `/profil/visi-misi` sudah terdaftar di `routes/frontend.js`
- View `profil-konten.ejs` sudah ada dan digunakan bersama untuk kedua halaman
- View `sambutan-kepsek.ejs` sudah ada sebagai tampilan alternatif sambutan
- Admin dapat mengelola konten melalui `/admin/profil-konten/:tipe`

Fitur ini berfokus pada memastikan kedua halaman dapat diakses dengan benar dari navigasi, konten dapat diedit admin, dan tampilan frontend konsisten dan lengkap.

---

## Glossary

- **Frontend_Controller**: Modul `controllers/frontendController.js` yang menangani request halaman publik
- **Profil_Konten_Controller**: Modul `controllers/profilKontenController.js` yang menangani CRUD konten profil di admin
- **Menu_Controller**: Modul `controllers/menuController.js` yang menangani pengelolaan menu navigasi
- **Halaman_Sambutan**: Halaman publik yang menampilkan sambutan dan foto kepala sekolah, diakses di `/profil/sambutan`
- **Halaman_Visi_Misi**: Halaman publik yang menampilkan visi dan misi sekolah, diakses di `/profil/visi-misi`
- **Profil_Konten**: Entitas data di tabel `profil_konten` dengan kolom `tipe` (enum: `sambutan`, `visi_misi`, `sejarah`), `judul`, `konten` (HTML), dan `foto`
- **Menu_Navigasi**: Entitas data di tabel `menu_navigasi` yang mengatur item menu di navbar frontend
- **Admin_Dashboard**: Antarmuka admin di `/admin/kontrol-website` dengan tab Kelola Halaman, Kelola Menu, dan Manajemen User
- **Rich_Text_Editor**: Editor WYSIWYG (misalnya TinyMCE atau Quill) untuk mengedit konten HTML di admin
- **EJS_Template**: Template engine yang digunakan untuk merender halaman HTML di server

---

## Requirements

### Requirement 1: Halaman Sambutan Kepala Sekolah (Frontend)

**User Story:** Sebagai pengunjung website, saya ingin melihat halaman Sambutan Kepala Sekolah, sehingga saya dapat membaca pesan dan melihat foto kepala sekolah.

#### Acceptance Criteria

1. WHEN pengunjung mengakses URL `/profil/sambutan`, THE Frontend_Controller SHALL merender halaman Sambutan Kepala Sekolah dengan data dari tabel `profil_konten` bertipe `sambutan`.
2. THE Halaman_Sambutan SHALL menampilkan judul halaman, konten sambutan (HTML), dan foto kepala sekolah jika tersedia.
3. IF kolom `konten` pada Profil_Konten bertipe `sambutan` kosong atau NULL, THEN THE Halaman_Sambutan SHALL menampilkan pesan placeholder "Sambutan kepala sekolah belum tersedia."
4. IF kolom `foto` pada Profil_Konten bertipe `sambutan` kosong atau NULL, THEN THE Halaman_Sambutan SHALL menampilkan ikon avatar default sebagai pengganti foto.
5. THE Halaman_Sambutan SHALL menyertakan navbar dengan daftar menu dari tabel `menu_navigasi` yang berstatus `aktif`.
6. THE Halaman_Sambutan SHALL menyertakan footer dengan informasi dari tabel `profil_sekolah`.

---

### Requirement 2: Halaman Visi Misi (Frontend)

**User Story:** Sebagai pengunjung website, saya ingin melihat halaman Visi Misi sekolah, sehingga saya dapat mengetahui arah dan tujuan sekolah.

#### Acceptance Criteria

1. WHEN pengunjung mengakses URL `/profil/visi-misi`, THE Frontend_Controller SHALL merender halaman Visi Misi dengan data dari tabel `profil_konten` bertipe `visi_misi`.
2. THE Halaman_Visi_Misi SHALL menampilkan judul halaman dan konten visi misi (HTML).
3. IF kolom `konten` pada Profil_Konten bertipe `visi_misi` kosong atau NULL, THEN THE Halaman_Visi_Misi SHALL menampilkan pesan placeholder "Konten visi misi belum tersedia."
4. THE Halaman_Visi_Misi SHALL menyertakan navbar dengan daftar menu dari tabel `menu_navigasi` yang berstatus `aktif`.
5. THE Halaman_Visi_Misi SHALL menyertakan footer dengan informasi dari tabel `profil_sekolah`.

---

### Requirement 3: Pengelolaan Konten Sambutan di Admin

**User Story:** Sebagai admin, saya ingin mengedit konten Sambutan Kepala Sekolah melalui dashboard admin, sehingga saya dapat memperbarui pesan dan foto kepala sekolah tanpa mengubah kode.

#### Acceptance Criteria

1. WHEN admin mengakses `/admin/profil-konten/sambutan`, THE Profil_Konten_Controller SHALL menampilkan form edit dengan field judul, konten (rich text), dan upload foto.
2. WHEN admin menyimpan form dengan data valid, THE Profil_Konten_Controller SHALL memperbarui baris `profil_konten` bertipe `sambutan` di database dan mengarahkan ke halaman sukses.
3. IF admin mengunggah file foto baru, THEN THE Profil_Konten_Controller SHALL menyimpan file ke direktori `uploads/` dan memperbarui kolom `foto` di tabel `profil_konten`.
4. IF admin tidak mengunggah foto baru saat update, THEN THE Profil_Konten_Controller SHALL mempertahankan nilai kolom `foto` yang sudah ada.
5. IF admin mengirim form dengan judul kosong, THEN THE Profil_Konten_Controller SHALL menampilkan pesan error validasi tanpa menyimpan data.
6. THE Admin_Dashboard SHALL menyediakan tautan navigasi ke halaman edit konten sambutan dari sidebar atau menu admin.

---

### Requirement 4: Pengelolaan Konten Visi Misi di Admin

**User Story:** Sebagai admin, saya ingin mengedit konten Visi Misi melalui dashboard admin, sehingga saya dapat memperbarui visi dan misi sekolah kapan saja.

#### Acceptance Criteria

1. WHEN admin mengakses `/admin/profil-konten/visi_misi`, THE Profil_Konten_Controller SHALL menampilkan form edit dengan field judul dan konten (rich text).
2. WHEN admin menyimpan form dengan data valid, THE Profil_Konten_Controller SHALL memperbarui baris `profil_konten` bertipe `visi_misi` di database dan mengarahkan ke halaman sukses.
3. IF admin mengirim form dengan judul kosong, THEN THE Profil_Konten_Controller SHALL menampilkan pesan error validasi tanpa menyimpan data.
4. THE Admin_Dashboard SHALL menyediakan tautan navigasi ke halaman edit konten visi misi dari sidebar atau menu admin.

---

### Requirement 5: Integrasi Menu Navigasi

**User Story:** Sebagai admin, saya ingin menambahkan menu "Sambutan Kepala Sekolah" dan "Visi Misi" ke navigasi website melalui tab Kelola Menu, sehingga pengunjung dapat menemukan kedua halaman tersebut dari navbar.

#### Acceptance Criteria

1. WHEN admin menambahkan menu baru di tab "Kelola Menu" dengan URL `/profil/sambutan`, THE Menu_Controller SHALL menyimpan entri baru ke tabel `menu_navigasi` dan menampilkannya di navbar frontend.
2. WHEN admin menambahkan menu baru di tab "Kelola Menu" dengan URL `/profil/visi-misi`, THE Menu_Controller SHALL menyimpan entri baru ke tabel `menu_navigasi` dan menampilkannya di navbar frontend.
3. WHILE status menu di tabel `menu_navigasi` adalah `aktif`, THE Frontend_Controller SHALL menyertakan menu tersebut dalam daftar navigasi yang dikirim ke semua halaman frontend.
4. WHEN admin mengubah status menu menjadi `nonaktif`, THE Frontend_Controller SHALL tidak menyertakan menu tersebut dalam daftar navigasi frontend.
5. THE Admin_Dashboard SHALL menampilkan daftar semua menu navigasi beserta URL, urutan, dan status pada tab "Kelola Menu" di halaman `/admin/kontrol-website`.

---

### Requirement 6: Inisialisasi Data Default

**User Story:** Sebagai developer, saya ingin memastikan data default untuk konten sambutan dan visi misi sudah tersedia di database, sehingga halaman tidak error saat pertama kali diakses.

#### Acceptance Criteria

1. THE Database SHALL memiliki baris pada tabel `profil_konten` dengan `tipe = 'sambutan'` dan `tipe = 'visi_misi'` sebelum halaman frontend diakses.
2. IF baris `profil_konten` dengan tipe tertentu tidak ditemukan di database, THEN THE Frontend_Controller SHALL mengembalikan objek default `{ tipe, judul: '', konten: '', foto: null }` tanpa melempar error.
3. THE Script_Inisialisasi (`create_profil_konten_table.js`) SHALL menggunakan `INSERT IGNORE` untuk memastikan data default tidak duplikat saat dijalankan ulang.
