

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import db from './config/db.js';    // Importiert  DB-Setup!


// Controller-Funktionen 
import { 
    getEuromillionsHistory, 
    saveEuromillionsDraw, 
    getJokerHistory, 
    saveJokerNumber,
    // Java erweiterung
    getLottoHistory,  // NEU
    saveLottoDraw     // NEU
} from './controllers/lotteryControllers.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

//  Middleware, um JSON-Daten vom Frontend verarbeiten zu können 
// Statische Dateien aus dem "public" Ordner bereitstellen
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

//OLD: API endpunkte !!
// Euromillionen
app.get('/api/euromillions', getEuromillionsHistory);
app.post('/api/euromillions', saveEuromillionsDraw);

// Joker
app.get('/api/joker', getJokerHistory);
app.post('/api/joker', saveJokerNumber);

// NEW: API zu Java
app.get('/api/lotto', getLottoHistory);
app.post('/api/lotto', saveLottoDraw);

// Server starten
app.listen(PORT, () => {
    console.log(` Server läuft auf: http://localhost:${PORT}....Browser wird geöffnet`);
});


