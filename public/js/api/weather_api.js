

export function ladeWetter(){
// Koordinaten

const cities = [
    {name: "Wien", lat: 48.2082, lon: 16.3738 },
     {name: "Graz", lat: 47.0707, lon: 15.4395},
      {name: "Salzburg", lat: 47.8095, lon: 13.0550},
       {name: "Innsbruck", lat: 47.2692, lon: 11.4041},
        {name: "Stegersbach", lat: 47.1667, lon: 16.1667},
         {name: "New York City", lat: 40.7127, lon: -74.0059}  //minus fehlte-_-
];

const container = document.getElementById("wetter-container");

// Mit schleife das Wetter für jede Stadt abrufen

cities.forEach(city => {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current_weather=true`)
        .then(res => {
            //FIX: Falls die API wieder blockiert oder einen Fehler wirft-> Abbruch
            if (!res.ok) {
                throw new Error(`API-Fehler: Status ${res.status}`);
            }
            return res.json();
        })
        .then(data => {
            // NEW: Sicherheitscheck -> Gibt es die Wetterdaten überhaupt im Res.?
            if (!data || !data.current_weather) {
                throw new Error("Unerwartetes Datenformat von der API erhalten.");
            }

            const w = data.current_weather;

            let localTime = "";
    
            if (city.name === "Wien") {
                localTime = new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" });

            } else if (city.name === "New York City") {
                localTime = new Date().toLocaleString("en-US", { timeZone: "America/New_York" });
            }

            const card = document.createElement('div');
            card.className = 'wetter-card';
            card.innerHTML = `
                <h3>${city.name}</h3>
                <p>${w.temperature} °C</p>
                <p>Wind: ${w.windspeed} km/h</p>
                ${localTime ? `<p>Ortszeit: ${localTime}</p>` : ""}
            `;
            container.appendChild(card);
        })
        .catch(err => {
            // Hier landen ab jetzt alle Fehler (zB Netzwerkfehler)
            console.error(`Fehler bei ${city.name}:`, err.message);
            
            //NEW: :  eine Fehlermeldung auf der UI (Besser als ncihst zu zeigen)
            const card = document.createElement('div');
            card.className = 'wetter-card fehler';
            card.innerHTML = `<h3>${city.name}</h3><p>Wetterdaten derzeit nicht verfügbar.</p>`;
            container.appendChild(card);
        });
})}
