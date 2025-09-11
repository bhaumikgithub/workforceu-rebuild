const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');
const latestFile = path.join(migrationsDir, 'latest.sql');

// Get all numbered migration files in order
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.match(/^\d+.*\.sql$/))
  .sort();

let content = '';
files.forEach(file => {
  const fileContent = fs.readFileSync(path.join(migrationsDir, file), 'utf8');
  content += `\n-- ${file}\n${fileContent}\n`;
});

// Write to latest.sql
fs.writeFileSync(latestFile, content);
console.log('latest.sql updated!');
