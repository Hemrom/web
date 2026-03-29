# Design Document: School Welcome & Vision Mission

## Overview

Fitur ini memastikan dua halaman publik website sekolah — **Sambutan Kepala Sekolah** (`/profil/sambutan`) dan **Visi Misi** (`/profil/visi-misi`) — berfungsi dengan benar secara end-to-end: dari pengelolaan konten oleh admin hingga tampilan di frontend.

Sebagian besar infrastruktur sudah tersedia (controller, route, view, tabel DB). Pekerjaan utama adalah:
1. Memastikan validasi input di `profilKontenController.js` (judul kosong ditolak)
2. Memastikan tampilan placeholder yang benar di `profil-konten.ejs` dan `sambutan-kepsek.ejs`
3. Memastikan data default tersedia via script inisialisasi
4. Memastikan navigasi admin ke halaman edit tersedia dari sidebar/dashboard

---

## Architecture

Sistem mengikuti arsitektur MVC standar Express.js:

```
Browser (Pengunjung/Admin)
        │
        ▼
   Express Router
   ┌─────────────────────────────────────┐
   │  routes/frontend.js                 │  GET /profil/sambutan
   │  routes/admin.js                    │  GET /admin/profil-konten/:tipe
   └─────────────────────────────────────┘
        │
        ▼
   Controllers
   ┌─────────────────────────────────────┐
   │  frontendController.js              │  sambutan(), visiMisi()
   │  profilKontenController.js          │  editPage(), update()
   │  menuController.js                  │  CRUD menu navigasi
   └─────────────────────────────────────┘
        │
        ▼
   Database (MySQL)
   ┌─────────────────────────────────────┐
   │  profil_konten  (tipe, judul,       │
   │                  konten, foto)      │
   │  menu_navigasi  (label, url,        │
   │                  status, urutan)    │
   │  profil_sekolah (nama, alamat, ...) │
   └─────────────────────────────────────┘
        │
        ▼
   Views (EJS)
   ┌─────────────────────────────────────┐
   │  frontend/profil-konten.ejs         │  Sambutan & Visi Misi
   │  frontend/sambutan-kepsek.ejs       │  Tampilan alternatif sambutan
   │  admin/profil-konten/edit.ejs       │  Form edit admin
   └─────────────────────────────────────┘
```

---

## Components and Interfaces

### 1. `frontendController.js` — Handler Publik

Fungsi yang relevan sudah ada. Keduanya menggunakan helper `getProfilKonten(tipe)` yang mengembalikan objek default jika baris tidak ditemukan.

```javascript
// Interface getProfilKonten
getProfilKonten(tipe: string) => Promise<{ tipe, judul, konten, foto } | default_object>

// Handler yang sudah ada
exports.sambutan(req, res)   // render profil-konten.ejs dengan tipe='sambutan'
exports.visiMisi(req, res)   // render profil-konten.ejs dengan tipe='visi_misi'
```

**Perubahan yang diperlukan:** Tidak ada perubahan pada controller — sudah benar.

### 2. `profilKontenController.js` — Handler Admin

```javascript
// Interface yang sudah ada
exports.editPage(req, res)   // GET /admin/profil-konten/:tipe
exports.update(req, res)     // POST /admin/profil-konten/:tipe (dengan multer)
```

**Perubahan yang diperlukan:** Tambahkan validasi judul kosong di `update()` — saat ini tidak ada validasi, form langsung disimpan.

### 3. `menuController.js` — Kelola Menu Navigasi

Sudah lengkap. Mendukung CRUD menu dengan status aktif/nonaktif dan toggle status via AJAX.

### 4. Views Frontend

- `profil-konten.ejs` — Digunakan bersama untuk sambutan dan visi misi. Sudah menangani placeholder konten kosong.
- `sambutan-kepsek.ejs` — Tampilan khusus sambutan dengan layout foto bulat. Sudah menangani foto null dengan avatar default.

**Perubahan yang diperlukan:** Pastikan pesan placeholder spesifik per tipe (sambutan vs visi misi) sesuai requirements.

### 5. `create_profil_konten_table.js` — Script Inisialisasi

