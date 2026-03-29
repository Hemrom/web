-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 29 Mar 2026 pada 11.10
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.1.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sekolah_db`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `admin`
--

INSERT INTO `admin` (`id`, `username`, `password`, `nama`, `email`, `created_at`) VALUES
(1, 'admin', '0192023a7bbd73250516f069df18b500', 'Administrator', 'admin@sekolah.com', '2026-03-14 07:44:11');

-- --------------------------------------------------------

--
-- Struktur dari tabel `berita`
--

CREATE TABLE `berita` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `konten` text NOT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `penulis` varchar(100) DEFAULT NULL,
  `tanggal_publish` date DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'draft',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `penulis_id` int(11) DEFAULT NULL,
  `kategori` enum('pengumuman','kegiatan','prestasi','umum') DEFAULT 'umum'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `berita`
--

INSERT INTO `berita` (`id`, `judul`, `slug`, `konten`, `gambar`, `penulis`, `tanggal_publish`, `status`, `created_at`, `updated_at`, `penulis_id`, `kategori`) VALUES
(1, 'Tunggu Aku di Hari Senin', 'tunggu-aku-di-hari-senin', '<p></p><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">Setelah melewati masa liburan puasa yang penuh makna, suasana di SMK Negeri 1 Kras kembali hidup dengan kehadiran siswa-siswi yang memulai aktivitas belajar seperti biasa. Hari pertama masuk sekolah setelah libur panjang ini menjadi momen yang dinantikan, baik oleh peserta didik maupun para guru. Semangat baru tampak jelas dari wajah para siswa yang kembali berkumpul, saling berbagi cerita pengalaman selama bulan puasa dan Hari Raya.\r\n\r\nSejak pagi hari, lingkungan sekolah sudah terlihat ramai. Para siswa datang dengan penuh antusias, mengenakan seragam rapi dan wajah ceria.&nbsp;</span></div><img src=\"/uploads/berita-1774678897045.jpeg\" style=\"text-align: justify; width: 25%; float: left;\" class=\"note-float-left\"><div style=\"text-align: right;\"><div style=\"text-align: justify;\"><br></div><span style=\"font-size: 1rem;\"><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">Beberapa di antaranya terlihat saling bersalaman sebagai bentuk mempererat silaturahmi setelah libur panjang. Tradisi saling memaafkan ini menjadi nilai penting yang terus dijaga di lingkungan sekolah, mencerminkan karakter positif yang ditanamkan kepada seluruh warga sekolah.\r\n\r\nKepala sekolah dalam sambutannya menyampaikan pentingnya menjaga semangat belajar setelah liburan. Ia mengingatkan bahwa momentum setelah bulan puasa adalah waktu yang tepat untuk memulai kembali aktivitas dengan energi baru dan niat yang lebih baik. “Liburan telah usai, saatnya kita kembali fokus belajar, mengejar prestasi, dan mempersiapkan masa depan,” ujarnya di hadapan seluruh siswa saat apel pagi.\r\n\r\nTidak hanya itu, para guru juga turut memberikan motivasi kepada siswa agar tidak kehilangan semangat. Mereka mengajak siswa untuk menjadikan pengalaman selama bulan puasa sebagai pelajaran berharga dalam membentuk kedisiplinan, kesabaran, dan tanggung jawab. Nilai-nilai tersebut diharapkan dapat diterapkan dalam kegiatan belajar sehari-hari di sekolah.\r\n\r\nDi dalam kelas, suasana pembelajaran berlangsung dengan penuh semangat. Meskipun baru kembali dari liburan, para siswa terlihat siap mengikuti pelajaran. Interaksi antara guru dan siswa pun terasa lebih hangat, karena diawali dengan suasana kebersamaan yang terbangun sejak pagi hari. Beberapa guru juga memberikan kegiatan ringan dan menyenangkan sebagai bentuk adaptasi agar siswa tidak merasa jenuh di hari pertama.\r\n\r\nSelain kegiatan belajar mengajar, sekolah juga mengadakan agenda halal bihalal sebagai sarana mempererat hubungan antar warga sekolah. Kegiatan ini diisi dengan saling berjabat tangan, doa bersama, serta tausiyah singkat yang memberikan motivasi spiritual kepada siswa. Momen ini menjadi pengingat bahwa kebersamaan dan saling menghargai adalah bagian penting dalam kehidupan sekolah.\r\n\r\nDengan berakhirnya masa liburan puasa, diharapkan seluruh siswa SMK Negeri 1 Kras dapat kembali fokus dan berkomitmen dalam menempuh pendidikan. Semangat baru yang muncul di hari pertama ini diharapkan dapat terus terjaga hingga akhir semester. Sekolah pun berkomitmen untuk terus memberikan lingkungan belajar yang nyaman, inspiratif, dan mendukung perkembangan potensi setiap siswa.\r\n\r\nKembalinya aktivitas sekolah bukan hanya sekadar rutinitas, tetapi juga awal baru untuk meraih prestasi yang lebih baik. Dengan semangat kebersamaan, disiplin, dan motivasi yang tinggi, siswa-siswi SMK Negeri 1 Kras siap melangkah maju menghadapi tantangan dan meraih masa depan yang gemilang.</span></div></span></div><p></p>', 'berita-1774677705701.jpeg', NULL, NULL, 'published', '2026-03-28 06:01:45', '2026-03-28 06:29:50', 7, 'umum'),
(2, 'SMK Negeri 1 Kras Siap Gelar Uji Kompetensi Keahlian (UKK)', 'smk-negeri-1-kras-siap-gelar-uji-kompetensi-keahlian-ukk', '<p><span style=\"font-size: 1rem;\">Kediri – SMK Negeri 1 Kras kembali menunjukkan komitmennya dalam mencetak lulusan yang kompeten dan siap kerja melalui pelaksanaan Uji Kompetensi Keahlian (UKK) yang akan dilaksanakan pada hari Senin besok. Kegiatan ini menjadi salah satu momen penting bagi siswa kelas XII sebagai bentuk evaluasi akhir terhadap kemampuan yang telah mereka pelajari selama menempuh pendidikan di bangku sekolah menengah kejuruan.</span></p><p><span style=\"font-size: 1rem;\">UKK merupakan bagian dari sistem penilaian nasional yang bertujuan untuk mengukur pencapaian kompetensi siswa sesuai dengan standar dunia kerja. Melalui kegiatan ini, siswa diharapkan mampu menunjukkan keterampilan, pengetahuan, dan sikap profesional yang telah mereka latih selama tiga tahun terakhir. Pelaksanaan UKK di SMK Negeri 1 Kras akan melibatkan berbagai program keahlian, seperti Teknik Kendaraan Ringan (TKR), Teknik Komputer dan Jaringan (TKJ), serta Tata Boga/Kuliner.</span></p><p><span style=\"font-size: 1rem;\">Persiapan UKK telah dilakukan secara matang oleh pihak sekolah sejak beberapa minggu terakhir. Mulai dari penyusunan jadwal, penyiapan sarana dan prasarana praktik, hingga koordinasi dengan penguji eksternal dari dunia usaha dan dunia industri (DUDI). Kehadiran penguji eksternal ini bertujuan untuk memastikan bahwa standar penilaian yang digunakan sesuai dengan kebutuhan industri saat ini.</span></p><p><span style=\"font-size: 1rem;\">Kepala sekolah SMK Negeri 1 Kras menyampaikan bahwa UKK bukan sekadar ujian biasa, melainkan ajang pembuktian kemampuan siswa. “UKK adalah kesempatan bagi siswa untuk menunjukkan bahwa mereka benar-benar siap terjun ke dunia kerja. Kami berharap seluruh siswa dapat mengikuti kegiatan ini dengan penuh percaya diri dan tanggung jawab,” ujarnya.</span></p><p><span style=\"font-size: 1rem;\">Pada program keahlian Teknik Komputer dan Jaringan (TKJ), siswa akan diuji dalam berbagai aspek, seperti instalasi jaringan, konfigurasi perangkat, hingga troubleshooting sistem. Sementara itu, pada program Teknik Kendaraan Ringan, siswa akan melaksanakan praktik perawatan dan perbaikan kendaraan sesuai standar industri otomotif. Adapun pada program Tata Boga/Kuliner, siswa akan menunjukkan keterampilan dalam mengolah dan menyajikan makanan dengan memperhatikan aspek kebersihan, rasa, dan presentasi.</span></p><p><span style=\"font-size: 1rem;\">Selain kemampuan teknis, aspek sikap kerja juga menjadi bagian penting dalam penilaian UKK. Siswa dituntut untuk menunjukkan kedisiplinan, ketelitian, serta kemampuan bekerja secara mandiri maupun dalam tim. Hal ini sejalan dengan kebutuhan dunia kerja yang tidak hanya mengutamakan keterampilan, tetapi juga karakter dan etos kerja yang baik.</span></p><p><span style=\"font-size: 1rem;\">Para siswa mengaku telah mempersiapkan diri dengan serius menghadapi UKK ini. Berbagai latihan praktik tambahan telah dilakukan, baik di sekolah maupun secara mandiri. Salah satu siswa jurusan TKJ menyampaikan bahwa dirinya merasa lebih percaya diri setelah mendapatkan bimbingan intensif dari guru. “Kami sudah sering latihan, jadi semoga saat UKK nanti bisa berjalan lancar dan mendapatkan hasil terbaik,” ungkapnya.</span></p><p><span style=\"font-size: 1rem;\">Dukungan penuh juga diberikan oleh para guru dan tenaga kependidikan di SMK Negeri 1 Kras. Mereka terus memberikan motivasi serta pendampingan kepada siswa agar dapat menghadapi UKK dengan optimal. Tidak hanya itu, sekolah juga memastikan bahwa seluruh peralatan dan bahan yang dibutuhkan dalam pelaksanaan UKK telah tersedia dan dalam kondisi baik.</span></p><p><span style=\"font-size: 1rem;\">Pelaksanaan UKK ini diharapkan dapat memberikan gambaran nyata tentang kesiapan siswa dalam menghadapi dunia kerja. Hasil UKK nantinya akan menjadi salah satu indikator kelulusan sekaligus bekal penting bagi siswa untuk melanjutkan ke jenjang karier berikutnya, baik bekerja maupun berwirausaha.</span></p><p><span style=\"font-size: 1rem;\">Dengan adanya kegiatan UKK, SMK Negeri 1 Kras terus berupaya menjaga kualitas pendidikan kejuruan agar tetap relevan dengan perkembangan zaman. Kegiatan ini juga menjadi bukti nyata bahwa sekolah tidak hanya fokus pada teori, tetapi juga pada penguasaan keterampilan praktis yang dibutuhkan di dunia industri.</span></p><p><span style=\"font-size: 1rem;\">Menjelang pelaksanaan UKK, suasana di lingkungan sekolah mulai terasa lebih dinamis. Siswa tampak sibuk mempersiapkan diri, sementara guru dan panitia memastikan seluruh rangkaian kegiatan berjalan sesuai rencana. Harapannya, pelaksanaan UKK pada hari Senin besok dapat berlangsung dengan lancar tanpa kendala yang berarti.</span></p><p><span style=\"font-size: 1rem;\">Melalui UKK ini, SMK Negeri 1 Kras kembali menegaskan perannya sebagai lembaga pendidikan yang berorientasi pada kualitas dan kesiapan kerja lulusan. Dengan semangat dan kerja keras seluruh warga sekolah, diharapkan siswa dapat meraih hasil terbaik dan siap melangkah menuju masa depan yang lebih cerah.</span></p>', NULL, NULL, NULL, 'published', '2026-03-29 07:53:33', '2026-03-29 07:53:33', 7, 'kegiatan'),
(3, 'Komitmen Menggunakan HP di Lingkungan Sekolah', 'komitmen-menggunakan-hp-di-lingkungan-sekolah', '<p></p><h2>📌 <strong>Ringkasan Aturan Penggunaan HP di Sekolah</strong></h2><h3>🎯 <strong>Tujuan Aturan Ini</strong></h3><p>Aturan ini dibuat supaya:</p><ul><li><p>Pembelajaran lebih fokus dan nyaman</p></li><li><p>Siswa terhindar dari dampak negatif gadget (game berlebihan, hoaks, cyberbullying, dll)</p></li><li><p>Siswa tetap punya karakter baik dan interaksi sosial yang sehat</p></li></ul><hr><h2>📱 <strong>Aturan Utama Penggunaan HP</strong><img src=\"/uploads/berita-1774771371026.jpeg\" style=\"display: block; max-width: 100%; margin: 1.5rem auto; width: 25%; float: right;\" class=\"note-float-right\"></h2><h3>1. <strong>Boleh Bawa HP, Tapi Tidak Bebas Dipakai</strong></h3><ul><li><p>HP boleh dibawa ke sekolah</p></li><li><p>Saat pelajaran:</p><ul><li><p>Harus <strong>mode silent</strong></p></li><li><p>Disimpan di tempat yang ditentukan</p></li><li><p>Hanya boleh dipakai kalau <strong>guru menyuruh</strong></p></li></ul></li></ul><hr><h3>2. <strong>HP Hanya untuk Belajar</strong></h3><p>HP boleh digunakan jika:</p><ul><li><p>Cari materi pelajaran</p></li><li><p>Ikut kuis online (Quizizz, Kahoot, dll)</p></li><li><p>Mengumpulkan tugas</p></li><li><p>Kegiatan belajar lainnya</p></li></ul><p>❌ Tidak boleh:</p><ul><li><p>Main game saat pelajaran</p></li><li><p>Buka hiburan (TikTok, YouTube, dll tanpa izin)<img src=\"/uploads/berita-1774771398623.jpeg\" style=\"display: block; max-width: 100%; margin: 1.5rem auto; width: 25%; float: right;\" class=\"note-float-right\"></p></li></ul><hr><h3>3. <strong>Jaga Etika Digital</strong></h3><p>Dilarang:</p><ul><li><p>Foto / video teman tanpa izin</p></li><li><p>Cyberbullying (ngejek, menghina online)</p></li><li><p>Sebar hoaks</p></li><li><p>Akses konten tidak pantas</p></li></ul><hr><h3>4. <strong>Saat Istirahat</strong></h3><ul><li><p>Boleh pakai HP, tapi <strong>secukupnya saja</strong></p></li><li><p>Lebih dianjurkan:</p><ul><li><p>Ngobrol langsung dengan teman</p></li><li><p>Aktivitas fisik ringan</p></li><li><p>Interaksi sosial</p></li></ul></li></ul><hr><h3>5. <strong>Tanggung Jawab</strong></h3><ul><li><p>Siswa bertanggung jawab atas HP masing-masing</p></li><li><p>Sekolah <strong>tidak bertanggung jawab</strong> jika HP hilang/rusak</p></li><li><p>Guru akan mengawasi penggunaan HP<img src=\"/uploads/berita-1774771421858.jpeg\" style=\"display: block; max-width: 100%; margin: 1.5rem auto; width: 25%; float: right;\" class=\"note-float-right\"></p></li></ul><hr><h3>⚠️ <strong>Sanksi Jika Melanggar</strong></h3><p>Bertahap:</p><ol><li><p>Teguran</p></li><li><p>HP disita sementara</p></li><li><p>Panggilan orang tua</p></li><li><p>Pembinaan lanjutan</p></li></ol><p>👉 Jika pelanggaran berat (misalnya curang ujian), akan ditindak lebih tegas</p><hr><h2>👨‍👩‍👧 <strong>Peran Orang Tua</strong></h2><ul><li><p>Mendukung aturan sekolah</p></li><li><p>Tidak menghubungi siswa saat pelajaran (kecuali darurat)</p></li><li><p>Siap menerima konsekuensi jika anak melanggar<img src=\"/uploads/berita-1774771435773.jpeg\" style=\"display: block; max-width: 100%; margin: 1.5rem auto; width: 25%; float: right;\" class=\"note-float-right\"></p></li></ul><hr><h2>🗓️ <strong>Mulai Berlaku</strong></h2><ul><li><p>Uji coba: awal April 2026</p></li><li><p>Setelah itu akan dievaluasi dan diterapkan penuh</p></li></ul><hr><h2>✅ <strong>Kesimpulan Singkat</strong></h2><p>👉 HP <strong>boleh dibawa</strong>, tapi:</p><ul><li><p>Tidak boleh dipakai sembarangan</p></li><li><p>Harus sesuai aturan dan instruksi guru</p></li><li><p>Digunakan secara bijak dan bertanggung jawab</p></li></ul><hr><p><br></p>', NULL, NULL, NULL, 'published', '2026-03-29 08:04:18', '2026-03-29 08:04:18', 7, 'pengumuman');

-- --------------------------------------------------------

--
-- Struktur dari tabel `galeri`
--

CREATE TABLE `galeri` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) NOT NULL,
  `kategori` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `galeri`
--

INSERT INTO `galeri` (`id`, `judul`, `deskripsi`, `gambar`, `kategori`, `created_at`) VALUES
(2, 'Kegiatan Halal Bi Halal', 'Halal Bi Halal', 'galeri-1774677492695.jpeg', 'Kegiatan', '2026-03-28 05:58:12');

-- --------------------------------------------------------

--
-- Struktur dari tabel `guru`
--

CREATE TABLE `guru` (
  `id` int(11) NOT NULL,
  `nip` varchar(50) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `mata_pelajaran` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `jabatan` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `guru`
--

INSERT INTO `guru` (`id`, `nip`, `nama`, `jenis_kelamin`, `tempat_lahir`, `tanggal_lahir`, `alamat`, `telepon`, `email`, `mata_pelajaran`, `foto`, `created_at`, `jabatan`) VALUES
(77, '', 'ANIK SAFITRI BUDIYATI, S.Kom.', 'L', NULL, NULL, NULL, '', '', '', 'guru-1774750265698.png', '2026-03-29 01:45:21', 'KEPALA SEKOLAH'),
(78, NULL, 'Drs. ANDIKA BAYU SAPUTRO', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 01:45:21', 'WAKA SARPRAS'),
(79, NULL, 'Drs. HAJI SIGIT SUPRANOTO', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:21', 'KAPROGLI TPTUP'),
(80, NULL, 'AYU DINI ARDIANTI,S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:21', 'WAKA KURIKULUM'),
(81, NULL, 'KUSMAN RAHMANU ADI,S.T', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:21', 'GURU'),
(82, NULL, 'ACHMAD AMIN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:21', 'GURU'),
(83, NULL, 'ALI ZURO, SPd.', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:21', 'GURU'),
(84, NULL, 'RENI YULIASIH,S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'BENDAHARA'),
(85, NULL, 'PENI SULISTYOWATI, S.Pd.I', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU'),
(86, NULL, 'INDRAGUS SHOLEHHUDIN, M.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'PJOK', NULL, '2026-03-29 01:45:22', 'GURU'),
(87, NULL, 'SUHARDHINI SETYANINGSIH,S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(88, NULL, 'WINDI YUNITA, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Sejarah Indonesia', NULL, '2026-03-29 01:45:22', 'GURU'),
(89, NULL, 'RIZKY LIA ANGGRAENY, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU'),
(90, NULL, 'EKO DODY PRASETYO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU'),
(91, NULL, 'SRI PURWANTI M, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:22', 'GURU'),
(92, NULL, 'DIANA CATUR  K.S, S.Kom', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU'),
(93, NULL, 'SOJU PURWANTO, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU'),
(94, NULL, 'ANGGA WARDHANA, S.Kom.', 'L', NULL, NULL, NULL, NULL, NULL, 'Informatika', NULL, '2026-03-29 01:45:22', 'WAKA HUMAS'),
(95, NULL, 'ATIK NURUL AINI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU'),
(96, NULL, 'AHMAD BAGUS DWI S, S.S', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'WAKA KESISWAAN'),
(97, NULL, 'AFIF RAHMAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(98, NULL, 'BASRONI , S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU'),
(99, NULL, 'YANUAR DWIANTA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU'),
(100, NULL, 'M. ANDIK ROHMATULLOH, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU'),
(101, NULL, 'LU\'LUATUL MABRUROH,S.Ag,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU'),
(102, NULL, 'IKE CINTIA DEWI, S.Pd, Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU'),
(103, NULL, 'ADHIEN WAHYU F.M. S.Pd.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU'),
(104, NULL, 'BOBY SUTANTO, S.Kom', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU'),
(105, NULL, 'TINO BAMBANG GUNAWAN, S.Kom., Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'KAPROGLI TKJ'),
(106, NULL, 'NANDA DHARA AYU P. M, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(107, NULL, 'BAGUS SETIAWAN, S.Pd, Kons.', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:22', 'GURU'),
(108, NULL, 'ULFIAN ASIFA AMINULLOH, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU'),
(109, NULL, 'NIA SASI HARDIANI, M.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'KAPROGLI KULINER'),
(110, NULL, 'RISKA HANDAYANI, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jawa', NULL, '2026-03-29 01:45:22', 'GURU'),
(111, NULL, 'BINTI MUSAFAAH,S.Pd,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU'),
(112, NULL, 'Dra. ENI RELAWATI.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jepang', NULL, '2026-03-29 01:45:22', 'GURU'),
(113, NULL, 'AGUS NAWATRI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU'),
(114, NULL, 'BEKTI WIDHIANTO, S.Kom.,Gr.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU'),
(115, NULL, 'SULISTIYO ANIS, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(116, NULL, 'M. HATTA UBAID, S.T.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU'),
(117, '', 'IMAM JUNAIDI ABROR, S.Kom.', 'L', NULL, NULL, NULL, '', '', 'Produktif TKJ', 'guru-1774755530289.png', '2026-03-29 01:45:22', 'GURU'),
(118, NULL, 'DONI ARDIANTO,S.KOM.,Gr.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU'),
(119, NULL, 'BIMA BUDI PRAKOSA, S.Pd.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(120, NULL, 'DEVY RARA GUVITHA, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(121, NULL, 'ABIDATUL ROKHIMAH, S.Pd.I', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU'),
(122, NULL, 'RR. YUNITA SAMAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU'),
(123, NULL, 'NASIKIN, S.E', 'L', NULL, NULL, NULL, NULL, NULL, 'Kewirausahaan', NULL, '2026-03-29 01:45:22', 'GURU'),
(124, NULL, 'KURNIA SILVI MUSTIKA SARI, SPd', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU'),
(125, NULL, 'ANANG KURNIAWAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU'),
(126, NULL, 'WIWIK KAMDIATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU'),
(127, NULL, 'SETYAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU'),
(128, NULL, 'DIEBA NABILLA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU'),
(129, NULL, 'ANGGRAINI WULANSARI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU'),
(130, NULL, 'SITI KOMARIRIATUZ ZAHROK, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU'),
(131, NULL, 'CANDRA DWI NURUDIANTO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU'),
(132, NULL, 'EKO SANTOSO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU'),
(133, NULL, 'HENDRIK KURNIAWAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'KAPROGLI TKRO'),
(134, NULL, 'DEVI AYU LIA FITRIA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Seni Budaya', NULL, '2026-03-29 01:45:22', 'GURU'),
(135, NULL, 'SITI NURUL FAUZIYAH, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU'),
(136, NULL, 'SANDY RIAWAN, M.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU'),
(137, NULL, 'ADI PRAWIRO, S.T.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 01:45:22', 'GURU'),
(138, NULL, 'FAIZ SYAIKHONI AZIZ, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 01:45:22', 'GURU'),
(139, NULL, 'MOHAMAD KUSMAN NADI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU'),
(140, NULL, 'JUNIANTO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jawa', NULL, '2026-03-29 01:45:22', 'GURU'),
(141, NULL, 'YUNENI FITRI HARIATI, SP', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'KTU'),
(142, NULL, 'M. LUFFI SYAFI\'I, S.T', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(143, NULL, 'ROIYATUS SYARI\'AH', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(144, NULL, 'AGUNG SUBELA, S.H', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(145, NULL, 'SUHARTI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(146, NULL, 'IKE SASI JARIYANTO', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(147, NULL, 'PURNOMO', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(148, NULL, 'FUAT HASIM', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(149, NULL, 'ABDUL FATAH', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(150, NULL, 'MAFTUCHIN QOMARUZZAMAN', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(151, NULL, 'MOH A\'AM TAUFIQI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(152, NULL, 'MUHAMAD RO\'UF FIRNANDA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(153, NULL, 'FEBRIANA EKA WULANDARI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(154, NULL, 'ADHIYASA KHOIRUL MUTTAQIIN', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU'),
(155, NULL, 'RISKI PANDUWINATA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Toolman Kuliner'),
(156, NULL, 'M. SUGENG RIADI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Perpus'),
(157, NULL, 'AHMAT ASROFI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Caraka'),
(158, NULL, 'RIKI WAHYU KUSUMA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Toolman TKRO'),
(159, NULL, 'DANANG', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Satpam'),
(160, NULL, 'ALIF PUTRA FADHILAH, S.T', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 05:08:49', 'GURU'),
(161, NULL, 'ANDIK TRIYONO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 05:08:49', 'GURU'),
(162, NULL, 'FAISSAL RACHMAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 05:08:49', 'GURU');

-- --------------------------------------------------------

--
-- Struktur dari tabel `halaman`
--

CREATE TABLE `halaman` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `konten` longtext DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `halaman`
--

INSERT INTO `halaman` (`id`, `judul`, `slug`, `konten`, `foto`, `status`, `created_at`, `updated_at`) VALUES
(3, 'Pencak Silat', 'pencak-silat', '<p style=\"text-align: justify;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ekstrakurikuler pencak silat adalah kegiatan sekolah di luar jam pelajaran yang bertujuan melatih seni bela diri tradisional Indonesia, meningkatkan kebugaran fisik, disiplin, mental tangguh, serta melestarikan budaya bangsa. Kegiatan ini memadukan empat aspek utama: mental-spiritual, bela diri, seni budaya, dan olahraga.&nbsp;</p><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify;\"><b>Berikut adalah poin-poin penting mengenai ekstrakurikuler pencak silat:</b></p><ul><li style=\"text-align: justify;\"><b>Pengembangan Karakter</b>: Membentuk mental disiplin, percaya diri, bertanggung jawab, sportif, dan berani, sebagaimana dijelaskan dalam artikel UNESA dan smk-almuttaqien.sch.id.</li><li style=\"text-align: justify;\"><b>Fisik &amp; Teknik</b>: Melatih kuda-kuda, pukulan, tendangan, stamina, kekuatan, dan kelenturan tubuh, menurut website SDNSuradadi4 dan Halodoc.</li><li style=\"text-align: justify;\"><b>Prestasi</b>: Menyediakan wadah untuk menyalurkan bakat dan berprestasi di kejuaraan tingkat sekolah, daerah, maupun nasional.</li><li style=\"text-align: justify;\"><b>Pelestarian Budaya</b>: Mengenalkan budaya luhur Indonesia kepada generasi muda</li></ul>', 'halaman-1774761639873.jpg', 'aktif', '2026-03-28 14:58:08', '2026-03-29 05:31:08'),
(4, 'Pramuka', 'pramuka', '<p style=\"text-align: justify; \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ekskul pramuka adalah kegiatan ekstrakurikuler wajib di sekolah yang bertujuan membentuk karakter siswa, kepemimpinan, kemandirian, dan disiplin melalui aktivitas luar ruangan yang menyenangkan. Pramuka (Praja Muda Karana) menanamkan nilai-nilai Pancasila, cinta alam, serta keterampilan hidup seperti pertolongan pertama (P3K), berkemah, dan tali-temali.&nbsp;</p><p style=\"text-align: justify;\"><b>Karakteristik &amp; Tujuan Ekskul Pramuka:</b></p><ul><li style=\"text-align: justify;\">Pembentukan Karakter: Mengembangkan akhlak mulia, kemandirian, dan tanggung jawab.</li><li style=\"text-align: justify;\">Pendidikan Karakter &amp; Keterampilan: Mengajarkan disiplin, kepedulian sosial, dan kecintaan terhadap lingkungan.</li><li style=\"text-align: justify; \">Wajib Disediakan: Sekolah wajib menyediakan, namun tidak wajib diikuti secara individu (berdasarkan Permendikbudristek No 12 Tahun 2024).</li><li style=\"text-align: justify;\">Sistem Belajar: Menggunakan pola \"belajar sambil melakukan\" (learning by doing) dan permainan edukatif di alam terbuka.&nbsp;</li></ul><p style=\"text-align: justify;\"><b>Contoh Kegiatan Pramuka (Usage Examples):</b></p><ul><li style=\"text-align: justify;\">Perkemahan Sabtu-Minggu (Persami): Berkemah untuk melatih kemandirian dan kerjasama.</li><li style=\"text-align: justify;\">Pionering dan Tali-Temali: Membuat tandu atau tenda darurat menggunakan tongkat dan tali.</li><li style=\"text-align: justify;\">Baris-Berbaris (PBB): Latihan rutin untuk disiplin dan kekompakan.</li><li style=\"text-align: justify;\">Jelajah Alam (Wide Game): Kegiatan penjelajahan untuk melatih fisik dan kerjasama tim.</li><li style=\"text-align: justify;\">Bakti Sosial: Gotong royong membersihkan lingkungan atau membantu masyarakat.&nbsp;</li></ul>', 'halaman-1774761942548.jpg', 'aktif', '2026-03-29 05:25:42', '2026-03-29 05:31:46'),
(5, 'Badminton', 'badminton', '<p style=\"text-align: justify; \">          Ekstrakurikuler badminton (bulu tangkis) adalah kegiatan olahraga di luar jam pelajaran sekolah yang bertujuan mengembangkan bakat, minat, serta kebugaran fisik dan mental siswa. Ekskul ini melatih teknik dasar, taktik, dan sportivitas untuk mempersiapkan siswa dalam kompetisi, seperti O2SN, serta menanamkan karakter disiplin. </p><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify; \"><b>Tujuan dan Manfaat Ekstrakurikuler Badminton:</b></p><ul><li style=\"text-align: justify;\">Pengembangan Bakat: Wadah bagi siswa yang memiliki hobi bulu tangkis.</li><li style=\"text-align: justify;\">Kesehatan Fisik: Meningkatkan kelincahan, ketahanan fisik, dan menurunkan berat badan.</li><li style=\"text-align: justify;\">Prestasi: Mempersiapkan fisik dan mental untuk kejuaraan antar pelajar.</li><li style=\"text-align: justify;\">Sportivitas & Karakter: Membangun rasa persaudaraan, kerjasama tim, dan karakter pantang menyerah. </li></ul><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify;\"><b>Aktivitas dalam Ekskul Badminton:</b></p><ul><li style=\"text-align: justify;\">Latihan rutin teknik dasar (pukulan, footwork) dan taktik permainan.</li><li style=\"text-align: justify;\">Latihan fisik seperti skipping, push up, dan lari.</li><li style=\"text-align: justify;\">Sparring (pertandingan) antar anggota atau sekolah lain.</li></ul>', 'halaman-1774762089550.jpg', 'aktif', '2026-03-29 05:28:09', '2026-03-29 07:22:53'),
(7, 'PROGLI TKJ', 'progli-tkj', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT) adalah program keahlian SMK yang fokus mempelajari instalasi, konfigurasi, perawatan, dan keamanan jaringan komputer serta infrastruktur telekomunikasi. Ini adalah evolusi dari jurusan TKJ yang lebih modern, mencakup teknologi cloud, IoT, dan fiber optik.&nbsp;</p><p><b style=\"font-size: 1rem;\">Detail Materi Pembelajaran TJKT:</b></p><ul><li>Perakitan &amp; Troubleshooting PC: Merakit komputer, instalasi sistem operasi (Windows/Linux), dan perbaikan perangkat keras/lunak.</li><li>Jaringan Komputer (LAN/WAN/WiFi): Membangun jaringan kabel dan nirkabel, konfigurasi router, manageable switch, dan firewall.</li><li>Administrasi Server: Mengelola server jaringan, sistem keamanan jaringan, dan layanan berbasis cloud.</li><li>Telekomunikasi: Mempelajari teknologi fiber optik, kabel struktural, dan sistem telepon.</li><li>Pemrograman Dasar: Mempelajari dasar pemrograman (HTML, CSS, PHP, MySQL) untuk kebutuhan web dan jaringan.&nbsp;</li></ul><p><span style=\"font-size: 1rem;\"><b>Prospek Kerja Lulusan TJKT:</b></span></p><ul><li>Lulusan TJKT sangat dibutuhkan untuk posisi seperti:&nbsp;</li><li>Network Administrator: Pengelola jaringan perusahaan.</li><li>Teknisi Jaringan/Fiber Optik: Pemasang dan pemelihara jaringan.</li><li>IT Support/Helpdesk: Teknisi perbaikan perangkat.</li><li>System Administrator: Pengelola server.</li><li>Wirausaha IT: Membuka jasa servis atau Depok internet service provider (ISP).&nbsp;</li></ul><p><span style=\"font-size: 1rem;\"><b>Keunggulan:</b></span></p><p>Siswa TJKT seringkali dibekali sertifikasi kompetensi (BNSP) dan kurikulum industri, membuat mereka siap kerja langsung setelah lulus.</p>', NULL, 'aktif', '2026-03-29 07:16:16', '2026-03-29 07:16:16'),
(8, 'PROGLI TPTUP', 'progli-tptup', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Jurusan TPTU (Teknik Pendingin dan Tata Udara) atau Refrigeration and Air Conditioning adalah bidang keahlian SMK yang mempelajari perencanaan, instalasi, perawatan, dan perbaikan sistem pendingin (kulkas, freezer) serta tata udara (AC gedung, ventilasi). Lulusan TPTU dipersiapkan menjadi teknisi HVAC profesional yang ahli dalam kelistrikan, pemipaan, dan refrigeran.&nbsp;</p><p><span style=\"font-size: 1rem;\"><b>Detail Kompetensi dan Materi Pembelajaran TPTU:</b></span></p><ul><li>Dasar Pendinginan: Mempelajari siklus refrigerasi, jenis-jenis refrigeran, dan prinsip perpindahan panas.</li><li>Instalasi AC dan Tata Udara: Memasang AC rumah tangga (split), AC komersial (cassette, standing), dan sistem tata udara gedung (AC Central/Chiller).</li><li>Pemeliharaan dan Perbaikan (Maintenance &amp; Troubleshooting): Merawat rutin, mendeteksi kerusakan, dan memperbaiki kulkas, freezer, cold storage, serta AC.</li><li>Kelistrikan dan Kontrol: Memahami sistem kelistrikan pada unit pendingin dan sistem kontrol otomatis.</li><li>Keselamatan Kerja (K3): Menerapkan standar keselamatan kerja dalam menangani sistem kelistrikan dan tekanan tinggi.</li><li>Pipa dan Alat Ukur: Menguasai pengelasan pipa tembaga, instalasi pemipaan, dan penggunaan alat ukur refrigerasi (manifold gauge, tang ampere, las).&nbsp;</li></ul><p><b style=\"font-size: 1rem;\">Prospek Kerja Lulusan TPTU:</b></p><ul><li>Teknisi AC/Refrigerasi: Teknisi di perkantoran, perhotelan, rumah sakit, atau pabrik.</li><li>Maintenance Engineer: Petugas perawatan sistem pendingin di gedung komersial.</li><li>Wirausaha: Membuka jasa servis AC, instalasi, dan penjualan unit pendingin.</li><li>Industri: Teknisi di industri makanan, minuman, dan cold storage (gudang pendingin).</li><li>Teknisi Mesin Otomotif: Spesialis AC kendaraan.&nbsp;</li></ul><p><span style=\"font-size: 1rem;\">TPTU adalah jurusan yang langka dengan tingkat kebutuhan industri yang tinggi, menjadikannya salah satu jurusan SMK dengan peluang kerja yang sangat menjanjikan.&nbsp;</span></p>', NULL, 'aktif', '2026-03-29 07:29:17', '2026-03-29 07:29:17'),
(9, 'PROGLI KULINER', 'progli-kuliner', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Jurusan Kuliner (atau Tata Boga) adalah bidang studi yang mempelajari seni dan teknik mengolah makanan, manajemen dapur profesional, serta pelayanan makanan dan minuman. Fokus utamanya adalah persiapan, pengolahan, hingga penyajian hidangan Nusantara dan Internasional, baik di tingkat SMK maupun pendidikan tinggi, untuk mencetak koki profesional, pastry chef, atau wirausahawan kuliner.&nbsp;</p><p><span style=\"font-size: 1rem;\"><b>Berikut adalah detail mengenai Jurusan Kuliner:</b></span></p><p><b>1. Apa yang Dipelajari?</b></p><ul><li>Teknik Memasak: Dasar-dasar memasak seperti cutting skills (memotong), sauté (menumis), grill (memanggang), hingga metode masak kontinental dan oriental.</li><li>Pastry &amp; Bakery: Keterampilan khusus membuat roti, kue, kue kering, dan dessert.</li><li>Keamanan Pangan &amp; Sanitasi: Penerapan standar kebersihan dapur dan keamanan makanan (seperti HACCP).</li><li>Manajemen Dapur &amp; Restoran: Pengelolaan operasional, perencanaan menu, kontrol stok bahan, dan layanan pelanggan (food and beverage service).</li><li>Ilmu Gizi: Pemahaman nilai gizi dan nutrisi makanan.&nbsp;</li></ul><p><b style=\"font-size: 1rem;\">2. Fokus Konsentrasi</b></p><ul><li>Kuliner/Tata Boga: Lebih fokus pada teknis memasak dan operasional dapur.</li><li>Pastry &amp; Bakery: Khusus mendalami seni membuat kue dan roti.</li><li>Bisnis Kuliner: Fokus pada penerapan ilmu bisnis, konsep menu, dan kewirausahaan.&nbsp;</li></ul><p><span style=\"font-size: 1rem;\"><b>3. Prospek Karier</b></span></p><ul><li>Chef/Koki Profesional: Bekerja di restoran, hotel, atau kapal pesiar.</li><li>Patissier/Pastry Chef: Ahli kue dan roti.</li><li>Entrepreneur Kuliner: Membuka kafe, restoran, katering, atau bisnis makanan online.</li><li>Food Stylist/Consultant: Penata makanan atau konsultan bisnis kuliner.</li><li>Barista: Ahli peracik kopi.&nbsp;</li></ul><p><span style=\"font-size: 1rem;\">Jurusan ini sangat cocok bagi yang menyukai dunia kreativitas makanan, memiliki ketelitian, dan ingin berkarier langsung di industri makanan dan minuman (food and beverage industry</span></p>', NULL, 'aktif', '2026-03-29 07:31:00', '2026-03-29 07:31:00'),
(10, 'PROGLI TKRO', 'progli-tkro', '<p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Teknik Kendaraan Ringan Otomotif (TKRO) adalah jurusan SMK yang mempelajari perawatan, perbaikan, dan teknik mesin mobil (bensin/diesel) sesuai standar industri. Siswa dibekali keterampilan memperbaiki mesin, sistem pemindah tenaga, sasis, suspensi, dan kelistrikan kendaraan ringan untuk menjadi mekanik atau teknisi otomotif yang profesional.&nbsp;</p><p><span style=\"font-size: 1rem;\"><b>Detail Apa yang Dipelajari di Jurusan TKRO:</b></span></p><ul><li>Mesin Otomotif: Perawatan dan perbaikan mesin (overhaul) bensin maupun diesel.</li><li>Sistem Pemindah Tenaga (Drivetrain): Mempelajari transmisi manual/otomatis, kopling, dan gardan.</li><li>Sasis dan Suspensi: Perbaikan sistem kemudi, rem (termasuk ABS), roda, dan suspensi.</li><li>Kelistrikan Otomotif: Perbaikan sistem starter, pengisian, pengapian, lampu-lampu, dan komponen elektronik mobil.</li><li>Sistem Bahan Bakar: Servis sistem karburator hingga injeksi bahan bakar modern (EFI/EMS).</li><li>Penunjang: Gambar teknik, penggunaan alat ukur (jangka sorong, mikrometer), dan pengelasan.&nbsp;</li></ul><p><span style=\"font-size: 1rem;\"><b>Keahlian Khusus &amp; Peluang Kerja:</b></span></p><p>Lulusan dididik untuk mampu mendiagnosis kerusakan, melakukan tune-up, serta mengoperasikan scanner diagnosis komputerisasi pada mobil. Peluang kerja meliputi mekanik bengkel resmi/umum, service advisor, teknisi perakitan mobil, atau wirausaha bengkel mandiri.</p>', NULL, 'aktif', '2026-03-29 07:32:14', '2026-03-29 07:32:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `halaman_embed`
--

CREATE TABLE `halaman_embed` (
  `id` int(11) NOT NULL,
  `halaman_id` int(11) NOT NULL,
  `platform` varchar(30) NOT NULL,
  `embed_url` text NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `halaman_galeri`
--

CREATE TABLE `halaman_galeri` (
  `id` int(11) NOT NULL,
  `halaman_id` int(11) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `jurusan`
--

CREATE TABLE `jurusan` (
  `id` int(11) NOT NULL,
  `kode` varchar(10) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `icon` varchar(50) DEFAULT 'fas fa-graduation-cap',
  `warna` varchar(100) DEFAULT 'linear-gradient(135deg,#0ea5e9,#0369a1)',
  `warna_badge` varchar(50) DEFAULT '#e0f2fe',
  `warna_teks_badge` varchar(50) DEFAULT '#0369a1',
  `kepala_jurusan` varchar(100) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jurusan`
