import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Pfade durchsuchen!
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// FIX: DB_DIR erstellen
const __dbDir = path.resolve(__dirname, '../db');

if (!fs.existsSync(__dbDir)) {
    fs.mkdirSync(__dbDir, { recursive: true });
}



const dbPath = path.resolve(__dbDir, 'database.db');
const db = new Database(dbPath);


// Tabellen erstellen, falls nicht vorhanden
// Euromillionen

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
        ziehungstag TEXT ,
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
