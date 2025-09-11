const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || '';
const DB_NAME = process.env.DB_NAME || 'wfu_rebuild';

async function applyMigrations() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    multipleStatements: true
  });

  // Create _migrations table if not exists
  await connection.query(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(191) NOT NULL UNIQUE,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);

  const migrationDir = path.join(__dirname, '../migrations/sql');
  const files = fs.readdirSync(migrationDir).filter(f => f.endsWith('.sql')).sort();

  for (const file of files) {
    const [rows] = await connection.query(
      'SELECT * FROM _migrations WHERE filename = ?',
      [file]
    );

    if (rows.length > 0) {
      console.log(`Already applied: ${file}`);
      continue;
    }

    const filePath = path.join(migrationDir, file);
    const sql = fs.readFileSync(filePath, 'utf8');

    try {
      await connection.query(sql);
      await connection.query(
        'INSERT INTO _migrations (filename) VALUES (?)',
        [file]
      );
      console.log(`Applied: ${file}`);
    } catch (err) {
      console.error(`Failed: ${file}`, err.message);
      break;
    }
  }

  await connection.end();
  console.log('All migrations applied!');
}

applyMigrations().catch(err => console.error(err));
