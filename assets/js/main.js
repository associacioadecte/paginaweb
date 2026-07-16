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
  // Referència: Lluna plena (de maduixa) del 30 de juny de 2026 a les 01:57 (CEST) = 29/06/2026 23:57 UTC.
  // Actualitza aquesta data de tant en tant amb una lluna plena propera perquè el càlcul no es desfasi.
  const refPlenilluni = new Date(Date.UTC(2026, 5, 29, 23, 57));
  const cicleSinodic = 29.530588853;
  const diesTranscorreguts = (data.getTime() - refPlenilluni.getTime()) / 86400000;
  let fraccioDesDePlenilluni = (diesTranscorreguts % cicleSinodic) / cicleSinodic;
  if (fraccioDesDePlenilluni < 0) fraccioDesDePlenilluni += 1;
  // fraccioDesDePlenilluni: 0 = lluna plena. Es converteix a la convenció fase: 0 = lluna nova, 0.5 = lluna plena.
  let fase = (fraccioDesDePlenilluni + 0.5) % 1;

  const illuminacio = (1 - Math.cos(fase * 2 * Math.PI)) / 2;
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
  const desplacament = Math.cos(fase * 2 * Math.PI) * radi * 1.7;
  const ombra = svgEl.querySelector('#ombra-lluna');
  if (ombra) ombra.setAttribute('cx', 50 + desplacament);
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

/* ---------- Inicialització ---------- */
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-cel-estrellat]').forEach(c => iniciaCelEstrellat(c));
  iniciaWidgetCel();
  iniciaNavegacio();
  gestionaImatgesAmbAlternativa();
  iniciaLightbox();
  marcaNavActiu();
  carregaAgenda();
  carregaGaleria();
});
