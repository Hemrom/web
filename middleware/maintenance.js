const db = require('../config/database');
const cache = require('../utils/cache');

module.exports = async (req, res, next) => {
  try {
    let isOn = cache.get('maintenance_mode');
    if (isOn === null) {
      const [rows] = await db.query(
        "SELECT setting_value FROM website_settings WHERE setting_key = 'maintenance_mode' LIMIT 1"
      );
      isOn = rows.length > 0 && rows[0].setting_value === '1';
      cache.set('maintenance_mode', isOn, 30); // cache 30 detik
    }
    if (isOn) {
      return res.status(503).render('frontend/maintenance', {
        title: 'Website Sedang Dalam Pemeliharaan'
      });
    }
    next();
  } catch (err) {
    next();
  }
};
