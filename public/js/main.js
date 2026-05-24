"use strict"

import { randomGuesser } from "./utils/randomCreater.js";
import { ladeWetter } from "./api/weather_api.js";
import * as Joker from "./modules/joker.js";
import * as Analyze from "./modules/analyze.js";

const digitForm = document.querySelector('#main');
const outputDiv = document.getElementById('output');
const hauptZahlen = document.getElementById('zahlen');
const zusatzZahlen = document.getElementById('zz');

let zahlen = [];
let zz = [];

// NEW: ASYNCHRONER JOKER GET-CALL
async function loadJokerDataAndAnalyze() {
    try {
        const response = await fetch('/api/joker');
        if (!response.ok) throw new Error('Fehler beim Laden der Joker-Daten aus der DB');
        
        const rows = await response.json();     // Liefert Array von Objekten [{id, joker_number}, ...]
        
        // Synchronisiert das Joker-Modul und startet die Berechnung
        Joker.setJokerHistory(rows);
        Joker.analyzeSixDigitHistory();
    } catch (error) {
        console.error('Fehler beim Laden der Joker-Daten:', error);
    }
}

// NEW: --- JOKER EVENT-LISTENER MIT ASYNC POST-CALL ---
const analyzeSixBtn = document.getElementById('analyzeSixBtn');
const sixDigitInput = document.getElementById('sixDigitInput');

analyzeSixBtn.addEventListener('click', async (e) => {
    e.preventDefault(); 
    const inputValue = sixDigitInput.value.trim();

    //BLEIBT: Regex-Prüfung: Exakt 6 Ziffern von 0-9
    if (/^\d{6}$/.test(inputValue)) {
        try {
            // Schickt die 'Joker-Zahl' als JSON an das Express-Backend
            const response = await fetch('/api/joker', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ joker_number: inputValue })
            });

            if (!response.ok) throw new Error('Fehler beim Speichern der Joker-Zahl in der DB');

            sixDigitInput.value = ''; //WICHTIG: Input-Feld bei Erfolg leeren
            
            // Daten neu aus der DB holen und UI auffrischen
            await loadJokerDataAndAnalyze();

        } catch (error) {
            console.error('Joker Speicherfehler:', error);
            alert("Fehler beim Speichern der Joker-Zahl in die Datenbank.");
        }
    } else {
        alert("Bitte gib eine gültige 6-stellige Zahl ein (nur Ziffern 0-9).");
    }
});

//BLEIBT: Erstelle Eingabefelder dynamisch für das Euromillionen-Formular
function createInputFields(container, count, prefix) {
    if (!container) return;
    for (let i = 1; i <= count; i++) {
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'number';
        input.id = `${prefix}${i}`;
        input.min = 1;
        input.max = prefix === 'haupt' ? 50 : 12;           // Grenzen setzen (1-50 bzw. 1-12)
        input.required = true;

        label.htmlFor = input.id;
        label.textContent = `Zahl ${i}`;

        container.appendChild(label);
        container.appendChild(input);
    }
}

// Dynamischen Aufbau starten
createInputFields(hauptZahlen, 5, 'haupt');
createInputFields(zusatzZahlen, 2, 'zusatz');

// --- EUROMILLIONEN SUBMIT EVENT-LISTENER ---
digitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const neueHauptzahlen = [];
    const neueZusatzzahlen = [];
    let isValid = true;


    // NEW: Den ziehungstag optional mitschicken
    const ziehungsTag = document.getElementById('ziehungstag').value || null;

    // Hauptzahlen einlesen und validieren
    for (let i = 1; i <= 5; i++) {
        const wert = parseInt(document.getElementById(`haupt${i}`).value);
        if (wert >= 1 && wert <= 50) { 
            neueHauptzahlen.push(wert);
        } else { 
            isValid = false;
            break;
        }
    }

    // Zusatzzahlen einlesen und validieren
    for (let i = 1; i <= 2; i++) {
        const wert = parseInt(document.getElementById(`zusatz${i}`).value);
        if (wert >= 1 && wert <= 12) {
            neueZusatzzahlen.push(wert);
        } else { 
            isValid = false;
            break;
        }
    }

    //FEATURE: SICHERHEITS-CHECK: Verhindert doppelte Zahlenwerte innerhalb einer Ziehung
    const hatDubletten = new Set(neueHauptzahlen).size !== neueHauptzahlen.length;
    if (hatDubletten) {
        alert("Fehler: Du darfst keine Zahl doppelt eingeben!");
        return;
    }

    
    if (isValid) {
        try {
            // Sende neue Ziehung an das Backend
            const response = await fetch('/api/euromillions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ haupt: neueHauptzahlen, zusatz: neueZusatzzahlen, ziehungstag: ziehungsTag })
            });

            if (!response.ok) throw new Error('Fehler beim Speichern in die DB');

            digitForm.reset(); // Formular zurücksetzen
            await loadDataAndAnalyze(); // Daten neu laden

        } catch (error) {
            console.error('Speicherfehler:', error);
            alert("Fehler beim Speichern der Ziehung in die Datenbank.");
        }
    } else {
        alert("Bitte überprüfe deine Eingaben (Hauptzahlen 1-50, Zusatzzahlen 1-12).");
    }
});

