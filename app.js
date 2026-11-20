/* Guardati attorno — il territorio su una mappa, per usarlo davvero.
   Il codice vale per qualunque territorio: i dati stanno in territori/<id>*.js. */

/* ================= Dati caricati dai file del territorio ================= */
let T = null, LINEE = [], BACHECA = [], PROGETTI = [];
function registraProgetti(p) { PROGETTI = p; }
let VETRINE = [];
function registraVetrine(v) { VETRINE = v; }
function registraTerritorio(d) { T = d; }
function registraLinee(l) { LINEE = l; }
function registraBacheca(b) { BACHECA = b; }

/* ================= Categorie e sottofiltri ================= */
const t = (...tipi) => (l) => tipi.some((x) => x.endsWith("=*") ? l.tipo.startsWith(x.slice(0, -1)) : l.tipo === x);
const cucina = (...c) => (l) => c.some((x) => (l.cucina || "").toLowerCase().includes(x));
const sport = (...s) => (l) => s.some((x) => (l.sport || "").includes(x));
const e = (...f) => (l) => f.every((g) => g(l));
const non = (f) => (l) => !f(l);

const MARCA = "#1d4e6b";
/* Un colore per ogni area: si riconoscono le cose sulla mappa anche senza filtrare. Toni presi dal territorio, tutti leggibili con l'icona bianca. */
const COLORI_AREE = {"mangiare": "#d0622a", "spesa": "#2e7d4f", "negozi": "#7a5ba6", "cura": "#c2417f", "sport": "#2a6fb0", "salute": "#d62f3a", "auto": "#5f6b7a", "servizi": "#1d4e6b", "cultura": "#a0711c", "natura": "#5a9a2a", "dormire": "#0f7b8a", "muoversi": "#3f51a3"};
/* Ogni categoria: nome che dice cosa contiene, icona a linea, sottofiltri che guidano,
   "info" = che cosa serve per decidere (lo pubblica l'attività), "prezzo" = si può ordinare dal più economico. */
const CATEGORIE = [
  { id: "mangiare", nome: "Mangiare e bere", icona: "mangiare", azione: "tavolo", prezzo: true,
    info: { titolo: "Menù e prezzi", vuoto: "Il menù non è ancora pubblicato." },
    entra: t("amenity=restaurant", "amenity=cafe", "amenity=bar", "amenity=pub", "amenity=fast_food", "amenity=ice_cream", "shop=pastry"),
    sotto: [
      ["Pizzerie", cucina("pizza")],
      ["Ristoranti e trattorie", e(t("amenity=restaurant"), non(cucina("pizza")))],
      ["Kebab", cucina("kebab")],
      ["Panini e rosticcerie", t("amenity=fast_food")],
      ["Bar e caffè", t("amenity=cafe", "amenity=bar")],
      ["Gelaterie e pasticcerie", t("amenity=ice_cream", "shop=pastry")],
      ["Pub", t("amenity=pub")],
    ] },
  { id: "spesa", nome: "Fare la spesa", icona: "spesa", azione: "ordine", prezzo: true,
    info: { titolo: "Offerte e consegna", vuoto: "Offerte e consegna a casa non sono ancora pubblicate." },
    entra: t("shop=supermarket", "shop=convenience", "shop=bakery", "shop=butcher", "shop=greengrocer", "shop=deli", "shop=dairy", "shop=seafood", "shop=cheese", "shop=frozen_food", "shop=farm", "shop=confectionery", "shop=coffee", "shop=pasta", "shop=wine", "shop=beverages", "shop=alcohol", "shop=tobacco", "shop=newsagent", "shop=kiosk", "shop=lottery"),
    sotto: [
      ["Supermercati e alimentari", t("shop=supermarket", "shop=convenience", "shop=deli", "shop=dairy", "shop=cheese", "shop=frozen_food", "shop=farm", "shop=pasta", "shop=coffee")],
      ["Pane e dolci", t("shop=bakery", "shop=confectionery")],
      ["Carne e pesce", t("shop=butcher", "shop=seafood")],
      ["Frutta e verdura", t("shop=greengrocer")],
      ["Vini e bevande", t("shop=wine", "shop=beverages", "shop=alcohol")],
      ["Tabacchi ed edicole", t("shop=tobacco", "shop=newsagent", "shop=kiosk", "shop=lottery")],
    ] },
  { id: "negozi", nome: "Negozi", icona: "negozio", azione: "chiama",
    info: { titolo: "Offerte in corso", vuoto: "Nessuna offerta pubblicata." },
    entra: e(t("shop=*"), non(t("shop=hairdresser", "shop=beauty", "shop=nails", "shop=car_repair", "shop=car", "shop=tyres", "shop=car_parts", "shop=motorcycle", "shop=funeral_directors", "shop=laundry", "shop=dry_cleaning", "shop=pastry", "shop=supermarket", "shop=convenience", "shop=bakery", "shop=butcher", "shop=greengrocer", "shop=deli", "shop=dairy", "shop=seafood", "shop=cheese", "shop=frozen_food", "shop=farm", "shop=confectionery", "shop=coffee", "shop=pasta", "shop=wine", "shop=beverages", "shop=alcohol", "shop=tobacco", "shop=newsagent", "shop=kiosk", "shop=lottery"))),
    sotto: [
      ["Abbigliamento e scarpe", t("shop=clothes", "shop=shoes", "shop=jewelry", "shop=bag", "shop=boutique", "shop=fashion_accessories", "shop=sports")],
      ["Casa e fai da te", t("shop=hardware", "shop=doityourself", "shop=furniture", "shop=houseware", "shop=garden_centre", "shop=paint", "shop=interior_decoration", "shop=kitchen", "shop=bathroom_furnishing", "shop=building_materials", "shop=agrarian", "shop=trade", "shop=mall")],
      ["Elettronica e telefonia", t("shop=electronics", "shop=mobile_phone", "shop=computer", "shop=appliance", "shop=photo")],
      ["Cura della persona", t("shop=chemist", "shop=cosmetics", "shop=perfumery", "shop=optician", "shop=medical_supply", "shop=herbalist", "shop=hairdresser_supply")],
      ["Fiori, regali e libri", t("shop=florist", "shop=gift", "shop=books", "shop=stationery", "shop=toys", "shop=pet", "shop=bicycle")],
    ] },
  { id: "cura", nome: "Barbiere e bellezza", icona: "cura", azione: "appuntamento", prezzo: true,
    info: { titolo: "Listino", vuoto: "Il listino non è ancora pubblicato." },
    entra: t("shop=hairdresser", "shop=beauty", "shop=nails", "amenity=spa"),
    sotto: [["Barbiere e parrucchiere", t("shop=hairdresser")], ["Estetica e unghie", t("shop=beauty", "shop=nails", "amenity=spa")]] },
  { id: "sport", nome: "Sport", icona: "sport", azione: "campo", prezzo: true,
    info: { titolo: "Prezzi dei campi", vuoto: "I prezzi non sono ancora pubblicati." },
    entra: t("leisure=pitch", "leisure=sports_centre", "leisure=stadium", "leisure=swimming_pool", "leisure=fitness_centre"),
    sotto: [
      ["Calcio e calcetto", sport("soccer")], ["Tennis e padel", sport("tennis", "padel")], ["Palestre", t("leisure=fitness_centre")],
      ["Piscine", t("leisure=swimming_pool")], ["Basket e volley", sport("basketball", "volleyball")], ["Centri sportivi", t("leisure=sports_centre", "leisure=stadium")],
    ] },
  { id: "salute", nome: "Salute", icona: "salute", azione: "chiama",
    info: { titolo: "Orari e turni", vuoto: "Turni di guardia non ancora pubblicati." },
    entra: t("amenity=pharmacy", "amenity=doctors", "amenity=dentist", "amenity=clinic", "amenity=hospital", "amenity=veterinary", "healthcare=*"),
    sotto: [
      ["Farmacie", t("amenity=pharmacy", "healthcare=pharmacy")],
      ["Medici e ambulatori", t("amenity=doctors", "amenity=clinic", "healthcare=doctor", "healthcare=clinic", "healthcare=centre", "healthcare=laboratory", "healthcare=physiotherapist")],
      ["Dentisti", t("amenity=dentist", "healthcare=dentist")], ["Ospedali", t("amenity=hospital", "healthcare=hospital")], ["Veterinari", t("amenity=veterinary")],
    ] },
  { id: "auto", nome: "Auto e artigiani", icona: "auto", azione: "appuntamento", prezzo: true,
    info: { titolo: "Listino", vuoto: "Il listino non è ancora pubblicato." },
    entra: t("shop=car_repair", "shop=tyres", "shop=car", "shop=car_parts", "shop=motorcycle", "amenity=car_wash", "amenity=fuel", "craft=*", "shop=laundry", "shop=dry_cleaning"),
    sotto: [
      ["Officine e gommisti", t("shop=car_repair", "shop=tyres", "shop=car", "shop=car_parts", "shop=motorcycle")], ["Distributori", t("amenity=fuel")],
      ["Autolavaggi", t("amenity=car_wash")], ["Lavanderie", t("shop=laundry", "shop=dry_cleaning")], ["Artigiani", t("craft=*")],
    ] },
  { id: "servizi", nome: "Uffici e servizi", icona: "servizi", azione: "chiama",
    info: { titolo: "Apertura al pubblico", vuoto: "Gli orari per il pubblico non sono ancora pubblicati." },
    entra: t("amenity=townhall", "amenity=post_office", "amenity=bank", "amenity=police", "amenity=fire_station", "amenity=school", "amenity=kindergarten", "amenity=college", "amenity=university", "amenity=library", "office=*", "amenity=social_facility", "amenity=community_centre", "amenity=courthouse", "shop=funeral_directors"),
    sotto: [
      ["Municipi e uffici pubblici", t("amenity=townhall", "office=government", "office=administrative", "amenity=courthouse")], ["Poste e banche", t("amenity=post_office", "amenity=bank")],
      ["Sicurezza", t("amenity=police", "amenity=fire_station")], ["Scuole e biblioteche", t("amenity=school", "amenity=kindergarten", "amenity=college", "amenity=university", "amenity=library")],
      ["Sociale e comunità", t("amenity=social_facility", "amenity=community_centre")], ["Studi e professionisti", e(t("office=*"), non(t("office=government", "office=administrative")))],
    ] },
  { id: "cultura", nome: "Cultura e luoghi da vedere", icona: "cultura", azione: "visita",
    entra: t("historic=*", "tourism=museum", "tourism=attraction", "tourism=artwork", "amenity=place_of_worship", "amenity=monastery", "amenity=theatre", "amenity=cinema", "amenity=arts_centre"),
    sotto: [
      ["Chiese e conventi", t("amenity=place_of_worship", "amenity=monastery", "historic=church", "historic=monastery", "historic=wayside_shrine", "historic=wayside_cross")], ["Musei", t("tourism=museum")],
      ["Castelli e mura", t("historic=castle", "historic=city_gate", "historic=citywalls", "historic=tower", "historic=fort")], ["Archeologia", t("historic=archaeological_site", "historic=ruins")],
      ["Monumenti e arte", t("historic=monument", "historic=memorial", "tourism=artwork", "tourism=attraction", "historic=building")], ["Teatri e cinema", t("amenity=theatre", "amenity=cinema", "amenity=arts_centre")],
    ] },
  { id: "natura", nome: "Natura e svago", icona: "natura", azione: "vai",
    entra: t("leisure=park", "leisure=playground", "leisure=nature_reserve", "tourism=viewpoint", "tourism=picnic_site", "natural=*"),
    sotto: [["Parchi e giochi", t("leisure=park", "leisure=playground")], ["Panorami", t("tourism=viewpoint", "natural=peak")], ["Grotte e sorgenti", t("natural=cave_entrance", "natural=spring")], ["Picnic e riserve", t("tourism=picnic_site", "leisure=nature_reserve")]] },
  { id: "dormire", nome: "Dormire", icona: "dormire", azione: "camera", prezzo: true,
    info: { titolo: "Prezzi a notte", vuoto: "I prezzi non sono ancora pubblicati." },
    entra: t("tourism=hotel", "tourism=guest_house", "tourism=apartment", "tourism=hostel", "tourism=camp_site", "tourism=chalet"),
    sotto: [["Hotel", t("tourism=hotel")], ["B&B e affittacamere", t("tourism=guest_house")], ["Case vacanza", t("tourism=apartment", "tourism=chalet")], ["Ostelli e campeggi", t("tourism=hostel", "tourism=camp_site")]] },
  { id: "muoversi", nome: "Muoversi", icona: "muoversi", azione: "bus",
    entra: t("highway=bus_stop", "amenity=bus_station", "railway=station"),
    sotto: [["Fermate", t("highway=bus_stop")], ["Autostazioni", t("amenity=bus_station")], ["Stazioni", t("railway=station")]] },
].map((c) => ({ ...c, colore: COLORI_AREE[c.id] || MARCA }));

const NOMI = {
  "amenity=restaurant": "Ristorante", "amenity=cafe": "Caffè", "amenity=bar": "Bar", "amenity=pub": "Pub", "amenity=fast_food": "Rosticceria",
  "amenity=ice_cream": "Gelateria", "shop=pastry": "Pasticceria", "shop=supermarket": "Supermercato", "shop=convenience": "Alimentari",
  "shop=bakery": "Panificio", "shop=butcher": "Macelleria", "shop=greengrocer": "Frutta e verdura", "shop=chemist": "Prodotti per la persona",
  "shop=cosmetics": "Cosmetici", "shop=optician": "Ottico", "shop=hardware": "Ferramenta", "shop=furniture": "Arredamento", "shop=clothes": "Abbigliamento",
  "shop=shoes": "Calzature", "shop=jewelry": "Gioielleria", "shop=tobacco": "Tabaccheria", "shop=newsagent": "Edicola", "shop=florist": "Fiorista",
  "shop=mobile_phone": "Telefonia", "shop=electronics": "Elettronica", "shop=hairdresser": "Barbiere e parrucchiere", "shop=beauty": "Estetica",
  "shop=car_repair": "Officina", "shop=tyres": "Gommista", "amenity=car_wash": "Autolavaggio", "shop=wine": "Enoteca", "shop=gift": "Regali",
  "leisure=pitch": "Campo", "leisure=sports_centre": "Centro sportivo", "leisure=stadium": "Stadio", "leisure=swimming_pool": "Piscina",
  "leisure=fitness_centre": "Palestra", "leisure=park": "Parco", "leisure=playground": "Parco giochi", "amenity=pharmacy": "Farmacia",
  "amenity=doctors": "Studio medico", "amenity=dentist": "Dentista", "amenity=clinic": "Ambulatorio", "amenity=hospital": "Ospedale",
  "amenity=veterinary": "Veterinario", "amenity=townhall": "Municipio", "amenity=post_office": "Ufficio postale", "amenity=bank": "Banca",
  "amenity=police": "Forze dell'ordine", "amenity=fire_station": "Vigili del fuoco", "amenity=school": "Scuola", "amenity=library": "Biblioteca",
  "amenity=fuel": "Distributore", "historic=castle": "Castello", "historic=monument": "Monumento", "historic=memorial": "Memoriale",
  "historic=ruins": "Rovine", "historic=archaeological_site": "Sito archeologico", "historic=church": "Chiesa storica", "historic=city_gate": "Porta antica",
  "historic=building": "Edificio storico", "historic=wayside_shrine": "Edicola votiva", "tourism=museum": "Museo", "tourism=attraction": "Da vedere",
  "amenity=place_of_worship": "Chiesa", "amenity=monastery": "Monastero", "amenity=theatre": "Teatro", "amenity=cinema": "Cinema",
  "tourism=viewpoint": "Panorama", "tourism=picnic_site": "Area picnic", "natural=peak": "Vetta", "natural=cave_entrance": "Grotta",
  "natural=spring": "Sorgente", "tourism=hotel": "Hotel", "tourism=guest_house": "B&B", "tourism=apartment": "Casa vacanze", "tourism=hostel": "Ostello",
  "tourism=camp_site": "Campeggio", "highway=bus_stop": "Fermata bus", "amenity=bus_station": "Autostazione", "railway=station": "Stazione",
};
const SPORT = { soccer: "calcio", tennis: "tennis", padel: "padel", basketball: "basket", volleyball: "pallavolo", multi: "polivalente", karting: "kart", equestrian: "equitazione", shooting: "tiro" };

