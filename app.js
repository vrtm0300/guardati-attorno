/* Guardati attorno — il territorio su una mappa, per usarlo davvero.
   Il codice vale per qualunque territorio: i dati stanno in territori/<id>*.js. */

/* ================= Dati caricati dai file del territorio ================= */
let T = null, LINEE = [], BACHECA = [];
function registraTerritorio(d) { T = d; }
function registraLinee(l) { LINEE = l; }
function registraBacheca(b) { BACHECA = b; }

/* ================= Categorie e sottofiltri ================= */
const t = (...tipi) => (l) => tipi.some((x) => x.endsWith("=*") ? l.tipo.startsWith(x.slice(0, -1)) : l.tipo === x);
const cucina = (...c) => (l) => c.some((x) => (l.cucina || "").toLowerCase().includes(x));
const sport = (...s) => (l) => s.some((x) => (l.sport || "").includes(x));
const e = (...f) => (l) => f.every((g) => g(l));
const non = (f) => (l) => !f(l);

const CATEGORIE = [
  { id: "mangiare", nome: "Mangiare", icona: "mangiare", colore: "#d4531e", azione: "tavolo",
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
  { id: "spesa", nome: "Spesa e negozi", icona: "spesa", colore: "#1a8a5a", azione: "ordine",
    entra: e(t("shop=*"), non(t("shop=hairdresser", "shop=beauty", "shop=car_repair", "shop=car", "shop=tyres", "shop=funeral_directors", "shop=laundry", "shop=dry_cleaning", "shop=pastry"))),
    sotto: [
      ["Alimentari", t("shop=supermarket", "shop=convenience", "shop=bakery", "shop=butcher", "shop=greengrocer", "shop=deli", "shop=dairy", "shop=seafood", "shop=cheese", "shop=frozen_food", "shop=farm", "shop=confectionery", "shop=coffee", "shop=pasta")],
      ["Vini e bevande", t("shop=wine", "shop=beverages", "shop=alcohol")],
      ["Cura della persona", t("shop=chemist", "shop=cosmetics", "shop=perfumery", "shop=optician", "shop=medical_supply", "shop=herbalist")],
      ["Casa e fai da te", t("shop=hardware", "shop=doityourself", "shop=furniture", "shop=houseware", "shop=garden_centre", "shop=paint", "shop=interior_decoration", "shop=kitchen", "shop=bathroom_furnishing", "shop=building_materials", "shop=agrarian", "shop=trade")],
      ["Elettronica e telefonia", t("shop=electronics", "shop=mobile_phone", "shop=computer", "shop=appliance")],
      ["Abbigliamento", t("shop=clothes", "shop=shoes", "shop=jewelry", "shop=bag", "shop=boutique", "shop=fashion_accessories", "shop=sports")],
      ["Tabacchi ed edicole", t("shop=tobacco", "shop=newsagent", "shop=kiosk", "shop=lottery")],
      ["Fiori, regali, libri", t("shop=florist", "shop=gift", "shop=books", "shop=stationery", "shop=toys", "shop=pet")],
    ] },
  { id: "sport", nome: "Sport", icona: "sport", colore: "#2563c9", azione: "campo",
    entra: t("leisure=pitch", "leisure=sports_centre", "leisure=stadium", "leisure=swimming_pool", "leisure=fitness_centre"),
    sotto: [
      ["Calcio e calcetto", sport("soccer")],
      ["Tennis e padel", sport("tennis", "padel")],
      ["Palestre", t("leisure=fitness_centre")],
      ["Piscine", t("leisure=swimming_pool")],
      ["Basket e volley", sport("basketball", "volleyball")],
      ["Centri sportivi", t("leisure=sports_centre", "leisure=stadium")],
    ] },
  { id: "salute", nome: "Salute", icona: "salute", colore: "#c4314b", azione: "chiama",
    entra: t("amenity=pharmacy", "amenity=doctors", "amenity=dentist", "amenity=clinic", "amenity=hospital", "amenity=veterinary", "healthcare=*"),
    sotto: [
      ["Farmacie", t("amenity=pharmacy", "healthcare=pharmacy")],
      ["Medici e ambulatori", t("amenity=doctors", "amenity=clinic", "healthcare=doctor", "healthcare=clinic", "healthcare=centre", "healthcare=laboratory", "healthcare=physiotherapist")],
      ["Dentisti", t("amenity=dentist", "healthcare=dentist")],
      ["Ospedali", t("amenity=hospital", "healthcare=hospital")],
      ["Veterinari", t("amenity=veterinary")],
    ] },
  { id: "cura", nome: "Barbiere e servizi", icona: "cura", colore: "#7a4cc2", azione: "appuntamento",
    entra: t("shop=hairdresser", "shop=beauty", "shop=car_repair", "shop=tyres", "shop=car", "amenity=car_wash", "shop=laundry", "shop=dry_cleaning", "craft=*"),
    sotto: [
      ["Barbiere e parrucchiere", t("shop=hairdresser")],
      ["Estetica", t("shop=beauty")],
      ["Auto e moto", t("shop=car_repair", "shop=tyres", "shop=car", "amenity=car_wash")],
      ["Lavanderie", t("shop=laundry", "shop=dry_cleaning")],
      ["Artigiani", t("craft=*")],
    ] },
  { id: "servizi", nome: "Comune e uffici", icona: "servizi", colore: "#3d4f60", azione: "chiama",
    entra: t("amenity=townhall", "amenity=post_office", "amenity=bank", "amenity=police", "amenity=fire_station", "amenity=school", "amenity=kindergarten", "amenity=college", "amenity=university", "amenity=library", "amenity=fuel", "office=*", "amenity=social_facility", "amenity=community_centre", "shop=funeral_directors"),
    sotto: [
      ["Municipi e uffici pubblici", t("amenity=townhall", "office=government", "office=administrative")],
      ["Poste e banche", t("amenity=post_office", "amenity=bank")],
      ["Sicurezza", t("amenity=police", "amenity=fire_station")],
      ["Scuole e biblioteche", t("amenity=school", "amenity=kindergarten", "amenity=college", "amenity=university", "amenity=library")],
      ["Carburante", t("amenity=fuel")],
      ["Sociale e comunità", t("amenity=social_facility", "amenity=community_centre")],
      ["Studi e professionisti", e(t("office=*"), non(t("office=government", "office=administrative")))],
    ] },
  { id: "cultura", nome: "Cultura", icona: "cultura", colore: "#a5641a", azione: "visita",
    entra: t("historic=*", "tourism=museum", "tourism=attraction", "tourism=artwork", "amenity=place_of_worship", "amenity=monastery", "amenity=theatre", "amenity=cinema", "amenity=arts_centre"),
    sotto: [
      ["Chiese e conventi", t("amenity=place_of_worship", "amenity=monastery", "historic=church", "historic=monastery", "historic=wayside_shrine", "historic=wayside_cross")],
      ["Musei", t("tourism=museum")],
      ["Castelli e mura", t("historic=castle", "historic=city_gate", "historic=citywalls", "historic=tower", "historic=fort")],
      ["Archeologia", t("historic=archaeological_site", "historic=ruins")],
      ["Monumenti e arte", t("historic=monument", "historic=memorial", "tourism=artwork", "tourism=attraction", "historic=building")],
      ["Teatri e cinema", t("amenity=theatre", "amenity=cinema", "amenity=arts_centre")],
    ] },
  { id: "natura", nome: "Natura e svago", icona: "natura", colore: "#4f8a1e", azione: "vai",
    entra: t("leisure=park", "leisure=playground", "leisure=nature_reserve", "tourism=viewpoint", "tourism=picnic_site", "natural=*"),
    sotto: [
      ["Parchi e giochi", t("leisure=park", "leisure=playground")],
      ["Panorami", t("tourism=viewpoint", "natural=peak")],
      ["Grotte e sorgenti", t("natural=cave_entrance", "natural=spring")],
      ["Picnic e riserve", t("tourism=picnic_site", "leisure=nature_reserve")],
    ] },
  { id: "dormire", nome: "Dormire", icona: "dormire", colore: "#0f7b8a", azione: "camera",
    entra: t("tourism=hotel", "tourism=guest_house", "tourism=apartment", "tourism=hostel", "tourism=camp_site", "tourism=chalet"),
    sotto: [
      ["Hotel", t("tourism=hotel")],
      ["B&B e affittacamere", t("tourism=guest_house")],
      ["Case vacanza", t("tourism=apartment", "tourism=chalet")],
      ["Ostelli e campeggi", t("tourism=hostel", "tourism=camp_site")],
    ] },
  { id: "muoversi", nome: "Bus e treni", icona: "muoversi", colore: "#0b4f6c", azione: "bus",
    entra: t("highway=bus_stop", "amenity=bus_station", "railway=station"),
    sotto: [["Fermate", t("highway=bus_stop")], ["Autostazioni", t("amenity=bus_station")], ["Stazioni", t("railway=station")]] },
];

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

const S = { cat: null, sotto: null, testo: "", comune: null, scelto: null, vista: "mappa", altezza: "basso", qui: null };
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

function filtrati() {
  const q = S.testo.trim().toLowerCase();
  const cat = CATEGORIE.find((c) => c.id === S.cat);
  const sotto = cat && S.sotto != null ? cat.sotto[S.sotto][1] : null;
  return TUTTI
    .filter((l) => !S.comune || l.comune === S.comune)
    .filter((l) => !cat || l.cat === cat)
    .filter((l) => !sotto || sotto(l))
    .filter((l) => !q || [nomeDi(l), tipoDi(l), l.cat.nome, comuneDi(l.comune)?.nome, l.cucina, l.sport].join(" ").toLowerCase().includes(q))
    .sort((a, b) => km(centro(), a) - km(centro(), b));
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
    html: `<div class="pin${scelto ? " scelto" : ""}" style="background:${l.cat.colore}">${icona(l.cat.icona)}</div>` });
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
    <p class="nota-tenue">${lista.length} ${lista.length === 1 ? "posto" : "posti"}${S.comune ? "" : " in " + T.comuni.length + " comuni"} · dal più vicino ${S.qui ? "a te" : "al centro"}</p>
    ${lista.length ? lista.slice(0, 80).map(riga).join("") : vuotoCategoria(cat)}`);
  $$("[data-osm]", $("#corpo")).forEach((b) => b.addEventListener("click", () => apriLuogo(b.dataset.osm, true)));
}
function riga(l) {
  return `<button class="riga" data-osm="${esc(l.osm)}">
      ${l.foto ? `<img class="miniatura" src="${esc(l.foto)}" alt="" loading="lazy">` : `<span class="segno" style="background:${l.cat.colore}14;color:${l.cat.colore}">${icona(l.cat.icona)}</span>`}
      <span><strong>${esc(nomeDi(l))}</strong><small>${esc(tipoDi(l))} · ${esc(comuneDi(l.comune)?.nome || "")}</small></span>
      <span class="dist">${distanza(l)}</span></button>`;
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
    </div>
    <div id="sapere"></div>
    ${l.cat.id !== "cultura" && l.cat.id !== "natura" && l.cat.id !== "muoversi" && !rivendicata ? `
      <div class="riquadro"><h3>È la tua attività?</h3><p>Rivendicala: aggiorni orari e foto, ricevi prenotazioni e pubblichi offerte in Bacheca.</p>
        <div class="azioni" style="grid-template-columns:1fr"><button class="btn" data-fai="rivendica">${icona("nfc")} Rivendica con il tag o con un codice</button></div></div>` : ""}
    <p class="fonte">Dati: <a href="https://www.openstreetmap.org/${esc(l.osm)}" target="_blank" rel="noopener">OpenStreetMap</a>${l.foto ? ' · foto: <a href="' + esc(l.foto_fonte || l.foto.replace("Special:FilePath/", "File:").replace(/\?width=\d+$/, "")) + '" target="_blank" rel="noopener">' + (l.foto_fonte ? "Wikipedia" : "Wikimedia Commons") + '</a>' : ""}</p>`);
  $("#chiudi").addEventListener("click", () => { elenco(); disegnaPin(); altezza("basso"); });
  $$("[data-fai]", $("#corpo")).forEach((b) => b.addEventListener("click", () => fai(b.dataset.fai, l)));
  if (S.altezza === "basso") altezza("medio");
  if (l.cat.id === "cultura" || l.cat.id === "natura") sapereDi(l);
  if (l.cat.id === "muoversi") busDi(l);
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
  box.innerHTML = `<div class="riquadro"><h3>${icona("libro")} Da sapere</h3>
    ${voce || `<p>Nessuno ha ancora scritto la storia di questo posto.</p>`}
    ${proposte.map((p) => `<p style="margin-top:10px"><span class="etich demo">In verifica</span> ${esc(p.testo)}</p>`).join("")}
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn" id="proponi">${icona("modifica")} Aggiungi un'informazione</button></div>
    <p class="fonte">Chi aggiunge un'informazione indica la fonte. Esce solo dopo la verifica di un esperto locale.</p></div>`;
  $("#proponi").addEventListener("click", () => fai("proponi", l));
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
      ${azione === "tavolo" ? `<label class="campo">Quante persone?<input id="persone" type="number" min="1" value="2"></label>` : ""}`,
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

/* ---- Esercenti: rivendicare la scheda ---- */
function rivendica(l) {
  corpo(`
    <div class="testa"><div><span class="etich">Per gli esercenti</span><h2 style="margin-top:6px">Rivendica ${esc(nomeDi(l))}</h2></div>
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
    guadagna(50, "Attività rivendicata"); gestisci(l);
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
    <p class="domanda">Pubblica in Bacheca</p>
    <label class="campo">Titolo<input id="b-titolo" placeholder="Es. Menu del giorno, offerta, chiusura per ferie"></label>
    <label class="campo">Testo<textarea id="b-testo" rows="3"></textarea></label>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="pubblica">Pubblica</button></div>
    <div class="riquadro"><h3>Profilo Google</h3><p>Con i dati della scheda creiamo o sistemiamo il tuo profilo dell'attività su Google, come servizio per il territorio.</p></div>
    ${DEMO}`);
  $("#chiudi").addEventListener("click", () => apriLuogo(l.osm));
  $("#pubblica").addEventListener("click", () => {
    const ti = $("#b-titolo").value.trim(), tx = $("#b-testo").value.trim(); if (!ti) return avvisa("Scrivi un titolo");
    const mie = leggi("bacheca-mie", []); mie.unshift({ id: "mia-" + Date.now(), tipo: "attivita", da: nomeDi(l), comune: l.comune, quando: "Adesso", titolo: ti, testo: tx, mia: true });
    scrivi("bacheca-mie", mie); guadagna(5, "Pubblicato in Bacheca"); apriLuogo(l.osm);
  });
}

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
  pagina(`<h1>Agenda</h1><p class="nota-tenue">Le tue prenotazioni e i tuoi ordini. ${promemoria === "sveglia" ? "Ti avvisiamo con una sveglia il giorno prima e un'ora prima." : "Puoi metterle nel calendario del telefono."}</p>
    ${v.length ? v.map((x) => `<div class="carta">
        <span class="etich">${esc(x.tipo)}</span>
        <h3>${esc(x.nome)}</h3><p>${esc(fmtData(x.quando))}${x.dettaglio ? " · " + esc(x.dettaglio) : ""}</p>
        <div class="azioni">
          ${promemoria === "sveglia" ? `<button class="btn piccolo ${x.sveglia ? "attivo" : ""}" data-sveglia="${x.n}">${icona("sveglia")} ${x.sveglia ? "Sveglia messa" : "Metti la sveglia"}</button>`
            : `<button class="btn piccolo" data-ics="${x.n}">${icona("calendario")} Nel calendario</button>`}
          <button class="btn piccolo" data-annulla="${x.n}">Annulla</button></div></div>`).join("")
      : `<div class="vuoto">${icona("calendario")}<p>Niente in programma.<br>Tocca «Prenota» sulla mappa per cominciare.</p></div>`}
    <p class="fonte">Promemoria scelto alla registrazione: ${promemoria === "sveglia" ? "sveglia" : "calendario"}. Si cambia dal Profilo.</p>`);
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
function paginaBacheca(filtro = null) {
  const u = utente(), scelti = u?.bacheca || Object.keys(TIPI_BACHECA);
  const voci = leggi("bacheca-mie", []).concat(BACHECA).filter((x) => scelti.includes(x.tipo)).filter((x) => !filtro || x.tipo === filtro)
    .filter((x) => !u?.soloMioComune || !x.comune || x.comune === u.comune);
  pagina(`<h1>Bacheca</h1><p class="nota-tenue">Avvisi dei Comuni, offerte delle attività, eventi e associazioni. Vedi solo ciò che hai scelto.</p>
    <div class="fila">${[[null, "Tutto"], ...Object.entries(TIPI_BACHECA).filter(([k]) => scelti.includes(k))].map(([k, n]) => `<button class="chip" data-filtro="${k ?? ""}" aria-pressed="${filtro === k}">${n}</button>`).join("")}</div>
    ${voci.map((x) => `<div class="carta ${x.urgente ? "urgente" : ""}">
        <span class="etich">${esc(TIPI_BACHECA[x.tipo])}</span> ${x.esempio ? '<span class="etich demo">Esempio</span>' : ""} ${x.mia ? '<span class="etich ok">Tua</span>' : ""}
        <h3>${esc(x.titolo)}</h3><p>${esc(x.testo)}</p>
        <p class="fonte">${esc(x.da)}${x.comune ? " · " + esc(comuneDi(x.comune)?.nome || "") : ""}${x.link ? ` · <a href="${esc(x.link)}" target="_blank" rel="noopener">fonte</a>` : ""}</p></div>`).join("") || `<div class="vuoto">${icona("bacheca")}<p>Niente da mostrare con i filtri scelti.</p></div>`}
    <div class="carta"><h3>Scegli cosa vedere</h3><p class="nota-tenue">Tutti possono comunicare e farsi conoscere, ma decidi tu cosa arriva sul tuo telefono.</p>
      <div class="azioni" style="grid-template-columns:1fr"><button class="btn" data-apri="preferenze">Cambia le preferenze</button></div></div>`);
  $$("[data-filtro]").forEach((b) => b.addEventListener("click", () => paginaBacheca(b.dataset.filtro || null)));
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
      ${vicini.length ? `<p class="sezione-t">Collegalo ai paesi vicini</p>${vicini.map(({ c, d }) => `<button class="riga" data-comune="${c.id}"><span class="segno" style="background:#0b4f6c14;color:#0b4f6c">${icona("luogo")}</span><span><strong>${esc(c.nome)}</strong><small>${TUTTI.filter((l) => l.comune === c.id && l.cat.id === "cultura").length} luoghi da vedere</small></span><span class="dist">${d.toFixed(0)} km</span></button>`).join("")}` : ""}`
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

