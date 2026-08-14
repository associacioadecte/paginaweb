# Web d'ADECTE — Guia de manteniment

Aquest paquet conté la web estàtica d'ADECTE (Associació per a la Divulgació
Espacial i Científica de les Terres de l'Ebre), llesta per pujar a
l'allotjament. No necessita cap procés de build: són fitxers HTML, CSS i JS
plans.

## 1. Estructura de carpetes

```
/
├── index.html
├── activitats.html
├── eclipsi.html
├── landerer.html
├── landerer-edicio-1.html
├── landerer-edicio-2.html
├── qui-som.html
├── galeria.html
├── socis.html
└── assets/
    ├── css/
    │   └── style.css
    ├── js/
    │   └── main.js
    ├── data/
    │   ├── agenda.js       → activitats (properes / passades)
    │   ├── galeria.js      → llista de fotos de la Galeria
    │   └── navegacio.js    → menú principal i peu de pàgina (totes les pàgines)
    └── img/
        ├── logo.png
        ├── equip-portada.png
        ├── galeria/
        │   └── (totes les fotos llistades a assets/data/galeria.js,
        │        incloses les de l'eclipsi)
        └── landerer/
            ├── portada.png
            ├── logo-landerer.png
            ├── logo-ajuntament.png
            ├── edicio-1/
            │   ├── patrocinador.png
            │   ├── foto-01.png ... foto-03.png
            │   ├── cartell.png
            │   └── centres/
            │       └── centre-01.png ... centre-03.png
            └── edicio-2/
                ├── patrocinador.png
                ├── foto-01.png ... foto-04.png
                ├── cartell.png
                └── centres/
                    └── centre-01.png ... centre-04.png
```

Puja aquesta estructura sencera al servidor, respectant els noms de carpeta
(`assets/css`, `assets/js`, `assets/data`, `assets/img`).

✅ **Totes les imatges necessàries ja estan pujades.** L'apartat 3 explica
com funciona el mecanisme de detecció d'imatges que falten, per si en algun
moment n'hi ha alguna que es perdi o es vulgui substituir.

## 2. Com funcionen les imatges que falten (mecanisme de seguretat)

Cada `<img>` important de la web porta un atribut `data-fallback-text` i està
dins d'un contenidor amb `data-imatge-contenidor`. Si la imatge no es troba,
`main.js` la substitueix per un requadre gris amb el nom del fitxer que falta
(per exemple, `centre-02.png`). Això és intencionat: així saps exactament
quin fitxer has de pujar i on. Un cop hi col·loquis la imatge amb el mateix
nom i a la mateixa carpeta, el requadre desapareix automàticament — no cal
tocar l'HTML.

**Important:** el nom del fitxer ha de coincidir exactament (majúscules,
minúscules i extensió) amb el que apareix a l'HTML o a `galeria.js`.

Aquest mateix mecanisme és el que fa servir la pàgina de l'Eclipsi
(`eclipsi.html`) per a les seves tres fotos.

## 3. On es fa servir cada imatge (referència)

| Fitxer | Ubicació | On es fa servir |
|---|---|---|
| `logo.png` | `assets/img/` | Logotip a la capçalera de totes les pàgines |
| `equip-portada.png` | `assets/img/` | Secció "Qui som" de la portada (`index.html`) |
| `portada.png` | `assets/img/landerer/` | Foto de fons de la portada de Landerer |
| `logo-landerer.png` | `assets/img/landerer/` | Logotip del Projecte Landerer |
| `logo-ajuntament.png` | `assets/img/landerer/` | Ajuntament col·laborador (Edició I **i** Edició II) |
| `patrocinador.png` | `assets/img/landerer/edicio-1/` | Patrocinador de l'Edició I |
| `centre-01.png` a `centre-03.png` | `assets/img/landerer/edicio-1/centres/` | 3 centres participants Edició I |
| `foto-01.png` a `foto-03.png`, `cartell.png` | `assets/img/landerer/edicio-1/` | Galeria i cartell de l'Edició I |
| `patrocinador.png` | `assets/img/landerer/edicio-2/` | Patrocinador de l'Edició II |
| `centre-01.png` a `centre-04.png` | `assets/img/landerer/edicio-2/centres/` | 4 centres participants Edició II |
| `foto-01.png` a `foto-04.png`, `cartell.png` | `assets/img/landerer/edicio-2/` | Galeria i cartell de l'Edició II |

⚠️ **Nota:** tant `landerer-edicio-1.html` com `landerer-edicio-2.html`
carreguen el mateix fitxer `assets/img/landerer/logo-ajuntament.png` per a
l'ajuntament col·laborador. Si cada edició té un ajuntament diferent, avisa'm
o canvia manualment aquesta ruta a cada HTML perquè apunti a un fitxer propi
(p. ex. `logo-ajuntament-edicio-1.png` i `logo-ajuntament-edicio-2.png`).

