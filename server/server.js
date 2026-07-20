

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





// NEW: Server deaktivieren über Browserfenster 
let lastPing = Date.now();
let isBrowserOpen = false;

app.post('/api/keep-alive', (req, res) => {
    lastPing = Date.now();
    isBrowserOpen = true;
    res.sendStatus(200);
});

setInterval(() => {
    if (isBrowserOpen && (Date.now() - lastPing > 8000)) {
        console.log("Browser-Fenster geschlossen. Server wird heruntergefahren....");
        process.exit(0);
    }
}, 3000);





// Server starten
app.listen(PORT, () => {
    console.log(` Server läuft auf: http://localhost:${PORT}....Browser wird geöffnet`);
});