function paginaProfilo() {
  const u = utente() || {}, lv = livello();
  const soliti = leggi("soliti", []).length, riv = leggi("rivendicate", []).length;
  pagina(`
    <div class="profilo-testa"><span class="avatar">${esc((u.nome || "?")[0].toUpperCase())}</span>
      <div><h1 style="margin:0">${esc(u.nome || "Ospite")}</h1><p class="nota-tenue" style="margin:0">${esc(comuneDi(u.comune)?.nome || "Vallo di Diano")}${u.eta ? " · " + esc(u.eta) : ""}</p></div></div>

    <div class="livello"><small>Livello ${lv.n}</small><div><strong style="font-size:1.25rem">${lv.nome}</strong></div>
      <div class="barra-liv"><i style="width:${lv.avanzamento}%"></i></div>
      <small>${lv.punti} punti · altri ${100 - lv.avanzamento} per il prossimo livello. Prenoti, scopri, contribuisci: cresci con il territorio.</small></div>
    <div class="saldo"><div><small>Crediti del territorio</small><b>€ ${lv.crediti}</b><small>da spendere come sconto nelle attività aderenti</small></div>
      <div><small>Donato al paese</small><b>€ ${String(leggi("donato", 0).toFixed(2)).replace(".", ",")}</b><small>con l'arrotondamento solidale</small></div></div>

    <p class="sezione-t">Le mie cose</p>
    <div class="gruppo">
      <div class="voce">${icona("cuore")}<div><strong>I miei soliti</strong><small>${soliti} ${soliti === 1 ? "posto" : "posti"} da prenotare con un tocco</small></div><button class="chiudi" id="vai-soliti" aria-label="Apri">${icona("freccia")}</button></div>
      <div class="voce">${icona("muoversi")}<div><strong>Orari dei bus</strong><small>Lamanna e Curcio, in evidenza le tue fermate</small></div><button class="chiudi" data-apri="bus" aria-label="Apri">${icona("freccia")}</button></div>
    </div>

    <p class="sezione-t">Come la uso</p>
    <div class="gruppo">
      <div class="voce">${icona("testo")}<div><strong>Testo grande</strong><small>Lettere e pulsanti più grandi</small></div><input type="checkbox" id="grande" ${document.documentElement.classList.contains("grande") ? "checked" : ""}></div>
      <div class="voce">${icona("sveglia")}<div><strong>Promemoria</strong><small>${u.promemoria === "sveglia" ? "Sveglia il giorno prima e un'ora prima" : "Nel calendario del telefono"}</small></div>
        <select id="promemoria" class="btn piccolo"><option value="calendario">Calendario</option><option value="sveglia" ${u.promemoria === "sveglia" ? "selected" : ""}>Sveglia</option></select></div>
      <div class="voce">${icona("bacheca")}<div><strong>Cosa vedere in Bacheca</strong><small>${(u.bacheca || Object.keys(TIPI_BACHECA)).map((k) => TIPI_BACHECA[k]).join(", ")}</small></div><button class="chiudi" data-apri="preferenze" aria-label="Cambia">${icona("freccia")}</button></div>
    </div>

    <p class="sezione-t">Sostieni il paese</p>
    <div class="gruppo">
      <div class="voce">${icona("dono")}<div><strong>Arrotondamento solidale</strong><small>Arrotonda ogni ordine all'euro e dona la differenza a un'associazione del tuo paese</small></div><input type="checkbox" id="arrotonda" ${leggi("arrotonda", false) ? "checked" : ""}></div>
    </div>

    <p class="sezione-t">Hai un'attività?</p>
    <div class="gruppo">
      <div class="voce">${icona("nfc")}<div><strong>Rivendica la tua scheda</strong><small>Cerca la tua attività sulla mappa e tocca «È la tua attività?»${riv ? ` · ne gestisci ${riv}` : ""}</small></div></div>
      <div class="voce">${icona("attivita")}<div><strong>Non sei sulla mappa?</strong><small>Registrati gratis: con i tuoi dati creiamo anche il profilo Google dell'attività</small></div><button class="chiudi" data-apri="registra" aria-label="Registra">${icona("freccia")}</button></div>
    </div>

    <div class="azioni" style="grid-template-columns:1fr;margin-top:22px"><button class="btn" id="esci">${icona("uscita")} Ricomincia da capo</button></div>
    <p class="fonte">I tuoi dati restano su questo telefono. Mappa e luoghi © OpenStreetMap, scaricati il ${esc(T.scaricati)}. Punti, crediti e donazioni sono una dimostrazione.</p>`);
  $("#grande").addEventListener("change", (ev) => { document.documentElement.classList.toggle("grande", ev.target.checked); scrivi("grande", ev.target.checked); setTimeout(() => mappa.invalidateSize(), 50); });
  $("#promemoria").addEventListener("change", (ev) => { scrivi("utente", { ...utente(), promemoria: ev.target.value }); paginaProfilo(); });
  $("#arrotonda").addEventListener("change", (ev) => { scrivi("arrotonda", ev.target.checked); avvisa(ev.target.checked ? "Grazie: ogni ordine aiuta il paese" : "Arrotondamento spento"); });
  $("#vai-soliti").addEventListener("click", () => { vai("mappa"); pannelloPrenota(); });
  $("#esci").addEventListener("click", () => { Object.keys(localStorage).filter((k) => k.startsWith(MEM)).forEach((k) => localStorage.removeItem(k)); location.reload(); });
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
    const tipo = { mangiare: "amenity=restaurant", spesa: "shop=convenience", sport: "leisure=sports_centre", salute: "amenity=doctors", cura: "shop=hairdresser", servizi: "office=company", dormire: "tourism=guest_house" }[catId];
    const nuove = leggi("nuove-attivita", []);
    nuove.push({ osm: "nuova/" + Date.now(), nome, tipo, catId, comune: c.id, lat: c.centro.lat + (Math.random() - .5) * .002, lon: c.centro.lon + (Math.random() - .5) * .002,
      indirizzo: $("#r-ind").value, telefono: $("#r-tel").value, orari: $("#r-orari").value, sito: $("#r-sito").value, descrizione: $("#r-desc").value, nuova: true });
    scrivi("nuove-attivita", nuove); prepara(); guadagna(50, "Attività registrata"); vai("mappa"); azzera(); S.comune = c.id; aggiorna();
  });
}

