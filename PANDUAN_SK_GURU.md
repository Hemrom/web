# Panduan Aktivasi Fitur SK Guru

## Langkah 1 — Jalankan Migrasi Database

Jalankan perintah berikut **sekali saja** di terminal server:

```bash
node run_sk_migration.js
```

Perintah ini akan membuat dua tabel baru di database `sekolah_db`:
- `sk_guru` — menyimpan data dokumen SK
- `sk_guru_penerima` — relasi SK dengan guru penerima

---

## Langkah 2 — Restart Server

```bash
pm2 restart all
# atau
pm2 restart app
```

---

## Cara Penggunaan

### Admin — Upload SK Mengajar

1. Login ke panel admin → **Kelola Informasi → SK Guru**
2. Klik **Upload SK Baru**
3. Pilih jenis SK: **SK Mengajar** atau **SK Tugas Tambahan**
4. Isi judul, nomor SK, tahun ajaran, tanggal SK (opsional)
5. Upload file (PDF, DOC, DOCX, XLS, XLSX, PPT, dll, maks 20MB)
6. Di panel kanan, **centang guru-guru** yang menjadi penerima SK
   - Gunakan kotak pencarian untuk mencari nama guru
   - Tombol "Pilih Semua" untuk memilih seluruh guru
7. Klik **Upload & Kirim SK**

### Admin — Lihat Status Download

1. Buka daftar SK → klik ikon **mata (👁)** atau klik judul SK
2. Halaman Detail SK menampilkan daftar semua guru penerima beserta status:
   - ✅ **Sudah download** + tanggal download
   - ⏰ **Belum download**

### Admin — Edit SK / Ganti Penerima

1. Klik ikon **edit (✏️)** pada SK yang ingin diubah
2. Bisa ganti file, ubah informasi, atau tambah/hapus guru penerima
3. Klik **Simpan Perubahan**

---

### Guru — Melihat & Download SK

1. Login ke **Portal Guru** (`/guru/login`)
2. Klik menu **SK Saya** di navbar atau quick action di dashboard
3. SK yang ditujukan akan tampil dengan filter tab:
   - Semua / SK Mengajar / SK Tugas Tambahan / Lainnya
4. SK yang belum didownload ditandai badge **BARU** merah berkedip
5. Klik tombol **Download** untuk mengunduh file SK
6. Setelah download, status berubah menjadi "Sudah didownload"

---

## File yang Dibuat

| File | Keterangan |
|------|-----------|
| `controllers/skGuruController.js` | Logic admin & guru |
| `views/admin/sk-guru/index.ejs` | Daftar SK di admin |
| `views/admin/sk-guru/create.ejs` | Form upload SK |
| `views/admin/sk-guru/edit.ejs` | Form edit SK |
| `views/admin/sk-guru/detail.ejs` | Detail SK + daftar penerima |
| `views/guru/sk-saya/index.ejs` | Halaman SK untuk guru |
| `migrations/create_sk_guru_table.sql` | File SQL migrasi |
| `run_sk_migration.js` | Script migrasi otomatis |
| `uploads/sk/` | Folder penyimpanan file SK |

## URL

| URL | Keterangan |
|-----|-----------|
| `/admin/sk-guru` | Daftar SK (admin) |
| `/admin/sk-guru/create` | Upload SK baru |
| `/admin/sk-guru/detail/:id` | Detail + status penerima |
| `/admin/sk-guru/edit/:id` | Edit SK |
| `/guru/sk-saya` | Lihat SK saya (guru) |
| `/guru/sk-saya/download/:id` | Download file SK |
