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
    │   ├── agenda.js      → activitats (properes / passades)
    │   └── galeria.js     → llista de fotos de la Galeria
    └── img/
        ├── logo.png                     (falta)
        ├── equip-portada.png            (falta)
        ├── galeria/                     (falta contingut)
        └── landerer/
            ├── portada.png              (falta)
            ├── logo-landerer.png        (falta)
            ├── logo-ajuntament.png      (falta)
            ├── edicio-1/
            │   ├── patrocinador.png     (falta)
            │   ├── foto-01.png ... foto-03.png   (falta)
            │   ├── cartell.png          (falta)
            │   └── centres/
            │       └── centre-01.png ... centre-03.png (falta)
            └── edicio-2/
                ├── patrocinador.png     (falta)
                ├── foto-01.png ... foto-04.png   (falta)
                ├── cartell.png          (falta)
                └── centres/
                    └── centre-01.png ... centre-04.png (falta)
```

Puja aquesta estructura sencera al servidor, respectant els noms de carpeta
(`assets/css`, `assets/js`, `assets/data`, `assets/img`).

## 2. Com funcionen les imatges que falten (comportament actual)

Cada `<img>` important de la web porta un atribut `data-fallback-text` i està
dins d'un contenidor amb `data-imatge-contenidor`. Si la imatge no es troba,
`main.js` la substitueix per un requadre gris amb el nom del fitxer que falta
(per exemple, `centre-02.png`). Això és intencionat: així saps exactament
quin fitxer has de pujar i on. Un cop hi col·loquis la imatge amb el mateix
nom i a la mateixa carpeta, el requadre desapareix automàticament — no cal
tocar l'HTML.

**Important:** el nom del fitxer ha de coincidir exactament (majúscules,
minúscules i extensió) amb el que apareix a l'HTML.

## 3. Imatges que falten sí o sí abans de publicar

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
necessiten cap fitxer "sí o sí": funcionen amb el que hi afegeixis (veure
punts 4 i 5). Si `assets/img/galeria/` no té les fotos llistades a
`galeria.js`, es mostrarà el requadre de "falta imatge" per a cadascuna.

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

## 5. Com afegir o editar activitats (Inici i Activitats)

Edita `assets/data/agenda.js`. Cada activitat és un objecte dins de l'array
`window.ADECTE_AGENDA`:

```js
{
  estat: 'propera',        // 'propera' o 'passada'
  dia: '12',                // dia del mes (text)
  mes: 'Set',                // mes abreujat
  tipus: 'Observació',       // etiqueta (Acte, Llançament, Observació…)
  titol: 'Nom de l\'activitat',
  meta: '20:00 h · Lloc',     // hora i ubicació
  descripcio: 'Descripció curta de l\'activitat.'
}
```

- Les activitats amb `estat: 'propera'` surten a la Home (les 3 primeres,
  per `data-limit="3"`) i a `activitats.html` (totes).
- Les que tenen `estat: 'passada'` només surten a l'arxiu d'`activitats.html`.
- Quan una activitat "propera" ja ha passat, canvia el seu `estat` a
  `'passada'` (no cal moure-la de lloc dins l'array).
- No hi ha límit d'activitats: pots afegir-ne tantes com vulguis, cada una
  com un nou objecte `{ ... }` separat per comes.

## 6. Com afegir contingut a les pàgines de Landerer

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
  senzilla és duplicar `landerer-edicio-2.html`, canviar-ne el contingut i
  afegir l'enllaç corresponent al menú "Landerer" (submenú) de totes les
  pàgines i al peu de pàgina de totes les pàgines.

## 7. Vista del cel — fase lunar

El widget de la Home ("El cel aquesta nit") calcula la fase lunar
matemàticament (sense connexió a internet ni API externa), a partir d'una
data de referència coneguda i del cicle sinòdic (29,530588853 dies).

Actualment fa servir com a referència:

> **Lluna plena (de maduixa) del 30 de juny de 2026 a les 01:57 (CEST)**

Això és a `assets/js/main.js`, dins la funció `calculaFaseLunar()`:

```js
const refPlenilluni = new Date(Date.UTC(2026, 5, 29, 23, 57)); // 29/06/2026 23:57 UTC = 30/06/2026 01:57 CEST
```

Com que el càlcul és una aproximació basada en el cicle sinòdic mitjà, es va
desviant molt lleugerament amb el temps (uns segons per cicle). Es recomana
actualitzar aquesta data cada 1-2 anys amb una lluna plena propera (es pot
consultar, per exemple, timeanddate.com o qualsevol calendari lunar) per
mantenir la màxima precisió. Cal substituir només aquesta línia, indicant
l'hora en **UTC** (no en hora local).

## 8. Publicació

Aquests fitxers són 100% estàtics: n'hi ha prou de pujar tota la carpeta
(manté l'estructura `assets/...`) al servidor o hosting (per exemple via
FTP, cPanel, Netlify, GitHub Pages, etc.). No calen bases de dades ni
processos d'instal·lació.

Abans de publicar, revisa el punt 3 (imatges obligatòries) perquè la web no
mostri cap requadre de "falta imatge" a llocs visibles.
