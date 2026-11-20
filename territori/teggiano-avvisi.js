/* Avvisi di Teggiano.
   ATTENZIONE: per ora sono esempi per la dimostrazione, non avvisi veri.
   Nella versione vera arrivano dal Comune (albo pretorio) e dalle associazioni. */
registraAvvisi("teggiano", {
  dimostrazione: true,
  nota: "Questi avvisi sono esempi per mostrare come funziona: non sono comunicazioni vere del Comune.",
  avvisi: [
    { da: "Comune", quando: "Esempio", urgente: true, titolo: "Interruzione dell'acqua",
      testo: "Esempio di avviso urgente: lavori sulla rete idrica, acqua sospesa in una zona del paese per qualche ora. Arriva come notifica sul telefono." },
    { da: "Comune", quando: "Esempio", titolo: "Raccolta differenziata: cambio del calendario",
      testo: "Esempio di avviso di servizio: il giorno della raccolta cambia per la festività." },
    { da: "Parrocchia", quando: "Esempio", titolo: "Festa del patrono, San Cono",
      testo: "Esempio di avviso di un'associazione: il programma della festa del 3 giugno, con gli orari della processione." },
    { da: "Pro loco", quando: "Esempio", titolo: "Torneo di calcetto",
      testo: "Esempio: iscrizioni aperte al torneo estivo. Si prenota il campo dalla mappa." }
  ]
});
