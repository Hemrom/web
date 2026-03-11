# Daftar Fitur Website Sekolah

## Frontend (Public Website)

### 1. Halaman Beranda (/)
- Hero section dengan nama sekolah dan visi
- Menampilkan 6 berita terbaru
- Menampilkan 6 foto galeri terbaru
- Navigasi menu lengkap

### 2. Halaman Profil (/profil)
- Informasi lengkap sekolah
- Logo sekolah
- Alamat, telepon, email
- Visi dan Misi sekolah

### 3. Halaman Berita (/berita)
- Daftar semua berita yang dipublish
- Pagination (9 berita per halaman)
- Filter berdasarkan kategori
- Gambar thumbnail berita

### 4. Detail Berita (/berita/:slug)
- Konten lengkap berita
- Informasi penulis dan tanggal
- Gambar berita
- Berita terkait di sidebar

### 5. Halaman Galeri (/galeri)
- Grid foto-foto kegiatan sekolah
- Judul dan deskripsi foto
- Kategori foto

### 6. Halaman Guru & Staff (/guru)
- Daftar guru dan staff
- Foto profil
- NIP, nama, mata pelajaran
- Jabatan dan kontak

### 7. Halaman Kontak (/kontak)
- Informasi kontak sekolah
- Form kontak untuk pengunjung
- Validasi form
- Notifikasi sukses kirim pesan

## Backend (Admin Panel)

### 1. Login Admin (/admin/login)
- Autentikasi username & password
- Session management
- Password terenkripsi (bcrypt)

### 2. Dashboard (/admin/dashboard)
- Statistik jumlah berita
- Statistik jumlah galeri
- Statistik jumlah guru
- Statistik kontak masuk baru
- Informasi user yang login

### 3. Kelola Profil Sekolah (/admin/profil)
- Edit nama sekolah
- Edit alamat, telepon, email
- Edit visi dan misi
- Upload logo sekolah
- Notifikasi sukses update

### 4. Kelola Berita (/admin/berita)
- Lihat semua berita
- Tambah berita baru
- Edit berita
- Hapus berita
- Upload gambar berita
- Kategori: Umum, Pengumuman, Kegiatan, Prestasi
- Status: Draft atau Published
- Auto-generate slug dari judul

### 5. Kelola Galeri (/admin/galeri)
- Lihat semua foto
- Upload foto baru
- Tambah judul dan deskripsi
- Kategori foto
- Hapus foto

### 6. Kelola Guru & Staff (/admin/guru)
- Lihat semua guru
- Tambah guru baru
- Edit data guru
- Hapus guru
- Upload foto guru
- Data: NIP, nama, mata pelajaran, jabatan, email, telepon

### 7. Kontak Masuk (/admin/kontak)
- Lihat semua pesan dari pengunjung
- Update status: Baru, Dibaca, Dibalas
- Informasi lengkap pengirim

## Fitur Teknis

### Keamanan
- Password hashing dengan bcrypt
- Session-based authentication
- Protected admin routes
- SQL injection prevention (prepared statements)

### Upload File
- Support upload gambar (logo, berita, galeri, foto guru)
- Auto-generate unique filename
- Validasi tipe file

### Database
- Relational database design
- Foreign key constraints
- Auto timestamp (created_at, updated_at)
- Enum untuk kategori dan status

### User Experience
- Responsive design (mobile-friendly)
- Loading states
- Error handling
- Success notifications
- Confirmation dialogs untuk delete
- Pagination untuk list panjang

### SEO Friendly
- Clean URL dengan slug
- Meta tags
- Semantic HTML

## Kategori Berita
1. Umum - Berita umum sekolah
2. Pengumuman - Pengumuman resmi
3. Kegiatan - Kegiatan dan acara sekolah
4. Prestasi - Prestasi siswa dan sekolah

## Status Berita
1. Draft - Belum dipublikasikan
2. Published - Sudah dipublikasikan dan tampil di frontend

## Role User
1. Admin - Akses penuh ke semua fitur
2. Guru - (Untuk pengembangan selanjutnya)