La galeria (`galeria.html`) i l'agenda (`activitats.html` / `index.html`) no
depenen d'aquesta taula: funcionen amb el que hi afegeixis (veure punts 4 i
5). Si `assets/img/galeria/` no té alguna de les fotos llistades a
`galeria.js`, es mostrarà el requadre de "falta imatge" només per a aquella
foto.

## 4. Com afegir fotos a la Galeria

1. Puja la foto a `assets/img/galeria/` (format `.png`, `.jpg` o `.jpeg`).
2. Obre `assets/data/galeria.js` i afegeix el nom **exacte** del fitxer
   (amb extensió) a la llista `window.ADECTE_GALERIA`:

   ```js
   window.ADECTE_GALERIA = [
     "Presentació Associació 1.jpeg",
     "Presentació Associació 2.jpeg",
     "Globus Landerer II.jpeg",
     "Moment previ al llançament del Landerer II.jpeg",
     "El teu nou fitxer.jpg"   // ← nova línia
   ];
   ```

3. Desa el fitxer. No cal tocar `galeria.html`: la pàgina llegeix aquesta
   llista i genera les targetes automàticament, en el mateix ordre en què
   apareixen al fitxer.
4. El peu de foto (caption) que es veu sota la imatge s'agafa automàticament
   del nom del fitxer (sense l'extensió). Si vols un peu de foto diferent del
   nom del fitxer, posa'l com a nom de fitxer real (p. ex.
   `Taller de planisferis en família.jpg`) — els espais i accents estan
   permesos, el codi ja els gestiona.
5. Fes clic a qualsevol foto de la galeria per veure-la ampliada (lightbox);
   no requereix configuració addicional.