/* ================= Stato e memoria ================= */
const MEM = "guardati-attorno:v3:";
const leggi = (k, d) => { try { const v = JSON.parse(localStorage.getItem(MEM + k)); return v ?? d; } catch { return d; } };
const scrivi = (k, v) => localStorage.setItem(MEM + k, JSON.stringify(v));

const S = { ordine: "vicino", cat: null, sotto: null, testo: "", comune: null, scelto: null, vista: "mappa", altezza: "basso", qui: null };
let mappa, strato, segnaposti = new Map(), segnoIo, TUTTI = [];

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const utente = () => leggi("utente", null);

/* ================= Luoghi ================= */
function prepara() {
  TUTTI = T.luoghi.map((l) => {
    const cat = CATEGORIE.find((c) => c.entra(l));
    return cat ? { ...l, cat } : null;
  }).filter((l) => l && !(l.tipo === "leisure=swimming_pool" && !l.nome) && !(l.tipo === "leisure=pitch" && !l.sport && !l.nome))
    .concat(leggi("nuove-attivita", []).map((a) => ({ ...a, cat: CATEGORIE.find((c) => c.id === a.catId) })));
}
const comuneDi = (id) => T.comuni.find((c) => c.id === id);
function nomeDi(l) {
  if (l.nome) return l.nome;
  const base = NOMI[l.tipo] || "Luogo";
  const sp = (l.sport || "").split(";").map((x) => SPORT[x]).filter(Boolean)[0];
  return sp ? `${base} da ${sp}` : base;
}
function tipoDi(l) {
  let b = NOMI[l.tipo] || l.tipo.split("=")[1].replace(/_/g, " ");
  const cu = (l.cucina || "").split(";")[0];
  if (cu === "pizza") b = "Pizzeria"; else if (cu === "kebab") b = "Kebab";
  return b;
}
function km(a, b) {
  const r = (g) => (g * Math.PI) / 180, dLa = r(b.lat - a.lat), dLo = r(b.lon - a.lon);
  const h = Math.sin(dLa / 2) ** 2 + Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(dLo / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}
function centro() {
  if (S.qui) return S.qui;
  if (S.comune) return comuneDi(S.comune).centro;
  const u = utente(); if (u?.comune && comuneDi(u.comune)) return comuneDi(u.comune).centro;
  return T.comuni[0].centro;
}
const distanza = (l) => { const d = km(centro(), l); return d < 1 ? `${Math.round(d * 100) * 10} m` : `${d.toFixed(1).replace(".", ",")} km`; };

/* Schede compilate dalle attività che le hanno riscattate: listino, consegna, ecc. */
const schedaDi = (osm) => leggi("schede", {})[osm] || null;
/* Prodotti in vetrina: quelli pubblicati dall'attività nell'app, oppure quelli presi dal suo sito per la dimostrazione. */
function prodottiDi(l) {
  const miei = schedaDi(l.osm)?.prodotti;
  if (miei?.length) return { prodotti: miei, mia: true };
  const v = VETRINE.find((x) => x.comune === l.comune && x.nome === l.nome);
  return v ? { ...v, mia: false } : null;
}
function prezzoMin(l) {
  const v = (schedaDi(l.osm)?.listino || []).concat(prodottiDi(l)?.prodotti || []).map((x) => x.prezzo).filter((x) => x > 0);
  return v.length ? Math.min(...v) : null;
}
const euro = (n) => "€ " + n.toFixed(2).replace(".", ",").replace(",00", "");
function filtrati() {
  const q = S.testo.trim().toLowerCase();
  const cat = CATEGORIE.find((c) => c.id === S.cat);
  const sotto = cat && S.sotto != null ? cat.sotto[S.sotto][1] : null;
  return TUTTI
    .filter((l) => !S.comune || l.comune === S.comune)
    .filter((l) => !cat || l.cat === cat)
    .filter((l) => !sotto || sotto(l))
    .filter((l) => !q || [nomeDi(l), tipoDi(l), l.cat.nome, comuneDi(l.comune)?.nome, l.cucina, l.sport, ...(prodottiDi(l)?.prodotti || []).map((x) => x.nome)].join(" ").toLowerCase().includes(q))
    .sort((a, b) => {
      if (S.ordine === "prezzo") { const pa = prezzoMin(a), pb = prezzoMin(b); if (pa != null || pb != null) return (pa ?? 1e9) - (pb ?? 1e9); }
      return km(centro(), a) - km(centro(), b);
    });
}

/* ================= Punti e livelli ================= */
const LIVELLI = ["Curioso", "Esploratore", "Conoscitore", "Custode", "Ambasciatore del territorio"];
function guadagna(punti, perche) {
  const p = leggi("punti", 0) + punti; scrivi("punti", p);
  avvisa(`${perche} <b>+${punti} punti</b>`);
}
function livello() {
  const p = leggi("punti", 0), n = Math.min(Math.floor(p / 100), LIVELLI.length - 1);
  return { punti: p, nome: LIVELLI[n], n: n + 1, avanzamento: (p % 100), crediti: (p / 100).toFixed(2).replace(".", ",") };
}

/* ================= Mappa ================= */
function iconaPin(l, scelto) {
  return L.divIcon({ className: "", iconSize: [30, 30], iconAnchor: [15, 15],
    html: `<div class="pin${scelto ? " scelto" : ""}${prodottiDi(l) ? " con-vetrina" : ""}" style="background:${l.cat.colore}">${icona(l.cat.icona)}</div>` });
}
function disegnaPin() {
  strato.clearLayers(); segnaposti.clear();
  const lista = filtrati();
  lista.forEach((l) => {
    const m = L.marker([l.lat, l.lon], { icon: iconaPin(l, S.scelto === l.osm), title: nomeDi(l) }).on("click", () => apriLuogo(l.osm));
    strato.addLayer(m); segnaposti.set(l.osm, m);
  });
}
function inquadra() {
  const lista = filtrati();
  const basso = Math.round(innerHeight * 0.46) + 10, alto = $("#sottocategorie").hidden ? 120 : 160;
  if ((S.cat || S.testo) && lista.length) {
    mappa.fitBounds(L.latLngBounds(lista.slice(0, 40).map((l) => [l.lat, l.lon])).pad(0.15), { paddingTopLeft: [0, alto], paddingBottomRight: [0, basso], maxZoom: 16 });
  } else if (S.comune) {
    const c = comuneDi(S.comune).centro; mappa.setView([c.lat, c.lon], 15);
  }
}

/* ================= Foglio in basso ================= */
function altezza(a) {
  S.altezza = a;
  document.body.classList.toggle("foglio-alto", a === "alto");
  document.documentElement.style.setProperty("--foglio-h", { basso: "132px", medio: "48vh", alto: "calc(100dvh - var(--barra-h) - 76px)" }[a]);
}
function corpo(html) { const c = $("#corpo"); c.innerHTML = html; c.scrollTop = 0; }

function elenco() {
  S.scelto = null;
  const lista = filtrati(), cat = CATEGORIE.find((c) => c.id === S.cat);
  const dove = S.comune ? comuneDi(S.comune).nome : T.nome;
  const titolo = S.testo ? `Risultati per «${esc(S.testo)}»` : cat ? (S.sotto != null ? cat.sotto[S.sotto][0] : cat.nome) : `Cosa c'è nel ${esc(dove).replace(/^nel (Vallo)/, "$1")}`;
  corpo(`
    <h2 class="titolo-foglio">${S.comune && !cat && !S.testo ? `Cosa c'è a ${esc(dove)}` : titolo}</h2>
    <p class="nota-tenue">${lista.length} ${lista.length === 1 ? "posto" : "posti"}${S.comune ? "" : " in " + T.comuni.length + " comuni"}</p>
    ${cat?.prezzo || S.testo ? `<div class="scelte" role="group" aria-label="Ordina">${[["vicino", "Più vicini"], ["prezzo", "Più economici"]].map(([k, n]) => `<button class="scelta" data-ordine="${k}" aria-pressed="${S.ordine === k}">${n}</button>`).join("")}</div>` : ""}
    ${lista.length ? lista.slice(0, 80).map(riga).join("") : vuotoCategoria(cat)}`);
  $$("[data-ordine]", $("#corpo")).forEach((b) => b.addEventListener("click", () => { S.ordine = b.dataset.ordine; disegnaPin(); elenco(); }));

  $$("[data-osm]", $("#corpo")).forEach((b) => b.addEventListener("click", () => apriLuogo(b.dataset.osm, true)));
}
function riga(l) {
  return `<button class="riga" data-osm="${esc(l.osm)}">
      ${l.foto ? `<img class="miniatura" src="${esc(l.foto)}" alt="" loading="lazy">` : `<span class="segno" style="background:${l.cat.colore}14;color:${l.cat.colore}">${icona(l.cat.icona)}</span>`}
      <span><strong>${esc(nomeDi(l))}</strong><small>${esc(tipoDi(l))} · ${esc(comuneDi(l.comune)?.nome || "")}</small>${trovato(l)}</span>
      <span class="dist">${distanza(l)}${prezzoMin(l) != null ? `<br><b style="color:var(--inchiostro)">da ${euro(prezzoMin(l))}</b>` : ""}</span></button>`;
}
function trovato(l) {
  const q = S.testo.trim().toLowerCase(); if (!q) return "";
  const p = (prodottiDi(l)?.prodotti || []).find((x) => x.nome.toLowerCase().includes(q));
  return p ? `<small style="display:block;color:var(--azione);font-weight:600">Ha: ${esc(p.nome)}${p.prezzo ? " · " + euro(p.prezzo) : ""}</small>` : "";
}
function vuotoCategoria(cat) {
  return `<div class="riquadro"><h3>Qui non c'è ancora nessuno</h3>
    <p>Le attività esistono, ma non sono ancora sulla mappa. Se ne conosci una, segnalala: se è tua, registrala gratis.</p>
    <div class="azioni" style="grid-template-columns:1fr 1fr"><button class="btn primario" data-apri="registra">Registra un'attività</button>
    <a class="btn" href="https://www.openstreetmap.org/note/new#map=16/${centro().lat}/${centro().lon}" target="_blank" rel="noopener">Segnala un posto</a></div></div>`;
}

const AZIONI = {
  tavolo: ["Prenota un tavolo", "calendario"], ordine: ["Ordina e ritira", "spesa"], campo: ["Prenota il campo", "calendario"],
  appuntamento: ["Prendi appuntamento", "calendario"], camera: ["Prenota una camera", "dormire"], chiama: ["Chiama", "telefono"],
  visita: ["Aggiungi all'itinerario", "percorso"], vai: ["Portami lì", "vai"], bus: ["Orari dei bus", "muoversi"],
};

async function apriLuogo(osm, centra = false) {
  const l = TUTTI.find((x) => x.osm === osm); if (!l) return;
  const prima = S.scelto; S.scelto = osm;
  if (prima && segnaposti.get(prima)) segnaposti.get(prima).setIcon(iconaPin(TUTTI.find((x) => x.osm === prima), false));
  const m = segnaposti.get(osm);
  if (m) { m.setIcon(iconaPin(l, true)); if (strato.zoomToShowLayer) strato.zoomToShowLayer(m, () => {}); }
  if (centra) { mappa.setView([l.lat, l.lon], Math.max(mappa.getZoom(), 16), { animate: false }); mappa.panBy([0, Math.round(innerHeight * 0.24)], { animate: false }); }
  const [testoAz, iconaAz] = AZIONI[l.cat.azione];
  const tel = l.telefono ? `tel:${l.telefono.split(";")[0].replace(/[^\d+]/g, "")}` : "";
  const vai = `https://www.google.com/maps/dir/?api=1&destination=${l.lat},${l.lon}`;
  const preferito = leggi("soliti", []).includes(l.osm);
  let primaria;
  if (l.cat.azione === "chiama") primaria = tel ? `<a class="btn primario pieno" href="${tel}">${icona("telefono")} Chiama</a>` : `<button class="btn primario pieno" disabled>${icona("telefono")} Numero non ancora inserito</button>`;
  else if (l.cat.azione === "vai") primaria = `<a class="btn primario pieno" href="${vai}" target="_blank" rel="noopener">${icona("vai")} Portami lì</a>`;
  else primaria = `<button class="btn primario pieno" data-fai="${l.cat.azione}">${icona(iconaAz)} ${testoAz}</button>`;
  const rivendicata = leggi("rivendicate", []).includes(l.osm);
  corpo(`
    ${l.foto ? `<img class="foto" src="${esc(l.foto)}" alt="${esc(nomeDi(l))}">` : ""}
    <div class="testa">
      <div><span class="etich" style="color:${l.cat.colore}">${esc(tipoDi(l))}</span>
        <h2 style="margin-top:6px">${esc(nomeDi(l))}</h2>
        <p class="nota-tenue" style="margin:2px 0 0">${esc(comuneDi(l.comune)?.nome || "")} · ${distanza(l)}${rivendicata ? ' · <span class="etich ok">Gestita dal titolare</span>' : ""}</p></div>
      <button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button>
    </div>
    <ul class="dati">
      ${l.indirizzo ? `<li>${icona("luogo")}<span>${esc(l.indirizzo)}</span></li>` : ""}
      ${l.orari ? `<li>${icona("orario")}<span>${esc(l.orari)}</span></li>` : ""}
      ${l.telefono ? `<li>${icona("telefono")}<span>${esc(l.telefono)}</span></li>` : ""}
      ${l.sito ? `<li>${icona("sito")}<a href="${esc(l.sito)}" target="_blank" rel="noopener">${esc(l.sito.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, ""))}</a></li>` : ""}
    </ul>
    <div class="azioni">
      ${primaria}
      <button class="btn verticale ${preferito ? "attivo" : ""}" data-fai="solito">${icona("cuore")}${preferito ? "Tra i soliti" : "Tra i miei soliti"}</button>
      <a class="btn verticale" href="${vai}" target="_blank" rel="noopener">${icona("vai")}Portami lì</a>
      ${tel ? `<a class="btn verticale" href="${tel}">${icona("telefono")}Chiama</a>` : l.cat.azione === "visita" ? "" : `<button class="btn verticale" data-fai="visita">${icona("percorso")}Itinerario</button>`}
      ${COSE_PER_CAT[l.cat.id] ? `<button class="btn" style="grid-column:1/-1" data-organizza="${esc(l.osm)}">${icona("persone")} Organizza un incontro qui</button>` : ""}
    </div>
    ${vetrinaDi(l)}
    ${infoUtili(l)}
    ${progettiDi(l).map((x) => `<div class="riquadro"><h3>${icona("libro")} Approfondisci su ${esc(x.progetto.nome)}</h3><p class="nota-tenue" style="margin:4px 0 0">${esc(x.progetto.nota)}</p>
      <div class="azioni" style="grid-template-columns:1fr"><a class="btn" href="${esc(x.url)}" target="_blank" rel="noopener">Apri la pagina del progetto</a></div></div>`).join("")}
    <div id="sapere"></div>
    ${l.cat.id !== "cultura" && l.cat.id !== "natura" && l.cat.id !== "muoversi" && !rivendicata ? `
      <div class="riquadro"><h3>È la tua attività?</h3><p>Riscattala gratis: pubblichi menù, listino e orari, ricevi prenotazioni e offerte in Bacheca.</p>
        <div class="azioni" style="grid-template-columns:1fr"><button class="btn" data-fai="rivendica">${icona("nfc")} Riscatta gratis la scheda</button></div></div>` : ""}
    <p class="fonte">Dati: <a href="https://www.openstreetmap.org/${esc(l.osm)}" target="_blank" rel="noopener">OpenStreetMap</a>${l.foto ? ' · foto: <a href="' + esc(l.foto_fonte || l.foto.replace("Special:FilePath/", "File:").replace(/\?width=\d+$/, "")) + '" target="_blank" rel="noopener">' + (l.foto_fonte ? "Wikipedia" : "Wikimedia Commons") + '</a>' : ""}</p>`);
  $("#chiudi").addEventListener("click", () => { elenco(); disegnaPin(); altezza("basso"); });
  $$("[data-fai]", $("#corpo")).forEach((b) => b.addEventListener("click", () => fai(b.dataset.fai, l)));
  $$("[data-ritira]", $("#corpo")).forEach((b) => b.addEventListener("click", () => ritira(l, prodottiDi(l).prodotti[+b.dataset.ritira])));
  $$("[data-organizza]", $("#corpo")).forEach((b) => b.addEventListener("click", () => window.vai("proponi", l.osm))); // "vai" qui è il link di Maps
  if (l.cat.id === "cultura" && l.foto) altezza("alto"); else if (S.altezza === "basso") altezza("medio");
  if (l.cat.id === "cultura" || l.cat.id === "natura") sapereDi(l);
  if (l.cat.id === "muoversi") busDi(l);
}

/* Progetti di digitalizzazione culturale collegati a un luogo: quelli noti e quelli che gli ambasciatori hanno scansionato. */
function progettiDi(l) {
  const n = (l.nome || "").toLowerCase();
  const noti = PROGETTI.filter((p) => p.comune === l.comune).flatMap((p) => p.luoghi.filter((x) => n.includes(x.parola)).slice(0, 1).map((x) => ({ progetto: p, url: x.url })));
  const scansionati = leggi("collegamenti", []).filter((c) => c.osm === l.osm).map((c) => ({ progetto: { nome: c.dominio, nota: "Collegato da un ambasciatore con la scansione del QR o del tag sul posto. In attesa di verifica." }, url: c.url }));
  return noti.concat(scansionati);
}
const linkDi = (l) => `${location.origin}${location.pathname}#luogo=${encodeURIComponent(l.osm)}`;

/* ================= Tag NFC e codici QR ================= */
function apriLettore(perLuogo = null) {
  corpo(`
    <div class="testa"><div><h2>${perLuogo ? "Collega un QR o un tag" : "Apri un tag o un QR"}</h2>
      <p class="nota-tenue" style="margin:2px 0 0">${perLuogo ? `Scansiona il codice di un progetto culturale che si trova a ${esc(nomeDi(perLuogo))}: lo salviamo nella scheda, così non va perso.` : "I tag delle attività e dei luoghi aprono subito la loro scheda."}</p></div>
      <button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    <div class="azioni" style="grid-template-columns:1fr 1fr">
      <button class="btn primario" id="leggi-nfc">${icona("nfc")} Tag NFC</button>
      <button class="btn primario" id="leggi-qr">${icona("cerca")} Codice QR</button></div>
    <video id="camera" playsinline muted style="width:100%;border-radius:14px;margin-top:12px;background:#000" hidden></video>
    <label class="campo">Oppure incolla il link<input id="link-manuale" type="url" placeholder="https://…"></label>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn" id="usa-link">Apri</button></div>
    <p class="fonte" id="stato-lettore"></p>`);
  altezza("alto");
  const statoL = (t) => { $("#stato-lettore").textContent = t; };
  let flusso = null;
  const ferma = () => { if (flusso) flusso.getTracks().forEach((t) => t.stop()); flusso = null; };
  $("#chiudi").addEventListener("click", () => { ferma(); perLuogo ? apriLuogo(perLuogo.osm) : (elenco(), altezza("basso")); });
  $("#usa-link").addEventListener("click", () => { ferma(); letto($("#link-manuale").value.trim(), perLuogo); });
  $("#leggi-nfc").addEventListener("click", async () => {
    if (!("NDEFReader" in window)) return statoL("Questo telefono o browser non legge i tag NFC: usa il QR o incolla il link. Su Android funziona con Chrome.");
    try {
      const r = new NDEFReader(); await r.scan(); statoL("Avvicina il telefono al tag…");
      r.onreading = (ev) => { for (const rec of ev.message.records) { if (rec.recordType === "url" || rec.recordType === "text") { letto(new TextDecoder().decode(rec.data), perLuogo); return; } } };
    } catch { statoL("Lettura NFC non permessa: controlla i permessi del browser."); }
  });
  $("#leggi-qr").addEventListener("click", async () => {
    if (!("BarcodeDetector" in window) || !navigator.mediaDevices) return statoL("Questo browser non legge i QR dalla fotocamera: usa la fotocamera del telefono e apri il link, oppure incollalo qui.");
    try {
      flusso = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      const v = $("#camera"); v.hidden = false; v.srcObject = flusso; await v.play(); statoL("Inquadra il codice QR…");
      const det = new BarcodeDetector({ formats: ["qr_code"] });
      const giro = async () => {
        if (!flusso) return;
        try { const c = await det.detect(v); if (c.length) { ferma(); return letto(c[0].rawValue, perLuogo); } } catch { /* riprova */ }
        requestAnimationFrame(giro);
      };
      giro();
    } catch { statoL("Fotocamera non disponibile o permesso negato."); }
  });
}
function letto(testo, perLuogo) {
  if (!testo) return avvisa("Nessun link letto");
  const m = testo.match(/#luogo=([^&]+)/);
  if (m) { const osm = decodeURIComponent(m[1]); if (TUTTI.find((l) => l.osm === osm)) { guadagna(2, "Tag aperto"); return apriLuogo(osm, true); } }
  let url; try { url = new URL(testo); } catch { return avvisa("Il codice non contiene un link"); }
  if (perLuogo) {
    const c = leggi("collegamenti", []); c.push({ osm: perLuogo.osm, url: url.href, dominio: url.hostname.replace(/^www\./, "") }); scrivi("collegamenti", c);
    guadagna(15, "Progetto collegato al luogo"); return apriLuogo(perLuogo.osm);
  }
  const noto = PROGETTI.flatMap((p) => p.luoghi.map((x) => ({ ...x, p }))).find((x) => url.href.startsWith(x.url));
  if (noto) { const l = TUTTI.find((y) => y.comune === noto.p.comune && (y.nome || "").toLowerCase().includes(noto.parola)); if (l) return apriLuogo(l.osm, true); }
  corpo(`<div class="testa"><div><h2>Link esterno</h2><p class="nota-tenue" style="margin:2px 0 0">${esc(url.hostname)}</p></div><button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    <p>Questo codice porta fuori dall'app. Se appartiene a un luogo della mappa, aprilo e usa «Collega un QR o un tag» per salvarlo lì.</p>
    <div class="azioni" style="grid-template-columns:1fr"><a class="btn primario" href="${esc(url.href)}" target="_blank" rel="noopener">Apri il link</a></div>`);
  $("#chiudi").addEventListener("click", () => { elenco(); altezza("basso"); });
}

function vetrinaDi(l) {
  const v = prodottiDi(l); if (!v) return "";
  return `<div class="riquadro"><h3>${icona("negozio")} In vetrina</h3>
    <div class="vetrina">${v.prodotti.map((x, i) => `<div class="prodotto ${x.esaurito ? "esaurito" : ""}">
      <strong>${esc(x.nome)}</strong><small>${esc(x.formato || "")}${x.nota ? " · " + esc(x.nota) : ""}</small>
      <b>${x.prezzo ? euro(x.prezzo) : "Prezzo in negozio"}</b>
      ${x.esaurito ? `<span class="etich">Esaurito</span>` : `<button class="btn piccolo accento" data-ritira="${i}">Prenota e ritira</button>`}</div>`).join("")}</div>
    <p class="fonte">${v.mia ? "Pubblicato dall'attività" : `Prodotti e prezzi dal <a href="${esc(v.fonte)}" target="_blank" rel="noopener">sito dell'attività</a>, consultato il ${esc(v.consultata)}. <span class="etich demo">Dimostrazione</span> La disponibilità in negozio va confermata.`}</p></div>`;
}

function infoUtili(l) {
  const i = l.cat.info; if (!i) return "";
  const sc = schedaDi(l.osm);
  if (!sc?.listino?.length && !sc?.extra) return `<div class="riquadro"><h3>${esc(i.titolo)}</h3><p class="nota-tenue" style="margin:4px 0 0">${esc(i.vuoto)} L'attività può pubblicarlo gratis riscattando la scheda.</p></div>`;
  return `<div class="riquadro"><h3>${esc(i.titolo)}</h3>
    ${(sc.listino || []).map((x) => `<div class="voce" style="padding:8px 0"><div><strong style="font-weight:500">${esc(x.voce)}</strong></div><b>${euro(x.prezzo)}</b></div>`).join("")}
    ${sc.extra ? `<p style="margin-top:8px">${esc(sc.extra)}</p>` : ""}
    <p class="fonte">Pubblicato dall'attività</p></div>`;
}

/* ---- Cultura: la voce verificata, come una piccola enciclopedia del territorio ---- */
async function sapereDi(l) {
  const box = $("#sapere"); if (!box) return;
  const proposte = leggi("proposte", []).filter((p) => p.osm === l.osm);
  let voce = "";
  if (l.wikipedia) {
    const [lingua, ...titolo] = l.wikipedia.split(":");
    try {
      const r = await fetch(`https://${lingua}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(titolo.join(":"))}`);
      if (r.ok) { const d = await r.json(); voce = `<p>${esc(d.extract)}</p><p class="fonte"><span class="etich ok">${icona("spunta")} Fonte verificata</span> <a href="${esc(d.content_urls?.mobile?.page || "")}" target="_blank" rel="noopener">Wikipedia</a></p>`; }
    } catch { /* senza rete la voce resta vuota */ }
  }
  if (!voce && l.descrizione) voce = `<p>${esc(l.descrizione)}</p><p class="fonte">Fonte: OpenStreetMap</p>`;
  if (S.scelto !== l.osm) return;
  box.innerHTML = `<div class="storia"><h3>${icona("libro")} La storia</h3>
    ${voce || `<p>Nessuno ha ancora scritto la storia di questo posto. Se la conosci, raccontala.</p>`}</div>
    <div class="storia locale"><h3>${icona("persone")} Lo racconta chi è del posto</h3>
    ${proposte.length ? proposte.map((p) => `<blockquote>${esc(p.testo)}<span class="etich demo">In verifica</span></blockquote>`).join("") : `<p class="nota-tenue">Ricordi, leggende, dettagli che internet non dice: gli ambasciatori del paese li aggiungono qui, con la fonte.</p>`}
    <div class="azioni" style="grid-template-columns:1fr 1fr"><button class="btn" id="proponi">${icona("modifica")} Aggiungi un'informazione</button>
      <button class="btn" id="collega">${icona("nfc")} Collega un QR o un tag</button></div>
    <p class="fonte">Chi aggiunge un'informazione indica la fonte. Esce solo dopo la verifica di un esperto locale. Gli ambasciatori possono collegare qui i QR e i tag dei progetti culturali del paese, così non vanno persi.</p></div>`;
  $("#proponi").addEventListener("click", () => fai("proponi", l));
  $("#collega").addEventListener("click", () => apriLettore(l));
}

/* ---- Bus: orari veri delle aziende ---- */
function busDi(l) {
  const box = $("#sapere"); if (!box) return;
  const linee = LINEE.filter((x) => x.fermate.some((f) => f.comune === l.comune));
  box.innerHTML = linee.length ? `<div class="riquadro"><h3>${icona("muoversi")} Bus da ${esc(comuneDi(l.comune).nome)}</h3>
    ${linee.map((x) => `<p><strong>${esc(x.azienda)}</strong> · ${esc(x.titolo)}</p>`).join("")}
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn" data-apri="bus">Vedi gli orari</button></div></div>` : "";
}

/* ================= Azioni ================= */
function prossimiGiorni(n) {
  const fmt = new Intl.DateTimeFormat("it-IT", { weekday: "short" });
  return Array.from({ length: n }, (_, i) => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + i); return { d, nome: i === 0 ? "Oggi" : i === 1 ? "Domani" : fmt.format(d), num: d.getDate() }; });
}
const ORARI = {
  tavolo: ["12:30", "13:00", "13:30", "19:30", "20:00", "20:30", "21:00", "21:30"],
  campo: ["09:00", "10:00", "11:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
  appuntamento: ["09:00", "09:30", "10:00", "10:30", "11:00", "15:30", "16:00", "16:30", "17:00", "17:30"],
};
const occupato = (g, h, osm) => ((g * 7 + h.charCodeAt(1) * 3 + h.charCodeAt(3) + osm.length) % 4) === 0;
const DEMO = `<p class="fonte"><span class="etich demo">Dimostrazione</span> Disponibilità di esempio: l'attività non è ancora collegata.</p>`;

function aggiungiAgenda(voce) {
  const v = leggi("agenda", []); v.unshift({ ...voce, n: Date.now() }); scrivi("agenda", v); contaAgenda();
}
function contaAgenda() { const n = leggi("agenda", []).length; $("#conta").hidden = !n; $("#conta").textContent = n; }

function fai(azione, l) {
  if (azione === "solito") {
    const s = leggi("soliti", []), i = s.indexOf(l.osm);
    if (i >= 0) { s.splice(i, 1); avvisa("Tolto dai tuoi soliti"); } else { s.push(l.osm); guadagna(2, "Aggiunto ai tuoi soliti"); }
    scrivi("soliti", s); return apriLuogo(l.osm);
  }
  if (azione === "visita") {
    const it = leggi("itinerario", []); if (!it.includes(l.osm)) { it.push(l.osm); scrivi("itinerario", it); guadagna(5, "Aggiunto all'itinerario"); } else avvisa("È già nel tuo itinerario");
    return;
  }
  if (azione === "bus") return vai("bus", l.comune);
  if (azione === "rivendica") return rivendica(l);
  if (azione === "proponi") return modulo(l, "Aggiungi un'informazione", `
      <label class="campo">Cosa sai di questo posto?<textarea id="p-testo" rows="4" placeholder="Una data, una storia, un dettaglio…"></textarea></label>
      <label class="campo">Da dove lo sai? (fonte)<input id="p-fonte" placeholder="Un libro, un documento, un sito, un archivio"></label>`,
    () => { const tx = $("#p-testo").value.trim(), f = $("#p-fonte").value.trim(); if (!tx || !f) { avvisa("Scrivi l'informazione e la fonte"); return false; }
      const p = leggi("proposte", []); p.push({ osm: l.osm, testo: `${tx} (fonte: ${f})` }); scrivi("proposte", p); guadagna(15, "Inviata alla verifica"); return true; });
  if (azione === "ordine") return modulo(l, "Ordina e ritira", `
      <label class="campo">Cosa ti serve?<textarea id="lista" rows="4" placeholder="Es. pane, latte, mezzo chilo di mele"></textarea></label>
      <label class="campo">Quando passi?<input id="ritiro" type="time" value="18:00"></label>${arrotonda()}`,
    () => { const tx = $("#lista").value.trim(); if (!tx) { avvisa("Scrivi cosa ti serve"); return false; }
      aggiungiAgenda({ tipo: "Ordine", osm: l.osm, nome: nomeDi(l), quando: oggiAlle($("#ritiro").value), dettaglio: tx });
      donazione(); guadagna(10, "Ordine inviato"); return true; });
  if (azione === "camera") return modulo(l, "Prenota una camera", `
      <label class="campo">Arrivo<input id="arrivo" type="date" value="${new Date().toISOString().slice(0, 10)}"></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px"><label class="campo">Notti<input id="notti" type="number" min="1" value="1"></label>
      <label class="campo">Persone<input id="persone" type="number" min="1" value="2"></label></div>`,
    () => { aggiungiAgenda({ tipo: "Camera", osm: l.osm, nome: nomeDi(l), quando: new Date($("#arrivo").value + "T14:00").toISOString(), dettaglio: `${$("#notti").value} notti, ${$("#persone").value} persone` });
      guadagna(10, "Richiesta inviata"); return true; });
  const giorni = prossimiGiorni(7), orari = ORARI[azione]; let g = 0, o = null;
  const disegna = () => modulo(l, AZIONI[azione][0], `
      <p class="domanda">Che giorno?</p>
      <div class="scelte">${giorni.map((x, i) => `<button class="scelta" data-g="${i}" aria-pressed="${i === g}"><small>${x.nome}</small>${x.num}</button>`).join("")}</div>
      <p class="domanda">A che ora?</p>
      <div class="scelte a-capo">${orari.map((h) => `<button class="scelta" data-o="${h}" aria-pressed="${h === o}" ${occupato(g, h, l.osm) ? "disabled" : ""}>${h}</button>`).join("")}</div>
      ${azione === "tavolo" ? `<label class="campo">Quante persone?<input id="persone" type="number" min="1" value="${S.persone || 2}"></label>` : ""}`,
    () => { if (!o) { avvisa("Scegli un orario"); return false; }
      const d = new Date(giorni[g].d); const [hh, mm] = o.split(":"); d.setHours(+hh, +mm);
      aggiungiAgenda({ tipo: azione === "tavolo" ? "Tavolo" : azione === "campo" ? "Campo" : "Appuntamento", osm: l.osm, nome: nomeDi(l), quando: d.toISOString(),
        dettaglio: azione === "tavolo" ? `${$("#persone").value} persone` : "" });
      guadagna(10, "Prenotato"); return true; },
    () => {
      $$("[data-g]", $("#corpo")).forEach((b) => b.addEventListener("click", () => { g = +b.dataset.g; o = null; disegna(); }));
      $$("[data-o]", $("#corpo")).forEach((b) => b.addEventListener("click", () => { o = b.dataset.o; disegna(); }));
    });
  disegna();
}
const oggiAlle = (hhmm) => { const d = new Date(); const [h, m] = hhmm.split(":"); d.setHours(+h, +m, 0, 0); return d.toISOString(); };
const arrotonda = () => leggi("arrotonda", false) ? `<p class="fonte"><span class="etich ok">${icona("dono")} Arrotondamento solidale attivo</span> La differenza va a ${esc(leggi("associazione", "un'associazione del paese"))}.</p>` : "";
function donazione() { if (leggi("arrotonda", false)) scrivi("donato", +(leggi("donato", 0) + 0.5).toFixed(2)); }

function modulo(l, titolo, html, conferma, dopo) {
  corpo(`
    <div class="testa"><div><span class="etich" style="color:${l.cat.colore}">${esc(nomeDi(l))}</span><h2 style="margin-top:6px">${esc(titolo)}</h2></div>
      <button class="chiudi" id="chiudi" aria-label="Annulla">${icona("chiudi")}</button></div>
    ${html}
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="conferma">Conferma</button></div>
    ${titolo.startsWith("Aggiungi un") ? "" : DEMO}`);
  altezza("alto");
  $("#chiudi").addEventListener("click", () => apriLuogo(l.osm));
  $("#conferma").addEventListener("click", () => { if (conferma()) { apriLuogo(l.osm); altezza("medio"); } });
  dopo && dopo();
}

/* ---- Vetrina: prenota e ritira, si paga in negozio ---- */
function ritira(l, x) {
  modulo(l, "Prenota e ritira", `
      <div class="riquadro" style="margin-top:6px"><h3>${esc(x.nome)}</h3><p>${esc(x.formato || "")} · ${x.prezzo ? euro(x.prezzo) : "prezzo in negozio"}</p></div>
      <label class="campo">Quanti?<input id="q" type="number" min="1" value="1"></label>
      <label class="campo">Quando passi a ritirarlo?<input id="ritiro" type="time" value="18:00"></label>
      <p class="nota-tenue">Lo paghi in negozio quando lo ritiri. Il negozio conferma che è pronto.</p>`,
    () => { const q = Math.max(1, +$("#q").value || 1);
      aggiungiAgenda({ tipo: "Ritiro", osm: l.osm, nome: nomeDi(l), quando: oggiAlle($("#ritiro").value), dettaglio: `${q} × ${x.nome}${x.prezzo ? " · " + euro(x.prezzo * q) : ""}, da pagare in negozio` });
      guadagna(10, "Prenotato: lo ritiri in negozio"); return true; });
}

/* ---- Esercenti: rivendicare la scheda ---- */
function rivendica(l) {
  corpo(`
    <div class="testa"><div><span class="etich">Per gli esercenti</span><h2 style="margin-top:6px">Riscatta ${esc(nomeDi(l))}</h2></div>
      <button class="chiudi" id="chiudi" aria-label="Annulla">${icona("chiudi")}</button></div>
    <div class="riquadro"><h3>${icona("nfc")} Con il tag Guardati attorno</h3>
      <p>Ogni attività riceve un piccolo tag da mettere in vetrina. Avvicini il telefono e la scheda è tua. Lo stesso tag fa entrare i clienti nella tua pagina.</p>
      <div class="azioni" style="grid-template-columns:1fr"><button class="btn primario" id="leggi-tag">Avvicina il telefono al tag</button></div></div>
    <div class="riquadro"><h3>Con un codice</h3><p>Se non hai ancora il tag, ti mandiamo un codice per posta all'indirizzo dell'attività.</p>
      <label class="campo">Codice ricevuto<input id="codice" inputmode="numeric" placeholder="6 cifre"></label>
      <div class="azioni" style="grid-template-columns:1fr"><button class="btn" id="usa-codice">Verifica</button></div></div>
    <p class="fonte"><span class="etich demo">Dimostrazione</span> In questa versione la verifica è simulata.</p>`);
  altezza("alto");
  const fatto = () => {
    const r = leggi("rivendicate", []); if (!r.includes(l.osm)) r.push(l.osm); scrivi("rivendicate", r);
    guadagna(50, "Scheda riscattata"); gestisci(l);
  };
  $("#chiudi").addEventListener("click", () => apriLuogo(l.osm));
  $("#leggi-tag").addEventListener("click", async () => {
    if ("NDEFReader" in window) { try { const r = new NDEFReader(); await r.scan(); avvisa("Avvicina il tag…"); r.onreading = fatto; return; } catch { /* permesso negato: si simula */ } }
    fatto();
  });
  $("#usa-codice").addEventListener("click", () => { if (!/^\d{6}$/.test($("#codice").value)) return avvisa("Il codice ha 6 cifre"); fatto(); });
}
function gestisci(l) {
  corpo(`
    <div class="testa"><div><span class="etich ok">${icona("spunta")} La scheda è tua</span><h2 style="margin-top:6px">${esc(nomeDi(l))}</h2></div>
      <button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    ${l.cat.info ? `<p class="domanda">${esc(l.cat.info.titolo)}</p>
    <div id="listino">${(schedaDi(l.osm)?.listino?.length ? schedaDi(l.osm).listino : [{ voce: "", prezzo: "" }]).map(rigaListino).join("")}</div>
    <button class="btn piccolo" id="agg-voce" style="margin-top:8px">${icona("piu")} Aggiungi una voce</button>
    <label class="campo">Altro da sapere<input id="extra" value="${esc(schedaDi(l.osm)?.extra || "")}" placeholder="Es. consegna a domicilio, asporto, parcheggio"></label>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn primario" id="salva-scheda">Salva la scheda</button></div>` : ""}
    <p class="domanda">${icona("negozio")} La tua vetrina</p>
    <p class="nota-tenue" style="margin:0">Pochi prodotti ma veri. Se non confermi la disponibilità per 30 giorni, il prodotto si nasconde da solo.</p>
    <div id="vetrina-ed">${(schedaDi(l.osm)?.prodotti?.length ? schedaDi(l.osm).prodotti : (prodottiDi(l)?.prodotti || [{ nome: "", prezzo: "" }])).map(rigaProdotto).join("")}</div>
    <button class="btn piccolo" id="agg-prod" style="margin-top:8px">${icona("piu")} Aggiungi un prodotto</button>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn primario" id="salva-vetrina">Salva la vetrina</button></div>
    <p class="domanda">Pubblica in Bacheca</p>
    <label class="campo">Titolo<input id="b-titolo" placeholder="Es. Menu del giorno, offerta, chiusura per ferie"></label>
    <label class="campo">Testo<textarea id="b-testo" rows="3"></textarea></label>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="pubblica">Pubblica</button></div>
    <div class="riquadro"><h3>${icona("nfc")} Il tuo tag e il tuo QR</h3><p>Aprono questa scheda nell'app. Questo è il link da scrivere sul tag o nel QR:</p>
      <p class="fonte" style="word-break:break-all">${esc(linkDi(l))}</p></div>
    <p class="sezione-t">Servizi per la tua attività</p>
    <div class="gruppo">${SERVIZI_EXTRA.map(([ic, ti, tx]) => `<div class="voce">${icona(ic)}<div><strong>${ti}</strong><small>${tx}</small></div><button class="btn piccolo" data-richiedi="${esc(ti)}">Richiedi</button></div>`).join("")}</div>
    ${DEMO}`);
  $("#chiudi").addEventListener("click", () => apriLuogo(l.osm));
  $$("[data-richiedi]", $("#corpo")).forEach((b) => b.addEventListener("click", () => { b.textContent = "Richiesto"; b.disabled = true; avvisa("Richiesta inviata: ti ricontattiamo"); }));
  if ($("#agg-voce")) {
    $("#agg-voce").addEventListener("click", () => $("#listino").insertAdjacentHTML("beforeend", rigaListino({ voce: "", prezzo: "" })));
    $("#salva-scheda").addEventListener("click", () => {
      const listino = $$("#listino .riga-listino").map((r) => ({ voce: $("input", r).value.trim(), prezzo: parseFloat(String($("input[type=number]", r).value).replace(",", ".")) }))
        .filter((x) => x.voce && x.prezzo > 0);
      const tutte = leggi("schede", {}); tutte[l.osm] = { listino, extra: $("#extra").value.trim() }; scrivi("schede", tutte);
      guadagna(10, "Scheda aggiornata"); apriLuogo(l.osm);
    });
  }
  $("#agg-prod").addEventListener("click", () => $("#vetrina-ed").insertAdjacentHTML("beforeend", rigaProdotto({ nome: "", prezzo: "" })));
  $("#salva-vetrina").addEventListener("click", () => {
    const prodotti = $$("#vetrina-ed .riga-prodotto").map((r) => ({ nome: $(".p-nome", r).value.trim(), formato: $(".p-formato", r).value.trim(),
      prezzo: parseFloat(String($(".p-prezzo", r).value).replace(",", ".")) || 0, esaurito: !$(".p-c-e", r).checked })).filter((x) => x.nome);
    const tutte = leggi("schede", {}); tutte[l.osm] = { ...(tutte[l.osm] || {}), prodotti, confermati: new Date().toISOString() }; scrivi("schede", tutte);
    guadagna(10, "Vetrina salvata"); apriLuogo(l.osm);
  });
  $("#pubblica").addEventListener("click", () => {
    const ti = $("#b-titolo").value.trim(), tx = $("#b-testo").value.trim(); if (!ti) return avvisa("Scrivi un titolo");
    const mie = leggi("bacheca-mie", []); mie.unshift({ id: "mia-" + Date.now(), tipo: "attivita", da: nomeDi(l), comune: l.comune, quando: "Adesso", titolo: ti, testo: tx, mia: true });
    scrivi("bacheca-mie", mie); guadagna(5, "Pubblicato in Bacheca"); apriLuogo(l.osm);
  });
}

const rigaListino = (x) => `<div class="riga-listino" style="display:grid;grid-template-columns:1fr 6rem;gap:8px;margin-top:8px">
  <input class="campo-in" placeholder="Es. Pizza margherita" value="${esc(x.voce)}">
  <input class="campo-in" type="number" step="0.5" min="0" placeholder="€" value="${x.prezzo || ""}"></div>`;
const rigaProdotto = (x) => `<div class="riga-prodotto">
  <input class="campo-in p-nome" placeholder="Prodotto" value="${esc(x.nome)}">
  <input class="campo-in p-formato" placeholder="Formato" value="${esc(x.formato || "")}">
  <input class="campo-in p-prezzo" type="number" step="0.5" min="0" placeholder="€" value="${x.prezzo || ""}">
  <label class="c-e"><input type="checkbox" class="p-c-e" ${x.esaurito ? "" : "checked"}> c'è</label></div>`;
const SERVIZI_EXTRA = [
  ["nfc", "Tag NFC in vetrina", "Il cliente avvicina il telefono e arriva alla tua scheda"],
  ["sito", "Profili su Google e social", "Li creiamo e li teniamo aggiornati con i dati della scheda"],
  ["stella", "Strumenti con l'intelligenza artificiale", "Risposte ai clienti, menù tradotti, preventivi"],
];

/* ================= Le mie cose: moduli che l'utente aggiunge al Profilo ================= */
const MODULI = {
  soliti: { nome: "I miei soliti", icona: "cuore", desc: () => { const n = leggi("soliti", []).length; return n ? `${n} ${n === 1 ? "posto" : "posti"} da prenotare con un tocco` : "Il barbiere, il supermercato, il campo: tocca il cuore su un posto"; }, apri: () => { vai("mappa"); pannelloPrenota(); } },
  bus: { nome: "Bus da casa", icona: "muoversi", desc: () => `Le partenze da ${comuneDi(utente()?.comune)?.nome || "casa tua"}`, apri: () => vai("bus") },
  itinerario: { nome: "Il mio itinerario", icona: "percorso", desc: () => { const n = leggi("itinerario", []).length; return n ? `${n} tappe` : "I posti che vuoi vedere, in fila"; }, apri: () => vai("itinerari") },
  farmacie: { nome: "Farmacie vicine", icona: "salute", desc: () => "Le più vicine a te, con il telefono", apri: () => { vai("mappa"); azzera(); S.cat = "salute"; S.sotto = 0; aggiorna(); altezza("medio"); } },
  avvisi: { nome: "Avvisi del mio paese", icona: "bacheca", desc: () => "Solo quello che hai scelto di vedere", apri: () => vai("bacheca") },
  punti: { nome: "Punti e crediti", icona: "moneta", desc: () => { const lv = livello(); return `${lv.nome} · ${lv.punti} punti · € ${lv.crediti} di crediti`; }, apri: () => vai("punti") },
  solidale: { nome: "Arrotondamento solidale", icona: "dono", desc: () => leggi("arrotonda", false) ? `Attivo · donati € ${leggi("donato", 0).toFixed(2).replace(".", ",")}` : "Arrotonda gli ordini e aiuta un'associazione", apri: () => { const v = !leggi("arrotonda", false); scrivi("arrotonda", v); avvisa(v ? "Grazie: ogni ordine aiuta il paese" : "Arrotondamento spento"); paginaProfilo(); } },
  incontri: { nome: "I miei incontri", icona: "persone", desc: () => { const n = leggi("partecipo", []).length + leggi("incontri", []).length; return n ? `${n} in programma` : "Una pizza, un aperitivo, una partita"; }, apri: () => vai("incontri") },
  attivita: { nome: "La mia attività", icona: "attivita", desc: () => { const r = leggi("rivendicate", []).length; return r ? `Ne gestisci ${r}` : "Riscattala gratis o registrala"; }, apri: () => vai("registra") },
};
const miei = () => leggi("moduli", ["soliti", "incontri", "bus"]);

/* ================= Prenota: i tuoi soliti e i servizi vicini ================= */
function pannelloPrenota() {
  const soliti = leggi("soliti", []).map((o) => TUTTI.find((l) => l.osm === o)).filter(Boolean);
  const prenotabili = TUTTI.filter((l) => ["tavolo", "campo", "appuntamento", "camera", "ordine"].includes(l.cat.azione))
    .filter((l) => !soliti.includes(l)).sort((a, b) => km(centro(), a) - km(centro(), b)).slice(0, 12);
  corpo(`
    <div class="testa"><div><h2>Prenota</h2><p class="nota-tenue" style="margin:2px 0 0">I tuoi soliti, e i servizi più vicini</p></div>
      <button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    <p class="sezione-t">I tuoi soliti</p>
    ${soliti.length ? soliti.map((l) => `<div class="riga" style="grid-template-columns:auto 1fr auto">
        <span class="segno" style="background:${l.cat.colore}14;color:${l.cat.colore}">${icona(l.cat.icona)}</span>
        <span><strong>${esc(nomeDi(l))}</strong><small>${esc(tipoDi(l))} · ${esc(comuneDi(l.comune)?.nome || "")}</small></span>
        <button class="btn piccolo accento" data-rapido="${esc(l.osm)}">${l.cat.azione === "chiama" ? "Chiama" : "Prenota"}</button></div>`).join("")
      : `<p class="nota-tenue">Il barbiere, il supermercato, il campo del giovedì: tocca il cuore su un posto e lo ritrovi qui, a un tocco.</p>`}
    <p class="sezione-t">Vicino a te</p>
    ${prenotabili.map(riga).join("")}`);
  altezza("alto");
  $("#chiudi").addEventListener("click", () => { elenco(); altezza("basso"); });
  $$("[data-rapido]", $("#corpo")).forEach((b) => b.addEventListener("click", () => { const l = TUTTI.find((x) => x.osm === b.dataset.rapido); apriLuogo(l.osm, true); if (l.cat.azione !== "chiama") fai(l.cat.azione, l); }));
  $$("[data-osm]", $("#corpo")).forEach((b) => b.addEventListener("click", () => apriLuogo(b.dataset.osm, true)));
}

/* ================= Pagine ================= */
function pagina(html) { const p = $("#pagina"); p.innerHTML = html; p.hidden = false; p.scrollTop = 0; collegaApri(p); }
function collegaApri(r) { $$("[data-apri]", r).forEach((b) => b.addEventListener("click", () => vai(b.dataset.apri))); }
const fmtData = (iso) => new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

function paginaAgenda() {
  const v = leggi("agenda", []), u = utente();
  const promemoria = u?.promemoria || "calendario";
  pagina(`<h1>Agenda</h1>
    <div class="azioni" style="grid-template-columns:1fr;margin:8px 0 6px"><button class="btn accento pieno" id="agenda-prenota">${icona("calendario")} Prenota</button></div>
    <p class="nota-tenue">Le tue prenotazioni e i tuoi ordini. ${promemoria === "sveglia" ? "Ti avvisiamo con una sveglia il giorno prima e un'ora prima." : "Puoi metterle nel calendario del telefono."}</p>
    ${v.length ? v.map((x) => `<div class="carta">
        <span class="etich">${esc(x.tipo)}</span>
        <h3>${esc(x.nome)}</h3><p>${esc(fmtData(x.quando))}${x.dettaglio ? " · " + esc(x.dettaglio) : ""}</p>
        <div class="azioni">
          ${promemoria === "sveglia" ? `<button class="btn piccolo ${x.sveglia ? "attivo" : ""}" data-sveglia="${x.n}">${icona("sveglia")} ${x.sveglia ? "Sveglia messa" : "Metti la sveglia"}</button>`
            : `<button class="btn piccolo" data-ics="${x.n}">${icona("calendario")} Nel calendario</button>`}
          <button class="btn piccolo" data-annulla="${x.n}">Annulla</button></div></div>`).join("")
      : `<div class="vuoto">${icona("calendario")}<p>Niente in programma.<br>Tocca «Prenota» qui sopra per cominciare.</p></div>`}
    <p class="fonte">Promemoria scelto alla registrazione: ${promemoria === "sveglia" ? "sveglia" : "calendario"}. Si cambia dal Profilo.</p>`);
  $("#agenda-prenota").addEventListener("click", () => { vai("mappa"); pannelloPrenota(); });
  $$("[data-annulla]").forEach((b) => b.addEventListener("click", () => { scrivi("agenda", leggi("agenda", []).filter((x) => x.n !== +b.dataset.annulla)); contaAgenda(); paginaAgenda(); }));
  $$("[data-ics]").forEach((b) => b.addEventListener("click", () => scaricaIcs(leggi("agenda", []).find((x) => x.n === +b.dataset.ics))));
  $$("[data-sveglia]").forEach((b) => b.addEventListener("click", async () => {
    const a = leggi("agenda", []), x = a.find((y) => y.n === +b.dataset.sveglia); x.sveglia = !x.sveglia; scrivi("agenda", a);
    if (x.sveglia && "Notification" in window && Notification.permission === "default") { try { await Notification.requestPermission(); } catch { /* niente */ } }
    avvisa(x.sveglia ? "Sveglia messa: il giorno prima e un'ora prima" : "Sveglia tolta"); paginaAgenda();
  }));
}
function scaricaIcs(x) {
  const d = new Date(x.quando), fine = new Date(d.getTime() + 3600e3);
  const f = (z) => z.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Guardati attorno//IT", "BEGIN:VEVENT", `UID:${x.n}@guardatiattorno`, `DTSTAMP:${f(new Date())}`,
    `DTSTART:${f(d)}`, `DTEND:${f(fine)}`, `SUMMARY:${x.tipo}: ${x.nome}`, `DESCRIPTION:${x.dettaglio || ""}`,
    "BEGIN:VALARM", "TRIGGER:-PT1H", "ACTION:DISPLAY", "DESCRIPTION:Promemoria", "END:VALARM", "END:VEVENT", "END:VCALENDAR"].join("\r\n");
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([ics], { type: "text/calendar" })); a.download = "prenotazione.ics"; a.click();
}

const TIPI_BACHECA = { comune: "Comune", attivita: "Attività", eventi: "Eventi", associazioni: "Associazioni", trasporti: "Trasporti" };
function paginaEventi() {
  const u = utente();
  const voci = leggi("bacheca-mie", []).concat(BACHECA).filter((x) => x.tipo === "eventi").filter((x) => !u?.soloMioComune || !x.comune || x.comune === u.comune);
  pagina(`<h1>Succede</h1>${segmenti("eventi")}<p class="nota-tenue">Feste, sagre, tornei e visite nel Vallo. Gli incontri organizzati dalle persone sono nella scheda accanto.</p>
    ${voci.map(cartaAvviso).join("") || `<div class="vuoto">${icona("succede")}<p>Nessun evento in programma.</p></div>`}`);
}
const cartaAvviso = (x) => `<div class="carta ${x.urgente ? "urgente" : ""}">
        <span class="etich">${esc(TIPI_BACHECA[x.tipo])}</span> ${x.esempio ? '<span class="etich demo">Esempio</span>' : ""} ${x.mia ? '<span class="etich ok">Tua</span>' : ""}
        <h3>${esc(x.titolo)}</h3><p>${esc(x.testo)}</p>
        <p class="fonte">${esc(x.da)}${x.comune ? " · " + esc(comuneDi(x.comune)?.nome || "") : ""}${x.link ? ` · <a href="${esc(x.link)}" target="_blank" rel="noopener">fonte</a>` : ""}</p></div>`;
function paginaBacheca(filtro = null) {
  const u = utente(), scelti = (u?.bacheca || Object.keys(TIPI_BACHECA)).filter((k) => k !== "eventi");
  const voci = leggi("bacheca-mie", []).concat(BACHECA).filter((x) => scelti.includes(x.tipo)).filter((x) => !filtro || x.tipo === filtro)
    .filter((x) => !u?.soloMioComune || !x.comune || x.comune === u.comune);
  pagina(`<h1>Succede</h1>${segmenti("avvisi")}<p class="nota-tenue">Avvisi dei Comuni, offerte delle attività, associazioni e trasporti. Vedi solo ciò che hai scelto.</p>
    <div class="fila">${[[null, "Tutto"], ...Object.entries(TIPI_BACHECA).filter(([k]) => scelti.includes(k) && k !== "eventi")].map(([k, n]) => `<button class="chip" data-filtro="${k ?? ""}" aria-pressed="${filtro === k}">${n}</button>`).join("")}</div>
    ${voci.map(cartaAvviso).join("") || `<div class="vuoto">${icona("bacheca")}<p>Niente da mostrare con i filtri scelti.</p></div>`}
    <div class="carta"><h3>Scegli cosa vedere</h3><p class="nota-tenue">Tutti possono comunicare e farsi conoscere, ma decidi tu cosa arriva sul tuo telefono.</p>
      <div class="azioni" style="grid-template-columns:1fr"><button class="btn" data-apri="preferenze">Cambia le preferenze</button></div></div>`);
  $$("[data-filtro]").forEach((b) => b.addEventListener("click", () => paginaBacheca(b.dataset.filtro || null)));
}

/* ================= Community: gli Incontri ================= */
const segmenti = (attivo) => `<div class="segmenti tre" role="tablist">
  <button role="tab" aria-selected="${attivo === "eventi"}" data-apri="eventi">Eventi</button>
  <button role="tab" aria-selected="${attivo === "incontri"}" data-apri="incontri">Incontri</button>
  <button role="tab" aria-selected="${attivo === "avvisi"}" data-apri="avvisi">Avvisi</button></div>`;
const COSE = {
  "Una pizza": { cat: "mangiare", sotto: 0, gusto: "Pizza e street food" },
  "Bere qualcosa": { cat: "mangiare", sotto: 4, gusto: "Vita notturna" },
  "Un caffè": { cat: "mangiare", sotto: 4, gusto: "Caffè e dolci" },
  "Cena tipica": { cat: "mangiare", sotto: 1, gusto: "Cucina tipica" },
  "Calcetto o tennis": { cat: "sport", sotto: null, gusto: "Sport" },
  "Una passeggiata": { cat: "natura", sotto: null, gusto: "Natura e passeggiate" },
  "Una visita": { cat: "cultura", sotto: null, gusto: "Cultura e storia" },
};
const COSE_PER_CAT = { mangiare: "Una pizza", sport: "Calcetto o tennis", natura: "Una passeggiata", cultura: "Una visita" };
const MINORI = ["Fino a 13", "14–17"];
function prossimo(giorniAvanti, ora) { const d = new Date(); d.setDate(d.getDate() + giorniAvanti); const [h, m] = ora.split(":"); d.setHours(+h, +m, 0, 0); return d.toISOString(); }
let ESEMPI_INCONTRI = null;
function esempiIncontri() {
  if (ESEMPI_INCONTRI) return ESEMPI_INCONTRI;
  const casa = utente()?.comune || "teggiano";
  const vicino = (f) => TUTTI.filter(f).sort((a, b) => km(comuneDi(casa).centro, a) - km(comuneDi(casa).centro, b))[0];
  const pizza = vicino((l) => l.cat.id === "mangiare" && CATEGORIE[0].sotto[0][1](l));
  const bar = vicino((l) => l.tipo === "amenity=bar" || l.tipo === "amenity=pub") || vicino((l) => l.tipo === "amenity=cafe");
  const campo = vicino((l) => l.cat.id === "sport" && (l.sport || "").includes("soccer"));
  const sab = (6 - new Date().getDay() + 7) % 7 || 7;
  ESEMPI_INCONTRI = [
    pizza && { id: "es-pizza", esempio: true, cosa: "Una pizza", osm: pizza.osm, quando: prossimo(sab, "20:30"), max: 8, partecipanti: ["Anna", "Luca", "Gerardo"], aperto: "Tutte", da: "Anna", note: "Pizza e due chiacchiere, chi c'è c'è." },
    bar && { id: "es-bar", esempio: true, cosa: "Bere qualcosa", osm: bar.osm, quando: prossimo(1, "19:00"), max: 6, partecipanti: ["Marco", "Sara"], aperto: "Tutte", da: "Marco", note: "Aperitivo dopo il lavoro." },
    campo && { id: "es-calcetto", esempio: true, cosa: "Calcetto o tennis", osm: campo.osm, quando: prossimo(sab + 1, "10:00"), max: 10, partecipanti: ["Nicola", "Pietro", "Vincenzo", "Rocco", "Antonio"], aperto: "Tutte", da: "Nicola", note: "Ne mancano cinque per fare due squadre." },
  ].filter(Boolean);
  return ESEMPI_INCONTRI;
}
const tuttiIncontri = () => leggi("incontri", []).concat(esempiIncontri()).filter((x) => new Date(x.quando) > Date.now() - 3 * 3600e3);
function visibile(x, u) {
  const minore = MINORI.includes(u?.eta);
  if (minore) return x.aperto === u.eta;            // i minori vedono solo gli incontri della loro fascia
  return x.aperto === "Tutte" || x.aperto === u?.eta;
}

function paginaIncontri(filtro = "tutti") {
  const u = utente(), part = leggi("partecipo", []), gusti = u?.gusti || [];
  const lista = tuttiIncontri().filter((x) => visibile(x, u)).map((x) => ({ ...x, l: TUTTI.find((y) => y.osm === x.osm) })).filter((x) => x.l)
    .filter((x) => filtro !== "gusti" || gusti.includes(COSE[x.cosa]?.gusto))
    .filter((x) => filtro !== "paese" || x.l.comune === u?.comune)
    .filter((x) => filtro !== "miei" || x.mio || part.includes(x.id))
    .sort((a, b) => new Date(a.quando) - new Date(b.quando));
  pagina(`<h1>Succede</h1>${segmenti("incontri")}
    <p class="nota-tenue">Una pizza, un aperitivo, una partita: ci si organizza qui e ci si vede in un posto del paese.</p>
    <div class="azioni" style="grid-template-columns:1fr;margin:4px 0 10px"><button class="btn accento pieno" data-apri="proponi">${icona("piu")} Organizza</button></div>
    <div class="fila">${[["tutti", "Tutti"], ["gusti", "Per i miei gusti"], ["paese", "Il mio paese"], ["miei", "I miei"]].map(([k, n]) => `<button class="chip" data-f="${k}" aria-pressed="${filtro === k}">${n}</button>`).join("")}</div>
    ${lista.map((x) => {
      const ci = x.mio || part.includes(x.id), n = x.partecipanti.length + (part.includes(x.id) ? 1 : 0);
      return `<div class="carta">
        <span class="etich">${esc(x.cosa)}</span> ${x.esempio ? '<span class="etich demo">Esempio</span>' : ""} ${x.mio ? '<span class="etich ok">Organizzi tu</span>' : ""} ${x.aperto !== "Tutte" ? `<span class="etich">${esc(x.aperto)} anni</span>` : ""}
        <h3>${esc(nomeDi(x.l))}</h3>
        <p>${esc(fmtData(x.quando))} · ${esc(comuneDi(x.l.comune)?.nome || "")}</p>
        ${x.note ? `<p class="nota-tenue">«${esc(x.note)}» — ${esc(x.da)}</p>` : ""}
        <div class="partecipanti"><div class="facce">${x.partecipanti.slice(0, 5).map((p) => `<span>${esc(p[0])}</span>`).join("")}</div><small>${n} ${n === 1 ? "persona" : "persone"} · ${Math.max(x.max - n, 0)} posti liberi</small></div>
        <div class="azioni">
          ${x.mio ? `<button class="btn accento" data-prenota-gruppo="${esc(x.id)}">${icona("calendario")} Prenota per ${n}</button>`
            : `<button class="btn ${ci ? "primario" : "accento"}" data-partecipo="${esc(x.id)}">${ci ? `${icona("spunta")} Ci sei` : "Ci sono"}</button>`}
          <button class="btn" data-vedi="${esc(x.osm)}">${icona("luogo")} Sul posto</button></div></div>`;
    }).join("") || `<div class="vuoto">${icona("persone")}<p>Nessun incontro con questi filtri.<br>Proponine uno tu: bastano quattro tocchi.</p></div>`}
    <p class="fonte">Gli incontri si fanno solo in luoghi pubblici. Si vedono i nomi, mai i numeri di telefono. Chi ha meno di 18 anni vede solo gli incontri della sua età.</p>`);
  $$("[data-f]").forEach((b) => b.addEventListener("click", () => paginaIncontri(b.dataset.f)));
  $$("[data-vedi]").forEach((b) => b.addEventListener("click", () => { vai("mappa"); azzera(); S.comune = null; aggiorna(); apriLuogo(b.dataset.vedi, true); }));
  $$("[data-partecipo]").forEach((b) => b.addEventListener("click", () => {
    const id = b.dataset.partecipo, pp = leggi("partecipo", []), x = tuttiIncontri().find((y) => y.id === id), l = TUTTI.find((y) => y.osm === x.osm);
    if (pp.includes(id)) { scrivi("partecipo", pp.filter((y) => y !== id)); scrivi("agenda", leggi("agenda", []).filter((a) => a.incontro !== id)); contaAgenda(); avvisa("Non partecipi più"); }
    else { pp.push(id); scrivi("partecipo", pp); aggiungiAgenda({ tipo: "Incontro", incontro: id, osm: x.osm, nome: `${x.cosa} · ${nomeDi(l)}`, quando: x.quando, dettaglio: `con ${x.partecipanti.join(", ")}` }); guadagna(5, "Ci sei: è in Agenda"); }
    paginaIncontri(filtro);
  }));
  $$("[data-prenota-gruppo]").forEach((b) => b.addEventListener("click", () => {
    const x = tuttiIncontri().find((y) => y.id === b.dataset.prenotaGruppo), l = TUTTI.find((y) => y.osm === x.osm);
    vai("mappa"); azzera(); aggiorna(); apriLuogo(l.osm, true);
    S.persone = x.partecipanti.length; if (["tavolo", "campo", "appuntamento"].includes(l.cat.azione)) fai(l.cat.azione, l); S.persone = null;
  }));
}

function paginaProponi(osm) {
  const u = utente(), dal = osm ? TUTTI.find((l) => l.osm === osm) : null;
  let cosa = dal ? COSE_PER_CAT[dal.cat.id] : "Una pizza";
  const casa = centro();
  const posti = (c) => { const k = COSE[c]; const cat = CATEGORIE.find((x) => x.id === k.cat);
    return TUTTI.filter((l) => l.cat === cat && (k.sotto == null || cat.sotto[k.sotto][1](l))).sort((a, b) => km(casa, a) - km(casa, b)).slice(0, 30); };
  const disegna = () => {
    const elenco = posti(cosa); if (dal && !elenco.includes(dal)) elenco.unshift(dal);
    pagina(`<h1>Organizza un incontro</h1><p class="nota-tenue">Scegli cosa, dove e quando. Gli altri lo vedono in Succede e toccano «Ci sono».</p>
      <p class="domanda">Cosa?</p>
      <div class="scelte a-capo">${Object.keys(COSE).map((c) => `<button class="scelta" data-cosa="${c}" aria-pressed="${c === cosa}">${c}</button>`).join("")}</div>
      <label class="campo">Dove?<select id="p-dove">${elenco.map((l) => `<option value="${esc(l.osm)}" ${dal && l.osm === dal.osm ? "selected" : ""}>${esc(nomeDi(l))} · ${esc(comuneDi(l.comune)?.nome || "")}</option>`).join("")}</select></label>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <label class="campo">Giorno<input id="p-giorno" type="date" value="${new Date(Date.now() + 864e5).toISOString().slice(0, 10)}"></label>
        <label class="campo">Ora<input id="p-ora" type="time" value="20:30"></label></div>
      <label class="campo">Quante persone al massimo?<input id="p-max" type="number" min="2" value="8"></label>
      <p class="domanda">Aperto a</p>
      <div class="scelte a-capo">${MINORI.includes(u?.eta) ? `<button class="scelta" aria-pressed="true">${esc(u.eta)} anni</button>` : `<button class="scelta" data-aperto="Tutte" aria-pressed="true">Tutti</button><button class="scelta" data-aperto="${esc(u?.eta || "")}" aria-pressed="false">Solo ${esc(u?.eta || "la mia età")}</button>`}</div>
      <label class="campo">Una riga per gli altri<input id="p-note" maxlength="120" placeholder="Es. pizza e due chiacchiere, chi c'è c'è"></label>
      <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="p-invia">Pubblica l'incontro</button></div>
      <p class="fonte">Solo luoghi pubblici della mappa. Nessun numero di telefono viene mostrato.</p>`);
    $$("[data-cosa]").forEach((b) => b.addEventListener("click", () => { cosa = b.dataset.cosa; disegna(); }));
    let aperto = MINORI.includes(u?.eta) ? u.eta : "Tutte";
    $$("[data-aperto]").forEach((b) => b.addEventListener("click", () => { aperto = b.dataset.aperto; $$("[data-aperto]").forEach((y) => y.setAttribute("aria-pressed", y === b)); }));
    $("#p-invia").addEventListener("click", () => {
      const quando = new Date(`${$("#p-giorno").value}T${$("#p-ora").value}`); if (isNaN(quando)) return avvisa("Scegli giorno e ora");
      const x = { id: "mio-" + Date.now(), mio: true, cosa, osm: $("#p-dove").value, quando: quando.toISOString(), max: +$("#p-max").value || 8,
        partecipanti: [u?.nome || "Tu"], aperto, da: u?.nome || "Tu", note: $("#p-note").value.trim() };
      const tutti = leggi("incontri", []); tutti.push(x); scrivi("incontri", tutti);
      const l = TUTTI.find((y) => y.osm === x.osm);
      aggiungiAgenda({ tipo: "Incontro", incontro: x.id, osm: x.osm, nome: `${cosa} · ${nomeDi(l)}`, quando: x.quando, dettaglio: "lo organizzi tu" });
      guadagna(15, "Incontro pubblicato"); paginaIncontri("miei");
    });
  };
  disegna();
}

function paginaItinerari() {
  const mio = leggi("itinerario", []).map((o) => TUTTI.find((l) => l.osm === o)).filter(Boolean);
  const comuniMiei = [...new Set(mio.map((l) => l.comune))];
  const vicini = comuniMiei.length ? T.comuni.filter((c) => !comuniMiei.includes(c.id))
    .map((c) => ({ c, d: Math.min(...comuniMiei.map((m) => km(comuneDi(m).centro, c.centro))) })).sort((a, b) => a.d - b.d).slice(0, 3) : [];
  const conFoto = TUTTI.filter((l) => l.cat.id === "cultura" && l.foto);
  const proposta = T.comuni.map((c) => conFoto.find((l) => l.comune === c.id)).filter(Boolean).sort((a, b) => b.lat - a.lat).slice(0, 6);
  const dir = (tappe) => tappe.length ? `https://www.google.com/maps/dir/?api=1&destination=${tappe.at(-1).lat},${tappe.at(-1).lon}${tappe.length > 1 ? "&waypoints=" + tappe.slice(0, -1).map((l) => `${l.lat},${l.lon}`).join("|") : ""}` : "#";
  pagina(`<h1>Itinerari</h1><p class="nota-tenue">Metti in fila i posti che vuoi vedere, anche tra paesi diversi.</p>
    <p class="sezione-t">Il mio itinerario</p>
    ${mio.length ? `<div class="gruppo">${mio.map((l, i) => `<div class="voce"><span class="segno" style="background:${l.cat.colore};color:#fff;border-radius:50%;width:2rem;height:2rem;font-weight:700">${i + 1}</span>
        <div><strong>${esc(nomeDi(l))}</strong><small>${esc(comuneDi(l.comune).nome)}</small></div>
        <button class="chiudi" data-su="${i}" ${i ? "" : "disabled"} aria-label="Prima">${icona("su")}</button>
        <button class="chiudi" data-togli="${i}" aria-label="Togli">${icona("chiudi")}</button></div>`).join("")}</div>
      <div class="azioni" style="grid-template-columns:1fr"><a class="btn primario pieno" href="${dir(mio)}" target="_blank" rel="noopener">${icona("vai")} Parti con il navigatore</a></div>
      ${vicini.length ? `<p class="sezione-t">Collegalo ai paesi vicini</p>${vicini.map(({ c, d }) => `<button class="riga" data-comune="${c.id}"><span class="segno" style="background:#1d4e6b14;color:#1d4e6b">${icona("luogo")}</span><span><strong>${esc(c.nome)}</strong><small>${TUTTI.filter((l) => l.comune === c.id && l.cat.id === "cultura").length} luoghi da vedere</small></span><span class="dist">${d.toFixed(0)} km</span></button>`).join("")}` : ""}`
      : `<div class="vuoto">${icona("percorso")}<p>Ancora vuoto. Apri un posto della Cultura e tocca «Aggiungi all'itinerario».</p></div>`}
    <p class="sezione-t">Un giro nel Vallo</p>
    <p class="nota-tenue">Un luogo con foto per ogni paese, da nord a sud. Proposto in automatico dai dati della mappa.</p>
    ${proposta.map((l) => `<div class="carta carta-foto"><img src="${esc(l.foto)}" alt="" loading="lazy"><div><span class="etich">${esc(comuneDi(l.comune).nome)}</span><h3>${esc(nomeDi(l))}</h3>
      <div class="azioni"><button class="btn piccolo" data-vedi="${esc(l.osm)}">Scopri</button><button class="btn piccolo" data-agg="${esc(l.osm)}">${icona("piu")} Aggiungi</button></div></div></div>`).join("")}`);
  $$("[data-togli]").forEach((b) => b.addEventListener("click", () => { const it = leggi("itinerario", []); it.splice(+b.dataset.togli, 1); scrivi("itinerario", it); paginaItinerari(); }));
  $$("[data-su]").forEach((b) => b.addEventListener("click", () => { const it = leggi("itinerario", []), i = +b.dataset.su; [it[i - 1], it[i]] = [it[i], it[i - 1]]; scrivi("itinerario", it); paginaItinerari(); }));
  $$("[data-agg]").forEach((b) => b.addEventListener("click", () => { fai("visita", TUTTI.find((l) => l.osm === b.dataset.agg)); paginaItinerari(); }));
  $$("[data-vedi]").forEach((b) => b.addEventListener("click", () => { vai("mappa"); azzera(); apriLuogo(b.dataset.vedi, true); }));
  $$("[data-comune]").forEach((b) => b.addEventListener("click", () => { vai("mappa"); azzera(); S.comune = b.dataset.comune; S.cat = "cultura"; aggiorna(); altezza("medio"); }));
}

function paginaBus(comune) {
  const mio = comune || utente()?.comune;
  pagina(`<h1>Bus</h1><p class="nota-tenue">Gli orari delle aziende che servono il Vallo, dalle loro fonti ufficiali.${mio ? ` In evidenza le fermate di ${esc(comuneDi(mio)?.nome)}.` : ""}</p>
    ${mio ? LINEE.map((x) => x.fermate.filter((f) => f.comune === mio).map((f) => `<div class="carta"><span class="etich">${esc(x.azienda)}</span><h3>Da ${esc(f.nome)}</h3>
      <p class="nota-tenue">${esc(x.titolo)}</p><div class="scelte a-capo">${f.orari.map((o, i) => o ? `<span class="scelta"><small>${esc(x.colonne[i])}</small>${esc(o)}</span>` : "").join("")}</div></div>`).join("")).join("") : ""}
    <p class="sezione-t">Tabelle complete</p>
    ${LINEE.map((x) => `<div class="carta"><span class="etich">${esc(x.azienda)}</span><h3>${esc(x.titolo)}</h3><p class="nota-tenue">${esc(x.validita)}</p>
      <div class="tabella"><table><thead><tr><th>Fermata</th>${x.colonne.map((c) => `<th>${esc(c)}</th>`).join("")}</tr></thead>
      <tbody>${x.fermate.map((f) => `<tr class="${f.comune && f.comune === mio ? "mio" : ""}"><td>${esc(f.nome)}</td>${f.orari.map((o) => `<td>${o ? esc(o) : "–"}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
      ${x.note.map((n) => `<p class="fonte">${esc(n)}</p>`).join("")}
      <p class="fonte">Info: ${esc(x.contatti)} · <a href="${esc(x.fonte)}" target="_blank" rel="noopener">fonte</a> · <a href="${esc(x.altri)}" target="_blank" rel="noopener">tutte le linee</a></p></div>`).join("")}`);
}

const MASCOTTE = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#eef3f6"/><circle cx="24" cy="24" r="13" fill="none" stroke="#1d4e6b" stroke-width="5"/><circle cx="24" cy="24" r="4.5" fill="#d8a93a"/><circle cx="19.5" cy="21" r="1.4" fill="#1d4e6b"/><circle cx="28.5" cy="21" r="1.4" fill="#1d4e6b"/></svg>`;

function paginaProfilo() {
  const u = utente() || {}, scelti = miei();
  pagina(`
    <div class="profilo-testa"><span class="avatar">${MASCOTTE}</span>
      <div style="flex:1"><h1 style="margin:0">${esc(u.nome || "Ospite")}</h1><p class="nota-tenue" style="margin:0">${esc(comuneDi(u.comune)?.nome || "Di passaggio")}${u.eta ? " · " + esc(u.eta) : ""}</p></div>
      <button class="btn piccolo" data-apri="dati">${icona("modifica")} Modifica</button></div>

    ${strumentiRuolo(u)}
    <div class="testa-sezione"><p class="sezione-t">Le mie cose</p><button class="btn piccolo" id="aggiungi-modulo">${icona("piu")} Aggiungi</button></div>
    ${scelti.length ? `<div class="gruppo">${scelti.filter((k) => MODULI[k]).map((k) => `<button class="voce voce-btn" data-modulo="${k}">${icona(MODULI[k].icona)}<div><strong>${MODULI[k].nome}</strong><small>${esc(MODULI[k].desc())}</small></div>${icona("freccia")}</button>`).join("")}</div>`
      : `<p class="nota-tenue">Aggiungi qui le funzioni che usi di più.</p>`}

    <p class="sezione-t">Impostazioni</p>
    <div class="gruppo">
      <label class="voce">${icona("testo")}<div><strong>Testo grande</strong></div><input type="checkbox" id="grande" ${document.documentElement.classList.contains("grande") ? "checked" : ""}></label>
      <button class="voce voce-btn" data-apri="dati">${icona("persona")}<div><strong>I miei dati e i miei gusti</strong><small>${esc((u.gusti || []).slice(0, 3).join(", ") || "Aggiungi i tuoi gusti per ricerche su misura")}</small></div>${icona("freccia")}</button>
      <button class="voce voce-btn" data-apri="preferenze">${icona("bacheca")}<div><strong>Cosa vedere in Bacheca</strong></div>${icona("freccia")}</button>
    </div>
    <div class="azioni" style="grid-template-columns:1fr;margin-top:18px"><button class="btn" id="esci">${icona("uscita")} Ricomincia da capo</button></div>
    <p class="fonte">I tuoi dati restano su questo telefono. Mappa e luoghi © OpenStreetMap, scaricati il ${esc(T.scaricati)}.</p>`);
  $$("[data-modulo]").forEach((b) => b.addEventListener("click", () => MODULI[b.dataset.modulo].apri()));
  $("#aggiungi-modulo").addEventListener("click", catalogoModuli);
  $("#grande").addEventListener("change", (ev) => { document.documentElement.classList.toggle("grande", ev.target.checked); scrivi("grande", ev.target.checked); setTimeout(() => mappa.invalidateSize(), 50); });
  $("#esci").addEventListener("click", () => { Object.keys(localStorage).filter((k) => k.startsWith(MEM)).forEach((k) => localStorage.removeItem(k)); location.reload(); });
}
function strumentiRuolo(u) {
  const st = (u.ruoli || []).flatMap((k) => (RUOLI[k]?.strumenti || []).map((x) => [...x, RUOLI[k].nome]));
  if (!st.length) return "";
  return `<p class="sezione-t">Per te</p><div class="gruppo">${st.map(([ic, testo, dove, ruolo]) => `<button class="voce voce-btn" data-apri="${dove}">${icona(ic)}<div><strong>${testo}</strong><small>${esc(ruolo)}</small></div>${icona("freccia")}</button>`).join("")}</div>`;
}
function catalogoModuli() {
  const scelti = miei();
  pagina(`<h1>Le mie cose</h1><p class="nota-tenue">Tocca + per aggiungere una funzione al Profilo, − per toglierla.</p>
    <div class="gruppo">${Object.entries(MODULI).map(([k, x]) => `<div class="voce">${icona(x.icona)}<div><strong>${x.nome}</strong><small>${esc(x.desc())}</small></div>
      <button class="tondo ${scelti.includes(k) ? "dentro" : ""}" data-alterna="${k}" aria-label="${scelti.includes(k) ? "Togli" : "Aggiungi"} ${x.nome}">${icona(scelti.includes(k) ? "spunta" : "piu")}</button></div>`).join("")}</div>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn primario pieno" data-apri="profilo">Fatto</button></div>`);
  $$("[data-alterna]").forEach((b) => b.addEventListener("click", () => {
    const m = miei(), k = b.dataset.alterna, i = m.indexOf(k);
    if (i >= 0) m.splice(i, 1); else m.push(k);
    scrivi("moduli", m); catalogoModuli();
  }));
}
function paginaPunti() {
  const lv = livello();
  pagina(`<h1>Punti e crediti</h1><p class="nota-tenue">Usi il territorio, lo fai crescere: prenotare, scoprire e aggiungere informazioni verificate ti fa salire di livello.</p>
    <div class="livello"><small>Livello ${lv.n}</small><div><strong style="font-size:1.25rem">${lv.nome}</strong></div>
      <div class="barra-liv"><i style="width:${lv.avanzamento}%"></i></div>
      <small>${lv.punti} punti · altri ${100 - lv.avanzamento} per il prossimo livello</small></div>
    <div class="saldo"><div><small>Crediti del territorio</small><b>€ ${lv.crediti}</b><small>sconto nelle attività aderenti</small></div>
      <div><small>Donato al paese</small><b>€ ${leggi("donato", 0).toFixed(2).replace(".", ",")}</b><small>con l'arrotondamento solidale</small></div></div>
    <p class="fonte"><span class="etich demo">Dimostrazione</span> Punti, crediti e donazioni non sono ancora collegati a un sistema vero.</p>`);
}

/* ---- Ruoli: chi usa l'app e per cosa. Ognuno vede in cima al Profilo i suoi strumenti. ---- */
const RUOLI = {
  vivo: { nome: "Ci vivo", strumenti: [] },
  visito: { nome: "Sono di passaggio", strumenti: [["percorso", "Il mio itinerario", "itinerari"]] },
  attivita: { nome: "Ho un'attività", strumenti: [["attivita", "La mia attività: scheda, vetrina, listino", "registra"]] },
  ambasciatore: { nome: "Ambasciatore del paese", strumenti: [["modifica", "Aggiungi una storia o un'informazione", "ambasciatore"], ["nfc", "Collega un QR o un tag a un luogo", "ambasciatore"]] },
  corriere: { nome: "Faccio consegne", strumenti: [["muoversi", "Consegne da fare vicino a te", "consegne"]] },
};
function paginaAmbasciatore() {
  const casa = centro();
  const senzaStoria = TUTTI.filter((l) => l.cat.id === "cultura" && !l.wikipedia && !l.descrizione && l.nome).sort((a, b) => km(casa, a) - km(casa, b)).slice(0, 12);
  pagina(`<h1>Per gli ambasciatori</h1><p class="nota-tenue">Racconta il tuo paese: quello che internet non dice e che sa chi ci vive. Ogni informazione esce dopo la verifica.</p>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="amb-qr">${icona("nfc")} Leggi un QR o un tag sul posto</button></div>
    <p class="sezione-t">Luoghi vicini che aspettano una storia</p>
    ${senzaStoria.map(riga).join("") || `<p class="nota-tenue">Tutti i luoghi vicini hanno già una storia.</p>`}`);
  $("#amb-qr").addEventListener("click", () => { vai("mappa"); apriLettore(); });
  $$("[data-osm]").forEach((b) => b.addEventListener("click", () => { vai("mappa"); azzera(); aggiorna(); apriLuogo(b.dataset.osm, true); }));
}
function paginaConsegne() {
  const negozi = TUTTI.filter((l) => l.cat.id === "spesa" || l.cat.id === "negozi").sort((a, b) => km(centro(), a) - km(centro(), b)).slice(0, 3);
  pagina(`<h1>Consegne</h1><p class="nota-tenue">Porti la spesa e i prodotti dei negozi a chi abita vicino, e guadagni per ogni consegna.</p>
    <p class="fonte"><span class="etich demo">Dimostrazione</span> Le consegne sotto sono esempi: il servizio non è ancora attivo.</p>
    ${negozi.map((l, i) => `<div class="carta"><span class="etich">Esempio</span><h3>Da ${esc(nomeDi(l))}</h3>
      <p>${esc(comuneDi(l.comune)?.nome || "")} · ${distanza(l)} da te · ${[2, 3, 1][i]} ${[2, 3, 1][i] === 1 ? "sacchetto" : "sacchetti"}</p>
      <div class="azioni"><button class="btn accento" data-prendo>Me ne occupo io</button><button class="btn" data-vedi-c="${esc(l.osm)}">${icona("luogo")} Sul posto</button></div></div>`).join("")}`);
  $$("[data-prendo]").forEach((b) => b.addEventListener("click", () => { b.textContent = "Presa in carico"; b.disabled = true; avvisa("Consegna presa in carico (esempio)"); }));
  $$("[data-vedi-c]").forEach((b) => b.addEventListener("click", () => { vai("mappa"); azzera(); aggiorna(); apriLuogo(b.dataset.vediC, true); }));
}

/* ---- I miei dati: nome, paese, età, gusti. Si cambiano quando si vuole. ---- */
const FASCE = ["Fino a 13", "14–17", "18–24", "25–34", "35–49", "50–64", "65–74", "75 e più"];
const GUSTI = {
  "Pizza e street food": ["mangiare"], "Cucina tipica": ["mangiare"], "Caffè e dolci": ["mangiare"], "Sport": ["sport"],
  "Palestra e benessere": ["sport", "cura"], "Cultura e storia": ["cultura"], "Natura e passeggiate": ["natura"], "Eventi e feste": ["cultura"],
  "Shopping": ["negozi"], "Famiglia e bambini": ["natura", "salute"], "Vita notturna": ["mangiare"], "Viaggi e gite": ["dormire", "muoversi"],
};
const anziano = (eta) => eta === "65–74" || eta === "75 e più";
function moduloDati(u, pulsante) {
  return `<label class="campo">Come ti chiami?<input id="d-nome" autocomplete="given-name" value="${esc(u.nome || "")}"></label>
    <label class="campo">Dove vivi?<select id="d-comune">${T.comuni.slice().sort((a, c) => a.nome.localeCompare(c.nome)).map((c) => `<option value="${c.id}" ${c.id === (u.comune ?? "teggiano") ? "selected" : ""}>${esc(c.nome)}</option>`).join("")}<option value="" ${u.comune === null ? "selected" : ""}>Sono di passaggio</option></select></label>
    <p class="domanda">Quanti anni hai?</p>
    <div class="scelte a-capo">${FASCE.map((x) => `<button class="scelta" data-eta="${x}" aria-pressed="${u.eta === x}">${x}</button>`).join("")}</div>
    <p class="domanda">Come userai l'app? <span class="nota-tenue" style="font-weight:400">Puoi scegliere più di una cosa</span></p>
    <div class="scelte a-capo">${Object.entries(RUOLI).map(([k, x]) => `<button class="scelta" data-ruolo="${k}" aria-pressed="${(u.ruoli || ["vivo"]).includes(k)}">${x.nome}</button>`).join("")}</div>
    <p class="domanda">Che cosa ti piace? <span class="nota-tenue" style="font-weight:400">Mettiamo prima le cose giuste per te</span></p>
    <div class="scelte a-capo">${Object.keys(GUSTI).map((x) => `<button class="scelta" data-gusto="${x}" aria-pressed="${(u.gusti || []).includes(x)}">${x}</button>`).join("")}</div>
    <p class="nota-tenue" id="d-spiega"></p>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="d-salva">${pulsante}</button></div>`;
}
function collegaDati(r, u, fatto) {
  let eta = u.eta || null; const gusti = new Set(u.gusti || []); const ruoli = new Set(u.ruoli || ["vivo"]);
  $$("[data-ruolo]", r).forEach((x) => x.addEventListener("click", () => { const k = x.dataset.ruolo; ruoli.has(k) ? ruoli.delete(k) : ruoli.add(k); x.setAttribute("aria-pressed", ruoli.has(k)); }));
  const spiega = () => { $("#d-spiega", r).textContent = !eta ? "" : anziano(eta) ? "Ti mettiamo la sveglia prima di ogni prenotazione e, se vuoi, il testo grande. Si cambia quando vuoi." : "Le prenotazioni potrai metterle nel calendario del telefono."; };
  $$("[data-eta]", r).forEach((x) => x.addEventListener("click", () => { eta = x.dataset.eta; $$("[data-eta]", r).forEach((y) => y.setAttribute("aria-pressed", y === x)); spiega(); }));
  $$("[data-gusto]", r).forEach((x) => x.addEventListener("click", () => { const g = x.dataset.gusto; gusti.has(g) ? gusti.delete(g) : gusti.add(g); x.setAttribute("aria-pressed", gusti.has(g)); }));
  spiega();
  $("#d-salva", r).addEventListener("click", () => {
    const nuovo = { ...u, nome: $("#d-nome", r).value.trim() || "Ospite", comune: $("#d-comune", r).value || null, eta, gusti: [...gusti], ruoli: [...ruoli],
      promemoria: u.promemoria || (anziano(eta) ? "sveglia" : "calendario"), bacheca: u.bacheca || Object.keys(TIPI_BACHECA) };
    scrivi("utente", nuovo); fatto(nuovo);
  });
}
function paginaDati() {
  const u = utente() || {};
  pagina(`<h1>I miei dati</h1><p class="nota-tenue">Servono a mostrarti prima ciò che ti interessa. Restano sul tuo telefono.</p>
    ${moduloDati(u, "Salva")}
    <p class="sezione-t">Promemoria</p>
    <div class="gruppo"><div class="voce">${icona("sveglia")}<div><strong>Come ti ricordiamo le prenotazioni</strong></div>
      <select id="promemoria" class="campo-in" style="width:auto"><option value="calendario">Calendario</option><option value="sveglia" ${u.promemoria === "sveglia" ? "selected" : ""}>Sveglia</option></select></div></div>`);
  $("#promemoria").addEventListener("change", (ev) => scrivi("utente", { ...utente(), promemoria: ev.target.value }));
  collegaDati($("#pagina"), u, (n) => { if (S.comune !== n.comune) { S.comune = n.comune; } aggiorna(); avvisa("Dati salvati"); vai("profilo"); });
}

function paginaPreferenze() {
  const u = utente() || {}, scelti = u.bacheca || Object.keys(TIPI_BACHECA);
  pagina(`<h1>Cosa vuoi vedere</h1><p class="nota-tenue">Ognuno può comunicare e farsi conoscere. Tu scegli cosa arriva a te.</p>
    <div class="gruppo">${Object.entries(TIPI_BACHECA).map(([k, n]) => `<label class="voce"><div><strong>${n}</strong></div><input type="checkbox" data-tipo="${k}" ${scelti.includes(k) ? "checked" : ""}></label>`).join("")}
      <label class="voce"><div><strong>Solo il mio paese</strong><small>Nascondi gli avvisi degli altri comuni</small></div><input type="checkbox" id="solo" ${u.soloMioComune ? "checked" : ""}></label></div>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="salva">Salva</button></div>`);
  $("#salva").addEventListener("click", () => {
    scrivi("utente", { ...utente(), bacheca: $$("[data-tipo]").filter((c) => c.checked).map((c) => c.dataset.tipo), soloMioComune: $("#solo").checked });
    avvisa("Preferenze salvate"); vai("bacheca");
  });
}

function paginaRegistra() {
  pagina(`<h1>Registra la tua attività</h1><p class="nota-tenue">Gratis. Con questi dati compaiamo sulla mappa e creiamo il profilo dell'attività su Google, come segno di sviluppo del territorio.</p>
    <label class="campo">Nome dell'attività<input id="r-nome" required></label>
    <label class="campo">Che cosa fa<select id="r-cat">${CATEGORIE.filter((c) => !["cultura", "natura", "muoversi"].includes(c.id)).map((c) => `<option value="${c.id}">${c.nome}</option>`).join("")}</select></label>
    <label class="campo">Comune<select id="r-comune">${T.comuni.map((c) => `<option value="${c.id}" ${utente()?.comune === c.id ? "selected" : ""}>${esc(c.nome)}</option>`).join("")}</select></label>
    <label class="campo">Indirizzo<input id="r-ind" placeholder="Via e numero"></label>
    <label class="campo">Telefono<input id="r-tel" type="tel"></label>
    <label class="campo">Orari<input id="r-orari" placeholder="Es. lun–sab 8:30–13, 16:30–20"></label>
    <label class="campo">Sito o pagina social<input id="r-sito" type="url"></label>
    <label class="campo">Due righe su di te<textarea id="r-desc" rows="3"></textarea></label>
    <label class="voce" style="border:0"><input type="checkbox" id="r-tag"><div><strong>Voglio il tag NFC per la vetrina</strong><small>Lo consegniamo a mano</small></div></label>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="r-invia">Invia la registrazione</button></div>
    <p class="fonte"><span class="etich demo">Dimostrazione</span> In questa versione i dati restano sul telefono; l'attività compare sulla mappa come «in verifica».</p>`);
  $("#r-invia").addEventListener("click", () => {
    const nome = $("#r-nome").value.trim(); if (!nome) return avvisa("Scrivi il nome dell'attività");
    const c = comuneDi($("#r-comune").value), catId = $("#r-cat").value;
    const tipo = { mangiare: "amenity=restaurant", spesa: "shop=convenience", negozi: "shop=gift", sport: "leisure=sports_centre", salute: "amenity=doctors", cura: "shop=hairdresser", auto: "shop=car_repair", servizi: "office=company", dormire: "tourism=guest_house" }[catId];
    const nuove = leggi("nuove-attivita", []);
    nuove.push({ osm: "nuova/" + Date.now(), nome, tipo, catId, comune: c.id, lat: c.centro.lat + (Math.random() - .5) * .002, lon: c.centro.lon + (Math.random() - .5) * .002,
      indirizzo: $("#r-ind").value, telefono: $("#r-tel").value, orari: $("#r-orari").value, sito: $("#r-sito").value, descrizione: $("#r-desc").value, nuova: true });
    scrivi("nuove-attivita", nuove); prepara(); guadagna(50, "Attività registrata"); vai("mappa"); azzera(); S.comune = c.id; aggiorna();
  });
}

function scegliComune() {
  corpo(`<div class="testa"><h2>Dove guardi?</h2><button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    <button class="riga" data-c=""><span class="segno" style="background:#1d4e6b14;color:#1d4e6b">${icona("mappa")}</span><span><strong>Tutto il ${esc(T.nome)}</strong><small>${T.comuni.length} comuni</small></span><span></span></button>
    ${T.comuni.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<button class="riga" data-c="${c.id}"><span class="segno" style="background:#1d4e6b14;color:#1d4e6b">${icona("luogo")}</span><span><strong>${esc(c.nome)}</strong><small>${TUTTI.filter((l) => l.comune === c.id).length} posti</small></span><span class="dist">${S.comune === c.id ? icona("spunta") : ""}</span></button>`).join("")}`);
  altezza("alto");
  $("#chiudi").addEventListener("click", () => { elenco(); altezza("basso"); });
  $$("[data-c]", $("#corpo")).forEach((b) => b.addEventListener("click", () => {
    S.comune = b.dataset.c || null; aggiorna(); altezza("basso");
    if (!S.comune) mappa.fitBounds(L.latLngBounds(T.comuni.map((c) => [c.centro.lat, c.centro.lon])).pad(0.1));
  }));
}

function vai(v, arg) {
  S.vista = v;
  const tab = { bus: "profilo", preferenze: "bacheca", registra: "profilo", dati: "profilo", punti: "profilo", moduli: "profilo", incontri: "bacheca", proponi: "bacheca", eventi: "bacheca", avvisi: "bacheca", ambasciatore: "profilo", consegne: "profilo" }[v] || v;
  $$("#barra button").forEach((b) => b.classList.toggle("attiva", b.dataset.vista === tab));
  if (v === "mappa") { $("#pagina").hidden = true; setTimeout(() => mappa.invalidateSize(), 20); return; }
  ({ itinerari: paginaItinerari, bacheca: paginaBacheca, agenda: paginaAgenda, profilo: paginaProfilo, bus: paginaBus, preferenze: paginaPreferenze, registra: paginaRegistra, dati: paginaDati, punti: paginaPunti, moduli: catalogoModuli, incontri: paginaIncontri, proponi: paginaProponi, eventi: paginaEventi, avvisi: paginaBacheca, ambasciatore: paginaAmbasciatore, consegne: paginaConsegne })[v](arg);
}

/* ================= Benvenuto e registrazione ================= */
function benvenuto() {
  const b = document.createElement("div"); b.className = "benvenuto";
  b.innerHTML = `<span class="marchio"><i></i>Guardati attorno</span>
    <h1>Il tuo territorio, a portata di mano.</h1>
    <p class="nota-tenue">Prenota, compra, scopri e resta informato su tutto il ${esc(T.nome)}. Qualche domanda e cominciamo: potrai cambiare tutto dopo.</p>
    ${moduloDati({}, "Comincia")}
    <p class="fonte">I dati restano sul tuo telefono.</p>`;
  document.body.append(b);
  collegaDati(b, {}, (u) => {
    if (u.eta === "75 e più") { scrivi("grande", true); document.documentElement.classList.add("grande"); }
    b.remove(); if (u.comune) S.comune = u.comune; aggiorna(); mappa.invalidateSize();
    guadagna(10, `Benvenuto, ${esc(u.nome)}`);
  });
}

/* ================= Varie ================= */
let tAvv;
function avvisa(html) {
  let el = $(".toast"); if (!el) { el = document.createElement("div"); el.className = "toast"; el.setAttribute("role", "status"); document.body.append(el); }
  el.innerHTML = html; el.classList.add("vedi"); clearTimeout(tAvv); tAvv = setTimeout(() => el.classList.remove("vedi"), 2400);
}
function disegnaCategorie() {
  const preferite = new Set((utente()?.gusti || []).flatMap((g) => GUSTI[g] || []));
  const ordinate = [...CATEGORIE].sort((a, b) => preferite.has(b.id) - preferite.has(a.id));
  $("#categorie").innerHTML = ordinate.map((c) => `<button class="chip" data-cat="${c.id}" aria-pressed="${S.cat === c.id}" style="--area:${c.colore}">${icona(c.icona)}${c.nome}</button>`).join("");
  $$("[data-cat]").forEach((b) => b.addEventListener("click", () => {
    S.cat = S.cat === b.dataset.cat ? null : b.dataset.cat; S.sotto = null; S.testo = ""; $("#cerca").value = ""; aggiorna(); altezza("medio");
  }));
  const cat = CATEGORIE.find((c) => c.id === S.cat), so = $("#sottocategorie");
  if (!cat) { so.hidden = true; return; }
  const base = TUTTI.filter((l) => l.cat === cat && (!S.comune || l.comune === S.comune));
  const conConteggio = cat.sotto.map(([n, f], i) => ({ n, i, k: base.filter(f).length }));
  so.hidden = false;
  conConteggio.sort((a, b) => (b.k > 0) - (a.k > 0));
  so.innerHTML = conConteggio.map((x) => `<button class="chip" data-sotto="${x.i}" aria-pressed="${S.sotto === x.i}" ${x.k ? "" : 'style="opacity:.55"'}>${x.n}${x.k ? ` <span style="opacity:.6">${x.k}</span>` : ""}</button>`).join("");
  $$("[data-sotto]").forEach((b) => b.addEventListener("click", () => { S.sotto = S.sotto === +b.dataset.sotto ? null : +b.dataset.sotto; aggiorna(); altezza("medio"); }));
}
function aggiorna() {
  disegnaCategorie(); disegnaPin(); elenco(); inquadra();
  $("#luogo-sel").innerHTML = `${esc(S.comune ? comuneDi(S.comune).nome : "Tutto il Vallo")} ${icona("giu")}`;
  $("#cerca").placeholder = S.comune ? `Cerca a ${comuneDi(S.comune).nome}` : "Cerca: pizza, barbiere, calcetto…";
}
function azzera() { S.cat = null; S.sotto = null; S.testo = ""; $("#cerca").value = ""; }
function posizione() {
  if (!navigator.geolocation) return avvisa("Il telefono non condivide la posizione");
  navigator.geolocation.getCurrentPosition((p) => {
    S.qui = { lat: p.coords.latitude, lon: p.coords.longitude };
    const vicino = T.comuni.map((c) => ({ c, d: km(S.qui, c.centro) })).sort((a, b) => a.d - b.d)[0];
    if (vicino.d > 20) { S.qui = null; return avvisa(`Sei fuori dal ${T.nome}: ti mostro la mappa`); }
    if (!segnoIo) segnoIo = L.marker([S.qui.lat, S.qui.lon], { icon: L.divIcon({ className: "", html: '<div class="io"></div>', iconSize: [16, 16] }), interactive: false }).addTo(mappa);
    else segnoIo.setLatLng([S.qui.lat, S.qui.lon]);
    S.comune = vicino.c.id; aggiorna(); mappa.setView([S.qui.lat, S.qui.lon], 16);
  }, () => avvisa("Non riesco a leggere la posizione"), { timeout: 10000, maximumAge: 300000 });
}

/* Il pannello si trascina con il dito: dalla maniglia, oppure dal contenuto quando è già in cima. */
let trascinato = false;
function trascinaFoglio() {
  const f = $("#foglio"), c = $("#corpo");
  const posizioni = () => {
    const disp = innerHeight - parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--barra-h") || 64);
    return { basso: 132, medio: innerHeight * 0.48, alto: disp - 76 };
  };
  let y0 = null, h0 = 0, t0 = 0, ultimoY = 0, attivo = false, daC = false;
  const inizio = (ev, daContenuto) => {
    const p = ev.touches ? ev.touches[0] : ev;
    daC = daContenuto;
    y0 = p.clientY; ultimoY = y0; h0 = f.getBoundingClientRect().height; t0 = performance.now(); attivo = false; trascinato = false;
  };
  const muovi = (ev) => {
    if (y0 == null) return;
    const p = ev.touches ? ev.touches[0] : ev, dy = y0 - p.clientY;
    if (!attivo && Math.abs(dy) < 8) return;
    // dal contenuto: verso il basso solo se il contenuto è in cima; verso l'alto solo se il pannello non è già alzato del tutto
    if (!attivo && daC && ((dy < 0 && c.scrollTop > 0) || (dy > 0 && S.altezza === "alto"))) { y0 = null; return; }
    attivo = true; trascinato = true;
    const pos = posizioni(), h = Math.max(pos.basso - 40, Math.min(pos.alto, h0 + dy));
    f.style.transition = "none"; f.style.height = h + "px";
    ultimoY = p.clientY;
    if (ev.cancelable) ev.preventDefault();
  };
  const fine = () => {
    if (y0 == null) return;
    if (attivo) {
      const pos = posizioni(), h = f.getBoundingClientRect().height;
      const vel = (y0 - ultimoY) / Math.max(performance.now() - t0, 1); // px/ms, positivo verso l'alto
      let meta = Object.entries(pos).sort((a, b) => Math.abs(a[1] - h) - Math.abs(b[1] - h))[0][0];
      if (Math.abs(vel) > 0.5) { const ordine = ["basso", "medio", "alto"], i = ordine.indexOf(S.altezza), passo = ordine[Math.max(0, Math.min(2, i + (vel > 0 ? 1 : -1)))]; const j = ordine.indexOf(meta), k = ordine.indexOf(passo); meta = vel > 0 ? ordine[Math.max(j, k)] : ordine[Math.min(j, k)]; }
      f.style.transition = ""; void f.offsetHeight;  // riparte l'animazione verso la posizione scelta
      f.style.height = ""; altezza(meta);
      setTimeout(() => { trascinato = false; }, 50);
    }
    y0 = null; attivo = false;
  };
  for (const el of [$("#maniglia"), c]) {
    el.addEventListener("touchstart", (ev) => inizio(ev, el === c), { passive: true });
    el.addEventListener("mousedown", (ev) => { if (el === $("#maniglia")) inizio(ev, false); });
  }
  addEventListener("touchmove", muovi, { passive: false });
  addEventListener("mousemove", muovi);
  addEventListener("touchend", fine);
  addEventListener("mouseup", fine);
}

function avvia() {
  riempiIcone();
  if (leggi("grande", false)) document.documentElement.classList.add("grande");
  prepara();
  mappa = L.map("mappa", { zoomControl: false }).fitBounds(L.latLngBounds(T.comuni.map((c) => [c.centro.lat, c.centro.lon])).pad(0.05));
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(mappa);
  strato = (L.markerClusterGroup ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 44, disableClusteringAtZoom: 17 }) : L.layerGroup()).addTo(mappa);
  $("#cerca").addEventListener("input", (ev) => { S.testo = ev.target.value; S.cat = null; S.sotto = null; aggiorna(); if (S.testo) altezza("medio"); });
  $("#maniglia").addEventListener("click", () => { if (trascinato) return; altezza(S.altezza === "basso" ? "medio" : S.altezza === "medio" ? "alto" : "basso"); });
  trascinaFoglio();
  $("#tasto-pos").addEventListener("click", posizione);
  $("#prenota-fab").addEventListener("click", pannelloPrenota);
  $("#luogo-sel").addEventListener("click", scegliComune);
  $("#scan").addEventListener("click", () => apriLettore());
  $$("#barra button").forEach((b) => b.addEventListener("click", () => vai(b.dataset.vista === "bacheca" ? "eventi" : b.dataset.vista)));
  document.addEventListener("click", (ev) => { const a = ev.target.closest("#corpo [data-apri]"); if (a) vai(a.dataset.apri); });
  const u = utente(); if (u?.comune) S.comune = u.comune;
  altezza("basso"); aggiorna(); contaAgenda();
  if (!u) benvenuto();
  const daLink = () => { const m = location.hash.match(/luogo=([^&]+)/); if (m) { const osm = decodeURIComponent(m[1]); if (TUTTI.find((l) => l.osm === osm)) { azzera(); S.comune = null; aggiorna(); apriLuogo(osm, true); } } };
  window.addEventListener("hashchange", daLink); daLink();
}
