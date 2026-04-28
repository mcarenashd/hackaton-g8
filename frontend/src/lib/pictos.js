// lib/pictos.js
// SVG pictogramas educativos para cada tipo de paso.
// Amplíalos o sustitúyelos por imágenes reales de Copilot Designer en producción.

export const PICTOS = {
  filter: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="10" width="80" height="60" rx="8" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="50" y="42" text-anchor="middle" font-size="28">🪣</text>
    <line x1="95" y1="40" x2="125" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="125,36 133,40 125,44" fill="#0f4f3a"/>
    <rect x="135" y="10" width="60" height="60" rx="8" fill="#fff8e6" stroke="#c8a000" stroke-width="1.5"/>
    <text x="165" y="42" text-anchor="middle" font-size="22">🧦</text>
    <line x1="200" y1="40" x2="230" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="230,36 238,40 230,44" fill="#0f4f3a"/>
    <rect x="240" y="20" width="32" height="48" rx="6" fill="#d4f0ff" stroke="#2a7fb0" stroke-width="1.5"/>
    <text x="256" y="50" text-anchor="middle" font-size="16">💧</text>
  </svg>`,

  sodis: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="40" cy="40" r="28" fill="#fff8c0" stroke="#e0a000" stroke-width="1.5"/>
    <text x="40" y="48" text-anchor="middle" font-size="26">☀️</text>
    <line x1="72" y1="40" x2="105" y2="40" stroke="#e0a000" stroke-width="2"/>
    <polygon points="105,36 115,40 105,44" fill="#e0a000"/>
    <rect x="118" y="14" width="44" height="66" rx="20" fill="#d4f0ff" stroke="#2a7fb0" stroke-width="1.5"/>
    <text x="140" y="52" text-anchor="middle" font-size="18">🍶</text>
    <text x="185" y="32" font-size="10" fill="#666">6h</text>
    <path d="M178,36 Q200,20 220,36" stroke="#e0a000" stroke-width="1.5" fill="none" stroke-dasharray="3,2"/>
    <text x="228" y="48" text-anchor="middle" font-size="20">✅</text>
  </svg>`,

  boil: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="30" width="70" height="40" rx="6" fill="#ffe0cc" stroke="#c04000" stroke-width="1.5"/>
    <text x="45" y="58" text-anchor="middle" font-size="22">🔥</text>
    <rect x="20" y="20" width="50" height="16" rx="4" fill="#c04000" opacity="0.2"/>
    <text x="45" y="32" text-anchor="middle" font-size="11" fill="#c04000">olla</text>
    <path d="M35,18 Q38,10 41,18" stroke="#c04000" stroke-width="1.5" fill="none"/>
    <path d="M45,16 Q48,8 51,16" stroke="#c04000" stroke-width="1.5" fill="none"/>
    <line x1="85" y1="40" x2="115" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="115,36 123,40 115,44" fill="#0f4f3a"/>
    <text x="140" y="30" text-anchor="middle" font-size="10" fill="#666">hervir 1 min</text>
    <rect x="118" y="32" width="44" height="38" rx="6" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="140" y="58" text-anchor="middle" font-size="20">💧</text>
    <line x1="167" y1="40" x2="197" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="197,36 205,40 197,44" fill="#0f4f3a"/>
    <circle cx="230" cy="40" r="26" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="230" y="48" text-anchor="middle" font-size="22">✅</text>
  </svg>`,

  chlorine: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="15" width="38" height="55" rx="8" fill="#fff0f0" stroke="#c04040" stroke-width="1.5"/>
    <text x="29" y="50" text-anchor="middle" font-size="18">🧴</text>
    <text x="29" y="26" text-anchor="middle" font-size="8" fill="#c04040">cloro</text>
    <path d="M52,35 Q65,20 75,35" stroke="#c04040" stroke-width="1.5" fill="none"/>
    <text x="65" y="18" text-anchor="middle" font-size="9" fill="#c04040">2 gotas/L</text>
    <rect x="80" y="25" width="60" height="40" rx="8" fill="#d4f0ff" stroke="#2a7fb0" stroke-width="1.5"/>
    <text x="110" y="52" text-anchor="middle" font-size="22">🪣</text>
    <line x1="145" y1="40" x2="175" y2="40" stroke="#666" stroke-width="1.5" stroke-dasharray="4,3"/>
    <text x="162" y="32" text-anchor="middle" font-size="9" fill="#666">30 min</text>
    <polygon points="175,36 183,40 175,44" fill="#0f4f3a"/>
    <circle cx="215" cy="40" r="30" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="215" y="44" text-anchor="middle" font-size="9" fill="#0f4f3a">lista para beber</text>
    <text x="215" y="58" text-anchor="middle" font-size="12">💧✓</text>
  </svg>`,

  default: `<svg viewBox="0 0 280 80" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="40" r="28" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="50" y="48" text-anchor="middle" font-size="26">💧</text>
    <line x1="82" y1="40" x2="120" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="120,36 128,40 120,44" fill="#0f4f3a"/>
    <circle cx="155" cy="40" r="28" fill="#fff8e6" stroke="#c8a000" stroke-width="1.5"/>
    <text x="155" y="48" text-anchor="middle" font-size="26">⏳</text>
    <line x1="187" y1="40" x2="218" y2="40" stroke="#0f4f3a" stroke-width="1.5" stroke-dasharray="4,3"/>
    <polygon points="218,36 226,40 218,44" fill="#0f4f3a"/>
    <circle cx="250" cy="40" r="22" fill="#e8f5ef" stroke="#0f4f3a" stroke-width="1.5"/>
    <text x="250" y="48" text-anchor="middle" font-size="18">✅</text>
  </svg>`,
};

