// Carga variables del .env (si existe) — no rompe si no hay
try { require('dotenv').config(); } catch {}

const express = require('express');
const cors = require('cors');
const planRoute = require('./routes/plan');
const illustrationRoute = require('./routes/illustration');
const visionRoute = require('./routes/vision');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
// /api/vision recibe imágenes en base64; subimos el límite.
app.use(express.json({ limit: '8mb' }));

app.get('/api/health', (_req, res) => {
  const hasAzureKey = Boolean(process.env.AZURE_OPENAI_KEY && process.env.AZURE_OPENAI_ENDPOINT);
  res.json({
    status: 'ok',
    service: 'aquaguia',
    azureConfigured: hasAzureKey,
    timestamp: Date.now(),
  });
});

app.use('/api/plan', planRoute);
app.use('/api/illustration', illustrationRoute);
app.use('/api/vision', visionRoute);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    error: err.publicMessage || 'Error interno del servidor.',
  });
});

app.listen(PORT, () => {
  console.log(`✅ AquaGuía API escuchando en http://localhost:${PORT}`);
  if (!process.env.AZURE_OPENAI_KEY) {
    console.log('ℹ️  AZURE_OPENAI_KEY no configurada — usando STUBS realistas.');
    console.log('    Cuando tengas tu key, copia .env.example a .env y reinicia.');
  }
});
