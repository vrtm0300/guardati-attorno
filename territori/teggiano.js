/* Dati del territorio: Teggiano.
   Ogni voce viene dalla fonte indicata. Ciò che manca si raccoglie, non si inventa. */
registraTerritorio({
  id: "teggiano",
  nome: "Teggiano",
  area: "Vallo di Diano",
  provincia: "Salerno",
  regione: "Campania",
  // Coordinate del centro del comune (Wikipedia: 40°23′N 15°32′E)
  coordinate: { lat: 40.3833, lon: 15.5333 },
  // Centro della mappa: il Municipio, nel centro storico (OpenStreetMap)
  piazza: { lat: 40.380392, lon: 15.539179 },
  fonte: {
    titolo: "Wikipedia, voce «Teggiano»",
    url: "https://it.wikipedia.org/wiki/Teggiano",
    consultata: "2026-11-17"
  },
  presentazione:
    "Borgo medievale a 635 metri, nel cuore del Vallo di Diano. Fino al 1862 si chiamava Diano, ed è da qui che prende il nome tutta la valle.",
  fatti: [
    { etichetta: "Altitudine", valore: "635 m s.l.m." },
    { etichetta: "Abitanti", valore: "6 955 (31 maggio 2026)" },
    { etichetta: "Patrono", valore: "San Cono, 3 giugno" },
    { etichetta: "Frazioni", valore: "Pantano, Piedimonte, Prato Perillo, San Marco" }
  ],
  sezioni: [
    {
      id: "primari",
      livello: 1,
      titolo: "Ogni giorno",
      sottotitolo: "Farmacie, alimentari, trasporti, numeri utili",
      daRaccogliere: ["Farmacie e turni", "Alimentari e mercati", "Autobus e treni", "Numeri utili"],
      luoghi: []
    },
    {
      id: "servizi",
      livello: 2,
      titolo: "Servizi",
      sottotitolo: "Comune, sanità, uffici",
      daRaccogliere: ["Uffici comunali e orari", "Guardia medica", "Poste e banche"],
      luoghi: []
    },
    {
      id: "vivere",
      livello: 3,
      titolo: "Feste e sapori",
      sottotitolo: "Ricorrenze e cucina della tradizione",
      daRaccogliere: ["Calendario degli eventi", "Ristoranti e locali"],
      luoghi: [
        { id: "san-cono", nome: "Festa di San Cono", tipo: "Festa patronale", quando: "3 giugno",
          testo: "San Cono è il patrono di Teggiano; il 3 giugno è il giorno festivo del paese." },
        { id: "stufati", nome: "Stufati", tipo: "Piatto tipico", quando: "Vigilia di Natale",
          testo: "Piatto della tradizione preparato per la vigilia di Natale." },
        { id: "parmitieddi", nome: "Parmitieddi", tipo: "Piatto tipico", quando: "Domenica delle Palme",
          testo: "Detti anche «Parmi», si preparano per il pranzo della Domenica delle Palme." },
        { id: "pizzichinu", nome: "Pizzichinu", tipo: "Piatto tipico", quando: "Pasqua",
          testo: "Torta rustica tipica del periodo pasquale." }
      ]
    },
    {
      id: "attivita",
      livello: 4,
      titolo: "Attività",
      sottotitolo: "Botteghe, ospitalità, prenotazioni",
      daRaccogliere: ["Strutture ricettive", "Ristorazione", "Artigiani e botteghe"],
      luoghi: []
    },
    {
      id: "cultura",
      livello: 5,
      titolo: "Cultura",
      sottotitolo: "Chiese, palazzi, castello, musei",
      luoghi: [
        { id: "cattedrale", nome: "Cattedrale di Santa Maria Maggiore", tipo: "Chiesa", quando: "XIII secolo",
          testo: "È il principale edificio religioso della città, sede della diocesi di Teggiano-Policastro." },
        { id: "castello", nome: "Castello Macchiaroli", tipo: "Castello", quando: "XI–XII secolo",
          testo: "Il castello dei principi Sanseverino, di epoca normanna. Qui nel 1485 fu tramata la congiura dei baroni contro Ferrante I d'Aragona." },
        { id: "seggio", nome: "Il Seggio", tipo: "Loggiato", quando: "",
          testo: "Loggiato all'incrocio tra cardo e decumano, dove si riuniva l'universitas, il governo cittadino." },
        { id: "san-francesco", nome: "Chiesa e convento di San Francesco", tipo: "Chiesa", quando: "1307",
          testo: "Complesso francescano del primo Trecento." },
        { id: "sant-agostino", nome: "Chiesa ed ex convento di Sant'Agostino", tipo: "Chiesa", quando: "1370",
          testo: "Chiesa con l'ex convento agostiniano." },
        { id: "annunziata", nome: "Chiesa della SS. Annunziata", tipo: "Chiesa", quando: "XIV secolo",
          testo: "Una delle chiese trecentesche del centro storico." },
        { id: "sant-antuono", nome: "Chiesa di Sant'Antonio", tipo: "Chiesa", quando: "XI secolo",
          testo: "Detta di Sant'Antuono, tra le più antiche del paese." },
        { id: "pieta", nome: "Chiesa e convento della Santissima Pietà", tipo: "Chiesa", quando: "XIV secolo",
          testo: "Complesso trecentesco di chiesa e convento." },
        { id: "obelisco", nome: "Obelisco di San Cono", tipo: "Monumento", quando: "",
          testo: "Monumento dedicato al patrono." },
        { id: "malavolta", nome: "Palazzo dei Malavolta", tipo: "Palazzo", quando: "",
          testo: "Oggi è la sede vescovile." },
        { id: "porta-sud", nome: "Porta della cinta muraria", tipo: "Mura medievali", quando: "Medioevo",
          testo: "Porta delle mura medievali, a sud dell'abitato; restano anche alcune torri." },
        { id: "museo-diocesano", nome: "Museo diocesano", tipo: "Museo", quando: "",
          testo: "Ha sede nell'ex chiesa di San Pietro." },
        { id: "lapidario", nome: "Lapidario Dianense", tipo: "Museo", quando: "", testo: "" },
        { id: "museo-erbe", nome: "Museo delle erbe", tipo: "Museo", quando: "", testo: "" },
        { id: "museo-memoria", nome: "Museo della Memoria e dei ricordi", tipo: "Museo", quando: "", testo: "" },
        { id: "museo-san-cono", nome: "Museo di San Cono", tipo: "Museo", quando: "", testo: "" },
        { id: "civilta-contadina", nome: "Museo della Civiltà Contadina", tipo: "Museo", quando: "", testo: "" }
      ]
    }
  ]
});
