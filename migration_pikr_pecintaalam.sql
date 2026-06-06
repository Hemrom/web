-- ============================================================
-- MIGRATION: Tambah tabel PIK-R dan Pecinta Alam
-- Tanggal  : 2026-06-06
-- ============================================================

-- ── PIK-R ────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `pikr_kegiatan` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL,
  `slug`       VARCHAR(300) NOT NULL UNIQUE,
  `konten`     LONGTEXT,
  `gambar`     VARCHAR(255),
  `kategori`   VARCHAR(100) DEFAULT 'kegiatan',
  `status`     ENUM('published','draft') DEFAULT 'published',
  `penulis`    VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pikr_berita` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL,
  `slug`       VARCHAR(300) NOT NULL UNIQUE,
  `konten`     LONGTEXT,
  `gambar`     VARCHAR(255),
  `kategori`   VARCHAR(100) DEFAULT 'berita',
  `status`     ENUM('published','draft') DEFAULT 'published',
  `penulis`    VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pikr_galeri` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) DEFAULT 'Galeri PIK-R',
  `gambar`     VARCHAR(255) NOT NULL,
  `keterangan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── PECINTA ALAM ─────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS `pecinta_alam_kegiatan` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL,
  `slug`       VARCHAR(300) NOT NULL UNIQUE,
  `konten`     LONGTEXT,
  `gambar`     VARCHAR(255),
  `kategori`   VARCHAR(100) DEFAULT 'kegiatan',
  `status`     ENUM('published','draft') DEFAULT 'published',
  `penulis`    VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pecinta_alam_berita` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) NOT NULL,
  `slug`       VARCHAR(300) NOT NULL UNIQUE,
  `konten`     LONGTEXT,
  `gambar`     VARCHAR(255),
  `kategori`   VARCHAR(100) DEFAULT 'berita',
  `status`     ENUM('published','draft') DEFAULT 'published',
  `penulis`    VARCHAR(100),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `pecinta_alam_galeri` (
  `id`         INT AUTO_INCREMENT PRIMARY KEY,
  `judul`      VARCHAR(255) DEFAULT 'Galeri Pecinta Alam',
  `gambar`     VARCHAR(255) NOT NULL,
  `keterangan` TEXT,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Selesai. Jalankan file ini sekali di MySQL/phpMyAdmin.
-- ============================================================
