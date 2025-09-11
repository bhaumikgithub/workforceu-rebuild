// scripts/apply-migrations.js
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'wfu_rebuild';
const MIGRATIONS_DIR = path.join(__dirname, '..', 'migrations');

async function applyMigrations() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true, // allow executing multiple statements in one query
  });

  // Ensure _migrations table exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(191) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Read all migration files
  const files = fs.readdirSync(MIGRATIONS_DIR).filter(f => f.endsWith('.sql'));
  files.sort(); // ensure migrations are applied in order

  for (const file of files) {
    // Check if this migration has already been applied
    const [rows] = await connection.query('SELECT * FROM _migrations WHERE filename = ?', [file]);
    if (rows.length > 0) {
      console.log(`Skipping already applied migration: ${file}`);
      continue;
    }

    const filePath = path.join(MIGRATIONS_DIR, file);
    const sql = fs.readFileSync(filePath, 'utf-8');

    try {
      console.log(`Applying migration: ${file}`);
      await connection.query(sql);

      // Mark migration as applied
      await connection.query('INSERT INTO _migrations (filename) VALUES (?)', [file]);

      console.log(`Migration applied successfully: ${file}`);
    } catch (err) {
      console.error(`Error applying migration ${file}:`, err);
      process.exit(1); // stop on first failure
    }
  }

  await connection.end();
  console.log('All migrations applied!');
}

applyMigrations();
