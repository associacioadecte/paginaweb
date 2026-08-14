/* Edita aquest fitxer per actualitzar l'agenda (o copia el contingut des de agenda.csv). */
window.ADECTE_AGENDA = [
  { estat: 'passada', dia: '12', mes: 'Ago', tipus: 'Efemèride', titol: 'Eclipsi Solar Total', meta: '19h30 - 21h30', descripcio: "Eclipsi solar total visible des de qualsevol punt de les Terres de l'Ebre, Camp de Tarragona, nord del País Valencià i altres punts de l'estat.", enllac: 'eclipsi.html', enllacText: 'Reviu l\'eclipsi' },
  { estat: 'passada', dia: '25', mes: 'Abr', tipus: 'Llançament', titol: 'Landerer II', meta: '11:00 h · Quinto', descripcio: "Llançament de la segona edició del projecte Landerer amb experiments de quatre centres educatius del territori.", enllac: 'landerer-edicio-2.html', enllacText: 'Veure l\'Edició II' },
  { estat: 'passada', dia: '18', mes: 'Abr', tipus: 'Acte', titol: 'Presentació Associació', meta: "Segona Planta, Edifici EMD", descripcio: "Presentació oficial d'ADECTE amb activitats divulgatives per als més petits." }

];

/* Camps: estat ('propera' o 'passada'), dia, mes, tipus, titol, meta, descripcio.
   Opcionals: enllac (URL a la qual ha d'anar el botó) i enllacText (text del
   botó; si no es posa es fa servir "Més informació"). Si no es defineix
   'enllac', la targeta no mostra cap botó.
   Si actualitzes des d'agenda.csv, afegeix dues columnes més: enllac i
   enllacText (poden quedar buides per a les activitats que no en necessitin). */