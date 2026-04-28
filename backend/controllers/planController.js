const { selectMethod } = require('../utils/methodSelector');
const { generatePlan } = require('../services/aiService');

const URGENCIA_VALUES = ['Ahora mismo', 'Tengo tiempo', ''];
const PERSONAS_VALUES = ['1–2 personas', 'Familia', 'Comunidad', 'Escuela', ''];

function sanitize(value, max = 300) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, max);
}

function splitList(value) {
  return sanitize(value)
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 15);
}

/**
 * Recibe el payload del nuevo flujo (frontend AquaGuía):
 * {
 *   situacion: { agua, customAgua, urgencia, personas },
 *   recursos: [{ id, label }, ...],
 *   customRecursos: string,
 *   customSource: string
 * }
 *
 * Lo normaliza al shape interno (compatible con el aiService).
 */
function normalize(body) {
  const errors = [];
  const sit = body.situacion || {};

  const recursosArr = Array.isArray(body.recursos) ? body.recursos : [];
  const recursoIds = recursosArr.map((r) => (typeof r === 'string' ? r : r.id)).filter(Boolean);
  const customRecursos = splitList(body.customRecursos);
  if (recursoIds.length === 0 && customRecursos.length === 0) {
    errors.push('Indica al menos un recurso (de la lista o en "Algo más").');
  }

  const aguaLabel = sanitize(sit.agua, 120);
  const customAgua = sanitize(sit.customAgua || body.customSource, 200);
  if (!aguaLabel) errors.push('Indica el tipo de fuente de agua.');
  if (aguaLabel === 'Otra (la describo)' && !customAgua) {
    errors.push('Describe brevemente la fuente "Otra".');
  }

  const urgencia = sanitize(sit.urgencia, 60);
  if (!URGENCIA_VALUES.includes(urgencia)) errors.push('Urgencia inválida.');

  const personas = sanitize(sit.personas, 60);
  if (!PERSONAS_VALUES.includes(personas)) errors.push('Selección de personas inválida.');

  // Mapeamos los recursos del nuevo frontend (ids: sol/botella/fuego/...) a los
  // ids canónicos que entiende methodSelector y aiService.
  const idMap = {
    sol: ['sol'],
    botella: ['botellas_plastico'],
    fuego: ['fuego'],
    carbon: ['carbon', 'arena'],
    cloro: ['cloro'],
    tela: ['tela'],
    olla: ['olla'],
    electricidad: ['electricidad'],
  };
  const canonicalMaterials = new Set();
  const canonicalResources = new Set();
  const sources = ['sol', 'fuego', 'electricidad'];
  for (const id of recursoIds) {
    const expanded = idMap[id] || [id];
    for (const c of expanded) {
      if (sources.includes(c)) canonicalResources.add(c);
      else canonicalMaterials.add(c);
    }
  }

  // Fuente de agua: del label legible al id canónico.
  const sourceMap = {
    'Río o arroyo': 'rio',
    'Agua de lluvia': 'lluvia',
    Pozo: 'pozo',
    'Grifo dudoso': 'grifo_dudoso',
    'Lago / laguna': 'lago',
    'Otra (la describo)': 'otro',
  };
  const waterSource = sourceMap[aguaLabel] || 'otro';

  // Litros estimados según nº personas + urgencia.
  const personasFactor = {
    '1–2 personas': 4,
    Familia: 12,
    Comunidad: 60,
    Escuela: 100,
    '': 5,
  }[personas];
  const urgenciaFactor = urgencia === 'Ahora mismo' ? 0.5 : 1;
  const dailyLiters = Math.max(1, Math.round(personasFactor * urgenciaFactor));

  return {
    errors,
    normalized: {
      materials: Array.from(canonicalMaterials),
      resources: Array.from(canonicalResources),
      customMaterials: customRecursos,
      customResources: [],
      waterSource,
      customSource: customAgua,
      dailyLiters,
      language: 'es',
      situacion: { agua: aguaLabel, customAgua, urgencia, personas },
    },
  };
}

async function generatePlanController(req, res, next) {
  try {
    const { errors, normalized } = normalize(req.body || {});
    if (errors.length) {
      return res.status(400).json({ error: 'Datos inválidos.', details: errors });
    }

    const recommendedMethod = selectMethod(normalized);
    const plan = await generatePlan(normalized, recommendedMethod);

    return res.json({ plan });
  } catch (err) {
    next(err);
  }
}

module.exports = { generatePlanController };
