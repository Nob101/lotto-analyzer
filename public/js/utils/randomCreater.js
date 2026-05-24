



let outPutList = document.getElementById('guesser');

export  function randomGuesser() {

    let newOutput = document.createElement('div');
    let usedNumbers = new Set();  //löscht dopplte einträge
    let zzUsedNumbers = new Set();

        let heading = document.createElement('h4');
        heading.className ='blue';
        heading.textContent = ` Zufallsgenerator Euromillionen`;
        newOutput.appendChild(heading);


    for (let i = 0; i < 3; i++) {
       
        
        let numbers = [];
        let zusatzzahlen = [];

      
        
        // 5 zahlen werden zufällig gesucht
        while (numbers.length < 5) {

          let random = Math.floor(Math.random() * 50) + 1;

          if (!usedNumbers.has(random)) {

              usedNumbers.add(random);
              numbers.push(random);
          }
        }

        // 2 zusatzzahlen und doppelter werte eliminieren
        while (zusatzzahlen.length < 2) {
            
            let zzRandom = Math.floor(Math.random() * 12) +1;

            if (!zzUsedNumbers.has(zzRandom)) {

                zzUsedNumbers.add(zzRandom);
               
                zusatzzahlen.push(zzRandom);
            }
        }
// debugger


         

        // sortieren der zahlen in den Arrays
        numbers.sort((a, b) => a - b);
        zusatzzahlen.sort((a, b) => a - b);



// console.log(numbers);
// console.log(zusatzzahlen);

        //  numbers and Zusatzzahlen to HTML
        let outPutList = document.createElement('div');
        outPutList.innerHTML =  
        `
         <br>
        <span class = "green" > ${numbers.join(' | ')} </span>  |  <span class = "red" > ${zusatzzahlen.join(' | ')} </span>
        `
        newOutput.appendChild(outPutList);
       
    }
   
    outPutList.appendChild(newOutput);
}


// randomGuesser();

// math random generiert einen wert zwischen 0 und 1   0-0,99
// mit *50 entsteht ein bereich zwischen 0 und 49,9999
// math floor rundet ab auf ganze zahlen  => 0-49
// und plus 1 erweitert den bereich auf 1-50;



