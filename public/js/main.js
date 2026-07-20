
// NEu: Clean code --- new structure

import { randomGuesser } from "./utils/randomCreater.js";
import { ladeWetter } from "./api/weather_api.js";
import * as Joker from "./modules/joker.js";
import * as Analyze from "./modules/analyze.js";

// --- SELEKTOREN ---
const digitForm = document.querySelector('#main');
const outputDiv = document.getElementById('output');
const hauptZahlen = document.getElementById('zahlen');
const zusatzZahlen = document.getElementById('zz');

// Neu: Selektoren für Euromil. | Joker | Lotto 6 aus 45
const lottoForm = document.querySelector('#lotto-main');
const lottoHauptZahlenContainer = document.getElementById('lotto-zahlen');
const lottoComboOutput = document.getElementById('lotto-comboOutput');

const navEuromillionen = document.getElementById('nav-euromillionen');
const navJoker = document.getElementById('nav-joker');
const navLotto = document.getElementById('nav-lotto');

const sectionEuromillionen = document.getElementById('section-euromillionen');
const sectionJoker = document.getElementById('section-joker');
const sectionLotto = document.getElementById('section-lotto');

let zahlen = [];
let zz = [];

// --- INITIALISIERUNG DER DYNAMISCHEN FELDER ---

// Felder für Euromillionen (5 Hauptzahlen)
createInputFields(hauptZahlen, 5, 'haupt');
createInputFields(zusatzZahlen, 2, 'zusatz');

// Felder für Lotto 6 aus 45 (6 Hauptzahlen)
if (lottoHauptZahlenContainer) {
    createInputFields(lottoHauptZahlenContainer, 6, 'lotto-haupt');

    // Zusatzzahl manuell anhängen 
    const zzLabel = document.createElement('label');
    const zzInput = document.createElement('input');
        zzInput.type = 'number';
        zzInput.id = 'lotto-zz';
        zzInput.min = 1;
        zzInput.max = 45;
        zzInput.required = true;
        zzLabel.htmlFor = zzInput.id;
        zzLabel.textContent = ' Zusatzzahl:';

    lottoHauptZahlenContainer.appendChild(zzLabel);
    lottoHauptZahlenContainer.appendChild(zzInput);
}

// Same: Hilfsvalidierung

function createInputFields(container, count, prefix) {
    if (!container) return;
    for (let i = 1; i <= count; i++) {
        const label = document.createElement('label');
        const input = document.createElement('input');

        input.type = 'number';
        input.id = `${prefix}${i}`;
        input.min = 1;
        input.max = prefix === 'haupt' ? 50 : (prefix === 'zusatz' ? 12 : 45);
        input.required = true;

        label.htmlFor = input.id;
        label.textContent = `Zahl ${i}:`;

        container.appendChild(label);
        container.appendChild(input);
    }
}

function findTopFrequentNumbers(arr, topN = 7) {
    const frequencyMap = {};
    arr.forEach(num => { frequencyMap[num] = (frequencyMap[num] || 0) + 1; });
    const frequencyArray = Object.entries(frequencyMap);
    frequencyArray.sort((a, b) => b[1] - a[1]);
    const topFrequentNumbers = frequencyArray.slice(0, topN);
    topFrequentNumbers.sort((a, b) => a[0] - b[0]);
    return topFrequentNumbers;
}

//  DATA-LOADER DB

async function loadJokerDataAndAnalyze() {
    try {
        const response = await fetch('/api/joker');
        if (!response.ok) throw new Error('Fehler beim Laden der Joker-Daten');
        const rows = await response.json();

            console.log("---Letzten 5 Joker-Ziehungen---");
            console.table(rows.slice(-5).reverse());

        Joker.setJokerHistory(rows);
        Joker.analyzeSixDigitHistory();
    } catch (error) {
        console.error('Fehler beim Laden der Joker-Daten:', error);
    }
}

