# «Guardati attorno»: l'app a mappa

## Come si apre
Serve la connessione, perché la mappa e la libreria Leaflet si caricano da internet. Dalla cartella `app`:

    python -m http.server 8080

Poi apri http://localhost:8080 nel browser. Dal PC conviene la vista telefono, che si attiva con F12 e poi Ctrl+Shift+M.

## Com'è fatta
- `app.js`: il codice, uguale per ogni paese. Contiene le categorie, la scheda del luogo, le prenotazioni, gli ordini, l'agenda, gli avvisi e il testo grande.
- `app.css`: l'aspetto.
- `territori/<paese>.js`: nome, coordinate e piazza del paese.
- `territori/<paese>-luoghi.js`: i luoghi da OpenStreetMap. Lo genera `strumenti/scarica_osm.py` e non va modificato a mano.
- `territori/<paese>-avvisi.js`: gli avvisi. Per ora sono esempi, segnati come tali.

## Aggiungere un paese
    python strumenti/scarica_osm.py padula "Padula" <sud> <ovest> <nord> <est>

Poi si crea `territori/padula.js` sul modello di Teggiano e si cambia `avvia("…")` in `index.html`.

## Cosa è vero e cosa è dimostrazione
- **Vero:** i luoghi, le posizioni, gli indirizzi e i telefoni, quando OpenStreetMap li ha.
- **Dimostrazione:** gli orari liberi per prenotare, la conferma degli ordini e gli avvisi. Nell'app sono segnati con l'etichetta «Dimostrazione» o «Esempio».