Harus menggunakan `INSERT IGNORE` untuk data default agar idempoten.

---

## Data Models

### Tabel `profil_konten`

| Kolom   | Tipe         | Keterangan                                      |
|---------|--------------|-------------------------------------------------|
| id      | INT PK AUTO  | Primary key                                     |
| tipe    | VARCHAR(50)  | Enum: `sambutan`, `visi_misi`, `sejarah`        |
| judul   | VARCHAR(255) | Judul halaman / nama kepala sekolah             |
| konten  | TEXT         | Konten HTML (dari rich text editor Summernote)  |
| foto    | VARCHAR(255) | Nama file foto di direktori `uploads/`, nullable|

**Constraint:** `tipe` bersifat unik per baris (satu baris per tipe).

### Tabel `menu_navigasi`

| Kolom     | Tipe         | Keterangan                              |
|-----------|--------------|-----------------------------------------|
| id        | INT PK AUTO  | Primary key                             |
| label     | VARCHAR(100) | Teks yang ditampilkan di navbar         |
| url       | VARCHAR(255) | URL tujuan menu                         |
| parent_id | INT FK NULL  | Referensi ke menu induk (untuk submenu) |
| urutan    | INT          | Urutan tampil di navbar                 |
| status    | ENUM         | `aktif` atau `nonaktif`                 |
| icon      | VARCHAR(100) | Class icon FontAwesome, nullable        |
| target    | VARCHAR(10)  | `_self` atau `_blank`                   |

### Objek Default (Fallback)

Ketika baris tidak ditemukan di `profil_konten`, `getProfilKonten()` mengembalikan:

```javascript
{ tipe: tipe, judul: '', konten: '', foto: null }
```

---

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system — essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Frontend controller selalu merender view dengan data yang benar

*For any* tipe konten profil (`sambutan` atau `visi_misi`), ketika controller dipanggil, view harus dirender dengan objek `konten` yang memiliki field `tipe`, `judul`, `konten`, dan `foto` — baik dari DB maupun dari objek default.

**Validates: Requirements 1.1, 2.1, 6.2**

### Property 2: Halaman profil konten menampilkan konten atau placeholder

*For any* nilai `konten.konten` (termasuk string kosong, null, atau string whitespace), halaman yang dirender harus menampilkan konten HTML jika tidak kosong, atau menampilkan pesan placeholder jika kosong/null. Tidak boleh ada kondisi di mana halaman error atau menampilkan string kosong tanpa pesan apapun.

**Validates: Requirements 1.2, 1.3, 2.2, 2.3**

### Property 3: Navbar hanya menampilkan menu dengan status aktif

*For any* kumpulan menu di tabel `menu_navigasi`, fungsi `getMenuItems()` harus mengembalikan hanya menu dengan `status = 'aktif'`. Menu dengan status `nonaktif` tidak boleh muncul di array yang dikirim ke view.

**Validates: Requirements 1.5, 2.4, 5.3, 5.4**

### Property 4: Update konten dengan data valid selalu tersimpan ke database

*For any* tipe konten yang valid (`sambutan`, `visi_misi`) dan judul yang tidak kosong, operasi update harus menghasilkan baris di `profil_konten` dengan nilai `judul` dan `konten` yang sesuai dengan input.

**Validates: Requirements 3.2, 4.2**

### Property 5: Judul kosong ditolak oleh admin controller

*For any* string judul yang kosong atau hanya terdiri dari whitespace, operasi update di `profilKontenController` harus menolak request dan tidak mengubah data di database.

**Validates: Requirements 3.5, 4.3**

### Property 6: Upload foto menyimpan file dan memperbarui kolom foto

*For any* file gambar yang diunggah saat update konten, nama file harus tersimpan di kolom `foto` tabel `profil_konten`. Jika tidak ada file yang diunggah, nilai kolom `foto` yang sudah ada harus dipertahankan (tidak berubah menjadi null).

**Validates: Requirements 3.3, 3.4**

### Property 7: Penambahan menu tersimpan dan muncul di navbar

*For any* menu baru yang ditambahkan dengan status `aktif`, setelah operasi create berhasil, menu tersebut harus dapat ditemukan di hasil `getMenuItems()` dengan label dan URL yang sesuai.

