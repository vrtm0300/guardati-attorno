/* Bacheca del Vallo di Diano.
   Ogni voce dice da chi viene. Le voci con "esempio: true" sono finte e servono solo a mostrare come funziona:
   nella versione vera arrivano dai Comuni, dalle attività che hanno rivendicato la scheda e dalle associazioni. */
registraBacheca([
  { id: "lamanna-orari", tipo: "trasporti", da: "Autolinee Lamanna", comune: null, quando: "2026-09-12",
    titolo: "Nuovi orari dal Vallo di Diano a Salerno e Napoli",
    testo: "Gli orari delle corse Lamanna sono in vigore dal 12 settembre 2026. Li trovi anche nella scheda Bus.",
    link: "https://www.autolineelamanna.it/web/orari-corse/" },
  { id: "es-acqua", tipo: "comune", esempio: true, urgente: true, da: "Comune di Teggiano", comune: "teggiano", quando: "Esempio",
    titolo: "Acqua sospesa per lavori", testo: "Esempio di avviso urgente del Comune: arriva come notifica a chi lo ha scelto." },
  { id: "es-offerta", tipo: "attivita", esempio: true, da: "Un'attività del paese", comune: "sala-consilina", quando: "Esempio",
    titolo: "Pizza a domicilio, consegna gratuita il martedì", testo: "Esempio di offerta pubblicata da un esercente che ha rivendicato la sua scheda." },
  { id: "es-evento", tipo: "eventi", esempio: true, da: "Pro loco", comune: "padula", quando: "Esempio",
    titolo: "Visita guidata serale alla Certosa", testo: "Esempio di evento: si prenota il posto e finisce in Agenda con il promemoria." },
  { id: "es-associazione", tipo: "associazioni", esempio: true, da: "Associazione di volontariato", comune: "polla", quando: "Esempio",
    titolo: "Raccolta alimentare di quartiere", testo: "Esempio di avviso di un'associazione: con l'arrotondamento solidale si sostiene da qui." },
  { id: "es-sport", tipo: "eventi", esempio: true, da: "Centro sportivo", comune: "teggiano", quando: "Esempio",
    titolo: "Torneo di calcetto aperto a tutti", testo: "Esempio: iscrizione della squadra e prenotazione del campo dalla mappa." }
]);
