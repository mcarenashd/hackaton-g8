const azure = require('../services/azureOpenAI');

const STYLE_GUIDE =
  'Estilo: ilustración pictográfica simple, plana, colores suaves, fondo claro, ' +
  'sin texto, alta legibilidad, líneas claras, accesible para personas con baja alfabetización, ' +
  'paleta verde-tierra, sin marcas de agua, formato cuadrado.';

const METHOD_PROMPTS = {
  ebullicion:
    'Una persona vertiendo agua en una olla sobre fuego, con burbujas de ebullición visibles, ' +
    'al lado un recipiente limpio con tapa para almacenar el agua hervida.',
  sodis:
    'Tres botellas PET transparentes acostadas horizontalmente al sol sobre una superficie metálica brillante, ' +
    'con un sol radiante encima y un reloj indicando 6 horas.',
  filtro_carbon:
    'Sección transversal de una botella PET cortada usada como filtro casero: capas de grava arriba, ' +
    'arena en el medio, carbón vegetal abajo, tela en el cuello, agua filtrada cayendo en un recipiente.',
  cloracion:
    'Un cuentagotas añadiendo lejía a un balde de agua transparente, con un reloj indicando 30 minutos ' +
    'y un símbolo de gota desinfectada.',
  destilacion_solar:
    'Un agujero en la tierra con agua sucia abajo, un vaso limpio en el centro, plástico transparente cubriendo ' +
    'el agujero, una piedra en el centro del plástico y gotas condensándose hacia el vaso.',
};

function buildStubSvg(methodId) {
  const svg = `<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#e8f5ef"/>
        <stop offset="100%" stop-color="#d4f0ff"/>
      </linearGradient>
    </defs>
    <rect width="400" height="400" rx="20" fill="url(#bg)"/>
    <text x="200" y="40" text-anchor="middle" font-size="14" fill="#0f4f3a" font-family="Arial">Proceso de potabilización</text>
    <circle cx="80" cy="200" r="50" fill="#d4f0ff" stroke="#2a7fb0" stroke-width="2"/>
    <text x="80" y="215" text-anchor="middle" font-size="40">🪣</text>
    <text x="80" y="270" text-anchor="middle" font-size="11" fill="#2a7fb0">agua cruda</text>
    <line x1="135" y1="200" x2="170" y2="200" stroke="#0f4f3a" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="170,194 180,200 170,206" fill="#0f4f3a"/>
    <rect x="190" y="150" width="80" height="100" rx="14" fill="#fff8e6" stroke="#c8a000" stroke-width="2"/>
    <text x="230" y="215" text-anchor="middle" font-size="40">⚙️</text>
    <text x="230" y="270" text-anchor="middle" font-size="11" fill="#c8a000">tratamiento</text>
    <line x1="275" y1="200" x2="310" y2="200" stroke="#0f4f3a" stroke-width="2" stroke-dasharray="5,3"/>
    <polygon points="310,194 320,200 310,206" fill="#0f4f3a"/>
    <circle cx="350" cy="200" r="35" fill="#c8f0d8" stroke="#0f4f3a" stroke-width="2"/>
    <text x="350" y="215" text-anchor="middle" font-size="32">✅</text>
    <text x="200" y="370" text-anchor="middle" font-size="10" fill="#4a8a6a" font-style="italic">${methodId} · AquaGuía</text>
  </svg>`;
  const b64 = Buffer.from(svg, 'utf8').toString('base64');
  return `data:image/svg+xml;base64,${b64}`;
}

async function illustrationController(req, res, next) {
  try {
    const { methodId = 'sodis', situacion = {}, recursos = [] } = req.body || {};

    if (!azure.isConfigured()) {
      // Stub: SVG embebido como data URL — no requiere CDN, funciona offline.
      return res.json({
        url: buildStubSvg(methodId),
        caption:
          '[Demo] Esta es una ilustración de muestra. Cuando configures Azure OpenAI, ' +
          'aquí aparecerá una imagen única generada por DALL-E 3 para tu plan.',
        powered: 'stub',
      });
    }

    const methodScene = METHOD_PROMPTS[methodId] || METHOD_PROMPTS.sodis;
    const audience = situacion.personas
      ? `Pensada para ${situacion.personas.toLowerCase()}.`
      : '';

    const prompt = `${methodScene} ${audience} ${STYLE_GUIDE}`;

    const url = await azure.image({ prompt, size: '1024x1024' });
    if (!url) throw new Error('Azure no devolvió URL.');

    res.json({
      url,
      caption: `Ilustración generada por Copilot Designer para tu método: ${methodId}.`,
      powered: 'azure',
    });
  } catch (err) {
    console.error('[illustration] error:', err);
    res.status(502).json({
      error: 'No se pudo generar la ilustración. Inténtalo de nuevo.',
    });
  }
}

module.exports = { illustrationController };
