import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

// Pfade durchsuchen!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const dbPath = path.resolve(__dirname, '../db/database.db');
const db = new Database(dbPath);


// Tabellen erstellen, falls nicht vorhanden

db.prepare(`
    CREATE TABLE IF NOT EXISTS euromillions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        h1 INTEGER NOT NULL,
        h2 INTEGER NOT NULL,
        h3 INTEGER NOT NULL,
        h4 INTEGER NOT NULL,
        h5 INTEGER NOT NULL,
        z1 INTEGER NOT NULL,
        z2 INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    
    `).run();

// Tabelle für joker

db.prepare(`
    CREATE TABLE IF NOT EXISTS joker (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        joker_number TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`).run();

console.log('--- SQLite Datenbank erfolgreich initialisiert ---');
export default db;
