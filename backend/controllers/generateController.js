const { selectMethod } = require('../utils/methodSelector');
const { generatePlan } = require('../services/aiService');

const ALLOWED_SOURCES = ['rio', 'pozo', 'lluvia', 'lago', 'grifo_dudoso', 'otro'];
const ALLOWED_LANGUAGES = ['es', 'en', 'pt'];

const MAX_FREE_TEXT = 300;

function sanitizeFreeText(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FREE_TEXT);
}

function splitCustomList(value) {
  // Permite separar por coma, salto de línea o punto y coma.
  return sanitizeFreeText(value)
    .split(/[\n,;]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 15);
}

function validatePayload(body) {
  const errors = [];

  const materials = Array.isArray(body.materials) ? body.materials : [];
  const customMaterials = splitCustomList(body.customMaterials);
  if (materials.length === 0 && customMaterials.length === 0) {
    errors.push('Indica al menos un material (de la lista o en "Otros").');
  }

  if (!body.waterSource || !ALLOWED_SOURCES.includes(body.waterSource)) {
    errors.push('Fuente de agua inválida.');
  }
  const customSource = sanitizeFreeText(body.customSource);
  if (body.waterSource === 'otro' && customSource.length === 0) {
    errors.push('Si eliges "Otro" como fuente, descríbela brevemente.');
  }

  const liters = Number(body.dailyLiters);
  if (!Number.isFinite(liters) || liters <= 0 || liters > 1000) {
    errors.push('La cantidad de agua diaria debe ser un número entre 1 y 1000 litros.');
  }

  const resources = Array.isArray(body.resources) ? body.resources : [];
  const customResources = splitCustomList(body.customResources);

  const lang = body.language || 'es';
  if (!ALLOWED_LANGUAGES.includes(lang)) {
    errors.push('Idioma no soportado.');
  }

  return {
    errors,
    normalized: {
      materials,
      customMaterials,
      waterSource: body.waterSource,
      customSource,
      dailyLiters: liters,
      resources,
      customResources,
      language: lang,
    },
  };
}

async function generatePlanController(req, res, next) {
  try {
    const { errors, normalized } = validatePayload(req.body || {});
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
