/* =========================================================
   ADECTE — main.js
   ========================================================= */

const CORREU_ADECTE = 'associacioadecte@gmail.com';

/* ---------- 1. Cel estrellat (canvas) — sense parpelleig, parallax al ratolí ---------- */
function iniciaCelEstrellat(canvas, opcions = {}) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const reduceixMoviment = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let estels = [];
  let amplada, alcada;
  const densitat = opcions.densitat || 0.00018;
  let ratoliX = 0.5;
  let ratoliY = 0.5;
  let ratoliActiu = false;

  function mida() {
    amplada = canvas.offsetWidth;
    alcada = canvas.offsetHeight;
    canvas.width = amplada * window.devicePixelRatio;
    canvas.height = alcada * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
    const n = Math.round(amplada * alcada * densitat);
    estels = Array.from({ length: n }, () => ({
      x: Math.random() * amplada,
      y: Math.random() * alcada,
      r: Math.random() * 1.3 + 0.3,
      lluentor: Math.random() * 0.35 + 0.45,
      parallax: Math.random() * 0.6 + 0.2
    }));
  }

  function onMouseMove(e) {
    const rect = canvas.getBoundingClientRect();
    ratoliX = (e.clientX - rect.left) / rect.width;
    ratoliY = (e.clientY - rect.top) / rect.height;
    ratoliActiu = true;
  }

  function onMouseLeave() {
    ratoliActiu = false;
    ratoliX = 0.5;
    ratoliY = 0.5;
  }

  function dibuixa() {
    ctx.clearRect(0, 0, amplada, alcada);
    const desplX = ratoliActiu ? (ratoliX - 0.5) * 18 : 0;
    const desplY = ratoliActiu ? (ratoliY - 0.5) * 12 : 0;

    estels.forEach(e => {
      const px = e.x + desplX * e.parallax;
      const py = e.y + desplY * e.parallax;
      ctx.beginPath();
      ctx.arc(px, py, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245,242,234,${e.lluentor})`;
      ctx.fill();
    });

    if (!reduceixMoviment && ratoliActiu) requestAnimationFrame(dibuixa);
  }

  if (!reduceixMoviment) {
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);
    requestAnimationFrame(function loop() {
      dibuixa();
      requestAnimationFrame(loop);
    });
  } else {
    dibuixa();
  }

  window.addEventListener('resize', mida);
  mida();
}

/* ---------- 2. Fase lunar ---------- */
function calculaFaseLunar(data = new Date()) {
  // SunCalc retorna un objecte amb:
  // - fraction: il·luminació (de 0 a 1)
  // - phase: fase lunar de 0 a 1 (0 = lluna nova, 0.25 = quart creixent, 0.5 = lluna plena, 0.75 = quart minvant)
  // - angle: angle de la lluna respecte al meridià
  const dadesSunCalc = SunCalc.getMoonIllumination(data);
  
  const fase = dadesSunCalc.phase;
  const illuminacio = dadesSunCalc.fraction;

  let nom;
  if (fase < 0.03 || fase > 0.97) nom = 'Lluna nova';
  else if (fase < 0.22) nom = 'Lluna creixent';
  else if (fase < 0.28) nom = 'Quart creixent';
  else if (fase < 0.47) nom = 'Gibosa creixent';
  else if (fase < 0.53) nom = 'Lluna plena';
  else if (fase < 0.72) nom = 'Gibosa decreixent';
  else if (fase < 0.78) nom = 'Quart decreixent';
  else nom = 'Lluna minvant';

  return { fase, illuminacio, nom };
}

function dibuixaLluna(svgEl, fase) {
  if (!svgEl) return;
  const radi = 40;
  const centreLlunaX = 50; // Coordenada X del centre de la lluna al SVG

  // CORRECCIÓ: Utilitzem el seno per a una transició suau de -1 a 1.
  // Multipliquem per -1 per a l'hemisferi nord perquè l'ombra
  // comenci a la dreta i vagi cap a l'esquerra a mesura que creix.
  const factorDesplacament = -Math.sin(fase * 2 * Math.PI);
  
  // Calculem el desplaçament màxim. El radi de la lluna és 40,
  // així que el màxim desplaçament ha de ser 40 perquè l'ombra
  // desaparegui per una banda o l'altra.
  const desplacament = factorDesplacament * radi;

  const ombra = svgEl.querySelector('#ombra-lluna');
  if (ombra) {
    // Apliquem el desplaçament a la posició X de l'ombra
    ombra.setAttribute('cx', centreLlunaX + desplacament);
  }
}

function iniciaWidgetCel() {
  const dadesNom = document.querySelector('[data-lluna-nom]');
  const dadesIllum = document.querySelector('[data-lluna-illuminacio]');
  const svgLluna = document.querySelector('[data-lluna-svg]');
  if (!dadesNom && !svgLluna) return;
  const { fase, illuminacio, nom } = calculaFaseLunar();
  if (dadesNom) dadesNom.textContent = nom;
  if (dadesIllum) dadesIllum.textContent = Math.round(illuminacio * 100) + ' %';
  dibuixaLluna(svgLluna, fase);
}

/* ---------- 3. Agenda des de CSV ---------- */
function parsejaCsv(text) {
  const files = [];
  let fila = [];
  let camp = '';
  let dinsCometes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') {
      dinsCometes = !dinsCometes;
    } else if (c === ',' && !dinsCometes) {
      fila.push(camp.trim());
      camp = '';
    } else if ((c === '\n' || c === '\r') && !dinsCometes) {
      if (c === '\r' && text[i + 1] === '\n') i++;
      fila.push(camp.trim());
      if (fila.some(v => v)) files.push(fila);
      fila = [];
      camp = '';
    } else {
      camp += c;
    }
  }
  if (camp || fila.length) {
    fila.push(camp.trim());
    if (fila.some(v => v)) files.push(fila);
  }
  return files;
}

function creaTargetaActivitat(dades, ambEtiqueta) {
  const { estat, dia, mes, tipus, titol, meta, descripcio } = dades;
  const div = document.createElement('div');
  div.className = 'targeta-activitat';

  let etiquetaHtml = '';
  if (ambEtiqueta && tipus) {
    const cls = estat === 'passada' ? 'etiqueta passada' : 'etiqueta';
    etiquetaHtml = `<span class="${cls}">${tipus}</span>`;
  }

  div.innerHTML = `
    <div class="data-bloc"><span class="dia">${dia}</span><span class="mes">${mes}</span></div>
    <div class="activitat-cos">
      ${etiquetaHtml}
      <h3>${titol}</h3>
      <span class="activitat-meta">${meta}</span>
      <p>${descripcio}</p>
    </div>`;
  return div;
}

function renderitzaAgenda(activitats) {
  const contenidors = document.querySelectorAll('[data-agenda]');
  contenidors.forEach(contenidor => {
    const mode = contenidor.dataset.agenda;
    const ambEtiqueta = contenidor.dataset.etiquetes === 'true';
    let filtrades = activitats.filter(a => a.estat === mode);

    if (mode === 'propera' && contenidor.dataset.limit) {
      filtrades = filtrades.slice(0, parseInt(contenidor.dataset.limit, 10));
    }

    contenidor.innerHTML = '';
    if (!filtrades.length) {
      contenidor.innerHTML = '<p class="agenda-buida">No hi ha activitats en aquest moment. Consulta aviat!</p>';
      return;
    }
    filtrades.forEach(a => contenidor.appendChild(creaTargetaActivitat(a, ambEtiqueta)));
  });
}

function activitatsDesDeCsv(text) {
  const files = parsejaCsv(text);
  if (files.length < 2) return null;
  const capçaleres = files[0].map(h => h.toLowerCase());
  return files.slice(1).map(fila => {
    const obj = {};
    capçaleres.forEach((h, i) => { obj[h] = fila[i] || ''; });
    return obj;
  });
}

async function carregaAgenda() {
  const contenidors = document.querySelectorAll('[data-agenda]');
  if (!contenidors.length) return;

  if (window.ADECTE_AGENDA && window.ADECTE_AGENDA.length) {
    renderitzaAgenda(window.ADECTE_AGENDA);
    return;
  }

  try {
    const res = await fetch('assets/data/agenda.csv');
    if (!res.ok) throw new Error('No es pot carregar l\'agenda');
    const activitats = activitatsDesDeCsv(await res.text());
    if (!activitats) throw new Error('CSV buit');
    renderitzaAgenda(activitats);
  } catch (err) {
    contenidors.forEach(c => {
      if (!c.children.length) {
        c.innerHTML = '<p class="agenda-buida">No s\'ha pogut carregar l\'agenda. Comprova assets/data/agenda.js o agenda.csv.</p>';
      }
    });
  }
}

/* ---------- 4. Galeria dinàmica ---------- */
function nomDesDeFitxer(nomFitxer) {
  return nomFitxer.replace(/\.[^.]+$/, '');
}

async function carregaGaleria() {
  const contenidor = document.querySelector('[data-galeria-dinamica]');
  if (!contenidor) return;

  let fitxers = window.ADECTE_GALERIA;

  if (!fitxers || !fitxers.length) {
    try {
      const res = await fetch('assets/img/galeria/llista.json');
      if (res.ok) fitxers = await res.json();
    } catch (err) { /* fallback */ }
  }

  if (!Array.isArray(fitxers) || !fitxers.length) {
    contenidor.innerHTML = '<p class="agenda-buida">Encara no hi ha fotos a la galeria. Afegeix imatges i registra-les a assets/data/galeria.js.</p>';
    return;
  }

  contenidor.innerHTML = '';
  fitxers.forEach(fitxer => {
    const titol = nomDesDeFitxer(fitxer);
    const src = `assets/img/galeria/${encodeURIComponent(fitxer)}`;
    const figure = document.createElement('figure');
    figure.className = 'foto-galeria';
    figure.dataset.imatgeContenidor = '';
    figure.innerHTML = `
      <img src="${src}" alt="${titol}" data-fallback-text="${fitxer}">
      <figcaption>${titol}</figcaption>`;
    contenidor.appendChild(figure);
  });

  gestionaImatgesAmbAlternativa();
  iniciaLightbox();
}

/* ---------- 5. Navegació mòbil i submenú Landerer ---------- */
function iniciaNavegacio() {
  const boto = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.nav-principal');
  if (!boto || !nav) return;
  boto.addEventListener('click', () => {
    const oberta = nav.classList.toggle('oberta');
    boto.setAttribute('aria-expanded', oberta ? 'true' : 'false');
    boto.textContent = oberta ? '✕' : '☰';
  });
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    nav.classList.remove('oberta');
    boto.textContent = '☰';
    document.querySelectorAll('.nav-item-dropdown.obert').forEach(d => d.classList.remove('obert'));
  }));

  document.querySelectorAll('.nav-dropdown-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const item = btn.closest('.nav-item-dropdown');
      const jaObert = item.classList.contains('obert');
      document.querySelectorAll('.nav-item-dropdown.obert').forEach(d => d.classList.remove('obert'));
      if (!jaObert) item.classList.add('obert');
      btn.setAttribute('aria-expanded', item.classList.contains('obert') ? 'true' : 'false');
    });
  });

  document.addEventListener('click', e => {
    if (e.target.closest('.nav-item-dropdown')) return;
    document.querySelectorAll('.nav-item-dropdown.obert').forEach(d => {
      d.classList.remove('obert');
      d.querySelector('.nav-dropdown-btn')?.setAttribute('aria-expanded', 'false');
    });
  });
}

/* ---------- 6. Imatges amb alternativa si falten ---------- */
function gestionaImatgesAmbAlternativa() {
  document.querySelectorAll('img[data-fallback-text]').forEach(img => {
    if (img.dataset.fallbackInit) return;
    img.dataset.fallbackInit = 'true';
    img.addEventListener('error', () => {
      const contenidor = img.closest('[data-imatge-contenidor]') || img.parentElement;
      img.style.display = 'none';
      if (contenidor && !contenidor.querySelector('.sense-imatge')) {
        const div = document.createElement('div');
        div.className = 'sense-imatge';
        div.textContent = img.dataset.fallbackText;
        contenidor.appendChild(div);
      }
    }, { once: true });
  });
}

/* ---------- 7. Lightbox de galeria ---------- */
function iniciaLightbox() {
  const lightbox = document.querySelector('.lightbox');
  if (!lightbox || lightbox.dataset.lightboxInit) return;
  lightbox.dataset.lightboxInit = 'true';
  const imgLightbox = lightbox.querySelector('img');
  const tancar = lightbox.querySelector('.lightbox-tancar');

  document.querySelectorAll('.foto-galeria img').forEach(img => {
    if (img.dataset.lightboxBound) return;
    img.dataset.lightboxBound = 'true';
    img.addEventListener('click', () => {
      imgLightbox.src = img.src;
      imgLightbox.alt = img.alt;
      lightbox.classList.add('oberta');
    });
  });

  function tancaLightbox() { lightbox.classList.remove('oberta'); imgLightbox.src = ''; }
  tancar?.addEventListener('click', tancaLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) tancaLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') tancaLightbox(); });
}

/* ---------- 8. Marca l'enllaç de navegació actiu ---------- */
function marcaNavActiu() {
  const pagina = document.body.dataset.pagina;
  if (!pagina) return;
  document.querySelectorAll(`.nav-principal a[data-pagina="${pagina}"]`).forEach(a => a.classList.add('actiu'));
  if (pagina.startsWith('landerer')) {
    document.querySelectorAll('.nav-item-dropdown').forEach(d => d.classList.add('actiu'));
  }
}

/* ---------- 9. Eclipsi total de sol — 12 d'agost de 2026 ----------
   Hores de referència per a les Terres de l'Ebre / Camp de Tarragona
   (aproximades; per a horaris exactes municipi a municipi, eclipsicatalunya.cat).
   Totes en UTC (CEST = UTC+2 a l'agost).

   Cada widget (contenidor amb [data-eclipsi-widget]) es calcula de manera
   independent: si porta els atributs data-eclipsi-c1..c4 (dates ISO), fa
   servir aquesta línia de temps pròpia; si no, fa servir la línia de temps
   real de l'eclipsi. Això permet tenir el widget real i, alhora, una
   simulació de demostració amb el seu propi horari accelerat. --------- */
const ECLIPSI_C1 = new Date(Date.UTC(2026, 7, 12, 17, 35, 0));   // 19:35 CEST — inici de la fase parcial
const ECLIPSI_C2 = new Date(Date.UTC(2026, 7, 12, 18, 29, 0));   // 20:29 CEST — inici de la totalitat
const ECLIPSI_C3 = new Date(Date.UTC(2026, 7, 12, 18, 30, 30));  // ~20:30:30 CEST — fi de la totalitat (~1'30")
const ECLIPSI_C4 = new Date(Date.UTC(2026, 7, 12, 19, 0, 0));    // 21:00 CEST — fi de la fase parcial

function calculaEstatEclipsi(ara, c1, c2, c3, c4) {
  let fase, overlap, missatge;
  if (ara < c1) {
    fase = 'abans'; overlap = 0;
    missatge = 'Encara no ha començat';
  } else if (ara < c2) {
    fase = 'parcial-entrada';
    overlap = (ara - c1) / (c2 - c1);
    missatge = 'Fase parcial: la Lluna comença a tapar el Sol';
  } else if (ara < c3) {
    fase = 'totalitat'; overlap = 1;
    missatge = 'TOTALITAT — el Sol queda completament tapat';
  } else if (ara < c4) {
    fase = 'parcial-sortida';
    overlap = 1 - (ara - c3) / (c4 - c3);
    missatge = 'Fase parcial: la Lluna es va retirant';
  } else {
    fase = 'despres'; overlap = 0;
    missatge = 'L\'eclipsi ja s\'ha viscut. Fins al 2 d\'agost de 2027!';
  }
  return { fase, overlap, missatge };
}

function dibuixaEclipsi(svgEl, overlap, fase) {
  if (!svgEl) return;
  const lluna = svgEl.querySelector('[data-lluna-eclipsi]');
  if (!lluna) return;
  const distanciaMax = 40 * 2.1; // radi del disc * 2.1, perquè comenci fora de camp
  const distancia = distanciaMax * (1 - overlap);
  const signe = (fase === 'parcial-sortida' || fase === 'despres') ? -1 : 1;
  lluna.setAttribute('cx', 50 + signe * distancia);
}

// Format detallat (dies, hores, minuts, segons) — widget complet d'/eclipsi.html
function formataCompteEnrere(ms) {
  if (ms <= 0) return '—';
  const dies = Math.floor(ms / 86400000);
  const hores = Math.floor((ms % 86400000) / 3600000);
  const minuts = Math.floor((ms % 3600000) / 60000);
  const segons = Math.floor((ms % 60000) / 1000);
  return dies > 0 ? `${dies}d ${hores}h ${minuts}m ${segons}s` : `${hores}h ${minuts}m ${segons}s`;
}

// Format compacte de només 2 unitats: dies+hores mentre en quedin, i
// hores+minuts quan ja no quedi cap dia sencer — pensat per a la barra superior.
function formataCompte2Unitats(ms) {
  if (ms <= 0) return '—';
  const dies = Math.floor(ms / 86400000);
  const hores = Math.floor((ms % 86400000) / 3600000);
  const minuts = Math.floor((ms % 3600000) / 60000);
  return dies > 0 ? `${dies}d ${hores}h` : `${hores}h ${minuts}m`;
}

function actualitzaWidgetsEclipsi() {
  const ara = new Date();

  document.querySelectorAll('[data-eclipsi-widget]').forEach(widget => {
    const c1 = widget.dataset.eclipsiC1 ? new Date(widget.dataset.eclipsiC1) : ECLIPSI_C1;
    const c2 = widget.dataset.eclipsiC2 ? new Date(widget.dataset.eclipsiC2) : ECLIPSI_C2;
    const c3 = widget.dataset.eclipsiC3 ? new Date(widget.dataset.eclipsiC3) : ECLIPSI_C3;
    const c4 = widget.dataset.eclipsiC4 ? new Date(widget.dataset.eclipsiC4) : ECLIPSI_C4;

    const { fase, overlap, missatge } = calculaEstatEclipsi(ara, c1, c2, c3, c4);
    const objectius = { 'abans': c1, 'parcial-entrada': c2, 'totalitat': c3, 'parcial-sortida': c4 };
    const objectiu = objectius[fase];

    const svg = widget.querySelector('[data-eclipsi-svg]');
    if (svg) dibuixaEclipsi(svg, overlap, fase);

    const estatEl = widget.querySelector('[data-eclipsi-estat]');
    if (estatEl) estatEl.textContent = missatge;

    const compteEl = widget.querySelector('[data-eclipsi-compte-enrere]');
    if (compteEl) compteEl.textContent = objectiu ? formataCompteEnrere(objectiu - ara) : 'Finalitzat';

    const compte2uEl = widget.querySelector('[data-eclipsi-compte-2u]');
    if (compte2uEl) compte2uEl.textContent = objectiu ? formataCompte2Unitats(objectiu - ara) : 'Viscut ✦';
  });
}

function iniciaWidgetEclipsi() {
  const hiHaWidgets = document.querySelector('[data-eclipsi-widget]');
  if (!hiHaWidgets) return;
  actualitzaWidgetsEclipsi();
  setInterval(actualitzaWidgetsEclipsi, 1000);
}

// Ajusta l'alçada real de la barra superior de l'eclipsi perquè la
// capçalera fixa i l'heroi es col·loquin just a sota, sigui quina sigui
// l'alçada que ocupi el text en cada amplada de pantalla.
function ajustaBarraEclipsi() {
  const barra = document.querySelector('.barra-eclipsi');
  if (!barra) return;
  document.documentElement.style.setProperty('--barra-eclipsi-alcada', barra.offsetHeight + 'px');
}

/* ---------- Inicialització ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-cel-estrellat]').forEach(c => iniciaCelEstrellat(c));
  iniciaWidgetCel();
  iniciaWidgetEclipsi();
  ajustaBarraEclipsi();
  iniciaNavegacio();
  gestionaImatgesAmbAlternativa();
  iniciaLightbox();
  marcaNavActiu();
  carregaAgenda();
  carregaGaleria();
});
window.addEventListener('resize', ajustaBarraEclipsi);

