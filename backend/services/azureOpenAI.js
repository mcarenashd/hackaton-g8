/**
 * Cliente unificado para Microsoft Copilot / Azure OpenAI.
 *
 * Cubre tres operaciones:
 *   - chat()        → GPT-4o (texto). Para generar el plan.
 *   - vision()      → GPT-4o vision. Detecta materiales en una foto.
 *   - image()       → DALL-E 3. Genera la ilustración educativa.
 *
 * Si NO hay variables de entorno configuradas, todas devuelven `null` y
 * el caller usa su stub. Esto permite que la app funcione end-to-end
 * sin ninguna API key durante el desarrollo y la demo.
 *
 * Para activar las llamadas reales, copia `.env.example` a `.env` con:
 *
 *   AZURE_OPENAI_ENDPOINT=https://<tu-recurso>.openai.azure.com
 *   AZURE_OPENAI_KEY=<tu-key>
 *   AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
 *   AZURE_OPENAI_IMAGE_DEPLOYMENT=dall-e-3
 *   AZURE_OPENAI_API_VERSION=2024-08-01-preview
 */

const ENDPOINT = process.env.AZURE_OPENAI_ENDPOINT;
const KEY = process.env.AZURE_OPENAI_KEY;
const CHAT_DEPLOYMENT = process.env.AZURE_OPENAI_CHAT_DEPLOYMENT || 'gpt-4o';
const IMAGE_DEPLOYMENT = process.env.AZURE_OPENAI_IMAGE_DEPLOYMENT || 'dall-e-3';
const API_VERSION = process.env.AZURE_OPENAI_API_VERSION || '2024-08-01-preview';

function isConfigured() {
  return Boolean(ENDPOINT && KEY);
}

async function callAzure(path, body) {
  const url = `${ENDPOINT.replace(/\/$/, '')}${path}?api-version=${API_VERSION}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Azure ${res.status}: ${err.slice(0, 300)}`);
  }
  return res.json();
}

/**
 * Chat completions (GPT-4o). Devuelve el texto de la primera respuesta.
 */
async function chat({ system, user, maxTokens = 800, jsonMode = false }) {
  if (!isConfigured()) return null;
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({ role: 'user', content: user });
  const body = { messages, max_tokens: maxTokens, temperature: 0.7 };
  if (jsonMode) body.response_format = { type: 'json_object' };
  const data = await callAzure(`/openai/deployments/${CHAT_DEPLOYMENT}/chat/completions`, body);
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Vision (GPT-4o multimodal). Recibe data URL base64.
 */
async function vision({ system, user, imageDataUrl, maxTokens = 400 }) {
  if (!isConfigured()) return null;
  const messages = [];
  if (system) messages.push({ role: 'system', content: system });
  messages.push({
    role: 'user',
    content: [
      { type: 'text', text: user },
      { type: 'image_url', image_url: { url: imageDataUrl } },
    ],
  });
  const data = await callAzure(`/openai/deployments/${CHAT_DEPLOYMENT}/chat/completions`, {
    messages,
    max_tokens: maxTokens,
    temperature: 0.2,
  });
  return data.choices?.[0]?.message?.content ?? '';
}

/**
 * Image generation (DALL-E 3). Devuelve la URL de la imagen.
 */
async function image({ prompt, size = '1024x1024', style = 'vivid' }) {
  if (!isConfigured()) return null;
  const data = await callAzure(`/openai/deployments/${IMAGE_DEPLOYMENT}/images/generations`, {
    prompt,
    n: 1,
    size,
    style,
    quality: 'standard',
  });
  return data.data?.[0]?.url || null;
}

module.exports = { isConfigured, chat, vision, image };
