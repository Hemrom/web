-- ============================================================
-- MIGRATION: Posisi teks & animasi slider homepage
-- Tanggal  : 2026-06-16
-- ============================================================

ALTER TABLE `slider`
  ADD COLUMN `posisi_teks` ENUM('kiri','tengah','kanan') NOT NULL DEFAULT 'tengah' AFTER `link_text`,
  ADD COLUMN `animasi_teks` VARCHAR(50) NOT NULL DEFAULT 'slide-up' AFTER `posisi_teks`;

UPDATE `slider` SET `posisi_teks` = 'tengah' WHERE `posisi_teks` IS NULL OR `posisi_teks` = '';
