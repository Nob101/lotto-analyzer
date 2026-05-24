import db from '../config/db.js';

// --- EUROMILLIONEN CONTROLLER ---

// NEW: Alle Euromillionen-Zahlen aus der DB holen
export const getEuromillionsHistory = (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM euromillions ORDER BY id ASC').all();
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Holen der Euromillionen-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};

// FIX: Eine neue Euromillionen-Ziehung speichern (Pfad fehlte zum Frontend)
// -
export const saveEuromillionsDraw = (req, res) => {
    try {
        const { haupt, zusatz, ziehungstag } = req.body; // Erwartet Arrays, z.B. haupt: [5,12,23,...], zusatz: [2,7]

        if (!haupt || haupt.length !== 5 || !zusatz || zusatz.length !== 2) {
            return res.status(400).json({ error: 'Ungültiges Zahlenformat. Erwartet werden 5 Haupt- und 2 Zusatzzahlen.' });
        }

        const insert = db.prepare(`
            INSERT INTO euromillions (h1, h2, h3, h4, h5, z1, z2, ziehungstag)
            VALUES (?, ?, ?, ?, ?, ?, ?,?)
        `);

        insert.run(haupt[0], haupt[1], haupt[2], haupt[3], haupt[4], zusatz[0], zusatz[1], ziehungstag);

        res.status(201).json({ message: 'Ziehung erfolgreich gespeichert!' });
    } catch (error) {
        console.error('Fehler beim Speichern der Euromillionen-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};





// -- JOKER CONTROLLER ---

// NEU: Alle Joker-Nummern aus der DB holen
export const getJokerHistory = (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM joker ORDER BY id ASC').all();
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Holen der Joker-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};

//  Eine neue Joker-Nummer speichern (Wie Oben)
export const saveJokerNumber = (req, res) => {
    try {
        const { joker_number } = req.body;

        if (!joker_number || !/^\d{6}$/.test(joker_number)) {
            return res.status(400).json({ error: 'Ungültige Joker-Zahl. Muss genau 6-stellig sein.' });
        }

        const insert = db.prepare('INSERT INTO joker (joker_number) VALUES (?)');
        insert.run(joker_number);

        res.status(201).json({ message: 'Joker-Zahl erfolgreich gespeichert!' });
    } catch (error) {
        console.error('Fehler beim Speichern der Joker-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};