--

INSERT INTO `jurusan` (`id`, `kode`, `nama`, `deskripsi`, `icon`, `warna`, `warna_badge`, `warna_teks_badge`, `kepala_jurusan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'TKJ', 'Teknik Jaringan Komputer dan Telekomunikasi', 'Mempelajari perakitan komputer, instalasi sistem operasi, pembangunan jaringan komputer (LAN/WAN/MAN), management jaringan Mikrotik, Fiber Optik & Cisco', 'fas fa-network-wired', 'linear-gradient(135deg,#0ea5e9,#0369a1)', '#e0f2fe', '#0369a1', 'Tino Bambang Gunawan, S.Kom., M.Pd.', 'aktif', '2026-03-28 03:19:31', '2026-03-29 05:13:36'),
(2, 'TKRO', 'Teknik Kendaraan Ringan Otomotif', 'Mempelajari perawatan, perbaikan sistem mesin, kelistrikan, sasis, dan teknologi otomotif modern dan teknik kendaraan roda empat (mobil).', 'fas fa-car', 'linear-gradient(135deg,#ef4444,#dc2626)', '#fee2e2', '#dc2626', 'Hendrik Kurniawan, S.Pd.', 'aktif', '2026-03-28 03:22:11', '2026-03-29 05:42:45'),
(3, 'KULINER', 'Kuliner', 'Mempelajari seni mengolah makanan, teknik memasak, penyajian, nutrisi, keamanan pangan, dan kewirausahaan hingga manajemen bisnis F&B (Food & Beverage).', 'fas fa-utensils', 'linear-gradient(135deg,#10b981,#059669)', '#d1fae5', '#059669', 'Nia Sasi Hardiani, S.Pd.', 'aktif', '2026-03-28 03:23:17', '2026-03-29 05:42:24'),
(4, 'TPTUP', 'Teknik Pendingin, Tata Udara, dan Pemanasan', 'Mempelajari perancangan, instalasi, perawatan, dan perbaikan sistem pendingin (AC/kulkas) serta pemanas (water heater/heat pump)', 'fas fa-snowflake', 'linear-gradient(135deg,#8b5cf6,#7c3aed)', '#ede9fe', '#7c3aed', 'Drs. Haji Sigit Supranoto', 'aktif', '2026-03-28 03:24:46', '2026-03-29 05:42:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `kontak_masuk`
--

CREATE TABLE `kontak_masuk` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `subjek` varchar(200) DEFAULT NULL,
  `pesan` text NOT NULL,
  `status` enum('baru','dibaca','dibalas') DEFAULT 'baru',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `media_sosial`
--

CREATE TABLE `media_sosial` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `platform` enum('tiktok','youtube','instagram','facebook','twitter','threads') NOT NULL,
  `embed_url` text NOT NULL,
  `thumbnail` varchar(255) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `media_sosial`
--

INSERT INTO `media_sosial` (`id`, `judul`, `deskripsi`, `platform`, `embed_url`, `thumbnail`, `status`, `urutan`, `created_at`, `updated_at`) VALUES
(1, 'Hari Raya Idul Fitri 1447 H', 'Selamat Hari Raya Idul Fitri 1447 H.\r\nTaqabbalallahu minna wa minkum.\r\nMinal Aidin wal Faizin.', 'instagram', 'https://www.instagram.com/p/DWGneZ8E4TN/', NULL, 'aktif', 0, '2026-03-28 03:17:14', '2026-03-28 05:28:00'),
(2, 'Pentas Seni', 'Kegiatan ini merupakan rangkaian acara Dies Natalis SMKN 1 Kras', 'youtube', 'https://www.youtube.com/watch?v=23Kf5HqzIhc', NULL, 'aktif', 1, '2026-03-28 03:41:26', '2026-03-28 05:26:56');

-- --------------------------------------------------------

--
-- Struktur dari tabel `menu_navigasi`
--

CREATE TABLE `menu_navigasi` (
  `id` int(11) NOT NULL,
  `label` varchar(100) NOT NULL,
  `url` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `urutan` int(11) NOT NULL DEFAULT 0,
  `status` enum('aktif','nonaktif') NOT NULL DEFAULT 'aktif',
  `icon` varchar(100) DEFAULT NULL,
  `target` enum('_self','_blank') NOT NULL DEFAULT '_self',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `menu_navigasi`
--

INSERT INTO `menu_navigasi` (`id`, `label`, `url`, `parent_id`, `urutan`, `status`, `icon`, `target`, `created_at`) VALUES
(1, 'Beranda', '/', NULL, 1, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(2, 'Profil', '/profil', NULL, 2, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(3, 'Berita', '/berita', NULL, 3, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(4, 'Galeri', '/galeri', NULL, 6, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(5, 'Guru & Staf Karyawan', '/guru', 2, 4, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(6, 'Media Sosial', '/media-sosial', NULL, 7, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(7, 'Kontak', '/kontak', NULL, 8, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(12, 'Sambutan Kepala Sekolah', '/profil/sambutan', 2, 3, 'aktif', NULL, '_self', '2026-03-28 13:32:23'),
(13, 'Visi & Misi', '/profil/visi-misi', 2, 1, 'aktif', NULL, '_self', '2026-03-28 13:32:23'),
(14, 'Profil Sekolah', '/profil', 2, 0, 'aktif', NULL, '_self', '2026-03-28 14:49:44'),
(15, 'Sejarah Sekolah', '/profil/sejarah', 2, 2, 'aktif', NULL, '_self', '2026-03-28 14:51:24'),
(16, 'Informasi', '/', NULL, 5, 'aktif', NULL, '_self', '2026-03-28 14:54:39'),
(17, 'Pencak Silat', '/page/pencak-silat', 21, 0, 'aktif', NULL, '_self', '2026-03-28 14:58:29'),
(18, 'Pramuka', '/page/pramuka', 21, 1, 'aktif', NULL, '_self', '2026-03-29 05:29:13'),
(19, 'Badminton', '/page/badminton', 21, 2, 'aktif', NULL, '_self', '2026-03-29 05:29:36'),
(20, 'Program Keahlian', '/', NULL, 4, 'aktif', NULL, '_self', '2026-03-29 06:21:31'),
(21, 'Ekstrakurikuler', '/', 16, 0, 'aktif', NULL, '_self', '2026-03-29 06:26:40'),
(22, 'BKK', '/', 16, 1, 'aktif', NULL, '_self', '2026-03-29 06:41:01'),
(23, 'Progli TKJ', '/page/progli-tkj', 20, 0, 'aktif', NULL, '_self', '2026-03-29 07:27:09'),
(24, 'Progli Kuliner', '/page/progli-kuliner', 20, 1, 'aktif', NULL, '_self', '2026-03-29 07:32:46'),
(25, 'Progli TPTUP', '/page/progli-tptup', 20, 2, 'aktif', NULL, '_self', '2026-03-29 07:33:16'),
(26, 'Progli TKRO', '/page/progli-tkro', 20, 3, 'aktif', NULL, '_self', '2026-03-29 07:33:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `profil_konten`
--

CREATE TABLE `profil_konten` (
  `id` int(11) NOT NULL,
  `tipe` enum('visi_misi','sejarah','sambutan') NOT NULL,
  `judul` varchar(255) DEFAULT NULL,
  `konten` longtext DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `profil_konten`
--

INSERT INTO `profil_konten` (`id`, `tipe`, `judul`, `konten`, `foto`, `updated_at`) VALUES
(1, 'visi_misi', 'Visi & Misi', '<p></p><h3><b><span style=\"font-size: 16px;\">Vi</span><span style=\"font-size: 16px;\">﻿</span><span style=\"font-size: 16px;\">si</span></b></h3><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 16px; text-align: justify;\">Menjadi SMK unggul yang menghasilkan lulusan berkarakter, siap kerja, dan mampu bersaing di dunia industri, sering kali berbasis iman dan takwa (Imtak) serta ilmu pengetahuan dan teknologi (Iptek).</span><p></p><p><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 14px; text-align: justify;\"><br></span></p><hr><p></p><h2><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 16px; text-align: justify;\"><b>Misi</b></span></h2><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 16px; text-align: justify;\">Menyelenggarakan pendidikan kejuruan yang relevan dengan kebutuhan dunia usaha dan dunia industri (DUDI), meningkatkan kualitas SDM, serta memperkuat kerjasama dengan&nbsp;</span><em class=\"eujQNb\" data-processed=\"true\" style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 14px; text-align: justify;\"><span style=\"font-size: 16px;\">stakeholder</span></em><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 16px; text-align: justify;\">&nbsp;terkait.</span><p></p><p><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 14px; text-align: justify;\"><br></span></p><hr><p><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 14px; text-align: justify;\"><br></span><span style=\"color: rgb(54, 54, 54); font-family: Poppins, sans-serif; font-size: 14px; text-align: justify;\"></span></p>', NULL, '2026-03-28 14:41:04'),
(2, 'sejarah', 'Sejarah Sekolah', '<p style=\"text-align: justify; \"></p><p style=\"text-align: justify; \"><b>Sejarah SMK Negeri 1 Kras Kabupaten Kediri</b></p><hr><p style=\"text-align: justify; \"><b style=\"font-size: 1rem;\">SMK Negeri 1</b><span style=\"font-size: 1rem;\"> </span><b style=\"font-size: 1rem;\">Kras</b><span style=\"font-size: 1rem;\"> merupakan salah satu lembaga pendidikan menengah kejuruan yang berada di Kecamatan Kras, Kabupaten Kediri, Provinsi Jawa Timur. Keberadaan sekolah ini menjadi bagian penting dalam upaya peningkatan kualitas sumber daya manusia, khususnya dalam bidang kejuruan yang berorientasi pada dunia kerja dan industri.</span></p><p style=\"text-align: justify;\">Secara resmi, <b><a href=\"https://smkn1kras.sch.id\" target=\"_blank\">SMK Negeri 1 Kras</a></b> didirikan pada tanggal 16 Februari 2012 berdasarkan Surat Keputusan (SK) pendirian Nomor 188.45/106/418.32/2012. Pendirian sekolah ini dilatarbelakangi oleh kebutuhan masyarakat akan pendidikan kejuruan di wilayah Kecamatan Kras dan sekitarnya yang saat itu masih terbatas. Pemerintah daerah bersama dengan Dinas Pendidikan melihat potensi wilayah Kras yang berkembang dan membutuhkan tenaga kerja terampil di berbagai bidang.</p><p style=\"text-align: justify;\">Pada awal berdirinya, <a href=\"https://smkn1kras.sch.id\" target=\"_blank\"><b>SMK Negeri 1 Kras</b></a> hadir sebagai sekolah negeri baru yang berfokus pada pengembangan keterampilan siswa agar siap memasuki dunia kerja maupun melanjutkan pendidikan ke jenjang yang lebih tinggi. Dengan lokasi yang strategis di Dusun Demangan, Desa Setonorejo, sekolah ini diharapkan dapat menjangkau peserta didik dari berbagai desa di wilayah Kras dan sekitarnya.</p><p style=\"text-align: justify;\">Di masa awal operasional, SMK Negeri 1 Kras mulai dengan jumlah siswa, guru, serta fasilitas yang masih terbatas. Namun demikian, semangat untuk berkembang menjadi sekolah unggulan terus ditanamkan sejak awal. Pengembangan sarana dan prasarana dilakukan secara bertahap, mulai dari ruang kelas, laboratorium, hingga fasilitas pendukung pembelajaran lainnya. Seiring berjalannya waktu, jumlah siswa terus meningkat sebagai bukti kepercayaan masyarakat terhadap kualitas pendidikan di sekolah ini.</p><p style=\"text-align: justify;\">Dalam pengembangan akademik, SMK Negeri 1 Kras membuka beberapa program keahlian yang disesuaikan dengan kebutuhan dunia industri dan potensi daerah. Program keahlian yang berkembang antara lain Teknik Kendaraan Ringan (TKR), Teknik Komputer dan Jaringan (TKJ), Tata Boga/Kuliner, serta program keahlian lainnya yang relevan. Kurikulum yang diterapkan terus mengalami penyesuaian, mulai dari Kurikulum 2013 hingga saat ini menggunakan Kurikulum Merdeka, guna meningkatkan kompetensi siswa secara menyeluruh.</p><p style=\"text-align: justify;\">Seiring dengan perkembangan zaman, SMK Negeri 1 Kras juga mulai menerapkan pembelajaran berbasis proyek (Project Based Learning) yang berorientasi pada dunia kerja nyata. Hal ini bertujuan agar siswa tidak hanya memahami teori, tetapi juga memiliki keterampilan praktik yang sesuai dengan kebutuhan industri. Selain itu, sekolah juga menjalin kerja sama dengan berbagai pihak, termasuk dunia usaha dan dunia industri (DUDI), untuk menyelaraskan kurikulum dan meningkatkan kualitas lulusan.</p><p style=\"text-align: justify;\">Dalam perjalanan perkembangannya, <b><a href=\"https://smkn1kras.sch.id\" target=\"_blank\">SMK Negeri 1 Kras</a></b> juga mengalami peningkatan dalam hal sumber daya manusia. Guru-guru yang mengajar di sekolah ini merupakan tenaga pendidik yang profesional dan terus meningkatkan kompetensi melalui pelatihan serta sertifikasi. Beberapa guru bahkan terlibat dalam kegiatan tingkat nasional, seperti pembimbing lomba kompetensi siswa (LKS), yang menunjukkan kualitas tenaga pendidik yang dimiliki.</p><p style=\"text-align: justify;\">Dari sisi prestasi, siswa <b><a href=\"https://smkn1kras.sch.id\" target=\"_blank\">SMK Negeri 1 Kras</a></b> telah menunjukkan kemampuan di berbagai bidang, baik akademik maupun non-akademik. Keikutsertaan dalam berbagai lomba, seperti Lomba Kompetensi Siswa (LKS), menjadi salah satu indikator bahwa sekolah ini terus berkembang dan mampu bersaing di tingkat daerah maupun lebih luas.</p><p style=\"text-align: justify;\">Saat ini, SMK Negeri 1 Kras telah menjadi salah satu sekolah kejuruan yang cukup berkembang di Kabupaten Kediri. Dengan jumlah siswa yang terus bertambah dan tenaga pendidik yang semakin profesional, sekolah ini berkomitmen untuk mencetak lulusan yang kompeten, berkarakter, dan siap menghadapi tantangan dunia kerja.</p><p style=\"text-align: justify;\">Ke depan, SMK Negeri 1 Kras diharapkan terus berinovasi dalam bidang pendidikan, baik melalui pengembangan kurikulum, peningkatan fasilitas, maupun kerja sama dengan dunia industri. Dengan demikian, sekolah ini tidak hanya menjadi tempat belajar, tetapi juga menjadi pusat pengembangan keterampilan dan karakter generasi muda di Kabupaten Kediri.</p><p style=\"text-align: justify;\">Sebagai lembaga pendidikan yang relatif muda, SMK Negeri 1 Kras telah menunjukkan perkembangan yang signifikan dalam waktu yang cukup singkat. Hal ini menjadi bukti bahwa dengan manajemen yang baik, dukungan masyarakat, serta komitmen seluruh warga sekolah, sebuah institusi pendidikan mampu tumbuh dan memberikan kontribusi nyata bagi kemajuan pendidikan di daerah.</p><hr><p style=\"text-align: justify;\"><br></p>', NULL, '2026-03-29 05:38:20'),
(3, 'sambutan', 'Anik Safitri Budiyati, S.Kom.', '<div style=\"text-align: justify;\"></div><div style=\"text-align: justify;\"></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><b><br></b></span></div><hr><div style=\"text-align: justify;\"><b style=\"font-size: 1rem;\">Assalamu’alaikum Wr. Wb.</b></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><b><br></b></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><b>\r\n</b></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">&nbsp; &nbsp; &nbsp;Puji syukur kita panjatkan kehadirat Allah SWT, yang senantiasa memberikan rahmat dan hidayah-Nya kepada kita semua.&nbsp;</span><span style=\"font-size: 1rem;\">Shalawat serta salam semoga tetap tercurahkan kepada junjungan kita Nabi Muhammad SAW, keluarga, sahabat, dan seluruh umat Islam yang senantiasa mengikuti petunjuk-Nya.</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">&nbsp; &nbsp; &nbsp;Perkenankan saya, Anik Safitri Budiyati, S.Kom., untuk memberikan sepatah dua patah kata bagi seluruh civitas akademika SMKN 1 Kras pada kesempatan yang sangat istimewa ini. Sebagai Kepala Sekolah, saya merasa sangat bahagia dan bersyukur dapat bergabung dengan keluarga besar SMKN 1 Kras yang terhormat.&nbsp;</span><span style=\"font-size: 1rem;\">Terlebih dahulu, izinkan saya menyampaikan rasa hormat dan terima kasih yang setinggi-tingginya kepada Bapak/Ibu guru, karyawan, siswa, serta orang tua/wali siswa SMKN 1 Kras.</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">&nbsp; &nbsp; &nbsp;Keberhasilan dan prestasi yang telah diraih oleh sekolah ini tidak terlepas dari kerjasama dan dedikasi yang luar biasa dari seluruh elemen di dalamnya.\r\n\r\nSaya datang dengan tekad dan semangat baru untuk terus mengangkat martabat SMKN 1 Kras ke tingkat yang lebih baik. Bersama-sama, kita akan merancang dan melaksanakan program-program pendidikan yang inovatif, sehingga mampu mencetak lulusan yang berkualitas dan siap bersaing di era global.\r\n\r\nPrestasi yang sudah dicapai oleh SMKN 1 Kras menjadi landasan yang kuat, namun tentunya kita tidak akan berhenti di situ.&nbsp;</span><span style=\"font-size: 1rem;\">Melalui kerja keras, sinergi, dan komitmen kita bersama, kita akan terus berupaya menciptakan lingkungan belajar yang kondusif, memotivasi siswa untuk meraih prestasi, serta mendukung pengembangan potensi individu.\r\n\r\nPeran orang tua dan wali siswa sangat penting dalam mendukung proses pembelajaran.</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">&nbsp; &nbsp; &nbsp;Saya mengajak seluruh orang tua/wali siswa untuk terlibat aktif dalam kegiatan sekolah, menjalin komunikasi yang baik, dan bersinergi untuk menciptakan lingkungan pendidikan yang positif bagi anak-anak kita.\r\n\r\nAkhir kata, mari kita bersama-sama membangun masa depan yang cerah untuk SMKN 1 Kras. Saya yakin, dengan tekad dan kerjasama yang kuat, kita akan mampu mencapai prestasi yang lebih gemilang. Terima kasih atas perhatian dan kerjasama Bapak/Ibu sekalian.</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">\r\n</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><b>\r\nWassalamu’alaikum Wr. Wb.\r\n</b></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><hr><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><b>\r\nANIK SAFITRI BUDIYATI, S.Kom.\r\n</b></span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\">NIP. 19790828 200902 2 007</span></div><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div><hr><div style=\"text-align: justify;\"><span style=\"font-size: 1rem;\"><br></span></div>', 'profil-1774700168765.png', '2026-03-29 05:40:04');

-- --------------------------------------------------------

--
-- Struktur dari tabel `profil_sekolah`
--

CREATE TABLE `profil_sekolah` (
  `id` int(11) NOT NULL,
  `nama_sekolah` varchar(200) NOT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `whatsapp` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `visi` text DEFAULT NULL,
  `misi` text DEFAULT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `npsn` varchar(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL COMMENT 'Negeri/Swasta',
  `jenjang` varchar(20) DEFAULT NULL COMMENT 'SD/SMP/SMA/SMK',
  `akreditasi` varchar(10) DEFAULT NULL,
  `no_sk_akreditasi` varchar(100) DEFAULT NULL,
  `sk_pendirian` varchar(100) DEFAULT NULL,
  `tanggal_sk` date DEFAULT NULL,
  `sk_izin` varchar(100) DEFAULT NULL,
  `tanggal_sk_izin` date DEFAULT NULL,
  `maps` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `profil_sekolah`
--

INSERT INTO `profil_sekolah` (`id`, `nama_sekolah`, `alamat`, `telepon`, `whatsapp`, `email`, `visi`, `misi`, `logo`, `updated_at`, `npsn`, `status`, `jenjang`, `akreditasi`, `no_sk_akreditasi`, `sk_pendirian`, `tanggal_sk`, `sk_izin`, `tanggal_sk_izin`, `maps`, `website`) VALUES
(1, 'SMKN 1 KRAS', 'Dsn. Demangan, Desa Setonorejo, Kecamatan Kras, Kabupaten Kediri, Provinsi Jawa Timur, 64172. ', '', '-', 'smkn1kras@gmail.com', NULL, NULL, '1774666777516.png', '2026-03-29 04:49:48', '69775452', 'Negeri', 'SMK', 'A', '022/BAN-PDM/SK/2023', '188.45/106/418.32/2012', '2012-03-22', '188.45/106/418.32/2012', '2012-03-22', 'https://maps.app.goo.gl/WGHtLP6k46Nm2wL5A', 'https://smkn1kras.sch.id');

-- --------------------------------------------------------

--
-- Struktur dari tabel `siswa`
--

CREATE TABLE `siswa` (
  `id` int(11) NOT NULL,
  `nis` varchar(50) DEFAULT NULL,
  `nama` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `tanggal_lahir` date DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `kelas` varchar(20) DEFAULT NULL,
  `tahun_masuk` year(4) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `jurusan` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `slider`
--

CREATE TABLE `slider` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `subjudul` text DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) NOT NULL,
  `link_url` varchar(255) DEFAULT NULL,
  `link_text` varchar(100) DEFAULT NULL,
  `urutan` int(11) DEFAULT 0,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `slider`
--

INSERT INTO `slider` (`id`, `judul`, `subjudul`, `deskripsi`, `gambar`, `link_url`, `link_text`, `urutan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Selamat Datang', 'Website Resmi Sekolah', 'Menciptakan generasi cerdas dan berkarakter.', 'slider-1773118470443.webp', NULL, NULL, 1, 'aktif', '2026-03-28 02:42:22', '2026-03-28 02:49:25'),
(2, 'Membangun Masa Depan Melalui Pendidikan', 'Selamat Datang di Website Resmi Kami', 'Menciptakan generasi yang cerdas, berkarakter, dan siap menghadapi tantangan masa depan.', 'slider-1773118470443.webp', '/profil', 'Pelajari Lebih Lanjut', 1, 'aktif', '2026-03-28 02:46:29', '2026-03-28 02:49:25'),
(3, 'Fasilitas Modern untuk Pembelajaran Optimal', 'Teknologi Terdepan', 'Dilengkapi dengan laboratorium komputer dan fasilitas pembelajaran modern.', 'slider-1773120327737.png', '/galeri', 'Lihat Fasilitas', 2, 'aktif', '2026-03-28 02:46:29', '2026-03-28 02:49:25'),
(4, 'Prestasi Gemilang di Berbagai Bidang', 'Kebanggaan Sekolah', 'Meraih berbagai prestasi di tingkat regional dan nasional.', 'slider-1773120359737.png', '/berita', 'Lihat Prestasi', 3, 'aktif', '2026-03-28 02:46:29', '2026-03-28 02:49:25');

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama_lengkap` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `role` enum('admin','guru') DEFAULT 'guru',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama_lengkap`, `email`, `role`, `created_at`) VALUES
(1, 'admin', '$2a$10$qqyyMTiwrKRZ1wvVKkjc1.j3Ccm9WS8sZ4qlLmjL5.m5w9J1z16Di', 'Administrator', 'admin@sekolah.com', 'admin', '2026-03-28 02:42:22'),
(7, 'mazjou', '$2a$10$RlHAMSpbo6JF9wDA.5AhFuUFh5bY/ZlVDhfn8Hi2q3YBnpnENHBCu', 'Imam', 'imamjunaidiabror@gmail.com', 'admin', '2026-03-28 03:43:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `website_settings`
--

CREATE TABLE `website_settings` (
  `id` int(11) NOT NULL,
  `setting_key` varchar(50) NOT NULL,
  `setting_value` text NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `website_settings`
--

INSERT INTO `website_settings` (`id`, `setting_key`, `setting_value`, `updated_at`) VALUES
(1, 'theme_mode', 'light', '2026-03-29 05:58:12'),
(2, 'primary_color', '#0ea5e9', '2026-03-29 05:58:43'),
(3, 'secondary_color', '#0369a1', '2026-03-29 05:58:43'),
(4, 'navbar_bg', '#ffffff', '2026-03-29 05:50:21'),
(5, 'footer_bg', '#0f172a', '2026-03-29 05:50:21'),
(26, 'maintenance_mode', '0', '2026-03-29 06:13:26');

--
-- Indexes for dumped tables
--

--
-- Indeks untuk tabel `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `galeri`
--
ALTER TABLE `galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `halaman`
--
ALTER TABLE `halaman`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `halaman_embed`
--
ALTER TABLE `halaman_embed`
  ADD PRIMARY KEY (`id`),
  ADD KEY `halaman_id` (`halaman_id`);

--
-- Indeks untuk tabel `halaman_galeri`
--
ALTER TABLE `halaman_galeri`
  ADD PRIMARY KEY (`id`),
  ADD KEY `halaman_id` (`halaman_id`);

--
-- Indeks untuk tabel `jurusan`
--
ALTER TABLE `jurusan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode` (`kode`);

--
-- Indeks untuk tabel `kontak_masuk`
--
ALTER TABLE `kontak_masuk`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `media_sosial`
--
ALTER TABLE `media_sosial`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `menu_navigasi`
--
ALTER TABLE `menu_navigasi`
  ADD PRIMARY KEY (`id`),
  ADD KEY `parent_id` (`parent_id`);

--
-- Indeks untuk tabel `profil_konten`
--
ALTER TABLE `profil_konten`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `profil_sekolah`
--
ALTER TABLE `profil_sekolah`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `siswa`
--
ALTER TABLE `siswa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nis` (`nis`);

--
-- Indeks untuk tabel `slider`
--
ALTER TABLE `slider`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `website_settings`
--
ALTER TABLE `website_settings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `setting_key` (`setting_key`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `guru`
--
ALTER TABLE `guru`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=163;

--
-- AUTO_INCREMENT untuk tabel `halaman`
--
ALTER TABLE `halaman`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `halaman_embed`
--
ALTER TABLE `halaman_embed`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `halaman_galeri`
--
ALTER TABLE `halaman_galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `jurusan`
--
ALTER TABLE `jurusan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `kontak_masuk`
--
ALTER TABLE `kontak_masuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `media_sosial`
--
ALTER TABLE `media_sosial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `menu_navigasi`
--
ALTER TABLE `menu_navigasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT untuk tabel `profil_konten`
--
ALTER TABLE `profil_konten`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `profil_sekolah`
--
ALTER TABLE `profil_sekolah`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `siswa`
--
ALTER TABLE `siswa`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `slider`
--
ALTER TABLE `slider`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT untuk tabel `website_settings`
--
ALTER TABLE `website_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `halaman_embed`
--
ALTER TABLE `halaman_embed`
  ADD CONSTRAINT `halaman_embed_ibfk_1` FOREIGN KEY (`halaman_id`) REFERENCES `halaman` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `halaman_galeri`
--
ALTER TABLE `halaman_galeri`
  ADD CONSTRAINT `halaman_galeri_ibfk_1` FOREIGN KEY (`halaman_id`) REFERENCES `halaman` (`id`) ON DELETE CASCADE;

--
-- Ketidakleluasaan untuk tabel `menu_navigasi`
--
ALTER TABLE `menu_navigasi`
  ADD CONSTRAINT `menu_navigasi_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `menu_navigasi` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
