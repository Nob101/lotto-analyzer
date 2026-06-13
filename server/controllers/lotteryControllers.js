import db from '../config/db.js';
import { exec } from 'child_process';  //NEU: für JAVA-erweiterung

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
// 
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



// NEU: für Java Erweiterung  (Practice for me ^-^)

export const getLottoHistory = (req, res) => {
    try {
        const rows = db.prepare('SELECT * FROM lotto_6_aus_45 ORDER BY id ASC').all();
       if (rows.length === 0) {
            return res.json([]);
        }

       const neuesteZiehung = rows[rows.length - 1];

        const javaArgs = [
            neuesteZiehung.h1, neuesteZiehung.h2, neuesteZiehung.h3, 
            neuesteZiehung.h4, neuesteZiehung.h5, neuesteZiehung.h6, 
            neuesteZiehung.zz
        ].join(' ');
        
        const cmd = `java -cp ./java-backend/bin Main ${javaArgs}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Java Exec Fehler bei GET: ${error}`);
                return res.json(rows); // Schickt das Array im Fehlerfall
            }

            try {
                const javaAnalysisResult = JSON.parse(stdout.trim());
                
                // Wir hängen das Java-Ergebnis an die neueste Ziehung an
                neuesteZiehung.analysis = javaAnalysisResult;

                // Wichtig: Wir schicken das pure Array zurück, genau wie bei den Euromillionen!
                return res.json(rows);
            } catch (parseError) {
                console.error('Fehler beim Parsen der Java-Ausgabe bei GET:', stdout);
                return res.json(rows);
            }
        });

    } catch (error) {
        console.error('Fehler beim Holen der Lotto-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};




// NEW: Lotto-Speicehrung und java analyse
export const saveLottoDraw = (req, res) => {
    try {
        const { haupt, zz, ziehungstag } = req.body; // FIX: Erwartet haupt: [1,2,3,4,5,6] und zz: 7

        if (!haupt || haupt.length !== 6 || !zz) {
            return res.status(400).json({ error: 'Ungültiges Zahlenformat. Erwartet werden 6 Hauptzahlen und 1 Zusatzzahl.' });
        }

        // Bleibt: In SQLite Datenbank wegsichern
        const insert = db.prepare(`
            INSERT INTO lotto_6_aus_45 (h1, h2, h3, h4, h5, h6, zz, ziehungstag)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insert.run(haupt[0], haupt[1], haupt[2], haupt[3], haupt[4], haupt[5], zz, ziehungstag);

        //  verbindung zu Java bauen
        //  alle Argumente (6 Hauptzahlen + 1 Zusatzzahl) wie joker
        const javaArgs = [...haupt, zz].join(' ');
        
        // Führt 'java -cp ./bin Main 1 2 3 4 5 6 7' aus
        const cmd = `java -cp ./java-backend/bin Main ${javaArgs}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`Java Exec Fehler: ${error}`);
                return res.status(500).json({ error: 'Fehler bei der Ausführung der Java-Analyse.' });
            }
            if (stderr) {
                console.error(`Java Stderr: ${stderr}`);
            }

            try {
                //Wichtig:  Das Java-Programm gibt ein JSON via System.out.println()
                const javaAnalysisResult = JSON.parse(stdout.trim());
                
                //  an das Frontend leiten
                res.status(201).json({
                    message: 'Lotto-Ziehung erfolgreich gespeichert und analysiert!',
                    analysis: javaAnalysisResult
                });
            } catch (parseError) {
                console.error('Fehler beim Parsen der Java-Ausgabe:', stdout);
                res.status(500).json({ error: 'Ungültiges Ausgabeformat von der Java-Analyse.' });
            }
        });

    } catch (error) {
        console.error('Fehler beim Speichern der Lotto-Daten:', error);
        res.status(500).json({ error: 'Interner Serverfehler' });
    }
};

// 