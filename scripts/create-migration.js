const fs = require('fs');
const path = require('path');

const migrationsDir = path.join(__dirname, '../migrations');

// Get existing migrations to calculate next number
const files = fs.readdirSync(migrationsDir)
  .filter(f => f.match(/^\d+.*\.sql$/))
  .sort();

const nextNumber = files.length + 1;
const nextNumberPadded = String(nextNumber).padStart(3, '0');

const fileName = `${nextNumberPadded}_new_migration.sql`;
const filePath = path.join(migrationsDir, fileName);

// Migration template
const template = `-- -------------------------------------------------------
-- Migration: [Describe your migration here]
-- Date: ${new Date().toISOString().split('T')[0]}
-- -------------------------------------------------------

-- Example: CREATE TABLE
-- CREATE TABLE IF NOT EXISTS \`table_name\` (
--   \`id\` INT UNSIGNED NOT NULL AUTO_INCREMENT,
--   \`column1\` VARCHAR(255) NOT NULL,
--   \`created_at\` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY (\`id\`)
-- ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
`;

fs.writeFileSync(filePath, template);
console.log(`✅ Migration file created: ${fileName}`);
