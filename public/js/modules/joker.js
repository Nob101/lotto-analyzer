// die History verwaltet  im RAM, befüllt wird sie via API aus der DB  !   Wechsel zu DB   !
let sixDigitHistory = [];

/**
 * NEW: Nimmt die frischen Daten aus der SQLite-Datenbank entgegen 
 * und mappt sie in ein flaches Array für die Analyse-Schleifen.
 */
export function setJokerHistory(data) {
    // Extrahiert das Textfeld 'joker_number' aus den Zeilenobjekten der DB
    sixDigitHistory = data.map(row => row.joker_number);
}

/**
 * WICHTIG: Erlaubt das temporäre Hinzufügen einer Zahl im lokalen Zustand
 */
export function addLocalNumber(number) {
    sixDigitHistory.push(number);
}

/**
 * Führt die  mathematische Analyse der Joker-Zahlen durch 
 * und rendert das Ergebnis direkt ins HTML-Dokument.
 */
export function analyzeSixDigitHistory() {

    //  Jackpot-Auswertung (Ganze 6 Richtige vergleichen)
    const jackPot = {};
    sixDigitHistory.forEach(number => {
        const combo = number.slice(0);
        jackPot[combo] = (jackPot[combo] || 0) + 1;
    });

    //  Kombinationen der letzten drei Ziffern
    const comboFreq = {};
    sixDigitHistory.forEach(number => {
        const combo = number.slice(3); // Endziffern ab Stelle 3
        comboFreq[combo] = (comboFreq[combo] || 0) + 1;
    });

    // Kombinationen der letzten zwei Ziffern
    const doubleFreq = {};
    sixDigitHistory.forEach(number => {
        const combo = number.slice(4);  // Endziffern ab Stelle 4
        doubleFreq[combo] = (doubleFreq[combo] || 0) + 1;
    });

    // Häufigkeit der allerletzten Ziffer
    const singleFreq = {};
    sixDigitHistory.forEach(number => {
        const combo = number.slice(5); // Letzte Ziffer
        singleFreq[combo] = (singleFreq[combo] || 0) + 1;
    });

            // Sortierung und Limitierung für die Top-Anzeigewerte
            const jackOutput = Object.entries(jackPot).sort((a, b) => b[1] - a[1]).slice(0, 3);
            const sortedCombos = Object.entries(comboFreq).sort((a, b) => b[1] - a[1]).slice(0, 8);
            const sortedDouble = Object.entries(doubleFreq).sort((a, b) => b[1] - a[1]).slice(0, 9);
            const sortedSingles = Object.entries(singleFreq).sort((a, b) => b[1] - a[1]);

    //FIX: HTML Container validieren und befüllen
    const outputSixDiv = document.getElementById('joker-guesser');
    if (!outputSixDiv) return;

    outputSixDiv.innerHTML = `
        <h3>Häufigste Kombinationen </h3>
        <ul class="highlighted">
            ${jackOutput.map(([combo, freq]) => `<li>Kombi <span class="blue">${combo}</span> kam <span class="red">${freq}</span> mal vor</li>`).join('')}
        </ul>
        <ul class="highlighted">
            ${sortedCombos.map(([combo, freq]) => `<li>Kombi <span class="blue">${combo}</span> kam <span class="red">${freq}</span> mal vor</li>`).join('')}
        </ul>
        <ul class="highlighted">
            ${sortedDouble.map(([combo, freq]) => `<li>Kombi <span class="blue">${combo}</span> kam <span class="red">${freq}</span> mal vor</li>`).join('')}
        </ul>
        <ul class="highlighted">
            ${sortedSingles.map(([combo, freq]) => `<li>Zahl <span class="blue">${combo}</span> kam <span class="red">${freq}</span> mal vor</li>`).join('')}
        </ul>
    `;
}


// NEW: letzen 6 Joker Einträge

export function getLastSixJokerNumbers(){
    return sixDigitHistory.slice(-6).reverse();
}

