-- ============================================================
-- FIX: Buat tabel galeri ekskul yang belum ada
-- Jalankan di phpMyAdmin atau MySQL client
-- ============================================================

CREATE TABLE IF NOT EXISTS `seni_galeri` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL DEFAULT 'Galeri Seni',
  `gambar`     VARCHAR(255) NOT NULL,
  `keterangan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bahasa_asing_galeri` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL DEFAULT 'Galeri Bahasa Asing',
  `gambar`     VARCHAR(255) NOT NULL,
  `keterangan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pencak_silat_galeri` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) DEFAULT 'Galeri Pencak Silat',
  `gambar`     VARCHAR(255) NOT NULL,
  `keterangan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verifikasi tabel berhasil dibuat:
SHOW TABLES LIKE '%galeri%';
