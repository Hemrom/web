const db = require('../config/database');

module.exports = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      "SELECT setting_value FROM website_settings WHERE setting_key = 'maintenance_mode' LIMIT 1"
    );
    const isOn = rows.length > 0 && rows[0].setting_value === '1';
    if (isOn) {
      return res.status(503).render('frontend/maintenance', {
        title: 'Website Sedang Dalam Pemeliharaan'
      });
    }
    next();
  } catch (err) {
    next(); // jika error DB, tetap lanjut
  }
};
