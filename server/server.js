

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './config/db.js'; // Importiert  DB-Setup!

// NEW:  Controller-Funktionen importieren
import { 
    getEuromillionsHistory, 
    saveEuromillionsDraw, 
    getJokerHistory, 
    saveJokerNumber,
} from './controllers/lotteryControllers.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware, um JSON-Daten vom Frontend verarbeiten zu können (einfacher)
app.use(express.json());

// Statische Dateien aus dem "public" Ordner bereitstellen
app.use(express.static(path.join(__dirname, '../public')));

// API endpunkte !!
// Euromillionen
app.get('/api/euromillions', getEuromillionsHistory);
app.post('/api/euromillions', saveEuromillionsDraw);


// Joker
app.get('/api/joker', getJokerHistory);
app.post('/api/joker', saveJokerNumber);



/* 
app.get('/api/test', (req, res) => {
     res.json({ message: "Server und Datenbank laufen!" });
 }); 
 */

// Server starten
app.listen(PORT, () => {
    console.log(` Server läuft auf: http://localhost:${PORT}`);
});