**Validates: Requirements 5.1, 5.2**

### Property 8: Script inisialisasi bersifat idempoten

*For any* jumlah eksekusi script `create_profil_konten_table.js`, menjalankannya lebih dari satu kali tidak boleh menghasilkan baris duplikat di tabel `profil_konten` untuk tipe yang sama.

**Validates: Requirements 6.3**

---

## Error Handling

| Kondisi                                      | Penanganan                                                                 |
|----------------------------------------------|----------------------------------------------------------------------------|
| Baris `profil_konten` tidak ada di DB        | `getProfilKonten()` mengembalikan objek default, halaman tetap render      |
| Judul kosong saat update admin               | Controller menampilkan pesan error, tidak menyimpan ke DB                  |
| File upload gagal (multer error)             | Controller mengembalikan HTTP 500 dengan pesan 'Error upload'              |
| Tipe konten tidak valid di URL admin         | Controller mengembalikan HTTP 404 'Halaman tidak ditemukan'                |
| Query DB gagal di frontend controller        | `catch` block mengembalikan HTTP 500 'Terjadi kesalahan'                   |
| Menu tidak ditemukan saat toggle/edit/delete | Controller redirect ke `/admin/kontrol-website?tab=menu&error=not_found`   |

---

## Testing Strategy

### Pendekatan Dual Testing

Fitur ini menggunakan dua lapisan pengujian yang saling melengkapi:

1. **Unit tests** — Memverifikasi contoh spesifik, edge case, dan kondisi error
2. **Property-based tests** — Memverifikasi properti universal di berbagai input yang di-generate

### Library yang Digunakan

- **Test runner:** Jest
- **Property-based testing:** `fast-check` (library PBT untuk JavaScript/Node.js)
- **HTTP testing:** `supertest`

### Unit Tests

Fokus pada contoh konkret dan integrasi:

- Halaman edit admin menampilkan form dengan field yang benar (judul, konten, foto untuk sambutan)
- Sidebar admin memiliki tautan ke `/admin/profil-konten/sambutan` dan `/admin/profil-konten/visi_misi`
- Dashboard `/admin/kontrol-website?tab=menu` menampilkan daftar menu dengan URL, urutan, dan status
- Script inisialisasi membuat baris default untuk `sambutan` dan `visi_misi`

### Property-Based Tests

Setiap property di atas diimplementasikan sebagai satu property-based test dengan minimum **100 iterasi**.

Format tag komentar:
```
// Feature: school-welcome-vision-mission, Property {N}: {property_text}
```

**Contoh implementasi:**

```javascript
const fc = require('fast-check');

// Feature: school-welcome-vision-mission, Property 3: Navbar hanya menampilkan menu aktif
test('getMenuItems hanya mengembalikan menu aktif', async () => {
  await fc.assert(
    fc.asyncProperty(
      fc.array(fc.record({
        id: fc.integer({ min: 1 }),
        label: fc.string({ minLength: 1 }),
        url: fc.string({ minLength: 1 }),
        parent_id: fc.constant(null),
        status: fc.oneof(fc.constant('aktif'), fc.constant('nonaktif'))
      })),
      async (menus) => {
        // Setup mock DB dengan menus yang di-generate
        // Panggil getMenuItems()
        // Assert: semua item yang dikembalikan memiliki status 'aktif'
        const result = await getMenuItems(menus);
        return result.every(m => m.status === 'aktif');
      }
    ),
    { numRuns: 100 }
  );
});
```

**Pemetaan Property ke Test:**

| Property | Test Name                                          | Iterasi |
|----------|----------------------------------------------------|---------|
| P1       | `controller renders view with valid konten object` | 100     |
| P2       | `placeholder shown when konten empty or null`      | 100     |
| P3       | `getMenuItems returns only active menus`           | 100     |
| P4       | `valid update persists judul and konten to DB`     | 100     |
| P5       | `empty or whitespace judul is rejected`            | 100     |
| P6       | `photo upload updates foto column`                 | 100     |
| P7       | `new active menu appears in getMenuItems result`   | 100     |
| P8       | `init script is idempotent`                        | 100     |
