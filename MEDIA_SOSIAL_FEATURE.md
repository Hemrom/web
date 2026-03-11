# Media Sosial Feature

## Overview
Fitur Media Sosial memungkinkan sekolah untuk menampilkan konten dari berbagai platform media sosial seperti TikTok, YouTube, Instagram, Facebook, dan Twitter dalam satu halaman yang terintegrasi.

## Features
- ✅ Support untuk 5 platform: TikTok, YouTube, Instagram, Facebook, Twitter
- ✅ Admin panel untuk mengelola konten media sosial
- ✅ Automatic URL conversion ke format embed
- ✅ Responsive design untuk semua device
- ✅ Status control (aktif/nonaktif)
- ✅ Ordering system untuk mengatur urutan tampil
- ✅ Native embed scripts untuk optimal performance

## Database Table
```sql
CREATE TABLE media_sosial (
  id INT PRIMARY KEY AUTO_INCREMENT,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  platform ENUM('tiktok', 'youtube', 'instagram', 'facebook', 'twitter') NOT NULL,
  embed_url TEXT NOT NULL,
  thumbnail VARCHAR(255),
  status ENUM('aktif', 'nonaktif') DEFAULT 'aktif',
  urutan INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## URL Formats Supported

### TikTok
- Input: `https://www.tiktok.com/@username/video/1234567890`
- Embed: Native TikTok embed dengan script resmi

### YouTube
- Input: `https://www.youtube.com/watch?v=VIDEO_ID` atau `https://youtu.be/VIDEO_ID`
- Embed: `https://www.youtube.com/embed/VIDEO_ID`

### Instagram
- Input: `https://www.instagram.com/p/POST_ID/`
- Embed: `https://www.instagram.com/p/POST_ID/embed/`

### Facebook
- Input: URL video Facebook lengkap
- Embed: Facebook video plugin

### Twitter
- Input: `https://twitter.com/username/status/TWEET_ID`
- Embed: Twitter embed widget

## Admin Panel
- **URL**: `/admin/media-sosial`
- **Features**:
  - Tambah konten media sosial baru
  - Edit konten yang sudah ada
  - Hapus konten
  - Atur status (aktif/nonaktif)
  - Atur urutan tampil
  - Preview konten

## Frontend
- **URL**: `/media-sosial`
- **Features**:
  - Grid layout responsive
  - Platform badges dengan warna berbeda
  - Native embed untuk setiap platform
  - Loading scripts untuk TikTok dan Twitter
  - Fallback untuk platform yang tidak support embed

## Files Created/Modified

### New Files
- `controllers/mediaSosialController.js`
- `views/admin/media-sosial/index.ejs`
- `views/admin/media-sosial/create.ejs`
- `views/admin/media-sosial/edit.ejs`
- `views/frontend/media-sosial.ejs`
- `create_media_sosial_table.js`

### Modified Files
- `config/database.sql` - Added media_sosial table
- `controllers/frontendController.js` - Added mediaSosial route
- `routes/frontend.js` - Added media-sosial route
- `routes/admin.js` - Added admin media-sosial routes
- `views/admin/partials/sidebar.ejs` - Added menu
- All frontend navigation menus - Added Media Sosial link

## Setup Instructions
1. Run database setup: `node create_media_sosial_table.js`
2. Access admin panel: `http://localhost:3000/admin/media-sosial`
3. Add social media content
4. View frontend: `http://localhost:3000/media-sosial`

## Usage Tips
1. **TikTok**: Copy URL dari browser saat melihat video TikTok
2. **YouTube**: Bisa menggunakan URL pendek (youtu.be) atau URL lengkap
3. **Instagram**: Pastikan post bersifat public untuk bisa di-embed
4. **Facebook**: Gunakan URL video Facebook lengkap
5. **Twitter**: Copy URL tweet dari browser

## Technical Notes
- Automatic URL conversion dilakukan di controller
- TikTok dan Twitter menggunakan external scripts
- Semua embed responsive dengan aspect ratio 16:9
- Error handling untuk URL yang tidak valid
- Fallback display untuk platform yang tidak support embed