export function getPicto(stepText) {
  const t = (stepText || "").toLowerCase();
  if (t.includes("sol") || t.includes("sodis") || t.includes("botella") || t.includes("pet")) return PICTOS.sodis;
  if (t.includes("hervir") || t.includes("fuego") || t.includes("calor") || t.includes("ebullición")) return PICTOS.boil;
  if (t.includes("cloro") || t.includes("lejía") || t.includes("desinfect")) return PICTOS.chlorine;
  if (t.includes("filtr") || t.includes("tela") || t.includes("arena") || t.includes("carbón")) return PICTOS.filter;
  return PICTOS.default;
}

/**
 * Devuelve un icono específico para el verbo/contenido de cada paso, así
 * dos pasos del mismo método (p.ej. "añade carbón" vs "añade arena")
 * tienen iconos visualmente distintos. Las patrones se evalúan de más
 * específico a más general — el primero que matchea gana.
 */
// Patrones de mayor a menor prioridad: el primero que matchea gana, así
// que los más específicos (incl. "espera N horas" antes de "sol", o
// "arena fina" antes de "carbón") deben ir arriba.
const STEP_ICONS = [
  // Acciones que mencionan tiempo/espera explícito (antes que sol/sun).
  { match: /(reposa|espera|sediment|durante \d+|al menos \d+\s*(?:hora|min|día)|dej[ae] [^.]+ (?:minuto|hora|día|h\b|min\b))/i, icon: '⏱️', accent: '#fff8e6' },

  // Materiales focales: arena antes que carbón porque el paso "Sobre el
  // carbón, añade arena" tiene ambos pero el material añadido es la arena.
  { match: /\barena\b/i, icon: '🟡', accent: '#fff3c0' },
  { match: /grava|piedras?/i, icon: '🪨', accent: '#e8e0d0' },
  { match: /carb[oó]n/i, icon: '⚫', accent: '#dad8d2' },
  { match: /tela|algod[oó]n|pa[ñn]o|gasa|trapo/i, icon: '🧦', accent: '#fff8e6' },
  { match: /(lej[ií]a|cloro|hipoclor|gota)/i, icon: '🧴', accent: '#d4f0ff' },

  // Acciones de seguridad / outcome
  { match: /(descart|primer.*minuto|primer.*flujo)/i, icon: '🚫', accent: '#ffe0cc' },
  { match: /(comprueba|verifica|huele|sabor)/i, icon: '👁️', accent: '#fff8e6' },
  { match: /(bebe|beber|listo para|consumir|almacen)/i, icon: '✅', accent: '#c8f0d8' },

  // Verbos físicos
  { match: /(corta|cortar)/i, icon: '✂️', accent: '#ffe6e6' },
  { match: /hierve|hervir|burbuje|ebullici/i, icon: '🔥', accent: '#ffe0cc' },
  { match: /(sol\b|solar|exponer|expón|expon|radiac)/i, icon: '☀️', accent: '#fff8c0' },
  { match: /(destil|condens|gotea)/i, icon: '💧', accent: '#d4f0ff' },
  { match: /(agita|mezcla|remueve|sacude|oxigen)/i, icon: '🌀', accent: '#d4f0ff' },
  { match: /(tapa|cubre|sella|cierr)/i, icon: '🔒', accent: '#e8f5ef' },
  { match: /(coloca|colocar|pon (la|el|una))/i, icon: '📍', accent: '#e8f5ef' },
  { match: /(filtra|filtrar|pre-filtr)/i, icon: '⏳', accent: '#fff8e6' },
  { match: /(llena|verter|vierte|trasvasa|recoge)/i, icon: '🪣', accent: '#d4f0ff' },
];

export function getStepIcon(text) {
  const t = (text || '').toLowerCase();
  for (const { match, icon, accent } of STEP_ICONS) {
    if (match.test(t)) return { icon, accent };
  }
  return { icon: '💧', accent: '#e8f5ef' };
}

export function parseSteps(text) {
  const lines = text.split("\n").filter((l) => l.trim());
  const steps = [];
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const isNewStep =
      /^(paso\s*\d|step\s*\d|\d+[\.\)—\-])/i.test(trimmed) ||
      (trimmed.match(/^[^\w\s]/u) && trimmed.length > 5 && steps.length < 5);

    if (isNewStep) {
      if (current) steps.push(current);
      current = { title: trimmed.replace(/\*\*/g, "").substring(0, 80), text: "", time: "" };
    } else if (current) {
      const timeMatch = trimmed.match(/\(([^)]+(?:min|hora|h|día)[^)]*)\)/i);
      if (timeMatch) current.time = timeMatch[1];
      else if (!current.text && trimmed.length > 10) current.text = trimmed.replace(/\*\*/g, "");
    }
  }
  if (current) steps.push(current);

  // Fallback si el parser no encuentra nada
  if (steps.length === 0) {
    return [
      { title: "1. ☀️ Filtra el agua", text: "Pasa el agua por una tela limpia para quitar tierra y partículas grandes.", time: "5 min" },
      { title: "2. 🍶 Llena la botella", text: "Llena una botella PET transparente dejando 1 cm de aire y ciérrala.", time: "2 min" },
      { title: "3. ☀️ Expón al sol (SODIS)", text: "Pon la botella al sol directo sobre una superficie reflectante.", time: "6 horas" },
      { title: "4. ✅ Lista para tomar", text: "Deja enfriar antes de beber.", time: "10 min" },
    ];
  }
  return steps.slice(0, 5);
}