// Hilfsfunktion: Berechnet die Top N der am häufigsten vorkommenden Zahlen
function findTopFrequentNumbers(arr, topN = 5) {
    const frequencyMap = {};
    arr.forEach(num => {
        frequencyMap[num] = (frequencyMap[num] || 0) + 1;
    });

    const frequencyArray = Object.entries(frequencyMap);
    frequencyArray.sort((a, b) => b[1] - a[1]);

    const topFrequentNumbers = frequencyArray.slice(0, topN);
    topFrequentNumbers.sort((a, b) => a[0] - b[0]);
    return topFrequentNumbers;
}

// Interne Analyse-Anzeige für Euromillionen
function analyzeNumbers() {
    if (!outputDiv) return;

    const anzahl = zz.length / 2; 
    const result = findTopFrequentNumbers(zahlen);
    const result2 = findTopFrequentNumbers(zz);

    outputDiv.innerHTML = `
        Von insgesamt <span class="blue">${anzahl}</span> Ziehungen 
        <br><br>  
        kamen folgende Zahlen am häufigsten vor: 
        <br><br> 
        <span class="ichigo">Hauptzahlen:</span> <span class="green">${result.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span>
        <br>
        <span class="ichigo">Zusatzzahlen:</span> <span class="red">${result2.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span>
        <br><br>
    `;
    
    const letzteHauptzahlen = zahlen.slice(-20); 
    const letzteZusatzzahlen = zz.slice(-8);

    for (let i = 0; i < letzteHauptzahlen.length; i += 5) {
        console.log(letzteHauptzahlen.slice(i, i + 5).join('  '));
    }

    for (let i = 0; i < letzteZusatzzahlen.length; i += 2) {
        console.log(letzteZusatzzahlen.slice(i, i + 2).join(' | '));
    }    

    // NEW: Joker Einträge in Konsolle ausgeben
    const lastJoker = Joker.getLastSixJokerNumbers();
    if(lastJoker.length === 0){
        console.log('Noch keine Joker-Einträge vorhanden');
    } else {
        console.log(lastJoker.join(' | '));
    }
}

// --- ASYNCHRONER EUROMILLIONEN GET-CALL ---
async function loadDataAndAnalyze() {
    try {
        const response = await fetch('/api/euromillions');
        if (!response.ok) throw new Error('Fehler beim Laden aus der DB');
        
        const rows = await response.json();

        // Arrays leeren und neu befüllen
        zahlen = [];
        zz = [];

        rows.forEach(row => {
            zahlen.push(row.h1, row.h2, row.h3, row.h4, row.h5);
            zz.push(row.z1, row.z2);
        });

        analyzeNumbers();
        Analyze.analyzeAndDisplayNumberSequences(zahlen);

    } catch (error) {
        console.error('Fehler beim Laden der DB-Daten:', error);
    }


}

// --- INITIALISIERUNG BEIM SEITENSTART ---
async function init() {
  
    // Datensätze parallel/nacheinander aus der  SQLite-DB ziehen
    await loadJokerDataAndAnalyze();
    await loadDataAndAnalyze();
    
    // Helfermodule starten
    randomGuesser();
    ladeWetter();
}

// Anwendung starten
init();