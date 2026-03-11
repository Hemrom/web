# Panduan Implementasi Face Recognition untuk Presensi Siswa

## Overview
Fitur presensi siswa dengan face recognition menggunakan face-api.js, sebuah library JavaScript yang powerful untuk deteksi dan pengenalan wajah di browser.

## Fitur Utama
- ✅ Deteksi wajah real-time menggunakan webcam
- ✅ Registrasi wajah siswa dengan foto
- ✅ Presensi otomatis dengan pengenalan wajah
- ✅ Dashboard presensi untuk admin dan guru
- ✅ Laporan presensi harian, mingguan, bulanan
- ✅ Export data presensi ke Excel/PDF
- ✅ Backup manual presensi jika face recognition gagal

## Teknologi yang Digunakan
- **face-api.js**: Library untuk face detection dan recognition
- **TensorFlow.js**: Backend untuk machine learning
- **WebRTC**: Akses webcam browser
- **Canvas API**: Manipulasi gambar dan video

## Database Schema

### Tabel Siswa
```sql
CREATE TABLE siswa (
  id INT PRIMARY KEY AUTO_INCREMENT,
  nis VARCHAR(20) UNIQUE NOT NULL,
  nama VARCHAR(100) NOT NULL,
  kelas VARCHAR(20) NOT NULL,
  jurusan VARCHAR(50),
  foto VARCHAR(255),
  face_descriptor TEXT, -- JSON array dari face descriptor
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Tabel Presensi
```sql
CREATE TABLE presensi (
  id INT PRIMARY KEY AUTO_INCREMENT,
  siswa_id INT NOT NULL,
  tanggal DATE NOT NULL,
  waktu_masuk TIME,
  waktu_keluar TIME,
  status ENUM('hadir', 'izin', 'sakit', 'alpha') DEFAULT 'hadir',
  keterangan TEXT,
  foto_presensi VARCHAR(255),
  metode ENUM('face_recognition', 'manual') DEFAULT 'face_recognition',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (siswa_id) REFERENCES siswa(id) ON DELETE CASCADE,
  UNIQUE KEY unique_presensi (siswa_id, tanggal)
);
```

## Struktur File yang Diperlukan

```
project/
├── controllers/
│   ├── siswaController.js          # CRUD siswa
│   └── presensiController.js       # Presensi management
├── routes/
│   ├── siswa.js                    # Routes siswa
│   └── presensi.js                 # Routes presensi
├── views/
│   ├── admin/
│   │   ├── siswa/
│   │   │   ├── index.ejs          # Daftar siswa
│   │   │   ├── create.ejs         # Tambah siswa + capture face
│   │   │   └── edit.ejs           # Edit siswa
│   │   └── presensi/
│   │       ├── index.ejs          # Dashboard presensi
│   │       ├── scan.ejs           # Halaman scan wajah
│   │       └── laporan.ejs        # Laporan presensi
│   └── frontend/
│       └── presensi.ejs           # Halaman presensi untuk siswa
├── public/
│   ├── models/                    # Face-api.js models
│   │   ├── tiny_face_detector_model-weights_manifest.json
│   │   ├── face_landmark_68_model-weights_manifest.json
│   │   ├── face_recognition_model-weights_manifest.json
│   │   └── face_expression_model-weights_manifest.json
│   └── js/
│       ├── face-recognition.js    # Core face recognition logic
│       └── presensi-scan.js       # Presensi scanning logic
└── uploads/
    ├── siswa/                     # Foto siswa
    └── presensi/                  # Foto presensi
```

## Cara Kerja Face Recognition

### 1. Registrasi Siswa
```javascript
// Capture foto siswa dari webcam
// Extract face descriptor (128-dimensional vector)
// Simpan descriptor ke database sebagai JSON
const descriptor = await faceapi
  .detectSingleFace(image)
  .withFaceLandmarks()
  .withFaceDescriptor();

// Simpan ke database
await db.query(
  'UPDATE siswa SET face_descriptor = ? WHERE id = ?',
  [JSON.stringify(Array.from(descriptor.descriptor)), siswaId]
);
```

### 2. Presensi dengan Face Recognition
```javascript
// Load semua face descriptors dari database
const labeledDescriptors = await loadLabeledDescriptors();

