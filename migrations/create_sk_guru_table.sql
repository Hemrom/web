-- Migrasi: Tabel SK Guru (SK Mengajar & SK Tugas Tambahan)
-- Jalankan sekali di database sekolah_db

-- Tabel utama dokumen SK
CREATE TABLE IF NOT EXISTS `sk_guru` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `judul` varchar(255) NOT NULL COMMENT 'Judul/nama SK',
  `jenis` enum('sk_mengajar','sk_tugas_tambahan','lainnya') NOT NULL DEFAULT 'sk_mengajar' COMMENT 'Jenis SK',
  `nomor_sk` varchar(100) DEFAULT NULL COMMENT 'Nomor surat SK',
  `tahun_ajaran` varchar(20) DEFAULT NULL COMMENT 'Tahun ajaran, mis: 2025/2026',
  `tanggal_sk` date DEFAULT NULL COMMENT 'Tanggal SK diterbitkan',
  `deskripsi` text DEFAULT NULL,
  `nama_file` varchar(255) NOT NULL COMMENT 'Nama file yang tersimpan di uploads/sk/',
  `nama_file_asli` varchar(255) DEFAULT NULL COMMENT 'Nama file aslinya saat upload',
  `ukuran_file` varchar(30) DEFAULT NULL,
  `tipe_file` varchar(10) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `dibuat_oleh` int(11) DEFAULT NULL COMMENT 'user.id admin yang upload',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_jenis` (`jenis`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tabel relasi: SK ditujukan ke guru mana saja
CREATE TABLE IF NOT EXISTS `sk_guru_penerima` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sk_id` int(11) NOT NULL,
  `guru_id` int(11) NOT NULL,
  `dibaca` tinyint(1) DEFAULT 0 COMMENT '0=belum dibuka, 1=sudah dibuka',
  `tanggal_dibaca` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_sk_guru` (`sk_id`,`guru_id`),
  KEY `idx_guru_id` (`guru_id`),
  CONSTRAINT `fk_skp_sk` FOREIGN KEY (`sk_id`) REFERENCES `sk_guru` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_skp_guru` FOREIGN KEY (`guru_id`) REFERENCES `guru` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