function scegliComune() {
  corpo(`<div class="testa"><h2>Dove guardi?</h2><button class="chiudi" id="chiudi" aria-label="Chiudi">${icona("chiudi")}</button></div>
    <button class="riga" data-c=""><span class="segno" style="background:#0b4f6c14;color:#0b4f6c">${icona("mappa")}</span><span><strong>Tutto il ${esc(T.nome)}</strong><small>${T.comuni.length} comuni</small></span><span></span></button>
    ${T.comuni.slice().sort((a, b) => a.nome.localeCompare(b.nome)).map((c) => `<button class="riga" data-c="${c.id}"><span class="segno" style="background:#0b4f6c14;color:#0b4f6c">${icona("luogo")}</span><span><strong>${esc(c.nome)}</strong><small>${TUTTI.filter((l) => l.comune === c.id).length} posti</small></span><span class="dist">${S.comune === c.id ? icona("spunta") : ""}</span></button>`).join("")}`);
  altezza("alto");
  $("#chiudi").addEventListener("click", () => { elenco(); altezza("basso"); });
  $$("[data-c]", $("#corpo")).forEach((b) => b.addEventListener("click", () => {
    S.comune = b.dataset.c || null; aggiorna(); altezza("basso");
    if (!S.comune) mappa.fitBounds(L.latLngBounds(T.comuni.map((c) => [c.centro.lat, c.centro.lon])).pad(0.1));
  }));
}

