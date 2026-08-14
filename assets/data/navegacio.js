/* =========================================================
   ADECTE — navegacio.js
   Edita aquest fitxer per afegir, treure o reordenar pàgines
   al menú principal (capçalera) i al peu de pàgina. Cap altre
   fitxer .html necessita tocar-se per fer aquest canvi.

   Cada element pot tenir:
     text     -> text visible de l'enllaç
     pagina   -> identificador (ha de coincidir amb el
                 data-pagina="..." del <body> de la pàgina, per
                 poder marcar l'enllaç com a actiu)
     href     -> fitxer .html al qual enllaça
     classe   -> (opcional) classe CSS extra, p. ex. 'btn-soci-nav'
     submenu  -> (opcional) array del mateix tipus per crear un
                 desplegable (com "Landerer" o "Activitats")

   Per afegir una subpàgina nova al desplegable d'Activitats
   (per exemple una altra efemèride), només cal afegir un objecte
   més dins del submenu d'aquí sota.
   ========================================================= */
window.ADECTE_NAV = [
  { text: 'Inici', pagina: 'inici', href: 'index.html' },
  {
    text: 'Activitats', pagina: 'activitats', href: 'activitats.html',
    submenu: [
      { text: 'Totes les activitats', pagina: 'activitats', href: 'activitats.html' },
      { text: 'Eclipsi Solar 2026', pagina: 'eclipsi', href: 'eclipsi.html' }
    ]
  },
  {
    text: 'Landerer', pagina: 'landerer', href: 'landerer.html',
    submenu: [
      { text: 'El projecte', pagina: 'landerer', href: 'landerer.html' },
      { text: 'Edició I', pagina: 'landerer-edicio-1', href: 'landerer-edicio-1.html' },
      { text: 'Edició II', pagina: 'landerer-edicio-2', href: 'landerer-edicio-2.html' }
    ]
  },
  { text: 'Qui som', pagina: 'qui-som', href: 'qui-som.html' },
  { text: 'Galeria', pagina: 'galeria', href: 'galeria.html' },
  { text: "Fes-te'n soci", pagina: 'socis', href: 'socis.html', classe: 'btn-soci-nav' }
];

/* Enllaços del peu de pàgina ("Navegació"). Deixa'l a 'null' perquè es
   generi automàticament a partir d'ADECTE_NAV (recomanat: no cal
   mantenir dues llistes). Si algun dia vols un peu diferent del menú
   principal, substitueix null per un array [{text, href}, ...]. */
window.ADECTE_NAV_PEU = null;
