const azure = require('../services/azureOpenAI');

const VALID_IDS = ['sol', 'botella', 'fuego', 'carbon', 'cloro', 'tela', 'olla', 'electricidad'];

const SYSTEM_PROMPT = `Eres un asistente experto en identificar materiales para potabilización de agua.
Tu tarea: ver la foto y devolver, en formato JSON estricto, qué de esta lista aparece visible:
- "sol" (luz solar directa, día soleado, exterior con sol)
- "botella" (botellas PET transparentes, plástico transparente)
- "fuego" (llamas, fuego, fogón, estufa, brasero)
- "carbon" (carbón vegetal, arena clara, grava)
- "cloro" (lejía, hipoclorito, frasco con etiqueta de blanqueador)
- "tela" (tela limpia, algodón, paño, gasa, mosquitero)
- "olla" (olla, cazo, lata grande, marmita)
- "electricidad" (enchufes, panel solar, generador, batería)

Devuelve SOLO JSON con esta forma exacta, sin texto antes ni después:
{ "detected": ["id1", "id2"], "rationale": "breve explicación" }`;

function pickStubDetection() {
  // Stub realista: combinación frecuente que ayuda a la demo.
  const opciones = [
    { detected: ['sol', 'botella', 'tela'], rationale: 'Botellas PET transparentes y tela visible bajo el sol.' },
    { detected: ['olla', 'fuego', 'tela'], rationale: 'Olla metálica junto a una llama, con tela cercana.' },
    { detected: ['cloro', 'tela'], rationale: 'Frasco de lejía y un paño para pre-filtrar.' },
    { detected: ['sol', 'botella'], rationale: 'Exterior con sol y botellas plásticas.' },
  ];
  return opciones[Math.floor(Math.random() * opciones.length)];
}

function parseJsonLoose(text) {
  if (!text) return null;
  // Quita bloques de código markdown si los hubiera.
  const cleaned = text.replace(/```json|```/g, '').trim();
  try {
    return JSON.parse(cleaned);
  } catch {
    // Intenta extraer el primer objeto {...} si el modelo añadió ruido.
    const match = cleaned.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return null;
  }
}

async function visionController(req, res, next) {
  try {
    const image = req.body?.image;
    if (typeof image !== 'string' || !image.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Falta imagen válida (data URL).' });
    }

    if (!azure.isConfigured()) {
      // Stub mientras no haya key de Azure
      const stub = pickStubDetection();
      return res.json({
        detected: stub.detected,
        rawText: `[STUB] ${stub.rationale}`,
        powered: 'stub',
      });
    }

    // Llamada real a Azure GPT-4o vision
    const text = await azure.vision({
      system: SYSTEM_PROMPT,
      user: 'Analiza esta foto. Devuelve solo el JSON.',
      imageDataUrl: image,
      maxTokens: 300,
    });

    const parsed = parseJsonLoose(text);
    const detected = Array.isArray(parsed?.detected)
      ? parsed.detected.filter((id) => VALID_IDS.includes(id))
      : [];

    res.json({
      detected,
      rawText: parsed?.rationale || text || '',
      powered: 'azure',
    });
  } catch (err) {
    console.error('[vision] error:', err);
    // Si falla Azure, devolvemos vacío con explicación clara — NO inventamos.
    res.status(502).json({
      detected: [],
      error: 'No se pudo analizar la imagen. Marca los recursos manualmente.',
    });
  }
}

module.exports = { visionController };