Pots eliminar una foto de la web simplement traient-ne la línia de
`galeria.js` (no cal esborrar el fitxer d'imatge si no vols).

**Nota:** la pàgina de l'Eclipsi (`eclipsi.html`) té la seva pròpia graella
de 3 fotos, escrita directament a l'HTML (no es llegeix de `galeria.js`).
Consulta l'apartat 8 per saber com afegir-hi més imatges enviades pels
socis.

## 5. Com afegir o editar activitats (Inici i Activitats)

Edita `assets/data/agenda.js`. Cada activitat és un objecte dins de l'array
`window.ADECTE_AGENDA`:

```js
{
  estat: 'propera',            // 'propera' o 'passada'
  dia: '12',                    // dia del mes (text)
  mes: 'Set',                    // mes abreujat
  tipus: 'Observació',           // etiqueta (Acte, Llançament, Observació…)
  titol: 'Nom de l\'activitat',
  meta: '20:00 h · Lloc',         // hora i ubicació
  descripcio: 'Descripció curta de l\'activitat.',
  enllac: 'eclipsi.html',         // opcional: mostra un botó a la targeta
  enllacText: 'Reviu l\'eclipsi'  // opcional: text del botó (per defecte "Més informació")
}
```

- Les activitats amb `estat: 'propera'` surten a la Home (les 3 primeres,
  per `data-limit="3"`) i a `activitats.html` (totes).
- Les que tenen `estat: 'passada'` només surten a l'arxiu d'`activitats.html`.
- Quan una activitat "propera" ja ha passat, canvia el seu `estat` a
  `'passada'` (no cal moure-la de lloc dins l'array).
- **`enllac` i `enllacText` són opcionals.** Si no els poses, la targeta no
  mostra cap botó (comportament per defecte). Si hi poses `enllac`, apareix
  un botó a sota de la descripció que porta a la URL indicada — normalment
  una altra pàgina del mateix web (p. ex. `landerer-edicio-2.html` o
  `eclipsi.html`), però també pot ser una URL externa.
- No hi ha límit d'activitats: pots afegir-ne tantes com vulguis, cada una
  com un nou objecte `{ ... }` separat per comes.
- Si en algun moment es carrega l'agenda des d'un `agenda.csv` en lloc
  d'aquest fitxer, afegeix-hi dues columnes més amb aquests mateixos noms
  (`enllac`, `enllacText`); poden quedar buides per a les activitats que no
  necessitin botó.

## 6. Menú principal i peu de pàgina (`navegacio.js`)

El menú de la capçalera i els enllaços del peu de pàgina **ja no s'editen
pàgina per pàgina**: es generen automàticament a totes les pàgines a partir
d'un únic fitxer, `assets/data/navegacio.js`.

Per afegir, treure o reordenar una pàgina del menú:

```js
window.ADECTE_NAV = [
  { text: 'Inici', pagina: 'inici', href: 'index.html' },
  {
    text: 'Activitats', pagina: 'activitats', href: 'activitats.html',
    submenu: [
      { text: 'Totes les activitats', pagina: 'activitats', href: 'activitats.html' },
      { text: 'Eclipsi Solar 2026', pagina: 'eclipsi', href: 'eclipsi.html' }
      // ← per afegir una altra efemèride, només cal una línia més aquí
    ]
  },
  // ...
];
```

- `text` és el que es veu al menú, `href` la pàgina a la qual enllaça.
- `pagina` ha de coincidir amb l'atribut `data-pagina="..."` del `<body>`
  de la pàgina corresponent (serveix per marcar l'enllaç com a actiu).
- `submenu` és opcional: si l'afegeixes, l'element es converteix en un
  desplegable (com passa amb "Activitats" i "Landerer").
- El peu de pàgina (bloc "Navegació") es genera automàticament a partir
  d'aquesta mateixa llista — no cal mantenir-lo per separat. Si mai
  volguessis un peu diferent del menú, pots substituir
  `window.ADECTE_NAV_PEU = null;` per un array propi `[{text, href}, ...]`.

Amb això, **afegir una pàgina nova al menú de tot el web és editar un sol
fitxer**, no els 9 (o més) `.html`.

## 7. Contingut de les pàgines de Landerer

- **`landerer.html`**: pàgina general del projecte. Els textos són fixos a
  l'HTML; edita'ls directament si cal.
- **`landerer-edicio-1.html` / `landerer-edicio-2.html`**: cada edició té
  blocs fixos per a patrocinador, ajuntament, centres participants, mapa de
  la ruta (iframe de Google My Maps) i una graella de fotos. Per canviar el
  nombre de centres o de fotos d'una edició, duplica o elimina el bloc
  `<div class="logo-slot centre" ...>` (centres) o
  `<div class="foto-landerer foto-galeria" ...>` (fotos) corresponent dins
  de l'HTML, i puja la imatge amb el nom que hi indiquis.
- **Noves edicions futures**: si es crea una Edició III, la manera més
  senzilla és duplicar `landerer-edicio-2.html` i canviar-ne el contingut.
  Per afegir-la al menú, ara només cal una línia nova dins del `submenu`
  de "Landerer" a `assets/data/navegacio.js` (veure apartat 6) — el peu de
  pàgina s'actualitza sol.

## 8. La pàgina de l'Eclipsi (`eclipsi.html`)

Pàgina de record de l'eclipsi solar total del 12 d'agost de 2026, penjada
del desplegable "Activitats" del menú. Té quatre blocs:

1. **Text informatiu** sobre el fenomen (fix a l'HTML; edita'l directament
   si cal corregir-hi alguna dada).
2. **Galeria de 3 fotos**, amb el mateix mecanisme de lightbox i de
   "falta imatge" que la resta del web, però escrita directament a l'HTML
   (com les pàgines de Landerer) en lloc de llegir-se de `galeria.js`. Per
   afegir-hi més fotos (per exemple, imatges que enviïn els socis), copia
   un bloc `<figure class="foto-galeria" data-imatge-contenidor>...</figure>`
   dins de `<div class="graella-galeria">` i puja la imatge corresponent a
   `assets/img/galeria/`.
3. **Vídeo del directe oficial** (Departament de Recerca i Universitats),
   incrustat amb un `<iframe>` de YouTube dins del contenidor
   `.video-directe`. Per canviar el vídeo, només cal substituir la URL de
   `src` per l'enllaç `embed` d'un altre vídeo de YouTube.
4. **Crida a compartir fotos**: convida a enviar imatges pròpies per
   Instagram, correu o a qualsevol membre de la Junta. Els enllaços de
   contacte ja hi són; no cal tocar-los llevat que canviïn.

## 9. Vista del cel — fase lunar

El widget de la Home ("El cel aquesta nit") calcula la fase lunar amb la
llibreria [SunCalc](https://github.com/mourner/suncalc), carregada per CDN
només a `index.html`:

```html
<script src="https://unpkg.com/suncalc@1.9.0/suncalc.js"></script>
```

La funció `calculaFaseLunar()` de `assets/js/main.js` crida
`SunCalc.getMoonIllumination(data)`, que retorna la fase (0–1) i la
il·luminació (0–1) exactes per a la data indicada. Com que és un càlcul
astronòmic real (no una aproximació amb data de referència), **no cal
actualitzar-lo periòdicament**.

Aquest widget només apareix a `index.html` (és l'única pàgina amb els
elements `data-lluna-nom`, `data-lluna-illuminacio` i `data-lluna-svg`), així
que si es vol reproduir a una altra pàgina cal afegir-hi aquests elements i
el `<script>` de SunCalc abans de `main.js`.

⚠️ Aquest widget necessita connexió a internet la primera vegada que es
carrega la pàgina, per descarregar la llibreria SunCalc des del CDN
(`unpkg.com`). Si mai cal que la web funcioni sense dependre de cap CDN
extern, la llibreria es pot descarregar i servir des de
`assets/js/suncalc.js`.

## 10. Publicació

Aquests fitxers són 100% estàtics: n'hi ha prou de pujar tota la carpeta
(manté l'estructura `assets/...`) al servidor o hosting (per exemple via
FTP, cPanel, Netlify, GitHub Pages, etc.). No calen bases de dades ni
processos d'instal·lació.

Abans de publicar, comprova ràpidament la web (sobretot `galeria.html` i
les pàgines de Landerer) per assegurar-te que no hi apareix cap requadre de
"falta imatge" en un lloc visible — si n'hi ha algun, consulta els apartats
2 i 3.