// Create face matcher
const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

// Detect face dari webcam
const detection = await faceapi
  .detectSingleFace(video)
  .withFaceLandmarks()
  .withFaceDescriptor();

// Match dengan database
const bestMatch = faceMatcher.findBestMatch(detection.descriptor);

if (bestMatch.label !== 'unknown') {
  // Siswa teridentifikasi, catat presensi
  await catatPresensi(bestMatch.label);
}
```

## Setup Instructions

### 1. Install Dependencies
```bash
npm install face-api.js canvas
```

### 2. Download Face-API Models
Download pre-trained models dari:
https://github.com/justadudewhohacks/face-api.js/tree/master/weights

Simpan di folder `public/models/`

### 3. Setup Database
```bash
node create_presensi_tables.js
```

### 4. Konfigurasi Webcam
Pastikan browser memiliki akses ke webcam:
- HTTPS required (atau localhost untuk development)
- User harus memberikan permission untuk webcam

## Fitur Admin Panel

### 1. Manajemen Siswa
- Tambah siswa baru dengan capture foto wajah
- Edit data siswa
- Update foto wajah siswa
- Hapus siswa
- Import siswa dari Excel

### 2. Dashboard Presensi
- Statistik presensi hari ini
- Grafik kehadiran per kelas
- Daftar siswa yang belum presensi
- Riwayat presensi real-time

### 3. Scan Presensi
- Interface untuk scan wajah siswa
- Preview webcam real-time
- Deteksi wajah otomatis
- Konfirmasi identitas siswa
- Catat waktu masuk/keluar

### 4. Laporan Presensi
- Filter by tanggal, kelas, siswa
- Export ke Excel/PDF
- Grafik statistik kehadiran
- Rekap bulanan per siswa

## Fitur Frontend (Untuk Siswa)

### Halaman Presensi Mandiri
- Siswa bisa melakukan presensi sendiri
- Scan wajah menggunakan webcam
- Konfirmasi identitas
- Notifikasi berhasil/gagal
- Riwayat presensi pribadi

## Keamanan & Privacy

### 1. Data Protection
- Face descriptor disimpan sebagai array numerik, bukan foto
- Enkripsi data sensitif
- Access control untuk admin/guru

### 2. GDPR Compliance
- Consent dari siswa/orang tua
- Hak untuk menghapus data
- Transparansi penggunaan data

### 3. Backup & Recovery
- Backup database regular
- Manual presensi sebagai fallback
- Log semua aktivitas presensi

## Performance Optimization

### 1. Model Loading
- Load models sekali saat page load
- Cache models di browser
- Use tiny models untuk device dengan resource terbatas

### 2. Face Detection
- Reduce video resolution untuk processing
- Throttle detection (tidak setiap frame)
- Use Web Workers untuk processing

### 3. Database
- Index pada siswa_id dan tanggal
- Pagination untuk laporan
- Cache query results

## Troubleshooting

### Webcam tidak terdeteksi
- Pastikan HTTPS atau localhost
- Check browser permissions
- Coba browser lain (Chrome recommended)

### Face recognition tidak akurat
- Pastikan pencahayaan cukup
- Foto registrasi harus jelas
- Threshold matching bisa disesuaikan (default 0.6)

### Performance lambat
- Gunakan tiny models
- Reduce video resolution
- Update browser ke versi terbaru

## Limitations

1. **Lighting Conditions**: Butuh pencahayaan yang baik
2. **Face Angle**: Wajah harus menghadap kamera
3. **Occlusion**: Masker/kacamata bisa mengurangi akurasi
4. **Multiple Faces**: Hanya detect satu wajah per scan
5. **Browser Support**: Butuh browser modern dengan WebRTC

## Future Enhancements

- [ ] Multi-face detection untuk presensi massal
- [ ] Mobile app untuk presensi
- [ ] Integration dengan sistem akademik
- [ ] Notifikasi ke orang tua via WhatsApp/Email
- [ ] AI untuk deteksi kecurangan (foto/video palsu)
- [ ] Liveness detection
- [ ] QR Code backup untuk presensi

## Resources

- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [WebRTC API](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API)

## Support

Untuk pertanyaan atau bantuan implementasi, silakan hubungi tim development atau buat issue di repository project.