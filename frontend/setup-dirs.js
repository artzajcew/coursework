const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components',
  'src/pages',
  'src/services',
];

dirs.forEach(dir => {
  const fullPath = path.join(__dirname, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
});

console.log('Directories created successfully');