async function loadDataAndAnalyze() {
    try {
        const response = await fetch('/api/euromillions');
        if (!response.ok) throw new Error('Fehler beim Laden aus der DB');
        const rows = await response.json();

            console.log("---Letzten 5 Euromillionen-Ziehungen---");
            console.table(rows.slice(-5).reverse());

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

// NEW: Lotto analyzer
async function loadLottoDataAndAnalyze() {
    try {
        const response = await fetch('/api/lotto');
        if (!response.ok) throw new Error('Fehler beim Laden der Lotto-Daten aus der DB');
        
       const rows = await response.json();
        if (!Array.isArray(rows) || rows.length === 0) return;   //JAVA


            console.log("---Letzten 5 Lotto 6 aus 45-Ziehungen---");
            console.table(rows.slice(-5).reverse());

        // Arrays für die Häufigkeitsanalyse sammeln
        let lottoZahlen = [];
        let lottoZZ = [];

        rows.forEach(row => {
            lottoZahlen.push(row.h1, row.h2, row.h3, row.h4, row.h5, row.h6);
            lottoZZ.push(row.zz);
        });

        // Statistische Langzeitauswertung berechnen (nutzt deine findTopFrequentNumbers Funktion)
        const anzahlZiehungen = rows.length;
        const topHauptzahlen = findTopFrequentNumbers(lottoZahlen);
        const topZusatzzahlen = findTopFrequentNumbers(lottoZZ);

        if (lottoComboOutput) {
            lottoComboOutput.innerHTML = `
                Von insgesamt <span class="blue">${anzahlZiehungen}</span> Ziehungen <br><br>  
                kamen folgende Zahlen am häufigsten vor: <br><br> 
                <span class="ichigo">Hauptzahlen:</span> <span class="green">${topHauptzahlen.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span><br>
                <span class="ichigo">Zusatzzahlen:</span> <span class="red">${topZusatzzahlen.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span><br><br>
            `;
        }

                const freqMap2 = Analyze.analyzeLottoSequences(rows);
                const freqMap3 = Analyze.analyzeLotto3ComboFrequency(rows);
                Analyze.displayLottoCombos(freqMap2, freqMap3, anzahlZiehungen);


    } catch (error) {
        console.error('Fehler beim Laden der Lotto-Historie:', error);
    }
}

function analyzeNumbers() {
    if (!outputDiv) return;
    const anzahl = zz.length / 2; 
    const result = findTopFrequentNumbers(zahlen);
    const result2 = findTopFrequentNumbers(zz);

    outputDiv.innerHTML = `
        Von insgesamt <span class="blue">${anzahl}</span> Ziehungen <br><br>  
        kamen folgende Zahlen am häufigsten vor: <br><br> 
        <span class="ichigo">Hauptzahlen:</span> <span class="green">${result.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span><br>
        <span class="ichigo">Zusatzzahlen:</span> <span class="red">${result2.map(entry => `${entry[0]}(${entry[1]})`).join(' - ')}</span><br><br>
    `;
}



// --- EVENT LISTENER (SUBMITS) ---

// Euromillionen 
digitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const neueHauptzahlen = [];
    const neueZusatzzahlen = [];
    let isValid = true;
    const ziehungsTag = document.getElementById('ziehungstag').value || null;

    for (let i = 1; i <= 5; i++) {
        const wert = parseInt(document.getElementById(`haupt${i}`).value);
        if (wert >= 1 && wert <= 50) neueHauptzahlen.push(wert); else isValid = false;
    }
    for (let i = 1; i <= 2; i++) {
        const wert = parseInt(document.getElementById(`zusatz${i}`).value);
        if (wert >= 1 && wert <= 12) neueZusatzzahlen.push(wert); else isValid = false;
    }

    if (new Set(neueHauptzahlen).size !== neueHauptzahlen.length) {
        alert("Fehler: Du darfst keine Hauptzahl doppelt eingeben!");
        return;
    }

    if (isValid) {
        try {
            const response = await fetch('/api/euromillions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ haupt: neueHauptzahlen, zusatz: neueZusatzzahlen, ziehungstag: ziehungsTag })
            });
            if (!response.ok) throw new Error('Fehler beim Speichern');
            digitForm.reset();
            await loadDataAndAnalyze();
        } catch (error) {
            alert("Fehler beim Speichern in die Datenbank.");
        }
    }
});

