const db = require('../config/database');
const cache = require('../utils/cache');
const { createUpload } = require('../middleware/uploadSecurity');
const upload = createUpload('medsos').single('thumbnail');

const clearMedsosCahce = () => cache.del('media_sosial_footer');

// Admin functions
exports.index = async (req, res) => {
  try {
    const [mediaSosial] = await db.query('SELECT * FROM media_sosial ORDER BY urutan ASC, created_at DESC');
    res.render('admin/media-sosial/index', {
      title: 'Kelola Media Sosial',
      user: req.session,
      mediaSosial,
      query: req.query
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.create = (req, res) => {
  res.render('admin/media-sosial/create', {
    title: 'Tambah Media Sosial',
    user: req.session
  });
};

exports.store = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    try {
      const { judul, deskripsi, platform, embed_url, urutan, status } = req.body;
      const thumbnail = req.file ? req.file.filename : null;
      await db.query(
        'INSERT INTO media_sosial (judul, deskripsi, platform, embed_url, thumbnail, urutan, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [judul, deskripsi, platform, embed_url, thumbnail, urutan || 0, status || 'aktif']
      );
      clearMedsosCahce();
      res.redirect('/admin/media-sosial?success=1');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.edit = async (req, res) => {
  try {
    const [mediaSosial] = await db.query('SELECT * FROM media_sosial WHERE id = ?', [req.params.id]);
    
    if (mediaSosial.length === 0) {
      return res.status(404).send('Media sosial tidak ditemukan');
    }
    
    res.render('admin/media-sosial/edit', {
      title: 'Edit Media Sosial',
      user: req.session,
      mediaSosial: mediaSosial[0]
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

exports.update = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) return res.status(500).send('Error upload');
    try {
      const { judul, deskripsi, platform, embed_url, urutan, status } = req.body;
      const thumbnail = req.file ? req.file.filename : null;
      if (thumbnail) {
        await db.query(
          'UPDATE media_sosial SET judul=?, deskripsi=?, platform=?, embed_url=?, thumbnail=?, urutan=?, status=? WHERE id=?',
          [judul, deskripsi, platform, embed_url, thumbnail, urutan || 0, status || 'aktif', req.params.id]
        );
      } else {
        await db.query(
          'UPDATE media_sosial SET judul=?, deskripsi=?, platform=?, embed_url=?, urutan=?, status=? WHERE id=?',
          [judul, deskripsi, platform, embed_url, urutan || 0, status || 'aktif', req.params.id]
        );
      }
      clearMedsosCahce();
      res.redirect('/admin/media-sosial?success=2');
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan');
    }
  });
};

exports.destroy = async (req, res) => {
  try {
    await db.query('DELETE FROM media_sosial WHERE id = ?', [req.params.id]);
    clearMedsosCahce();
    res.redirect('/admin/media-sosial?success=3');
  } catch (error) {
    console.error(error);
    res.status(500).send('Terjadi kesalahan');
  }
};

// Helper function to convert URLs to embeddable format
exports.convertToEmbedUrl = (url, platform) => {
  switch (platform) {
    case 'youtube':
      // Convert YouTube watch URL to embed URL
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
      return youtubeMatch ? `https://www.youtube.com/embed/${youtubeMatch[1]}` : url;
      
    case 'tiktok':
      // TikTok embed format
      const tiktokMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/);
      return tiktokMatch ? `https://www.tiktok.com/embed/v2/${tiktokMatch[1]}` : url;
      
    case 'instagram':
      // Instagram embed format
      const instagramMatch = url.match(/instagram\.com\/p\/([^\/]+)/);
      return instagramMatch ? `https://www.instagram.com/p/${instagramMatch[1]}/embed/` : url;
      
    case 'facebook':
      // Facebook video embed
      return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}`;
      
    case 'twitter':
      // Twitter embed (requires tweet ID)
      const twitterMatch = url.match(/twitter\.com\/[^\/]+\/status\/(\d+)/);
      return twitterMatch ? `https://platform.twitter.com/embed/Tweet.html?id=${twitterMatch[1]}` : url;
      
    default:
      return url;
  }
};