function vai(v, arg) {
  S.vista = v;
  const tab = { bus: "profilo", preferenze: "bacheca", registra: "profilo" }[v] || v;
  $$("#barra button").forEach((b) => b.classList.toggle("attiva", b.dataset.vista === tab));
  if (v === "mappa") { $("#pagina").hidden = true; setTimeout(() => mappa.invalidateSize(), 20); return; }
  ({ itinerari: paginaItinerari, bacheca: paginaBacheca, agenda: paginaAgenda, profilo: paginaProfilo, bus: paginaBus, preferenze: paginaPreferenze, registra: paginaRegistra })[v](arg);
}

/* ================= Benvenuto e registrazione ================= */
function benvenuto() {
  const b = document.createElement("div"); b.className = "benvenuto";
  b.innerHTML = `<span class="marchio"><i></i>Guardati attorno</span>
    <h1>Il tuo territorio, a portata di mano.</h1>
    <p class="nota-tenue">Prenota, compra, scopri e resta informato su tutto il ${esc(T.nome)}. Due domande e cominciamo.</p>
    <label class="campo">Come ti chiami?<input id="b-nome" autocomplete="given-name"></label>
    <label class="campo">Dove vivi?<select id="b-comune">${T.comuni.slice().sort((a, c) => a.nome.localeCompare(c.nome)).map((c) => `<option value="${c.id}" ${c.id === "teggiano" ? "selected" : ""}>${esc(c.nome)}</option>`).join("")}<option value="">Sono di passaggio</option></select></label>
    <p class="domanda">Quanti anni hai?</p>
    <div class="scelte a-capo" id="b-eta">${["Meno di 18", "18–35", "36–64", "65 e più"].map((x) => `<button class="scelta" data-eta="${x}" aria-pressed="false">${x}</button>`).join("")}</div>
    <p class="nota-tenue" id="b-spiega"></p>
    <div class="azioni" style="grid-template-columns:1fr"><button class="btn accento pieno" id="b-via">Comincia</button></div>
    <p class="fonte">I dati restano sul tuo telefono.</p>`;
  document.body.append(b);
  let eta = null;
  $$("[data-eta]", b).forEach((x) => x.addEventListener("click", () => {
    eta = x.dataset.eta; $$("[data-eta]", b).forEach((y) => y.setAttribute("aria-pressed", y === x));
    $("#b-spiega", b).textContent = eta === "65 e più" ? "Ti mettiamo il testo grande e la sveglia prima di ogni prenotazione. Si cambia quando vuoi." : "Le prenotazioni potrai metterle nel calendario del telefono.";
  }));
  $("#b-via", b).addEventListener("click", () => {
    const anziano = eta === "65 e più";
    scrivi("utente", { nome: $("#b-nome", b).value.trim() || "Ospite", comune: $("#b-comune", b).value || null, eta, promemoria: anziano ? "sveglia" : "calendario", bacheca: Object.keys(TIPI_BACHECA) });
    if (anziano) { scrivi("grande", true); document.documentElement.classList.add("grande"); }
    b.remove(); const u = utente(); if (u.comune) { S.comune = u.comune; } aggiorna(); mappa.invalidateSize();
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
  $("#categorie").innerHTML = CATEGORIE.map((c) => `<button class="chip" data-cat="${c.id}" aria-pressed="${S.cat === c.id}"><span class="punto" style="background:${c.colore}"></span>${c.nome}</button>`).join("");
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

function avvia() {
  riempiIcone();
  if (leggi("grande", false)) document.documentElement.classList.add("grande");
  prepara();
  mappa = L.map("mappa", { zoomControl: false }).fitBounds(L.latLngBounds(T.comuni.map((c) => [c.centro.lat, c.centro.lon])).pad(0.05));
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }).addTo(mappa);
  strato = (L.markerClusterGroup ? L.markerClusterGroup({ showCoverageOnHover: false, maxClusterRadius: 44, disableClusteringAtZoom: 17 }) : L.layerGroup()).addTo(mappa);
  $("#cerca").addEventListener("input", (ev) => { S.testo = ev.target.value; S.cat = null; S.sotto = null; aggiorna(); if (S.testo) altezza("medio"); });
  $("#maniglia").addEventListener("click", () => altezza(S.altezza === "basso" ? "medio" : S.altezza === "medio" ? "alto" : "basso"));
  $("#tasto-pos").addEventListener("click", posizione);
  $("#prenota-fab").addEventListener("click", pannelloPrenota);
  $("#luogo-sel").addEventListener("click", scegliComune);
  $$("#barra button").forEach((b) => b.addEventListener("click", () => vai(b.dataset.vista)));
  document.addEventListener("click", (ev) => { const a = ev.target.closest("#corpo [data-apri]"); if (a) vai(a.dataset.apri); });
  const u = utente(); if (u?.comune) S.comune = u.comune;
  altezza("basso"); aggiorna(); contaAgenda();
  if (!u) benvenuto();
}