// Joker 
const analyzeSixBtn = document.getElementById('analyzeSixBtn');
const sixDigitInput = document.getElementById('sixDigitInput');
if (analyzeSixBtn) {
    analyzeSixBtn.addEventListener('click', async (e) => {
        e.preventDefault(); 
        const inputValue = sixDigitInput.value.trim();
        if (/^\d{6}$/.test(inputValue)) {
            try {
                const response = await fetch('/api/joker', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ joker_number: inputValue })
                });
                if (!response.ok) throw new Error('Fehler beim Speichern');
                sixDigitInput.value = '';
                await loadJokerDataAndAnalyze();
            } catch (error) {
                alert("Fehler beim Speichern der Joker-Zahl.");
            }
        } else {
            alert("Bitte gib eine gültige 6-stellige Zahl ein.");
        }
    });
}

// NEU: Lotto 6 aus 45 (Kommunikation mit dem Java-Backend) --Practice
if (lottoForm) {
    lottoForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const neueHauptzahlen = [];
        const ziehungsTag = document.getElementById('lotto-ziehungstag').value || null;
        let isValid = true;

        for (let i = 1; i <= 6; i++) {
            const wert = parseInt(document.getElementById(`lotto-haupt${i}`).value);
            if (wert >= 1 && wert <= 45) neueHauptzahlen.push(wert); else isValid = false;
        }

        const zusatzZahl = parseInt(document.getElementById('lotto-zz').value);
        if (isNaN(zusatzZahl) || zusatzZahl < 1 || zusatzZahl > 45) isValid = false;

        const alleZahlen = [...neueHauptzahlen, zusatzZahl];
        if (new Set(alleZahlen).size !== alleZahlen.length) {
            alert("Fehler: Alle Zahlen inklusive der Zusatzzahl müssen einzigartig sein!");
            return;
        }

        if (isValid) {
            try {
                const response = await fetch('/api/lotto', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ haupt: neueHauptzahlen, zz: zusatzZahl, ziehungstag: ziehungsTag })
                });


    // --- DIAGNOSE-START ---
    //     const rawText = await response.text();
    //     console.log("Status-Code vom Server:", response.status);
    //     console.log("Rohe Antwort vom Server (auch bei Fehler 500):", rawText);
    // --- DIAGNOSE-ENDE ---

                if (!response.ok) throw new Error('Fehler bei der Java-Berechnung');
                    lottoForm.reset();
                    await loadLottoDataAndAnalyze();
                
            } catch (error) {
                console.error("Abgefangener Fehler im JS: ",error);
                alert("Fehler beim Verarbeiten der Lotto-Daten im Backend.");
            }
        } else {
            alert("Bitte überprüfe deine Eingaben (Zahlen von 1-45).");
        }
    });
}


//  Reiter Toggle Logik
const navItems = [
    { nav: navEuromillionen, sec: sectionEuromillionen },
    { nav: navJoker, sec: sectionJoker },
    { nav: navLotto, sec: sectionLotto }
];

navItems.forEach(item => {
    if (item.nav) {
        item.nav.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(i => {
                if (i.nav) i.nav.classList.remove('active');
                if (i.sec) i.sec.classList.remove('active');
            });
            item.nav.classList.add('active');
            if (item.sec) item.sec.classList.add('active');
        });
    }
});



// Shutdown-Logik: Sende alle 4 Sekunden ein signal an Express
function startHeartbeat() {
    setInterval(() => {
        fetch('/api/keep-alive', {
            method: 'POST'
        }).catch(()=> {
            // Falls Server nicht antwortet
            console.warn("Server nicht erreichbar. Heartbeat gestoppt.");
            clearInterval(heartbeatInterval);
        });
    }, 4000);
}







// INITIALISIERUNG
async function init() {
    await loadJokerDataAndAnalyze();
    await loadDataAndAnalyze();
    await loadLottoDataAndAnalyze();

    randomGuesser();
    ladeWetter();

    startHeartbeat();  //NEW
}

init();