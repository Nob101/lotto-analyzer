
// Funktion zum Aufteilen des Zahlen-Arrays in 5er-Folgen basierend auf aufsteigender Reihenfolge
export function splitSequences(arr) {
  const sequences = [];
  let start = 0;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) {
      sequences.push(arr.slice(start, i));
      start = i;
    }
  }
  sequences.push(arr.slice(start));
  return sequences;
}

// Analyse der Häufigkeit einzelner Zahlen in allen 5er-Folgen
export function analyzeNumberFrequency(sequences) {
  const numFreq = {};
  sequences.forEach(seq => {
    if (seq.length === 5) {
      seq.forEach(num => {
        numFreq[num] = (numFreq[num] || 0) + 1;
      });
    }
  });
  return numFreq;
}



// Analyse der Frequenz der 2er-Kombinationen jeder 5er-Folge

export function analyzeSequences(sequences) {
  const comboFreq = {};
  // Prüfen ob es eine 5erfolge ist oder nicht
  sequences.forEach(seq => {
    if (seq.length === 5) {
      // Erzeuge alle 2er Paare (ohne Reihenfolge) aus der 5er-Folge
      for (let i = 0; i < seq.length - 1; i++) {
        for (let j = i + 1; j < seq.length; j++) {
          const a = seq[i];
          const b = seq[j];
          // Sortieren für konsistente Schlüssel (z.B. "2,5" statt "5,2")
          const pairKey = a < b ? `${a} | ${b}` : `${b} | ${a}`;
          comboFreq[pairKey] = (comboFreq[pairKey] || 0) + 1;
        }
      }
    }
  });
  return comboFreq;
}


// 3er combi

// Gleich wie 2ercombo aber 3 schleifen
export function analyze3ComboFrequency(sequences){
  const combo3Freq = {};
  sequences.forEach(seq => {
    if(seq.length === 5){
      // 3er Kombi erzeugen aus der 5er folge
      for(let i = 0; i < seq.length -2; i++){
        for(let j = i+1 ; j < seq.length -1; j++){
          for(let k = j +1; k <seq.length; k++){
            const deltaValue = [seq[i], seq[j], seq[k]];
            // Sortieren [bubble]
            deltaValue.sort((a, b) => a-b);
            const comboKey = deltaValue.join(' | ');
            combo3Freq[comboKey] = (combo3Freq[comboKey] || 0) +1;
          }
        }
      }
    }
  });
  return combo3Freq;
}



// ---------------------------------------  


// Anzeige der häufigsten Kombinationen UND der 2 häufigsten Zahlen im HTML
export function displayComboFreqAndTopNumbers(freqMap, combo3Freq, numFreq) {
  const outputDiv = document.getElementById('comboOutput');
  if (!outputDiv) return;

  // Sortierte 2er-Kombinationen
  const sortedCombos = Object.entries(freqMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const sortedCombos3 = Object.entries(combo3Freq)
  .sort((a, b) => b[1]-a[1])
  .slice(0, 10)


  outputDiv.innerHTML = 
  `
    <h2><span class="red">Häufigste</span> 2er-Kombinationen in <span class="blue">5er-Folgen</span></h2>
    <ul>
      ${sortedCombos
        .map(([combo, count]) => 
          `<li>Kombination <span class="red">${combo}</span> kam <span class="blue">${count}</span> mal vor</li>`
        ).join('')}
    </ul>
    <h2><span class="red">Häufigste</span> 3er-Kombinationen in <span class="blue">5er-Folgen</span></h2>
    <ul>
      ${sortedCombos3
        .map(([combo, count]) => 
          `<li>Kombination <span class="orange">${combo}</span> kam <span class="blue">${count}</span> mal vor</li>`
        ).join('')}
    </ul>
  `;
}






// ---------------------------------------------



// Hauptfunktion zur Analyse und Anzeige
export function analyzeAndDisplayNumberSequences(zahlen) {
  if (!Array.isArray(zahlen)) {
    console.error("Fehler: zahlen ist kein Array.", zahlen);
    return;
  }
  zahlen = zahlen.map(num => typeof num === 'string' ? parseInt(num, 10) : num);

  if (!zahlen.every(num => typeof num === 'number' && !isNaN(num))) {
    console.error("Fehler: zahlen enthält ungültige Werte.", zahlen);
    return;
  }

  if (zahlen.length < 5) {
    console.warn("Nicht genügend Zahlen für die Analyse:", zahlen);
    return;
  }

  const sequences = splitSequences(zahlen);
  const freqMap = analyzeSequences(sequences);
  const freqMap3 = analyze3ComboFrequency(sequences);
  const numFreq = analyzeNumberFrequency(sequences);
  displayComboFreqAndTopNumbers(freqMap, freqMap3, numFreq);
}


