# AquaGuía 💧 — MVP

Generador de planes de potabilización de agua **low-cost** con IA generativa de
**Microsoft Copilot** (Azure OpenAI). Hackathon: "Innovación para un Futuro con
Agua y Energía Sostenibles" · ODS 6 & 7.

---

## Lo que hace

1. **Splash** — bienvenida + propuesta de valor.
2. **Situación** — fuente del agua (con opción "Otra" en texto libre), urgencia, nº de personas.
3. **Recursos** —
   - **Cámara real** que sube la foto a `/api/vision` (Copilot Vision / GPT-4o vision detecta materiales).
   - Checkboxes manuales con 8 recursos comunes.
   - Textarea "Algo más que tengas" para texto libre — la IA los interpreta.
4. **Plan** —
   - Plan estructurado y seguro generado por la IA, basado en plantillas validadas.
   - Pictogramas SVG para baja alfabetización.
   - Botón **"Generar ilustración"** → Copilot Designer / DALL-E 3.
   - Botón **"Escuchar"** → TTS del navegador (Web Speech API, sin coste).
   - Sección "Cómo usar tus recursos extra" con consejo concreto por cada item custom.
5. **Validación** — autoevaluación tras el tratamiento (clara, turbia, con olor…).
6. **Kit** — lista de compra **adaptada al método elegido y a lo que ya tienes**, con costos en USD.

## Stack

- **Backend**: Node.js + Express, proxy hacia Azure OpenAI (sin exponer keys).
- **Frontend**: React 18 + Vite, CSS puro (sin Tailwind), tipografía Fraunces+DM Sans.
- **IA**: Azure OpenAI (`gpt-4o` para texto y vision; `dall-e-3` para imagen).
- **TTS**: Web Speech API del navegador (gratis, offline).

## Estructura

```
hackaton-g8/
├── backend/
│   ├── server.js                          # Bootstrap + 3 rutas
│   ├── routes/
│   │   ├── plan.js                        # POST /api/plan
│   │   ├── vision.js                      # POST /api/vision
│   │   └── illustration.js                # POST /api/illustration
│   ├── controllers/
│   │   ├── planController.js
│   │   ├── visionController.js
│   │   └── illustrationController.js
│   ├── services/
│   │   ├── aiService.js                   # Plantillas seguras + opcional personalización LLM
│   │   └── azureOpenAI.js                 # Cliente unificado Azure (chat/vision/image)
│   ├── utils/
│   │   ├── methodSelector.js              # Heurística: ebullición > SODIS > cloración > filtro > destilación
│   │   └── customResources.js             # Keyword matcher para textos libres
│   └── .env.example
└── frontend/
    ├── index.html
    ├── package.json                       # React + Vite (sin Tailwind)
    └── src/
        ├── main.jsx
        ├── App.jsx                        # Router de pantallas + estado global
        ├── App.css
        ├── components/PhoneShell.jsx
        ├── lib/
        │   ├── api.js                     # Cliente del backend
        │   ├── camera.js                  # File → base64 redimensionado
        │   ├── tts.js                     # Web Speech API
        │   └── pictos.js                  # SVG pictogramas + getPicto()
        └── screens/
            ├── ScreenSplash.jsx
            ├── ScreenSituacion.jsx
            ├── ScreenRecursos.jsx         # Cámara real + custom textarea
            ├── ScreenPlan.jsx             # IA + ilustración + TTS
            ├── ScreenValidacion.jsx
            └── ScreenKit.jsx              # Kit adaptativo
```

## Setup en local

Necesitas **Node 18+**.

### 1. Backend

```bash
cd backend
npm install
npm run dev          # http://localhost:4000
```

Mensaje esperado al arrancar:

```
✅ AquaGuía API escuchando en http://localhost:4000
ℹ️  AZURE_OPENAI_KEY no configurada — usando STUBS realistas.
```

### 2. Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Abre `http://localhost:5173` y haz el flujo completo. Funciona end-to-end con
**stubs** (no necesitas API keys para la demo inicial).

## Conectar Microsoft Copilot / Azure OpenAI

Cuando tengas tu recurso de Azure OpenAI listo:

1. **Crea el recurso** en `portal.azure.com` → "Azure OpenAI" → "Crear".
2. **Despliega los modelos** en `Azure AI Studio` (https://oai.azure.com):
   - Modelo `gpt-4o` (texto + vision) → deployment name `gpt-4o`.
   - Modelo `dall-e-3` (imagen) → deployment name `dall-e-3`.
3. **Copia las claves** en Azure Portal → tu recurso → "Keys and Endpoint".
4. **Configura `.env`** en `backend/`:

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edita `.env` y rellena:

   ```
   AZURE_OPENAI_ENDPOINT=https://aquaguia.openai.azure.com
   AZURE_OPENAI_KEY=tu-key-aquí
   AZURE_OPENAI_CHAT_DEPLOYMENT=gpt-4o
   AZURE_OPENAI_IMAGE_DEPLOYMENT=dall-e-3
   AZURE_OPENAI_API_VERSION=2024-08-01-preview
   ```

5. **Reinicia el backend** (`npm run dev`).
6. **Verifica** con `curl http://localhost:4000/api/health` — debe decir `"azureConfigured": true`.

A partir de aquí: `/api/vision` analiza fotos reales, `/api/illustration` genera
imágenes con DALL-E, `/api/plan` adapta el resumen del método al contexto del
usuario.

## Decisiones de seguridad

- **Las APIs de Azure NUNCA se llaman desde el navegador.** El frontend solo habla con
  nuestro Express, que añade la API key del lado servidor.
- **Los pasos del plan vienen de plantillas validadas, no del LLM.** El LLM solo
  personaliza el resumen — nunca puede recomendar algo inseguro.
- **No hay fallback silencioso.** Si Azure falla, el endpoint devuelve un error
  claro en vez de "inventar" un plan SODIS por defecto.
- **`.env` está en `.gitignore`** — la key no llega al repo.

## Endpoints del backend

| Método | Path | Body | Devuelve |
|---|---|---|---|
| GET  | `/api/health` | — | `{ status, azureConfigured }` |
| POST | `/api/plan` | `{ situacion, recursos, customRecursos, customSource }` | `{ plan: { method, steps, materials, warnings, … } }` |
| POST | `/api/vision` | `{ image: "data:image/jpeg;base64,…" }` | `{ detected: [ids], rawText, powered }` |
| POST | `/api/illustration` | `{ methodId, situacion, recursos }` | `{ url, caption, powered }` |

## Próximas ideas (no implementadas)

- **PWA offline** con Service Worker — cumplir la promesa de "funciona sin internet".
- **Voice input** (Web Speech Recognition) para describir la situación hablando.
- **Traducción a lenguas indígenas** vía LLM.
- **Validación con Vision real** del agua tras el tratamiento.
- **Realtime voice agent** (OpenAI Realtime / Azure Speech) para todo el flujo.
- **Datos reales de comunidad** para el panel "tu zona".
