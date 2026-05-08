const fs = require('fs');
const path = require('path');

const ekstras = [
  { name: 'pramuka', label: 'PRAMUKA', color: 'success' },
  { name: 'olahraga', label: 'OLAHRAGA', color: 'primary' },
  { name: 'paskibraka', label: 'PASKIBRAKA', color: 'danger' },
  { name: 'seni', label: 'SENI', color: 'pink' },
  { name: 'bahasa-asing', label: 'BAHASA ASING', color: 'info' },
  { name: 'rohis', label: 'ROHIS', color: 'success' },
  { name: 'pmr', label: 'PMR', color: 'danger' }
];

const files = ['index.ejs', 'create.ejs', 'edit.ejs', 'berita.ejs', 'berita-create.ejs', 'berita-edit.ejs', 'galeri.ejs'];

ekstras.forEach(ekstra => {
  const targetDir = `views/admin/${ekstra.name}`;
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });
  
  files.forEach(file => {
    const sourceFile = `views/admin/osis/${file}`;
    const targetFile = `${targetDir}/${file}`;
    
    if (!fs.existsSync(sourceFile)) {
      console.log(`⚠️  Source file not found: ${sourceFile}`);
      return;
    }
    
    let content = fs.readFileSync(sourceFile, 'utf8');
    
    // Replace OSIS dengan nama ekstra
    content = content.replace(/osis/g, ekstra.name);
    content = content.replace(/OSIS/g, ekstra.label);
    content = content.replace(/warning/g, ekstra.color);
    
    fs.writeFileSync(targetFile, content);
    console.log(`✅ Created ${targetFile}`);
  });
});

console.log('\n✅ All views copied and customized!');
console.log('\nNow add routes and controllers manually:');
console.log('1. Copy content from admin_routes_generated.txt to routes/admin.js (after OSIS routes)');
console.log('2. Read admin_controllers_generated.txt in chunks and add to controllers/portalController.js');
