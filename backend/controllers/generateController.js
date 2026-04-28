const { selectMethod } = require('../utils/methodSelector');
const { generatePlan } = require('../services/aiService');

const ALLOWED_SOURCES = ['rio', 'pozo', 'lluvia', 'lago', 'grifo_dudoso', 'otro'];
const ALLOWED_LANGUAGES = ['es', 'en', 'pt'];

function validatePayload(body) {
  const errors = [];
  if (!Array.isArray(body.materials) || body.materials.length === 0) {
    errors.push('Debes indicar al menos un material disponible.');
  }
  if (!body.waterSource || !ALLOWED_SOURCES.includes(body.waterSource)) {
    errors.push('Fuente de agua inválida.');
  }
  const liters = Number(body.dailyLiters);
  if (!Number.isFinite(liters) || liters <= 0 || liters > 1000) {
    errors.push('La cantidad de agua diaria debe ser un número entre 1 y 1000 litros.');
  }
  if (!Array.isArray(body.resources)) {
    errors.push('El campo "resources" debe ser una lista (sol/fuego/electricidad).');
  }
  const lang = body.language || 'es';
  if (!ALLOWED_LANGUAGES.includes(lang)) {
    errors.push('Idioma no soportado.');
  }
  return { errors, normalized: { ...body, dailyLiters: liters, language: lang } };
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
