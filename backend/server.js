const express = require('express');
const cors = require('cors');
const generateRoute = require('./routes/generate');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'potabiliza-facil', timestamp: Date.now() });
});

app.use('/api/generate', generateRoute);

app.use((err, _req, res, _next) => {
  console.error('[error]', err);
  res.status(err.status || 500).json({
    error: err.publicMessage || 'Error interno del servidor.',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Potabiliza Fácil API escuchando en http://localhost:${PORT}`);
});
