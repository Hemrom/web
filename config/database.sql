-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Waktu pembuatan: 02 Apr 2026 pada 09.07
-- Versi server: 10.4.32-MariaDB
-- Versi PHP: 8.2.12

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
-- Struktur dari tabel `alumni`
--

CREATE TABLE `alumni` (
  `id` int(11) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `nis` varchar(50) DEFAULT NULL,
  `tahun_lulus` year(4) DEFAULT NULL,
  `jurusan` varchar(100) DEFAULT NULL,
  `pekerjaan` varchar(150) DEFAULT NULL,
  `perusahaan` varchar(150) DEFAULT NULL,
  `kota` varchar(100) DEFAULT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `instagram` varchar(100) DEFAULT NULL,
  `linkedin` varchar(200) DEFAULT NULL,
  `cerita` text DEFAULT NULL,
  `token` varchar(64) DEFAULT NULL,
  `status` enum('pending','disetujui','ditolak') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `artikel`
--

CREATE TABLE `artikel` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `konten` longtext DEFAULT NULL,
  `ringkasan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT 'Umum',
  `penulis_id` int(11) DEFAULT NULL,
  `penulis_nama` varchar(150) DEFAULT NULL,
  `penulis_tipe` enum('admin','guru') DEFAULT 'admin',
  `status` enum('draft','published') DEFAULT 'draft',
  `tampil_home` tinyint(1) DEFAULT 0,
  `views` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `artikel`
--

INSERT INTO `artikel` (`id`, `judul`, `slug`, `konten`, `ringkasan`, `gambar`, `kategori`, `penulis_id`, `penulis_nama`, `penulis_tipe`, `status`, `tampil_home`, `views`, `created_at`, `updated_at`) VALUES
(1, 'Jaringan Internet dan Peranannya dalam Kehidupan Modern', 'jaringan-internet-dan-peranannya-dalam-kehidupan-modern', '<p style=\"text-align: justify; \"><br></p><p style=\"text-align: justify;\">Jaringan internet telah menjadi bagian yang tidak terpisahkan dari kehidupan manusia modern. Hampir semua aktivitas, mulai dari komunikasi, pendidikan, bisnis, hingga hiburan, kini bergantung pada koneksi internet. Secara sederhana, jaringan internet adalah kumpulan perangkat yang saling terhubung untuk berbagi data dan informasi melalui protokol komunikasi tertentu. Dengan perkembangan teknologi yang pesat, internet telah berevolusi dari sekadar alat pertukaran data menjadi infrastruktur utama dalam transformasi digital global.</p><p style=\"text-align: justify;\">Pada dasarnya, jaringan internet terdiri dari berbagai komponen penting, seperti perangkat keras (hardware) dan perangkat lunak (software). Perangkat keras meliputi router, switch, server, dan kabel jaringan, sedangkan perangkat lunak mencakup sistem operasi jaringan serta protokol komunikasi seperti TCP/IP. Router berfungsi mengarahkan lalu lintas data antar jaringan, sementara switch menghubungkan perangkat dalam satu jaringan lokal. Server berperan sebagai pusat penyimpanan dan penyedia layanan data yang dapat diakses oleh pengguna.</p><p style=\"text-align: justify;\">Jenis jaringan internet dapat dibedakan berdasarkan cakupan wilayahnya. Local Area Network (LAN) adalah jaringan dengan cakupan kecil, seperti di rumah, sekolah, atau kantor. Metropolitan Area Network (MAN) mencakup wilayah yang lebih luas, seperti satu kota. Sedangkan Wide Area Network (WAN) merupakan jaringan dengan cakupan sangat luas yang dapat menghubungkan berbagai negara, bahkan seluruh dunia, seperti internet itu sendiri. Selain itu, terdapat juga jaringan nirkabel (wireless) seperti Wi-Fi yang memungkinkan pengguna terhubung tanpa menggunakan kabel.</p><p style=\"text-align: justify; \">Perkembangan jaringan internet juga sangat dipengaruhi oleh teknologi transmisi data. Dahulu, koneksi internet menggunakan dial-up yang lambat dan terbatas. Kini, teknologi seperti fiber optic, 4G, dan bahkan 5G telah memungkinkan kecepatan internet yang jauh lebih tinggi dan stabil. Fiber optic, misalnya, menggunakan cahaya untuk mentransmisikan data sehingga memiliki kecepatan yang sangat tinggi dan latensi rendah. Hal ini sangat mendukung kebutuhan masyarakat akan akses informasi yang cepat dan real-time.</p><p style=\"text-align: justify;\">Dalam dunia pendidikan, jaringan internet memberikan dampak yang sangat signifikan. Guru dan siswa dapat mengakses berbagai sumber belajar secara online, mengikuti kelas virtual, serta berkolaborasi tanpa batas ruang dan waktu. Platform pembelajaran digital dan Learning Management System (LMS) semakin banyak digunakan untuk meningkatkan efektivitas proses belajar mengajar. Hal ini sangat relevan terutama dalam era pembelajaran berbasis teknologi seperti saat ini.</p><p style=\"text-align: justify;\">Di bidang bisnis, internet membuka peluang besar bagi pelaku usaha untuk memperluas pasar. E-commerce, digital marketing, dan layanan berbasis cloud menjadi tulang punggung dalam operasional bisnis modern. Dengan adanya internet, transaksi dapat dilakukan secara cepat dan efisien tanpa harus bertatap muka secara langsung. Selain itu, komunikasi internal perusahaan juga menjadi lebih mudah melalui email, video conference, dan aplikasi kolaborasi.</p><p style=\"text-align: justify;\">Namun, di balik berbagai manfaatnya, jaringan internet juga memiliki tantangan dan risiko. Keamanan jaringan menjadi salah satu isu utama yang harus diperhatikan. Ancaman seperti hacking, malware, phishing, dan pencurian data dapat merugikan individu maupun organisasi. Oleh karena itu, diperlukan sistem keamanan yang baik, seperti penggunaan firewall, enkripsi data, serta edukasi kepada pengguna tentang pentingnya keamanan digital.</p><p style=\"text-align: justify;\">Selain itu, kesenjangan akses internet juga masih menjadi masalah di beberapa daerah, terutama di wilayah terpencil. Tidak semua masyarakat memiliki akses internet yang memadai, baik dari segi infrastruktur maupun biaya. Hal ini dapat menghambat pemerataan informasi dan perkembangan teknologi. Oleh karena itu, diperlukan peran pemerintah dan pihak terkait untuk memperluas akses jaringan internet secara merata.</p><p style=\"text-align: justify;\">Di masa depan, jaringan internet diprediksi akan terus berkembang dengan hadirnya teknologi seperti Internet of Things (IoT), Artificial Intelligence (AI), dan jaringan 6G. IoT memungkinkan berbagai perangkat terhubung dan saling berkomunikasi secara otomatis, seperti smart home dan smart city. Sementara itu, AI dapat meningkatkan efisiensi dan kecerdasan dalam pengelolaan jaringan.</p><p style=\"text-align: justify; \">Sebagai kesimpulan, jaringan internet memiliki peran yang sangat penting dalam kehidupan modern. Dengan memahami konsep, manfaat, serta tantangannya, kita dapat memanfaatkan internet secara optimal dan bijak. Perkembangan teknologi jaringan yang terus maju diharapkan dapat memberikan dampak positif bagi seluruh lapisan masyarakat dan mendukung kemajuan di berbagai bidang.</p>', 'Kecepatan teknologi jaringan', 'artikel-1775103126758-4498355963a914e5e4398a938f88921e.jpg', 'Umum', 7, 'Admin', 'admin', 'published', 1, 5, '2026-04-02 04:12:06', '2026-04-02 04:28:45');

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
-- Struktur dari tabel `bkk_lowongan`
--

CREATE TABLE `bkk_lowongan` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `perusahaan` varchar(150) NOT NULL,
  `lokasi` varchar(150) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `persyaratan` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('magang','kerja','beasiswa','lainnya') DEFAULT 'kerja',
  `deadline` date DEFAULT NULL,
  `kontak` varchar(255) DEFAULT NULL,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `bkk_lowongan`
--

INSERT INTO `bkk_lowongan` (`id`, `judul`, `slug`, `perusahaan`, `lokasi`, `deskripsi`, `persyaratan`, `gambar`, `kategori`, `deadline`, `kontak`, `status`, `created_at`) VALUES
(2, 'Magang Jepang', 'magang-jepang-mng2bh50', 'OKINAWA', 'Kediri', 'Segara melamar', '- Laki-laki\r\n- Siap Biaya dan Raga', 'portal-1775048957306-7228ba2a19fafdf3251eb62101b57a40.jpeg', 'magang', '2026-04-16', '08566343242132', 'aktif', '2026-04-01 13:09:17');

-- --------------------------------------------------------

--
-- Struktur dari tabel `fasilitas`
--

CREATE TABLE `fasilitas` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('ruang-kelas','laboratorium','perpustakaan','olahraga','kantin','kesehatan','ibadah','lainnya') DEFAULT 'lainnya',
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `fasilitas`
--

INSERT INTO `fasilitas` (`id`, `nama`, `slug`, `deskripsi`, `gambar`, `kategori`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Masjid', 'masjid-mngjwsqp', 'Masjid almuttaqin SMKN 1 Kras', 'portal-1775078505580-506741ecf59728836e9ad7175d9dc1ff.jpg', 'ibadah', 'published', '2026-04-01 21:21:45', '2026-04-01 21:21:45'),
(2, 'Lab TKJ', 'lab-tkj-mngjxh4r', 'Lab Mikrotik TKJ', 'portal-1775078537204-c7c33175078c60ce3eb515e599239149.jpg', 'lainnya', 'published', '2026-04-01 21:22:17', '2026-04-01 21:22:17'),
(3, 'Perpustakaan', 'perpustakaan-mngjxwk5', 'Perpus', 'portal-1775078557202-c9be254a098d3558dce2cc4548b2d671.jpg', 'perpustakaan', 'published', '2026-04-01 21:22:37', '2026-04-01 21:22:37');

-- --------------------------------------------------------

--
-- Struktur dari tabel `fasilitas_foto`
--

CREATE TABLE `fasilitas_foto` (
  `id` int(11) NOT NULL,
  `fasilitas_id` int(11) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `fasilitas_foto`
--

INSERT INTO `fasilitas_foto` (`id`, `fasilitas_id`, `gambar`, `urutan`, `created_at`) VALUES
(1, 1, 'portal-1775078505580-506741ecf59728836e9ad7175d9dc1ff.jpg', 0, '2026-04-01 21:39:01'),
(2, 2, 'portal-1775078537204-c7c33175078c60ce3eb515e599239149.jpg', 0, '2026-04-01 21:39:01'),
(3, 3, 'portal-1775078557202-c9be254a098d3558dce2cc4548b2d671.jpg', 0, '2026-04-01 21:39:01'),
(4, 2, 'fasilitas-1775079688686-afad3e1efe9a6b05dc3305e98d1583e1.jpg', 1, '2026-04-01 21:41:28'),
(5, 2, 'fasilitas-1775079688691-1fdba26380f554570a45d6e5086d200a.jpg', 2, '2026-04-01 21:41:28'),
(6, 1, 'fasilitas-1775079699944-fdb6c5006fa8e5d98793c59a7ffe7c7d.jpg', 1, '2026-04-01 21:41:39'),
(7, 1, 'fasilitas-1775079699945-734f37f39281544d40713ef396dc326b.jpg', 2, '2026-04-01 21:41:39'),
(8, 3, 'fasilitas-1775079710549-c44f2914d96bd36b466e068ac90fea6b.jpg', 1, '2026-04-01 21:41:50'),
(9, 3, 'fasilitas-1775079710558-83ad77f4133cca0162fa01dc7c47fe87.webp', 2, '2026-04-01 21:41:50');

-- --------------------------------------------------------

--
-- Struktur dari tabel `file_download`
--

CREATE TABLE `file_download` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `nama_file` varchar(255) NOT NULL,
  `ukuran_file` varchar(50) DEFAULT NULL,
  `tipe_file` varchar(50) DEFAULT NULL,
  `kategori` varchar(100) DEFAULT 'Umum',
  `penulis_id` int(11) DEFAULT NULL,
  `penulis_nama` varchar(150) DEFAULT NULL,
  `penulis_tipe` enum('admin','guru') DEFAULT 'admin',
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `tampil_home` tinyint(1) DEFAULT 0,
  `jumlah_download` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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
(2, 'Kegiatan Halal Bi Halal', 'Halal Bi Halal', 'galeri-1774677492695.jpeg', 'Kegiatan', '2026-03-28 05:58:12'),
(31, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542268-bff6fa580d90f505215b66cb5fed56fe.jpg', 'Kegiatan', '2026-03-31 23:59:03'),
(32, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542290-79e1d815ea17983e7f364b45d63c7551.jpg', 'Kegiatan', '2026-03-31 23:59:03'),
(33, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542312-69401bcc2f0ea88f9c6e6fc2686dc2a4.jpg', 'Kegiatan', '2026-03-31 23:59:03'),
(34, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542329-6d4ba8ea702954867ac2955bbf4d6c97.jpg', 'Kegiatan', '2026-03-31 23:59:03'),
(35, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542345-bb7dcb048574087da0876bdf9b8852d8.jpg', 'Kegiatan', '2026-03-31 23:59:03'),
(36, 'Pondok Ramadhan', '<p>Ponrom</p>', 'galeri-1775001542361-ba0babcc5b43c3e4cd8138b83c62f6ff.jpg', 'Kegiatan', '2026-03-31 23:59:03');

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
  `jabatan` varchar(100) DEFAULT NULL,
  `guru_username` varchar(50) DEFAULT NULL,
  `guru_password` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `guru`
--

INSERT INTO `guru` (`id`, `nip`, `nama`, `jenis_kelamin`, `tempat_lahir`, `tanggal_lahir`, `alamat`, `telepon`, `email`, `mata_pelajaran`, `foto`, `created_at`, `jabatan`, `guru_username`, `guru_password`) VALUES
(77, '', 'ANIK SAFITRI BUDIYATI, S.Kom.', 'L', NULL, NULL, NULL, '', '', '', 'guru-1774750265698.png', '2026-03-29 01:45:21', 'KEPALA SEKOLAH', 'guru77', '$2a$10$pBE7SS.mlzvanq/VX8XZUelIWnqaChbUkusMOfBz0uItzf0596ExC'),
(78, NULL, 'Drs. ANDIKA BAYU SAPUTRO', 'L', NULL, NULL, NULL, '', '', 'Produktif TKRO', NULL, '2026-03-29 01:45:21', 'WAKA SARPRAS', 'guru78', '$2a$10$K1hHAG6cJXrOnCDLwsZaweoPYbbd/ualm3DskezI/h8L7cdTsAZRi'),
(79, NULL, 'Drs. HAJI SIGIT SUPRANOTO', 'L', NULL, NULL, NULL, '', '', 'Produktif TPTUP', NULL, '2026-03-29 01:45:21', 'KAPROGLI TPTUP', 'guru79', '$2a$10$A8Hn2UBkeEWahc6WWZKQzuqqhxuvQ/VEW3VBxuc0ZEA/R.VUqIrAu'),
(80, NULL, 'AYU DINI ARDIANTI,S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:21', 'WAKA KURIKULUM', 'guru80', '$2a$10$Ll5/8Hjw3xrnOL7USYBiWeKVJBDcuftX13445Wx6x64Sl6M35FJPe'),
(81, NULL, 'KUSMAN RAHMANU ADI,S.T', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:21', 'GURU', 'guru81', '$2a$10$9mWOWcCnQ0vTGs7T9md3G.jHNC3k6/LKS6k3Osx2dw9AN2lFZagRO'),
(82, NULL, 'ACHMAD AMIN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:21', 'GURU', 'guru82', '$2a$10$H1FkcPvG6BhWIfbo4hFtMugefwV2SsSoQE1/dZbvfWHHPgRymdCK6'),
(83, NULL, 'ALI ZURO, SPd.', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:21', 'GURU', 'guru83', '$2a$10$Ng/jVkCH8gkKXfgrx3TCNeDnF4rUL.hCgeq.oJtC14shadiYI40f6'),
(84, NULL, 'RENI YULIASIH,S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'BENDAHARA', 'guru84', '$2a$10$f7ckeNC01wtLjx.UKzeV.O3pAHoAB/XdvfPcE9NA8a2JEvAhd0qUO'),
(85, NULL, 'PENI SULISTYOWATI, S.Pd.I', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU', 'guru85', '$2a$10$BHaJ1b1yRDU17C1ef7VVo.xlYTuY4miBLQ4o76WSta.l1gaeReeAO'),
(86, NULL, 'INDRAGUS SHOLEHHUDIN, M.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'PJOK', NULL, '2026-03-29 01:45:22', 'GURU', 'guru86', '$2a$10$pLVdVUkG5FwB7qhth4cvq.JqNGwSP4EbRb4HFxKYOpMe/F48AMBli'),
(87, NULL, 'SUHARDHINI SETYANINGSIH,S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru87', '$2a$10$oZvpQNHW/tF6AYtt0EDjf.CO6uDyLtmI17TBmzT0Dia.XeClVEwcW'),
(88, NULL, 'WINDI YUNITA, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Sejarah Indonesia', NULL, '2026-03-29 01:45:22', 'GURU', 'guru88', '$2a$10$aWLnrY8lBsSpC0JoC1Rd7.jI3ZSnyQ2IpXZD72SCB116gB8ZGYMOa'),
(89, NULL, 'RIZKY LIA ANGGRAENY, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU', 'guru89', '$2a$10$5e3SpFv98faRo/otwUj.wueGDEiUw97q1qUyRHEiDIOvkvOkgXrrW'),
(90, NULL, 'EKO DODY PRASETYO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU', 'guru90', '$2a$10$utUn6H/N3h2CCNh3Pa6HWOZ1fcKtrBLAvE0hnZqKW.wiCEsPy3Yiy'),
(91, NULL, 'SRI PURWANTI M, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:22', 'GURU', 'guru91', '$2a$10$uRE6k0.FglGORigzl7yzW.0cCIx6S3GMXVVXQJrOwBr0S9HUnPj5W'),
(92, NULL, 'DIANA CATUR  K.S, S.Kom', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU', 'guru92', '$2a$10$cd9yS5TMKgwJPse9apDZy.6zvNS6eFHcdHKIl37oXflPloc398I1i'),
(93, NULL, 'SOJU PURWANTO, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU', 'guru93', '$2a$10$.77bsVAUjInsFbbQePm2IuM1shBXeq64qdQT8YsPU8ODKy6MGI7w6'),
(94, NULL, 'ANGGA WARDHANA, S.Kom.', 'L', NULL, NULL, NULL, NULL, NULL, 'Informatika', NULL, '2026-03-29 01:45:22', 'WAKA HUMAS', 'guru94', '$2a$10$kj.T9DE73L6VmtcMn5DSNOvadPRXCuejjOg5ytyqP34z9rYlgnofW'),
(95, NULL, 'ATIK NURUL AINI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU', 'guru95', '$2a$10$kvlbP0AQZ7YmltL./tHDrOlQccgGQBActXAFvhnzHF2KkZyR9dRgi'),
(96, NULL, 'AHMAD BAGUS DWI S, S.S', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'WAKA KESISWAAN', 'guru96', '$2a$10$YoIlqAzpkvXmQJO15qaxmuAPw8IKfag.5WI6wbknIBoqLafDgD4Ea'),
(97, NULL, 'AFIF RAHMAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru97', '$2a$10$VN0jI1b32nJ5aFdtYl/EBusYN7nbiBTqOevDmGs7.rmUwp1NHvP3e'),
(98, NULL, 'BASRONI , S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU', 'guru98', '$2a$10$m0IJVp8flUc4j7ibDURPUOE1vjLVJNBIMQUkIhfb6sUcXm0lTcHb2'),
(99, NULL, 'YANUAR DWIANTA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU', 'guru99', '$2a$10$LCLvCChg/jdl6w2VvZip.ez8cHjWTEBovaeLCuz7PFJiemm8fucxi'),
(100, NULL, 'M. ANDIK ROHMATULLOH, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU', 'guru100', '$2a$10$PrFHdhO5gbEpOzAz0zJGTuNTXxYbIQ6Y7YXoCdOZmVFVWYefq635i'),
(101, NULL, 'LU\'LUATUL MABRUROH,S.Ag,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU', 'guru101', '$2a$10$q2aMLBVfAbDncofWkIJjkO8Z/0bZw1WVxH7ZhJbfNd4sVX1F4s2F.'),
(102, NULL, 'IKE CINTIA DEWI, S.Pd, Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU', 'guru102', '$2a$10$Y1rhUcjym9gWPVzrftFBh.8sMt3LCvRgveljB5vXfi2oqcDFWXgLC'),
(103, NULL, 'ADHIEN WAHYU F.M. S.Pd.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU', 'guru103', '$2a$10$BJs/BGpxjZYKFlKXHCgkv.SCoYDrWuPR8TUB8Nto0XWq9yBDn0Kbm'),
(104, NULL, 'BOBY SUTANTO, S.Kom', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU', 'guru104', '$2a$10$0MIS1UQmcnE0fU1Oy2.hceUsGImLwOzJKKJyAUjebNZcxrmNmbgKK'),
(105, NULL, 'TINO BAMBANG GUNAWAN, S.Kom., Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'KAPROGLI TKJ', 'guru105', '$2a$10$.GU8cqrDK7ukcrhU2LEIWeJI3cEmWK.tJ6Wb9LBmfdsBxfdSh0SlC'),
(106, NULL, 'NANDA DHARA AYU P. M, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru106', '$2a$10$p1BmthLSJUSjqUvUFox09Oe5JIhjs7rpZIqHYm8DoADhCAuTwEcga'),
(107, NULL, 'BAGUS SETIAWAN, S.Pd, Kons.', 'L', NULL, NULL, NULL, NULL, NULL, 'BK', NULL, '2026-03-29 01:45:22', 'GURU', 'guru107', '$2a$10$kbe8LaDpFyAyKawUDY4owOui4tjjp.RHFFZmmE8O0n.0puO7B2pJG'),
(108, NULL, 'ULFIAN ASIFA AMINULLOH, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU', 'guru108', '$2a$10$LRNGkX8VKY/lApFI/58lbeTFTpD4bGbk1iAMnh56jX14zDYLwIVW6'),
(109, NULL, 'NIA SASI HARDIANI, M.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'KAPROGLI KULINER', 'guru109', '$2a$10$Zp0S3rflMo8Azpnoa0/e.OMB5k.FMxQUDWCDP07JoD8WxPPSpURu2'),
(110, NULL, 'RISKA HANDAYANI, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jawa', NULL, '2026-03-29 01:45:22', 'GURU', 'guru110', '$2a$10$LLi/35A.ntR4twj2OZhwb.XYdrvCS.rYWKVZM1Qf02V6grUp2aTHS'),
(111, NULL, 'BINTI MUSAFAAH,S.Pd,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU', 'guru111', '$2a$10$grEw/J50sbVuaDoecQD6penMJUmr6r0J9Sdr0/3C0KFThwKX2pPai'),
(112, NULL, 'Dra. ENI RELAWATI.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jepang', NULL, '2026-03-29 01:45:22', 'GURU', 'guru112', '$2a$10$xJgMfAJc6YD9Nheik18mc.L64tgoNM40/xljttBvEmUXL7tBCFuJ6'),
(113, NULL, 'AGUS NAWATRI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU', 'guru113', '$2a$10$IDAlpiDQROHzQO075Iv/Ze6szPqHZbs8pg87reKsWEU0jHFbWX172'),
(114, NULL, 'BEKTI WIDHIANTO, S.Kom.,Gr.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU', 'guru114', '$2a$10$I7q.K9QFC/L3Wn00iO9Wq.ta3VJHCxNqApvcrC2gyjo.ss.l6qQ4y'),
(115, NULL, 'SULISTIYO ANIS, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru115', '$2a$10$HKF27hC9Kap1o6LkRcyZWuAyW2aB8VE4ZTt.XBrx2BMjMZCtZRNvW'),
(116, NULL, 'M. HATTA UBAID, S.T.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'GURU', 'guru116', '$2a$10$DSK10OOCQn2Wi1oniL9PLulhy.pfwK6SDxI.eweT8DNPAI2.86df2'),
(117, '', 'IMAM JUNAIDI ABROR, S.Kom.', 'L', NULL, NULL, NULL, '', '', 'Produktif TKJ', 'guru-1774755530289.png', '2026-03-29 01:45:22', 'GURU', 'guru117', '$2a$10$YBSiCnb8gGGK0EEI3k1s5eENojKhsbMlyhlFIJuje3akvRAqaVMVm'),
(118, NULL, 'DONI ARDIANTO,S.KOM.,Gr.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKJ', NULL, '2026-03-29 01:45:22', 'GURU', 'guru118', '$2a$10$SKbeR24Cknd5yEdVbYsveehfOT2pNIEkhE4EjXh7aBdjgVjKnIX.K'),
(119, NULL, 'BIMA BUDI PRAKOSA, S.Pd.,Gr', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru119', '$2a$10$41xNLTGIyo2kCPDrInoIIusgNL26k4B8XXwsA9RFKPloBvB.zzr1e'),
(120, NULL, 'DEVY RARA GUVITHA, S.Pd.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru120', '$2a$10$4bgKLC.SIFd8OzqPhpiG8uE5VvYjV8oiWG3n/8LgmSleBll.Cmwru'),
(121, NULL, 'ABIDATUL ROKHIMAH, S.Pd.I', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU', 'guru121', '$2a$10$El7As5W7nGFxZt.DeLjJROblBT5RWh.gUaHFokXVSh/SG1LHJemdi'),
(122, NULL, 'RR. YUNITA SAMAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU', 'guru122', '$2a$10$ZcQCFk18WteSLpSmApop.OvGakcgaGHlx978DzIEycxbMYYPvJ3lS'),
(123, NULL, 'NASIKIN, S.E', 'L', NULL, NULL, NULL, NULL, NULL, 'Kewirausahaan', NULL, '2026-03-29 01:45:22', 'GURU', 'guru123', '$2a$10$s6AVYMdfBiqPm0guTmpP1eSX4ue8/rivzWPu2g2LTF.eGImVAO87S'),
(124, NULL, 'KURNIA SILVI MUSTIKA SARI, SPd', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU', 'guru124', '$2a$10$wRSlarKSyph0zuvgJMqsCeDSvYd.gWpAymUKI99UWR/UKOOafI2mS'),
(125, NULL, 'ANANG KURNIAWAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU', 'guru125', '$2a$10$OHjub6jj.fboTbK8egHgUuBEgCEr5iQZ1l3w2LTCCjl.hjsEvYH3O'),
(126, NULL, 'WIWIK KAMDIATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU', 'guru126', '$2a$10$QqaX2c8RAmsYO9tB.GF00egQxtVtMfJDGky/l16fl8M49WmMt8SfO'),
(127, NULL, 'SETYAWATI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Matematika', NULL, '2026-03-29 01:45:22', 'GURU', 'guru127', '$2a$10$jKKGg/hvYZ/9./xcdvYF3ObDe1ypjhkAmksJh4iVjLcjQJj0hURgm'),
(128, NULL, 'DIEBA NABILLA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif Kuliner', NULL, '2026-03-29 01:45:22', 'GURU', 'guru128', '$2a$10$l69Sd8nkzusZB54gEscsseNpbj8goYpcorBlTCw9NbaaXn4.a7ET6'),
(129, NULL, 'ANGGRAINI WULANSARI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Inggris', NULL, '2026-03-29 01:45:22', 'GURU', 'guru129', '$2a$10$7bomu1WDVCE2h5rrRpmrGOM0pmrVxIWL3yBBTUILPXW83NexaXHZi'),
(130, NULL, 'SITI KOMARIRIATUZ ZAHROK, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU', 'guru130', '$2a$10$j2Aoi7TpJVVWp4SwTH2eaORPb/2Jmk6PYXL2H9.eWmFGMv3HRZpxS'),
(131, NULL, 'CANDRA DWI NURUDIANTO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Indonesia', NULL, '2026-03-29 01:45:22', 'GURU', 'guru131', '$2a$10$dYrOl53iXU8u1EKJkmiJjufDGdKRgiZ/iTd1xQkpCLo66pKdt9eKm'),
(132, NULL, 'EKO SANTOSO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU', 'guru132', '$2a$10$buLMLnn4Os/liG2RLfJOBOOTuSNL1ut1xZ/ppVOcJNXQsqNkiscSe'),
(133, NULL, 'HENDRIK KURNIAWAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 01:45:22', 'KAPROGLI TKRO', 'guru133', '$2a$10$QdjFTIuyzT5YlRQwnmPam.qLfGKHJiY3Jq0XFbBW5CBbU9.zJtbXq'),
(134, NULL, 'DEVI AYU LIA FITRIA, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Seni Budaya', NULL, '2026-03-29 01:45:22', 'GURU', 'guru134', '$2a$10$baxc2qWiRBOaALfX48L2cu/kWpjrVVsT83trVL8xOiowqHVj/H1ry'),
(135, NULL, 'SITI NURUL FAUZIYAH, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'IPAS', NULL, '2026-03-29 01:45:22', 'GURU', 'guru135', '$2a$10$h9C5lRmCO5jChAK/VJm88OCOyY1fP6DIeDHk/O2YGWp6qXVtcGF3m'),
(136, NULL, 'SANDY RIAWAN, M.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PPKN', NULL, '2026-03-29 01:45:22', 'GURU', 'guru136', '$2a$10$jwFv91DpWtlbU/w1mtsIVO4rjsYUoXTJCdf6usPaWAxUJOHoZOcX.'),
(137, NULL, 'ADI PRAWIRO, S.T.', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 01:45:22', 'GURU', 'guru137', '$2a$10$62yBSYS8dTNRRxYsf4H2l.tMvWg/jLtZJHSZJYm9E3SKsmtYbSGNS'),
(138, NULL, 'FAIZ SYAIKHONI AZIZ, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 01:45:22', 'GURU', 'guru138', '$2a$10$fY5TJqmvY4qM4xsXqM2kGebFIuxf7pbOEyDTbuW2jEFDrGnVoJJDW'),
(139, NULL, 'MOHAMAD KUSMAN NADI, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'PAI', NULL, '2026-03-29 01:45:22', 'GURU', 'guru139', '$2a$10$Cz7m5yXAGit6SWZrXTQmMeylJ7rn.A1Wl/CJiLq2PNygOBdOPoeke'),
(140, NULL, 'JUNIANTO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'B. Jawa', NULL, '2026-03-29 01:45:22', 'GURU', 'guru140', '$2a$10$e70DlnYV/wWAszq2IJy44u0Uc68Ii5dJkOkJmu5UeW2LCRdr9X6pu'),
(141, NULL, 'YUNENI FITRI HARIATI, SP', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'KTU', 'guru141', '$2a$10$HybVbg5av9He.QiB7Ph.w.rL7qjAZZA0pf2XsVFXJnZwR7/pDRi9C'),
(142, NULL, 'M. LUFFI SYAFI\'I, S.T', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru142', '$2a$10$eYWs9XA.Uz434mKxzTczz.kTMfjUyllBWxO3nijROAgudIunOVPj2'),
(143, NULL, 'ROIYATUS SYARI\'AH', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru143', '$2a$10$312xmFipqPMmFxUAA1P5quxq.S542VBn85Ah.szt/GWvkzvCQqVfu'),
(144, NULL, 'AGUNG SUBELA, S.H', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru144', '$2a$10$m2yPgLEKI3VuOpjPru9vgOUrJA10/UCHjXrPjZtpBUut6XK8E5s1S'),
(145, NULL, 'SUHARTI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru145', '$2a$10$g.UdIc5Z2pEuuW/dXqb4HuidWhHG4wMQu0m/F4p191QQ.Cv.BgayS'),
(146, NULL, 'IKE SASI JARIYANTO', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru146', '$2a$10$ztXFquG4pI4QLF1rvqUfge4BmNXDiqr10Qf4Yfrdzx2PKnVFoY2le'),
(147, NULL, 'PURNOMO', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru147', '$2a$10$v1a/VqVjd3rEXv700EO81e2gLIR5F.gyz7vOGdyBv1ry9WYQs2vhe'),
(148, NULL, 'FUAT HASIM', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru148', '$2a$10$3VqE9tXIsF73SMi6YO.Hueuo2QpGy2xjg18H7JRSORSxu3FcUKZ0O'),
(149, NULL, 'ABDUL FATAH', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru149', '$2a$10$aVQ.y3Qnnq3B/QFNp3zjQOoFmsDU0NELhiQwK/EI6p38rlgSB7R9m'),
(150, NULL, 'MAFTUCHIN QOMARUZZAMAN', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru150', '$2a$10$lqpk2B7qUm2wVUV4Pu/EOO6EwjROunRBWHUm/e1uiJVnBxynz1R9W'),
(151, NULL, 'MOH A\'AM TAUFIQI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru151', '$2a$10$0gvPTHsqVfxdLxAnhdhQ4u1UT.4gu5RGXWJxhSUhvnox1U7IdqwpO'),
(152, NULL, 'MUHAMAD RO\'UF FIRNANDA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru152', '$2a$10$RJn1qr.Yh1xdgoFYikqAUOopEPfE6mwHmRR9Y3SnmO3tLEpUMUwh.'),
(153, NULL, 'FEBRIANA EKA WULANDARI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru153', '$2a$10$JP0E9vXmyaZ1swhGc2qMnOwaQI.TFIBJVu7rCFeGx8EjfGdYHDmcq'),
(154, NULL, 'ADHIYASA KHOIRUL MUTTAQIIN', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Staf TU', 'guru154', '$2a$10$PxdFLLThXMVrBPhjPmb26OWn9ofC4n8uw.FXF0TKmuFY9ztwuANl2'),
(155, NULL, 'RISKI PANDUWINATA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Toolman Kuliner', 'guru155', '$2a$10$ZauA.nSD92kKDzmSe.DJUuvM6L4pL0cUOW5KHkSzVs/RXn.BuD9DW'),
(156, NULL, 'M. SUGENG RIADI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Perpus', 'guru156', '$2a$10$OfOVOKHWHPZxrwvFBDyNUuWsfpegaJ9KRDPwkx09Z49yWSYVY8OwO'),
(157, NULL, 'AHMAT ASROFI', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Caraka', 'guru157', '$2a$10$T/dyH8w0XIimXUFaW/VG2uzuE9/axX.wOvy0nKrnFkkUqtV73W8Gi'),
(158, NULL, 'RIKI WAHYU KUSUMA', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Toolman TKRO', 'guru158', '$2a$10$5uHJ0HjQYNjHt32amNYT6ueX80fKZR.EmW.T/qqk84d.b83xfBcx.'),
(159, NULL, 'DANANG', 'L', NULL, NULL, NULL, NULL, NULL, '', NULL, '2026-03-29 01:48:14', 'Satpam', 'guru159', '$2a$10$MWfCN4PXdGz2W2u8ycYxCO8oe34DKiGZ9yXzO8bsEiCaqkk1.R6lG'),
(160, NULL, 'ALIF PUTRA FADHILAH, S.T', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 05:08:49', 'GURU', 'guru160', '$2a$10$vAooHNdsa9iCQIcEtUaykui0h6F54YNPUFEhMFeDHepA2kJIg3g7K'),
(161, NULL, 'ANDIK TRIYONO, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TKRO', NULL, '2026-03-29 05:08:49', 'GURU', 'guru161', '$2a$10$eG01b7oXGZQhr4I1lU6hWOuYvWiCSbNoKOThCgYbFfdkC6MKP2.Fe'),
(162, NULL, 'FAISSAL RACHMAN, S.Pd', 'L', NULL, NULL, NULL, NULL, NULL, 'Produktif TPTUP', NULL, '2026-03-29 05:08:49', 'GURU', 'guru162', '$2a$10$u96rnUHK8lPPUyRMxKVJwuOV4V4Ghulk9u.qNT5VOtZbDSnllcOx2');

-- --------------------------------------------------------

--
-- Struktur dari tabel `halaman`
--

CREATE TABLE `halaman` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `subtitle` varchar(500) DEFAULT NULL,
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

INSERT INTO `halaman` (`id`, `judul`, `subtitle`, `slug`, `konten`, `foto`, `status`, `created_at`, `updated_at`) VALUES
(3, 'Pencak Silat', NULL, 'pencak-silat', '<p style=\"text-align: justify;\">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ekstrakurikuler pencak silat adalah kegiatan sekolah di luar jam pelajaran yang bertujuan melatih seni bela diri tradisional Indonesia, meningkatkan kebugaran fisik, disiplin, mental tangguh, serta melestarikan budaya bangsa. Kegiatan ini memadukan empat aspek utama: mental-spiritual, bela diri, seni budaya, dan olahraga.&nbsp;</p><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify;\"><b>Berikut adalah poin-poin penting mengenai ekstrakurikuler pencak silat:</b></p><ul><li style=\"text-align: justify;\"><b>Pengembangan Karakter</b>: Membentuk mental disiplin, percaya diri, bertanggung jawab, sportif, dan berani, sebagaimana dijelaskan dalam artikel UNESA dan smk-almuttaqien.sch.id.</li><li style=\"text-align: justify;\"><b>Fisik &amp; Teknik</b>: Melatih kuda-kuda, pukulan, tendangan, stamina, kekuatan, dan kelenturan tubuh, menurut website SDNSuradadi4 dan Halodoc.</li><li style=\"text-align: justify;\"><b>Prestasi</b>: Menyediakan wadah untuk menyalurkan bakat dan berprestasi di kejuaraan tingkat sekolah, daerah, maupun nasional.</li><li style=\"text-align: justify;\"><b>Pelestarian Budaya</b>: Mengenalkan budaya luhur Indonesia kepada generasi muda</li></ul>', 'halaman-1774761639873.jpg', 'aktif', '2026-03-28 14:58:08', '2026-03-29 05:31:08'),
(4, 'Pramuka', NULL, 'pramuka', '<p style=\"text-align: justify; \">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; Ekskul pramuka adalah kegiatan ekstrakurikuler wajib di sekolah yang bertujuan membentuk karakter siswa, kepemimpinan, kemandirian, dan disiplin melalui aktivitas luar ruangan yang menyenangkan. Pramuka (Praja Muda Karana) menanamkan nilai-nilai Pancasila, cinta alam, serta keterampilan hidup seperti pertolongan pertama (P3K), berkemah, dan tali-temali.&nbsp;</p><p style=\"text-align: justify;\"><b>Karakteristik &amp; Tujuan Ekskul Pramuka:</b></p><ul><li style=\"text-align: justify;\">Pembentukan Karakter: Mengembangkan akhlak mulia, kemandirian, dan tanggung jawab.</li><li style=\"text-align: justify;\">Pendidikan Karakter &amp; Keterampilan: Mengajarkan disiplin, kepedulian sosial, dan kecintaan terhadap lingkungan.</li><li style=\"text-align: justify; \">Wajib Disediakan: Sekolah wajib menyediakan, namun tidak wajib diikuti secara individu (berdasarkan Permendikbudristek No 12 Tahun 2024).</li><li style=\"text-align: justify;\">Sistem Belajar: Menggunakan pola \"belajar sambil melakukan\" (learning by doing) dan permainan edukatif di alam terbuka.&nbsp;</li></ul><p style=\"text-align: justify;\"><b>Contoh Kegiatan Pramuka (Usage Examples):</b></p><ul><li style=\"text-align: justify;\">Perkemahan Sabtu-Minggu (Persami): Berkemah untuk melatih kemandirian dan kerjasama.</li><li style=\"text-align: justify;\">Pionering dan Tali-Temali: Membuat tandu atau tenda darurat menggunakan tongkat dan tali.</li><li style=\"text-align: justify;\">Baris-Berbaris (PBB): Latihan rutin untuk disiplin dan kekompakan.</li><li style=\"text-align: justify;\">Jelajah Alam (Wide Game): Kegiatan penjelajahan untuk melatih fisik dan kerjasama tim.</li><li style=\"text-align: justify;\">Bakti Sosial: Gotong royong membersihkan lingkungan atau membantu masyarakat.&nbsp;</li></ul>', 'halaman-1774761942548.jpg', 'aktif', '2026-03-29 05:25:42', '2026-03-29 05:31:46'),
(5, 'Badminton', NULL, 'badminton', '<p style=\"text-align: justify; \">          Ekstrakurikuler badminton (bulu tangkis) adalah kegiatan olahraga di luar jam pelajaran sekolah yang bertujuan mengembangkan bakat, minat, serta kebugaran fisik dan mental siswa. Ekskul ini melatih teknik dasar, taktik, dan sportivitas untuk mempersiapkan siswa dalam kompetisi, seperti O2SN, serta menanamkan karakter disiplin. </p><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify; \"><b>Tujuan dan Manfaat Ekstrakurikuler Badminton:</b></p><ul><li style=\"text-align: justify;\">Pengembangan Bakat: Wadah bagi siswa yang memiliki hobi bulu tangkis.</li><li style=\"text-align: justify;\">Kesehatan Fisik: Meningkatkan kelincahan, ketahanan fisik, dan menurunkan berat badan.</li><li style=\"text-align: justify;\">Prestasi: Mempersiapkan fisik dan mental untuk kejuaraan antar pelajar.</li><li style=\"text-align: justify;\">Sportivitas & Karakter: Membangun rasa persaudaraan, kerjasama tim, dan karakter pantang menyerah. </li></ul><p style=\"text-align: justify;\"><br></p><p style=\"text-align: justify;\"><b>Aktivitas dalam Ekskul Badminton:</b></p><ul><li style=\"text-align: justify;\">Latihan rutin teknik dasar (pukulan, footwork) dan taktik permainan.</li><li style=\"text-align: justify;\">Latihan fisik seperti skipping, push up, dan lari.</li><li style=\"text-align: justify;\">Sparring (pertandingan) antar anggota atau sekolah lain.</li></ul>', 'halaman-1774762089550.jpg', 'aktif', '2026-03-29 05:28:09', '2026-03-29 07:22:53');

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
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `deskripsi_lengkap` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jurusan`
--

INSERT INTO `jurusan` (`id`, `kode`, `nama`, `deskripsi`, `icon`, `warna`, `warna_badge`, `warna_teks_badge`, `kepala_jurusan`, `status`, `created_at`, `updated_at`, `deskripsi_lengkap`) VALUES
(1, 'TKJ', 'Teknik Jaringan Komputer dan Telekomunikasi', 'Mempelajari perakitan komputer, instalasi sistem operasi, pembangunan jaringan komputer (LAN/WAN/MAN), management jaringan Mikrotik, Fiber Optik & Cisco', 'fas fa-network-wired', 'linear-gradient(135deg,#0ea5e9,#0369a1)', '#e0f2fe', '#0369a1', 'Tino Bambang Gunawan, S.Kom., M.Pd.', 'aktif', '2026-03-28 03:19:31', '2026-04-01 12:41:43', '<div>          Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT) adalah program keahlian SMK yang fokus mempelajari instalasi, konfigurasi, perawatan, dan keamanan jaringan komputer serta infrastruktur telekomunikasi. Ini adalah evolusi dari jurusan TKJ yang lebih modern, mencakup teknologi cloud, IoT, dan fiber optik. </div><div><br></div><div><b>Detail Materi Pembelajaran TJKT:</b></div><div><br></div><ul><li>Perakitan & Troubleshooting PC: Merakit komputer, instalasi sistem operasi (Windows/Linux), dan perbaikan perangkat keras/lunak.</li><li>Jaringan Komputer (LAN/WAN/WiFi): Membangun jaringan kabel dan nirkabel, konfigurasi router, manageable switch, dan firewall.</li><li>Administrasi Server: Mengelola server jaringan, sistem keamanan jaringan, dan layanan berbasis cloud.</li><li>Telekomunikasi: Mempelajari teknologi fiber optik, kabel struktural, dan sistem telepon.</li><li>Pemrograman Dasar: Mempelajari dasar pemrograman (HTML, CSS, PHP, MySQL) untuk kebutuhan web dan jaringan. </li></ul><div><br></div><div><b>Prospek Kerja Lulusan TJKT:</b></div><div><br></div><ul><li>Lulusan TJKT sangat dibutuhkan untuk posisi seperti: </li><li>Network Administrator: Pengelola jaringan perusahaan.</li><li>Teknisi Jaringan/Fiber Optik: Pemasang dan pemelihara jaringan.</li><li>IT Support/Helpdesk: Teknisi perbaikan perangkat.</li><li>System Administrator: Pengelola server.</li><li>Wirausaha IT: Membuka jasa servis atau Depok internet service provider (ISP). </li></ul><div><br></div><div><b>Keunggulan:</b></div><div><br></div><div>Siswa TJKT seringkali dibekali sertifikasi kompetensi (BNSP) dan kurikulum industri, membuat mereka siap kerja langsung setelah lulus.</div>'),
(2, 'TKRO', 'Teknik Kendaraan Ringan Otomotif', 'Mempelajari perawatan, perbaikan sistem mesin, kelistrikan, sasis, dan teknologi otomotif modern dan teknik kendaraan roda empat (mobil).', 'fas fa-car', 'linear-gradient(135deg,#ef4444,#dc2626)', '#fee2e2', '#dc2626', 'Hendrik Kurniawan, S.Pd.', 'aktif', '2026-03-28 03:22:11', '2026-03-29 05:42:45', NULL),
(3, 'KULINER', 'Kuliner', 'Mempelajari seni mengolah makanan, teknik memasak, penyajian, nutrisi, keamanan pangan, dan kewirausahaan hingga manajemen bisnis F&B (Food & Beverage).', 'fas fa-utensils', 'linear-gradient(135deg,#10b981,#059669)', '#d1fae5', '#059669', 'Nia Sasi Hardiani, S.Pd.', 'aktif', '2026-03-28 03:23:17', '2026-03-29 05:42:24', NULL),
(4, 'TPTUP', 'Teknik Pendingin, Tata Udara, dan Pemanasan', 'Mempelajari perancangan, instalasi, perawatan, dan perbaikan sistem pendingin (AC/kulkas) serta pemanas (water heater/heat pump)', 'fas fa-snowflake', 'linear-gradient(135deg,#8b5cf6,#7c3aed)', '#ede9fe', '#7c3aed', 'Drs. Haji Sigit Supranoto', 'aktif', '2026-03-28 03:24:46', '2026-03-29 05:42:30', NULL);

-- --------------------------------------------------------

--
-- Struktur dari tabel `jurusan_berita`
--

CREATE TABLE `jurusan_berita` (
  `id` int(11) NOT NULL,
  `jurusan` varchar(100) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `konten` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('berita','informasi','pengumuman','prestasi') DEFAULT 'berita',
  `status` enum('draft','published') DEFAULT 'published',
  `penulis` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jurusan_berita`
--

INSERT INTO `jurusan_berita` (`id`, `jurusan`, `judul`, `slug`, `konten`, `gambar`, `kategori`, `status`, `penulis`, `created_at`, `updated_at`) VALUES
(1, 'TKJ', 'Selayang', 'selayang-mnfus2kq', '<p>          Jurusan Teknik Jaringan Komputer dan Telekomunikasi (TJKT) adalah program keahlian SMK yang fokus mempelajari instalasi, konfigurasi, perawatan, dan keamanan jaringan komputer serta infrastruktur telekomunikasi. Ini adalah evolusi dari jurusan TKJ yang lebih modern, mencakup teknologi cloud, IoT, dan fiber optik. </p><p><span style=\"font-weight: bolder; font-size: 1rem;\">Detail Materi Pembelajaran TJKT:</span></p><ul><li>Perakitan & Troubleshooting PC: Merakit komputer, instalasi sistem operasi (Windows/Linux), dan perbaikan perangkat keras/lunak.</li><li>Jaringan Komputer (LAN/WAN/WiFi): Membangun jaringan kabel dan nirkabel, konfigurasi router, manageable switch, dan firewall.</li><li>Administrasi Server: Mengelola server jaringan, sistem keamanan jaringan, dan layanan berbasis cloud.</li><li>Telekomunikasi: Mempelajari teknologi fiber optik, kabel struktural, dan sistem telepon.</li><li>Pemrograman Dasar: Mempelajari dasar pemrograman (HTML, CSS, PHP, MySQL) untuk kebutuhan web dan jaringan. </li></ul><p><span style=\"font-size: 1rem;\"><span style=\"font-weight: bolder;\">Prospek Kerja Lulusan TJKT:</span></span></p><ul><li>Lulusan TJKT sangat dibutuhkan untuk posisi seperti: </li><li>Network Administrator: Pengelola jaringan perusahaan.</li><li>Teknisi Jaringan/Fiber Optik: Pemasang dan pemelihara jaringan.</li><li>IT Support/Helpdesk: Teknisi perbaikan perangkat.</li><li>System Administrator: Pengelola server.</li><li>Wirausaha IT: Membuka jasa servis atau Depok internet service provider (ISP). </li></ul><p><span style=\"font-size: 1rem;\"><span style=\"font-weight: bolder;\">Keunggulan:</span></span></p><p>Siswa TJKT seringkali dibekali sertifikasi kompetensi (BNSP) dan kurikulum industri, membuat mereka siap kerja langsung setelah lulus.</p>', 'portal-1775047650593-e9f658e4bd8362267f60f8c6cac18a79.jpg', 'informasi', 'published', 'Imam Junaidi Abror', '2026-04-01 09:38:14', '2026-04-01 12:47:30');

-- --------------------------------------------------------

--
-- Struktur dari tabel `jurusan_galeri`
--

CREATE TABLE `jurusan_galeri` (
  `id` int(11) NOT NULL,
  `jurusan` varchar(100) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `urutan` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `jurusan_galeri`
--

INSERT INTO `jurusan_galeri` (`id`, `jurusan`, `judul`, `gambar`, `keterangan`, `urutan`, `created_at`) VALUES
(1, 'TKJ', 'UKK', 'jurusan-galeri-1775045341866-b3b7514edcc1b2f59a7269053601d37b.jpeg', 'Kegiatan UKK', 0, '2026-04-01 12:09:01'),
(2, 'TKJ', 'UKK', 'jurusan-galeri-1775045341872-7aede637335e17c0e3bedcd095a6f38c.jpeg', 'Kegiatan UKK', 0, '2026-04-01 12:09:01'),
(3, 'TKJ', 'UKK', 'jurusan-galeri-1775045341874-042743b00c5cbb9269d6052e37403aa5.jpeg', 'Kegiatan UKK', 0, '2026-04-01 12:09:01'),
(6, 'TKJ', 'UKK', 'jurusan-galeri-1775045341889-4f56e9014c85bb43bafe0e1c7d834721.jpeg', 'Kegiatan UKK', 0, '2026-04-01 12:09:01');

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
-- Struktur dari tabel `link_terkait`
--

CREATE TABLE `link_terkait` (
  `id` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `url` varchar(500) NOT NULL,
  `logo` varchar(255) DEFAULT NULL,
  `deskripsi` varchar(255) DEFAULT NULL,
  `urutan` int(11) DEFAULT 0,
  `status` enum('aktif','nonaktif') DEFAULT 'aktif',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `link_terkait`
--

INSERT INTO `link_terkait` (`id`, `nama`, `url`, `logo`, `deskripsi`, `urutan`, `status`, `created_at`) VALUES
(1, 'Dapodik', 'http://210.79.142.181:5774/', 'link-1774991526923.png', NULL, 0, 'aktif', '2026-03-31 21:12:06');

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
(1, 'Hari Raya Idul Fitri 1447 H', 'Selamat Hari Raya Idul Fitri 1447 H.\r\nTaqabbalallahu minna wa minkum.\r\nMinal Aidin wal Faizin.', 'instagram', 'https://www.instagram.com/p/DWGneZ8E4TN/', NULL, 'aktif', 3, '2026-03-28 03:17:14', '2026-04-01 04:40:26'),
(2, 'Pentas Seni', 'Kegiatan ini merupakan rangkaian acara Dies Natalis SMKN 1 Kras', 'youtube', 'https://www.youtube.com/watch?v=23Kf5HqzIhc', NULL, 'aktif', 1, '2026-03-28 03:41:26', '2026-04-01 02:25:27'),
(3, 'Verifikasi TUK UKK', 'TPTUP', 'instagram', 'https://www.instagram.com/reel/DU5crxdgYqP', NULL, 'aktif', 2, '2026-04-01 02:16:20', '2026-04-01 02:40:00'),
(4, 'Mesin', 'TKRO', 'facebook', 'https://www.facebook.com/share/1KsbYk2LfC/', NULL, 'aktif', 4, '2026-04-01 02:45:07', '2026-04-01 02:45:07'),
(5, 'Expo JATIM', 'EXPO', 'instagram', 'https://www.instagram.com/p/DUuqUPDEXfB', NULL, 'aktif', 0, '2026-04-01 04:40:18', '2026-04-01 04:40:18');

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
(7, 'Kontak', '/kontak', NULL, 8, 'aktif', NULL, '_self', '2026-03-28 04:31:26'),
(12, 'Sambutan Kepala Sekolah', '/profil/sambutan', 2, 3, 'aktif', NULL, '_self', '2026-03-28 13:32:23'),
(13, 'Visi & Misi', '/profil/visi-misi', 2, 1, 'aktif', NULL, '_self', '2026-03-28 13:32:23'),
(14, 'Profil Sekolah', '/profil', 2, 0, 'aktif', NULL, '_self', '2026-03-28 14:49:44'),
(15, 'Sejarah Sekolah', '/profil/sejarah', 2, 2, 'aktif', NULL, '_self', '2026-03-28 14:51:24'),
(16, 'Informasi', '/', NULL, 5, 'aktif', NULL, '_self', '2026-03-28 14:54:39'),
(17, 'Pencak Silat', '/page/pencak-silat', 21, 0, 'aktif', NULL, '_self', '2026-03-28 14:58:29'),
(18, 'Pramuka', '/page/pramuka', 21, 1, 'aktif', NULL, '_self', '2026-03-29 05:29:13'),
(19, 'Badminton', '/page/badminton', 21, 2, 'aktif', NULL, '_self', '2026-03-29 05:29:36'),
(21, 'Ekstrakurikuler', '/', 16, 0, 'aktif', NULL, '_self', '2026-03-29 06:26:40'),
(27, 'Prestasi', '/prestasi', 16, 6, 'aktif', NULL, '_self', '2026-04-01 06:36:29'),
(28, 'BKK', '/bkk', 16, 7, 'aktif', NULL, '_self', '2026-04-01 06:36:29'),
(29, 'OSIS', '/osis', 21, 8, 'aktif', NULL, '_self', '2026-04-01 06:36:29'),
(30, 'Program Keahlian', '/jurusan', NULL, 5, 'aktif', NULL, '_self', '2026-04-01 06:43:59'),
(31, 'Kuliner', '/jurusan/kuliner', 30, 1, 'aktif', NULL, '_self', '2026-04-01 06:43:59'),
(32, 'Teknik Jaringan Komputer dan Telekomunikasi', '/jurusan/tkj', 30, 2, 'aktif', NULL, '_self', '2026-04-01 06:43:59'),
(33, 'Teknik Kendaraan Ringan Otomotif', '/jurusan/tkro', 30, 3, 'aktif', NULL, '_self', '2026-04-01 06:43:59'),
(34, 'Teknik Pendingin, Tata Udara, dan Pemanasan', '/jurusan/tptup', 30, 4, 'aktif', NULL, '_self', '2026-04-01 06:43:59'),
(35, 'Sosial Media', '/media-sosial', 16, 9, 'aktif', NULL, '_self', '2026-04-01 06:44:38'),
(36, 'Learning Management System (LMS)', 'https://lms.smkn1kras.sch.id', 16, 3, 'aktif', NULL, '_self', '2026-04-01 08:58:36'),
(37, 'Fasilitas', '/fasilitas', 2, 9, 'aktif', NULL, '_self', '2026-04-01 21:23:24'),
(38, 'Presensi Siswa', 'https://presensi.tamanet.site', 16, 8, 'aktif', NULL, '_self', '2026-04-02 01:03:33'),
(39, 'Artikel', '/artikel', 16, 10, 'aktif', NULL, '_self', '2026-04-02 04:05:50'),
(40, 'File Download', '/file-download', 16, 11, 'aktif', NULL, '_self', '2026-04-02 04:06:18');

-- --------------------------------------------------------

--
-- Struktur dari tabel `osis_berita`
--

CREATE TABLE `osis_berita` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `konten` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('berita','pengumuman','kegiatan','lainnya') DEFAULT 'berita',
  `status` enum('draft','published') DEFAULT 'published',
  `penulis` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `osis_berita`
--

INSERT INTO `osis_berita` (`id`, `judul`, `slug`, `konten`, `gambar`, `kategori`, `status`, `penulis`, `created_at`, `updated_at`) VALUES
(1, 'Jumat bersib', 'jumat-bersib-mng3oh6y', '<p>bersih-bersih</p>', 'portal-1775051243510-5f39ecd60468c9c8b70746e0e256be53.jpg', 'kegiatan', 'published', 'elrica', '2026-04-01 13:47:23', '2026-04-01 13:47:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `osis_galeri`
--

CREATE TABLE `osis_galeri` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `gambar` varchar(255) NOT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `osis_galeri`
--

INSERT INTO `osis_galeri` (`id`, `judul`, `gambar`, `keterangan`, `created_at`) VALUES
(1, 'Kerja', 'osis-galeri-1775051268197-40870c9e53cc7794961f97d874f36bec.jpg', 'kerja', '2026-04-01 13:47:48'),
(2, 'Kerja', 'osis-galeri-1775051268208-fe8d33137a8220ae98d250bcaffea069.jpg', 'kerja', '2026-04-01 13:47:48'),
(3, 'Kerja', 'osis-galeri-1775051268239-296513cc8b7668c1d0d7f98af63e4833.jpg', 'kerja', '2026-04-01 13:47:48');

-- --------------------------------------------------------

--
-- Struktur dari tabel `osis_kegiatan`
--

CREATE TABLE `osis_kegiatan` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `konten` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('kegiatan','pengumuman','prestasi','lainnya') DEFAULT 'kegiatan',
  `status` enum('draft','published') DEFAULT 'published',
  `penulis` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `osis_kegiatan`
--

INSERT INTO `osis_kegiatan` (`id`, `judul`, `slug`, `konten`, `gambar`, `kategori`, `status`, `penulis`, `created_at`, `updated_at`) VALUES
(1, 'LDKS', 'ldks-mng3ntiy', '<p>siap LDKS</p>', 'portal-1775051212848-b5aa1bdebdb8efde44990a7182704fbb.jpeg', 'kegiatan', 'published', 'elrica', '2026-04-01 13:46:52', '2026-04-01 13:46:52');

-- --------------------------------------------------------

--
-- Struktur dari tabel `portal_users`
--

CREATE TABLE `portal_users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `role` enum('bkk','osis','jurusan') NOT NULL,
  `jurusan` varchar(100) DEFAULT NULL,
  `aktif` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `portal_users`
--

INSERT INTO `portal_users` (`id`, `username`, `password`, `nama`, `role`, `jurusan`, `aktif`, `created_at`) VALUES
(1, 'imam', '$2a$10$fHtoYaX7ux4cVeIxhbyvv.W0MYS58MVtvwwZufr.SN3iG9LGefW12', 'Imam Junaidi Abror', 'jurusan', 'TKJ', 1, '2026-04-01 06:54:14'),
(6, 'jou', '$2a$10$B1nLV.AKrluXpDif1B4i6eVeqQeLq9F5jIhLp.O0Q6F0HAr9Lacdq', 'Imam Junaidi Abror', 'jurusan', 'TKRO', 1, '2026-04-01 11:18:58'),
(7, 'aab', '$2a$10$GLt6Vf.oU/JvzkrejTL6Au8.udMRAZGM72ANz1MDsIWGtWTOs7I/q', 'Imam Junaidi Abror', 'jurusan', 'Kuliner', 1, '2026-04-01 11:19:37'),
(8, 'maz', '$2a$10$kucitkPAuO/2Gj4WLZjQA.Enlzfm6/o8bJuIeiVE8oWMPZ7Mij0eW', 'Imam Junaidi Abror', 'jurusan', 'TPTUP', 1, '2026-04-01 11:19:58'),
(9, 'yanu', '$2a$10$wHxhl3pHslKmUvsIeMWADehK88HiABz8VYS9GCROOt9NEV2F3m1MS', 'Yanuar', 'bkk', 'TKJ', 1, '2026-04-01 11:20:22'),
(10, 'el', '$2a$10$30ALc1YvHTdfVi1GoJ.3kOYyFhEd1kx9NkIedHKvFuLn.jUE8m10i', 'elrica', 'osis', 'TKJ', 1, '2026-04-01 13:10:14');

-- --------------------------------------------------------

--
-- Struktur dari tabel `prestasi`
--

CREATE TABLE `prestasi` (
  `id` int(11) NOT NULL,
  `judul` varchar(255) NOT NULL,
  `slug` varchar(255) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `gambar` varchar(255) DEFAULT NULL,
  `kategori` enum('akademik','non-akademik','olahraga','seni','teknologi','lainnya') DEFAULT 'lainnya',
  `tingkat` enum('sekolah','kecamatan','kabupaten','provinsi','nasional','internasional') DEFAULT 'sekolah',
  `tahun` year(4) DEFAULT NULL,
  `jurusan` varchar(100) DEFAULT NULL,
  `status` enum('draft','published') DEFAULT 'published',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `prestasi`
--

INSERT INTO `prestasi` (`id`, `judul`, `slug`, `deskripsi`, `gambar`, `kategori`, `tingkat`, `tahun`, `jurusan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Juara 1 Lomba Pencak Silat Nasional', 'juara-1-lomba-pencak-silat-nasional-mnfnthtt', 'ananda fulan', 'portal-1775024603772-1ae74c64c4962bd1dd4be1adb2e8f0e7.jpg', 'olahraga', 'provinsi', '2025', 'TKRO', 'published', '2026-04-01 06:23:23', '2026-04-01 06:23:23'),
(2, 'Cloud Cmputing', 'cloud-cmputing-mnfyh4x4', 'Juara 1', 'portal-1775042502941-dd6dcf3289e2386292c71b5a7d850c22.png', 'akademik', 'provinsi', '2026', 'TKJ', 'published', '2026-04-01 11:21:42', '2026-04-01 11:21:42'),
(3, 'Cyber Security', 'cyber-security-mnfyintq', 'Juara 2', 'portal-1775042574101-4571b13bdfa6f02f3aa13b79fbd69046.jpeg', 'akademik', 'provinsi', '2026', 'TKJ', 'published', '2026-04-01 11:22:54', '2026-04-01 11:22:54');

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
  `website` varchar(255) DEFAULT NULL,
  `tampil_wa` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `profil_sekolah`
--

INSERT INTO `profil_sekolah` (`id`, `nama_sekolah`, `alamat`, `telepon`, `whatsapp`, `email`, `visi`, `misi`, `logo`, `updated_at`, `npsn`, `status`, `jenjang`, `akreditasi`, `no_sk_akreditasi`, `sk_pendirian`, `tanggal_sk`, `sk_izin`, `tanggal_sk_izin`, `maps`, `website`, `tampil_wa`) VALUES
(1, 'SMKN 1 KRAS', 'Dsn. Demangan, Desa Setonorejo, Kecamatan Kras, Kabupaten Kediri, Provinsi Jawa Timur, 64172. ', '', '-', 'smkn1kras@gmail.com', NULL, NULL, '1774666777516.png', '2026-04-01 09:35:09', '69775452', 'Negeri', 'SMK', 'A', '022/BAN-PDM/SK/2023', '188.45/106/418.32/2012', NULL, '188.45/106/418.32/2012', NULL, 'https://maps.app.goo.gl/WGHtLP6k46Nm2wL5A', 'https://smkn1kras.sch.id', 0);

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
(7, 'mazjou', '$2a$10$RlHAMSpbo6JF9wDA.5AhFuUFh5bY/ZlVDhfn8Hi2q3YBnpnENHBCu', 'Imam', 'imamjunaidiabror@gmail.com', 'admin', '2026-03-28 03:43:33'),
(8, 'master', '$2a$10$ZnUriOVPj8ea5PpAZIvgAu68vVAFFBHqVrT.YHVKP7pOeVoVM1/ZW', 'master', 'master@gmail.com', 'guru', '2026-03-30 07:17:37');

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
(1, 'theme_mode', 'light', '2026-04-01 05:17:11'),
(2, 'primary_color', '#8b5cf6', '2026-04-01 14:05:59'),
(3, 'secondary_color', '#7c3aed', '2026-04-01 14:05:59'),
(4, 'navbar_bg', '#ffffff', '2026-04-01 05:17:11'),
(5, 'footer_bg', '#2e1065', '2026-04-01 14:05:59'),
(26, 'maintenance_mode', '0', '2026-04-01 20:58:22'),
(46, 'font_family', 'Poppins', '2026-04-01 14:05:59'),
(47, 'border_radius', '20', '2026-04-01 14:05:59');

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
-- Indeks untuk tabel `alumni`
--
ALTER TABLE `alumni`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `artikel`
--
ALTER TABLE `artikel`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `berita`
--
ALTER TABLE `berita`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `bkk_lowongan`
--
ALTER TABLE `bkk_lowongan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `fasilitas`
--
ALTER TABLE `fasilitas`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `fasilitas_foto`
--
ALTER TABLE `fasilitas_foto`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fasilitas_id` (`fasilitas_id`);

--
-- Indeks untuk tabel `file_download`
--
ALTER TABLE `file_download`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `galeri`
--
ALTER TABLE `galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `guru`
--
ALTER TABLE `guru`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `guru_username` (`guru_username`);

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
-- Indeks untuk tabel `jurusan_berita`
--
ALTER TABLE `jurusan_berita`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `jurusan_galeri`
--
ALTER TABLE `jurusan_galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `kontak_masuk`
--
ALTER TABLE `kontak_masuk`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `link_terkait`
--
ALTER TABLE `link_terkait`
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
-- Indeks untuk tabel `osis_berita`
--
ALTER TABLE `osis_berita`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `osis_galeri`
--
ALTER TABLE `osis_galeri`
  ADD PRIMARY KEY (`id`);

--
-- Indeks untuk tabel `osis_kegiatan`
--
ALTER TABLE `osis_kegiatan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

--
-- Indeks untuk tabel `portal_users`
--
ALTER TABLE `portal_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- Indeks untuk tabel `prestasi`
--
ALTER TABLE `prestasi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`);

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
-- AUTO_INCREMENT untuk tabel `alumni`
--
ALTER TABLE `alumni`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `artikel`
--
ALTER TABLE `artikel`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `berita`
--
ALTER TABLE `berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `bkk_lowongan`
--
ALTER TABLE `bkk_lowongan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `fasilitas`
--
ALTER TABLE `fasilitas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `fasilitas_foto`
--
ALTER TABLE `fasilitas_foto`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `file_download`
--
ALTER TABLE `file_download`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `galeri`
--
ALTER TABLE `galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=37;

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
-- AUTO_INCREMENT untuk tabel `jurusan_berita`
--
ALTER TABLE `jurusan_berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `jurusan_galeri`
--
ALTER TABLE `jurusan_galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT untuk tabel `kontak_masuk`
--
ALTER TABLE `kontak_masuk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `link_terkait`
--
ALTER TABLE `link_terkait`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `media_sosial`
--
ALTER TABLE `media_sosial`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT untuk tabel `menu_navigasi`
--
ALTER TABLE `menu_navigasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=41;

--
-- AUTO_INCREMENT untuk tabel `osis_berita`
--
ALTER TABLE `osis_berita`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `osis_galeri`
--
ALTER TABLE `osis_galeri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `osis_kegiatan`
--
ALTER TABLE `osis_kegiatan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `portal_users`
--
ALTER TABLE `portal_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT untuk tabel `prestasi`
--
ALTER TABLE `prestasi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT untuk tabel `website_settings`
--
ALTER TABLE `website_settings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=143;

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
