const express = require('express');
const router = express.Router();
const frontendController = require('../controllers/frontendController');
const kontrolWebsiteController = require('../controllers/kontrolWebsiteController');
const { formLimiter } = require('../middleware/security');
const { validateSlugParam } = require('../middleware/securityHardening');

// Dynamic theme CSS (tidak kena maintenance)
router.get('/theme.css', kontrolWebsiteController.themeCss);

router.get('/', frontendController.home);
router.get('/profil', frontendController.profil);
router.get('/profil/visi-misi', frontendController.visiMisi);
router.get('/profil/sejarah', frontendController.sejarah);
router.get('/profil/sambutan', frontendController.sambutan);
router.get('/profil/kepala-sekolah', frontendController.sambutanKepsek);
router.get('/berita', frontendController.berita);
router.get('/berita/:slug', validateSlugParam, frontendController.beritaDetail);
router.get('/galeri', frontendController.galeri);
router.get('/guru', frontendController.guru);
router.get('/kontak', frontendController.kontakPage);
router.post('/kontak', formLimiter, frontendController.kontakSubmit);
router.get('/media-sosial', frontendController.mediaSosial);

// Alumni
const alumniController = require('../controllers/alumniController');
const { csrfProtect } = require('../middleware/csrf');
router.get('/alumni', alumniController.frontendIndex);
router.get('/alumni/daftar', alumniController.registerPage);
router.post('/alumni/daftar', formLimiter, csrfProtect, alumniController.register);
router.get('/alumni/update', alumniController.updatePage);
router.get('/alumni/edit/:token', alumniController.editPage);
router.post('/alumni/edit/:token', formLimiter, csrfProtect, alumniController.editSubmit);

// Prestasi, BKK, OSIS
const portalController = require('../controllers/portalController');
router.get('/prestasi', portalController.prestasiIndex);
router.get('/prestasi/:slug', validateSlugParam, portalController.prestasiDetail);
router.get('/bkk', portalController.bkkIndex);
router.get('/bkk/:slug', validateSlugParam, portalController.bkkDetail);
router.get('/osis', portalController.osisIndex);
router.get('/osis/berita/:slug', validateSlugParam, portalController.osisBeritaDetail);
router.get('/osis/:slug', validateSlugParam, portalController.osisDetail);
router.get('/pramuka', portalController.pramukaIndex);
router.get('/pramuka/berita/:slug', validateSlugParam, portalController.pramukaBeritaDetail);
router.get('/pramuka/:slug', validateSlugParam, portalController.pramukaDetail);
router.get('/olahraga', portalController.olahragaIndex);
router.get('/olahraga/berita/:slug', validateSlugParam, portalController.olahragaBeritaDetail);
router.get('/olahraga/:slug', validateSlugParam, portalController.olahragaDetail);
router.get('/paskibraka', portalController.paskibrakaIndex);
router.get('/paskibraka/berita/:slug', validateSlugParam, portalController.paskibrakaBeritaDetail);
router.get('/paskibraka/:slug', validateSlugParam, portalController.paskibrakaDetail);

// Seni
router.get('/seni', portalController.seniIndex);
router.get('/seni/berita/:slug', validateSlugParam, portalController.seniBeritaDetail);
router.get('/seni/:slug', validateSlugParam, portalController.seniDetail);

// Bahasa Asing
router.get('/bahasa-asing', portalController.bahasaAsingIndex);
router.get('/bahasa-asing/berita/:slug', validateSlugParam, portalController.bahasaAsingBeritaDetail);
router.get('/bahasa-asing/:slug', validateSlugParam, portalController.bahasaAsingDetail);

// Rohis
router.get('/rohis', portalController.rohisIndex);
router.get('/rohis/berita/:slug', validateSlugParam, portalController.rohisBeritaDetail);
router.get('/rohis/:slug', validateSlugParam, portalController.rohisDetail);

// PMR
router.get('/pmr', portalController.pmrIndex);
router.get('/pmr/berita/:slug', validateSlugParam, portalController.pmrBeritaDetail);
router.get('/pmr/:slug', validateSlugParam, portalController.pmrDetail);

