/**
 * download-fonts.js
 * Download font Inter (woff2) dari bunny.net ke folder lokal.
 * Jalankan SEKALI di VPS: node scripts/download-fonts.js
 */
const https = require('https');
const fs    = require('fs');
const path  = require('path');

const FONTS_DIR = path.join(__dirname, '..', 'assets', 'fonts');

// Font Inter dari bunny.net (privacy-friendly, sama persis dengan Google Fonts)
const FONTS = [
  { weight: 400, url: 'https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff2',  out: 'inter-400.woff2' },
  { weight: 500, url: 'https://fonts.bunny.net/inter/files/inter-latin-500-normal.woff2',  out: 'inter-500.woff2' },
  { weight: 600, url: 'https://fonts.bunny.net/inter/files/inter-latin-600-normal.woff2',  out: 'inter-600.woff2' },
  { weight: 700, url: 'https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff2',  out: 'inter-700.woff2' },
  { weight: 800, url: 'https://fonts.bunny.net/inter/files/inter-latin-800-normal.woff2',  out: 'inter-800.woff2' },
  { weight: 900, url: 'https://fonts.bunny.net/inter/files/inter-latin-900-normal.woff2',  out: 'inter-900.woff2' },
];

if (!fs.existsSync(FONTS_DIR)) fs.mkdirSync(FONTS_DIR, { recursive: true });

function download(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) { console.log(`  ⏭  ${path.basename(dest)} sudah ada`); return resolve(); }
    const file = fs.createWriteStream(dest);
    https.get(url, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        file.close();
        fs.unlinkSync(dest);
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', err => { fs.unlinkSync(dest); reject(err); });
  });
}

async function run() {
  console.log(`📁 Folder font: ${FONTS_DIR}\n`);
  for (const f of FONTS) {
    const dest = path.join(FONTS_DIR, f.out);
    process.stdout.write(`  Downloading inter-${f.weight}.woff2 ... `);
    try {
      await download(f.url, dest);
      const size = fs.statSync(dest).size;
      console.log(`✅ (${(size/1024).toFixed(1)} KB)`);
    } catch(e) {
      console.log(`❌ ${e.message}`);
    }
  }
  console.log('\n✅ Selesai! Font siap dipakai secara lokal.');
  console.log('   Restart server tidak diperlukan.');
}

run();
