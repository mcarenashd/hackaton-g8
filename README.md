# Potabiliza Fácil — MVP

Aplicación web que genera **planes personalizados de potabilización de agua low‑cost**
usando IA generativa (simulada en este MVP). El usuario describe sus recursos
disponibles y recibe un plan paso a paso con materiales, advertencias y
alternativas, descargable en PDF.

---

## 🧱 Stack

- **Frontend:** React 18 + Vite + TailwindCSS + jsPDF
- **Backend:** Node.js + Express + CORS
- **IA:** Endpoint `/api/generate` con simulación de respuesta LLM

## 📁 Estructura

```
hackaton-g8/
├── backend/
│   ├── controllers/
│   │   └── generateController.js   # Validación + orquestación
│   ├── routes/
│   │   └── generate.js             # Routing del endpoint
│   ├── services/
│   │   └── aiService.js            # Simula la llamada al LLM
│   ├── utils/
│   │   └── methodSelector.js       # Heurística: elige método según recursos
│   ├── server.js                   # Bootstrap Express
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Welcome.jsx         # Pantalla 1
    │   │   ├── PlanForm.jsx        # Pantalla 2
    │   │   └── PlanResult.jsx      # Pantalla 3
    │   ├── utils/
    │   │   └── pdfGenerator.js     # Exporta el plan a PDF
    │   ├── App.jsx                 # Router de pantallas
    │   ├── main.jsx
    │   └── index.css               # Tailwind
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── vite.config.js
    └── package.json
```

## 🚀 Cómo ejecutar

Necesitas **Node 18+**.

### 1) Backend

```bash
cd backend
npm install
npm run dev          # arranca en http://localhost:4000
```

### 2) Frontend

En otra terminal:

```bash
cd frontend
npm install
npm run dev          # arranca en http://localhost:5173
```

Abre `http://localhost:5173` y sigue el flujo:

1. Pantalla de bienvenida → **Comenzar**
2. Rellena el formulario → **Generar plan**
3. Revisa el plan → **Descargar PDF** o **Generar otro plan**

> El frontend hace `fetch` a `http://localhost:4000/api/generate`. Si cambias el
> puerto del backend, ajusta `VITE_API_URL` en `frontend/.env`.

## 🧠 IA generativa

El servicio `backend/services/aiService.js` **simula** una llamada a un LLM y
devuelve un plan estructurado. Para conectar un modelo real (OpenAI, Claude,
etc.) basta con sustituir el contenido de `generatePlan()` por la llamada HTTP
correspondiente — la firma de entrada/salida no cambia.

## 🧪 Ejemplo de payload

```json
POST /api/generate
{
  "materials": ["botellas_plastico", "tela", "olla"],
  "waterSource": "rio",
  "dailyLiters": 5,
  "resources": ["sol", "fuego"],
  "language": "es"
}
```
