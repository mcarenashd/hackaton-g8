/**
 * Convierte texto libre del usuario (materiales/recursos) en flags canónicos
 * y genera consejos específicos para cada item reconocido.
 *
 * Pensado para texto en español; tolerante a tildes y mayúsculas.
 */

// Cada flag agrupa sinónimos/variantes que el usuario podría escribir.
const KEYWORDS = {
  olla: ['olla', 'cazo', 'cacerola', 'pava', 'caldero', 'lata', 'marmita'],
  botellas_plastico: ['botella pet', 'botellas pet', 'pet', 'botella plast', 'botellas plast'],
  tela: [
    'tela',
    'algodon',
    'pano',
    'trapo',
    'gasa',
    'mosquitero',
    'sabana',
    'pañuelo',
    'panuelo',
    'camiseta',
  ],
  carbon: ['carbon', 'carboncillo', 'carbon activado', 'carbon vegetal'],
  arena: ['arena'],
  grava: ['grava', 'piedra', 'piedras', 'gravilla'],
  cloro: ['cloro', 'lejia', 'hipoclorito', 'lavandina', 'clorox'],
  plastico: ['plastico', 'lamina', 'film', 'bolsa transparente', 'envoltorio'],
  sol: ['sol ', 'solar', 'soleado'],
  fuego: ['fuego', 'estufa', 'fogon', 'lena', 'gas', 'horno', 'brasero', 'fogata', 'cocina a gas'],
  electricidad: [
    'electric',
    'corriente',
    'enchufe',
    'panel solar',
    'generador',
    'bateria',
    'placa solar',
  ],
  filtro_ceramica: ['ceramica', 'filtro de ceramica', 'filtro ceramico', 'vela ceramica'],
  filtro_comercial: ['brita', 'jarra filtrante', 'filtro de jarra', 'filtro comercial'],
  pastillas: ['pastilla potabilizadora', 'pastillas potabilizadoras', 'tableta potabilizadora', 'aquatabs'],
  yodo: ['yodo', 'tintura de yodo'],
  vinagre: ['vinagre'],
  hielo_nevera: ['nevera', 'frigorif', 'congelador', 'hielo'],
  agua_caliente: ['agua caliente', 'termo', 'calentador'],
  uv_lampara: ['uv', 'lampara uv', 'esterilizador uv', 'steripen'],
  cafe: ['cafe molido', 'posos de cafe'],
};

// Consejo concreto por flag. La función recibe la cadena original que escribió
// el usuario para personalizar el mensaje.
const ADVICE = {
  olla: (item) =>
    `"${item}": úsala para hervir el agua si tienes fuego. Es el método más seguro y universal.`,
  botellas_plastico: (item) =>
    `"${item}": ideales para SODIS. Llénalas hasta ¾, agita 20 s y déjalas al sol al menos 6 h.`,
  tela: (item) =>
    `"${item}": como pre-filtro siempre, antes de cualquier método. Mejora muchísimo la eficacia.`,
  carbon: (item) =>
    `"${item}": añade una capa al filtro casero (~5 cm) para mejorar olor y sabor; cámbialo cada 1-2 semanas.`,
  arena: (item) => `"${item}": lávala bien y úsala como capa intermedia en el filtro multicapa.`,
  grava: (item) => `"${item}": forma la capa superior del filtro. Lávalas hasta que no suelten polvo.`,
  cloro: (item) =>
    `"${item}": tras filtrar, añade 2 gotas por litro (4 si turbio) y espera 30 min. Inactiva virus que el filtro no retiene.`,
  plastico: (item) =>
    `"${item}": útil para destilación solar de emergencia o para sellar el contenedor durante SODIS.`,
  sol: (item) =>
    `"${item}": aprovecha la exposición para SODIS o destilación. Si es muy intenso, mejor las horas centrales.`,
  fuego: (item) =>
    `"${item}": prioriza el hervido. Aprovecha cada encendido para potabilizar varias tandas seguidas.`,
  electricidad: (item) =>
    `"${item}": si puede mover una bomba, úsala para circular el agua; si calienta, hierve directamente.`,
  filtro_ceramica: (item) =>
    `"${item}": retiene bacterias y la mayoría de protozoos. Úsalo después de la tela; aún así, complementa con cloración para los virus.`,
  filtro_comercial: (item) =>
    `"${item}": mejora sabor y filtra cloro/sedimentos, pero NO sustituye un tratamiento de desinfección. Combínalo con hervido o cloro.`,
  pastillas: (item) =>
    `"${item}": respeta la dosis del envase y el tiempo de reposo (~30 min). Equivalentes prácticos a la cloración.`,
  yodo: (item) =>
    `"${item}": 5-10 gotas de tintura al 2% por litro, espera 30 min. No usar en embarazadas ni problemas de tiroides.`,
  vinagre: (item) =>
    `"${item}": sirve para limpiar tus recipientes antes de almacenar el agua, pero NO desinfecta agua para beber.`,
  hielo_nevera: (item) =>
    `"${item}": NO confíes en congelar para potabilizar (no mata patógenos), pero sí para conservar el agua ya tratada.`,
  agua_caliente: (item) =>
    `"${item}": si alcanza ebullición, equivale al método de hervido. Si solo calienta tibio, no es suficiente.`,
  uv_lampara: (item) =>
    `"${item}": potente desinfectante. Úsalo solo en agua ya filtrada y transparente; sigue las instrucciones del fabricante.`,
  cafe: (item) =>
    `"${item}": curiosidad — los posos pueden mejorar el sabor pero NO desinfectan. Úsalo solo como toque final.`,
};

function normalize(s) {
  return (s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

function matchKeywords(text) {
  const n = normalize(text);
  const hits = new Set();
  for (const [flag, words] of Object.entries(KEYWORDS)) {
    for (const w of words) {
      if (n.includes(normalize(w).trim())) {
        hits.add(flag);
        break;
      }
    }
  }
  return Array.from(hits);
}

function extractFlags(items = []) {
  const out = new Set();
  for (const item of items) {
    matchKeywords(item).forEach((f) => out.add(f));
  }
  return out;
}

/**
 * Devuelve una lista de strings: consejo específico para cada item del
 * usuario. Si no detectamos ninguna keyword, generamos un mensaje genérico
 * para que el item no pase desapercibido.
 */
function buildConsiderations({ customMaterials = [], customResources = [] }) {
  const all = [...customMaterials, ...customResources];
  const out = [];
  const seenFlags = new Set();

  for (const item of all) {
    const flags = matchKeywords(item);
    if (flags.length === 0) {
      out.push(
        `"${item}": lo registramos como recurso adicional. Si encaja con alguno de los pasos, úsalo como complemento al método principal.`
      );
      continue;
    }
    // Para no repetir el mismo consejo si el usuario menciona varias variantes
    // del mismo concepto, dedupe por flag.
    for (const f of flags) {
      if (seenFlags.has(f)) continue;
      seenFlags.add(f);
      const advice = ADVICE[f];
      if (advice) out.push(advice(item));
    }
  }
  return out;
}

module.exports = { matchKeywords, extractFlags, buildConsiderations };
