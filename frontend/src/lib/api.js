/**
 * Cliente del backend de AquaGuía.
 *
 * Todas las llamadas a Microsoft Copilot / Azure OpenAI pasan por nuestro
 * propio Express, NO directamente desde el navegador, por dos motivos:
 *
 *   1. La API key de Azure NO debe estar en el navegador.
 *   2. Azure OpenAI no permite CORS desde browser.
 *
 * El backend (ver `backend/services/azureOpenAI.js`) hace el proxy.
 * Mientras no haya key configurada, los endpoints devuelven respuestas
 * stub realistas para que la app funcione end-to-end en demo.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function postJson(path, body) {
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      (data.details && data.details.join(' • ')) ||
      data.error ||
      `Error ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

/**
 * Genera el plan personalizado a partir de la situación + recursos.
 * Devuelve `{ plan: { method, steps, materials, warnings, ... } }`.
 */
export async function generarPlan({ situacion, recursos, customRecursos = '', customSource = '' }) {
  return postJson('/api/plan', {
    situacion,
    recursos,
    customRecursos,
    customSource,
  });
}

/**
 * Detecta recursos en una imagen (cámara). Recibe data URL (base64).
 * Devuelve `{ detected: ['sol','botella',...], rawText: '...' }`.
 */
export async function detectarRecursos(imageDataUrl) {
  return postJson('/api/vision', { image: imageDataUrl });
}

/**
 * Genera la ilustración educativa con DALL-E / Copilot Designer.
 * Devuelve `{ url, caption }`. Si no hay key, `url` será un SVG stub.
 */
export async function generarIlustracion({ situacion, recursos, methodId }) {
  return postJson('/api/illustration', { situacion, recursos, methodId });
}
