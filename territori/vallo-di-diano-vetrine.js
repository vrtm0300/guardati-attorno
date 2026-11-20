/* Vetrine delle attività. Per la dimostrazione: prodotti e prezzi presi dalle pagine pubbliche delle attività,
   con la fonte. Le attività non sono ancora collegate: la disponibilità in negozio va confermata. */
registraVetrine([
  { nome: "La Dispensa di Casa Amaro Teggiano", comune: "teggiano",
    fonte: "https://amaroteggianoshop.jimdofree.com/", consultata: "2026-11-20",
    nota: "Enoteca e gastronomia in piazza San Cono; punto vendita ufficiale dell'Amaro Teggiano (fonte: visitteggiano.it).",
    prodotti: [
      { nome: "Amaro Teggiano", formato: "70 cl", prezzo: 20 },
      { nome: "Amaro Teggiano, 3 bottiglie", formato: "3 × 70 cl", prezzo: 57, nota: "19 € a bottiglia" },
      { nome: "Amaro Teggiano, 6 bottiglie", formato: "6 × 70 cl", prezzo: 108, nota: "18 € a bottiglia" },
      { nome: "Teggiano Gin Italiano", formato: "50 cl", prezzo: 35 }
    ] }
]);