// PIK-R
router.get('/pikr', portalController.pikrIndex);
router.get('/pikr/berita/:slug', validateSlugParam, portalController.pikrBeritaDetail);
router.get('/pikr/:slug', validateSlugParam, portalController.pikrDetail);

// Pecinta Alam
router.get('/pecinta-alam', portalController.pecintaAlamIndex);
router.get('/pecinta-alam/berita/:slug', validateSlugParam, portalController.pecintaAlamBeritaDetail);
router.get('/pecinta-alam/:slug', validateSlugParam, portalController.pecintaAlamDetail);

// Fasilitas
router.get('/fasilitas', portalController.fasilitasIndex);

// Halaman Jurusan (dinamis dari DB)
router.get('/jurusan', portalController.jurusanListPage);
router.get('/jurusan/:kode', portalController.jurusanDetailPage);
router.get('/jurusan/:kode/berita/:slug', validateSlugParam, portalController.jurusanBeritaDetailPage);

// Halaman dinamis - harus di paling bawah
const halamanController = require('../controllers/halamanController');
router.get('/page/:slug', validateSlugParam, halamanController.show);

// Artikel
const artikelController = require('../controllers/artikelController');
router.get('/artikel', artikelController.frontendIndex);
router.get('/artikel/:slug', validateSlugParam, artikelController.frontendDetail);

// Agenda
const agendaController = require('../controllers/agendaController');
router.get('/agenda', agendaController.frontendIndex);
router.get('/agenda/:slug', validateSlugParam, agendaController.frontendDetail);

// File Download
const fileDownloadController = require('../controllers/fileDownloadController');
router.get('/file-download', fileDownloadController.frontendIndex);
router.get('/file-download/:id', fileDownloadController.frontendDownload);

// Halaman Ekstrakurikuler
router.get('/ekstrakurikuler', portalController.ekstrakurikulerIndex);

// SEO
router.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /guru\nDisallow: /bkk\nDisallow: /osis\nDisallow: /pramuka\nDisallow: /olahraga\nDisallow: /paskibraka\nDisallow: /seni\nDisallow: /bahasa-asing\nDisallow: /rohis\nDisallow: /pmr\nDisallow: /pikr\nDisallow: /pecinta-alam\nDisallow: /jurusan-portal\nSitemap: https://smknegeri1kras.sch.id/sitemap.xml`);
});

router.get('/sitemap.xml', async (req, res) => {
  try {
    const db = require('../config/database');
    const baseUrl = 'https://smknegeri1kras.sch.id';
    const now = new Date().toISOString().split('T')[0];

    const [[berita], [artikel], [jurusan], [halaman]] = await Promise.all([
      db.query("SELECT slug, updated_at FROM berita WHERE status='published'"),
      db.query("SELECT slug, updated_at FROM artikel WHERE status='published'"),
      db.query("SELECT kode FROM jurusan WHERE status='aktif'"),
      db.query("SELECT slug FROM halaman WHERE status='aktif'"),
    ]);

    const staticPages = ['', '/berita', '/galeri', '/guru', '/kontak', '/profil', '/prestasi', '/bkk', '/osis', '/pramuka', '/olahraga', '/paskibraka', '/seni', '/bahasa-asing', '/rohis', '/pmr', '/pikr', '/pecinta-alam', '/fasilitas', '/ekstrakurikuler'];

    let urls = staticPages.map(p => `
  <url><loc>${baseUrl}${p}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${p === '' ? '1.0' : '0.8'}</priority></url>`).join('');

    berita.forEach(b => { urls += `\n  <url><loc>${baseUrl}/berita/${b.slug}</loc><lastmod>${new Date(b.updated_at).toISOString().split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`; });
    artikel.forEach(a => { urls += `\n  <url><loc>${baseUrl}/artikel/${a.slug}</loc><lastmod>${new Date(a.updated_at).toISOString().split('T')[0]}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`; });
    jurusan.forEach(j => { urls += `\n  <url><loc>${baseUrl}/jurusan/${j.kode.toLowerCase()}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>`; });
    halaman.forEach(h => { urls += `\n  <url><loc>${baseUrl}/page/${h.slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`; });

    res.type('application/xml');
    res.send(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}\n</urlset>`);
  } catch (e) { res.status(500).send('Error generating sitemap'); }
});

module.exports = router;
