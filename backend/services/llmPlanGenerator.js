/**
 * Genera un plan personalizado con GPT-4o usando structured output (JSON).
 *
 * Reglas de seguridad:
 *  - El METHOD ya viene elegido por la heurística (selectMethod). El LLM
 *    NO puede cambiarlo; solo personaliza el contenido dentro de ese método.
 *  - Si el LLM devuelve algo que falla validación, devolvemos `null` y el
 *    caller usa el plan basado en plantilla (más seguro y predecible).
 *  - max_tokens limitado y respuesta validada estrictamente antes de usarse.
 */

const azure = require('./azureOpenAI');

const METHOD_NAMES = {
  ebullicion: 'Hervido tradicional',
  sodis: 'SODIS — Desinfección solar',
  filtro_carbon: 'Filtro casero de carbón, arena y grava',
  cloracion: 'Cloración con lejía doméstica',
  destilacion_solar: 'Destilación solar de emergencia',
};

function buildSystemPrompt() {
  return `Eres AquaGuía, asistente experto en potabilización low-cost para comunidades vulnerables.

Tu trabajo: generar un plan personalizado en español muy claro, frases simples, sin tecnicismos.
NUNCA inventes pasos peligrosos o cifras de seguridad sin base. Si dudas, sé conservador.

Reglas de seguridad:
- NO afirmes "elimina 99.9%" sin matiz. Habla de "reduce significativamente" o "elimina la mayoría de bacterias".
- NO recomiendes mezclar productos químicos.
- Hervir = al menos 1 minuto a ebullición fuerte (3 min sobre 2000m de altitud).
- SODIS = mínimo 6 horas de sol fuerte (2 días si nublado).
- Cloración = 2 gotas de lejía sin perfume por litro (4 si turbio), reposar 30 min.
- Filtros caseros NO eliminan virus por sí solos: SIEMPRE combinar con desinfección.

Devolverás SIEMPRE un JSON válido con esta estructura EXACTA:

{
  "summary": "Una frase de 1-2 líneas adaptada al contexto (urgencia, nº personas, fuente).",
  "steps": [
    {"title": "Acción concreta corta", "text": "Detalle en 1-2 frases", "time": "5 min" o "" si no aplica}
  ],
  "warnings": ["Advertencia específica 1", "Advertencia 2"],
  "tips": ["Tip útil 1", "Tip 2"],
  "customAdvice": ["Para tu <recurso>: <consejo concreto>"]
}

- 4-7 pasos. Concretos, accionables.
- 2-4 warnings reales para esta combinación de método + fuente.
- 2-4 tips prácticos.
- customAdvice: una entrada por cada recurso custom que aporte el usuario, integrándolo en el plan.

NO incluyas texto fuera del JSON. NO uses bloques de código markdown. Solo el JSON puro.`;
}

function buildUserPrompt(methodId, input) {
  const sit = input.situacion || {};
  const recursoLabels = (input.materials || []).concat(input.resources || []).join(', ') || 'ninguno marcado';
  const customs = (input.customMaterials || []).join(', ') || 'ninguno';
  const fuente =
    input.waterSource === 'otro' && input.customSource
      ? `Otra fuente descrita por el usuario: "${input.customSource}"`
      : `Fuente: ${input.waterSource}`;

  return `Genera el plan para este caso real:

MÉTODO ELEGIDO (NO LO CAMBIES): ${methodId} — ${METHOD_NAMES[methodId] || methodId}
${fuente}
Litros/día estimados: ${input.dailyLiters}
Urgencia: ${sit.urgencia || 'no especificada'}
Personas: ${sit.personas || 'no especificadas'}
Recursos disponibles: ${recursoLabels}
Recursos extra (texto libre del usuario): ${customs}

Adapta los pasos a estos detalles. Por ejemplo:
- Si urgencia es "Ahora mismo", prioriza acción rápida y omite reposos largos opcionales.
- Si la fuente es "lluvia", el primer paso debe descartar los primeros minutos de agua.
- Si hay "filtro de cerámica" en custom, intégralo como mejora de los pasos de filtrado.
- Si son muchas personas, escala recipientes o procesa por lotes.

Devuelve el JSON ahora.`;
}

function parseJsonLoose(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return null;
  }
}

function validatePlan(parsed) {
  if (!parsed || typeof parsed !== 'object') return null;
  const out = {};

  if (typeof parsed.summary === 'string' && parsed.summary.trim().length > 5) {
    out.summary = parsed.summary.trim().slice(0, 400);
  } else {
    return null; // sin resumen no aceptamos el plan
  }

  if (!Array.isArray(parsed.steps) || parsed.steps.length < 3 || parsed.steps.length > 10) {
    return null;
  }
  out.steps = parsed.steps
    .map((s) => {
      if (typeof s === 'string') return { title: s.slice(0, 80), text: '', time: '' };
      if (typeof s !== 'object') return null;
      const title = String(s.title || '').slice(0, 100).trim();
      if (!title) return null;
      return {
        title,
        text: String(s.text || '').slice(0, 350).trim(),
        time: String(s.time || '').slice(0, 30).trim(),
      };
    })
    .filter(Boolean);

  if (out.steps.length < 3) return null;

  out.warnings = Array.isArray(parsed.warnings)
    ? parsed.warnings
        .filter((w) => typeof w === 'string')
        .map((w) => w.trim().slice(0, 250))
        .slice(0, 6)
    : [];

  out.tips = Array.isArray(parsed.tips)
    ? parsed.tips
        .filter((t) => typeof t === 'string')
        .map((t) => t.trim().slice(0, 250))
        .slice(0, 6)
    : [];

  out.customAdvice = Array.isArray(parsed.customAdvice)
    ? parsed.customAdvice
        .filter((c) => typeof c === 'string')
        .map((c) => c.trim().slice(0, 250))
        .slice(0, 8)
    : [];

  return out;
}

/**
 * Devuelve un plan personalizado o `null` si Azure no está configurado o
 * el resultado falla validación.
 */
async function tryGenerateLlmPlan(methodId, input) {
  if (!azure.isConfigured()) return null;
  try {
    const text = await azure.chat({
      system: buildSystemPrompt(),
      user: buildUserPrompt(methodId, input),
      maxTokens: 1200,
      jsonMode: true,
    });
    const parsed = parseJsonLoose(text);
    return validatePlan(parsed);
  } catch (err) {
    console.warn('[llmPlanGenerator] Azure call failed:', err.message);
    return null;
  }
}

module.exports = { tryGenerateLlmPlan };
