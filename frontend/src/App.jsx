import { useState } from 'react';
import Welcome from './components/Welcome.jsx';
import PlanForm from './components/PlanForm.jsx';
import PlanResult from './components/PlanResult.jsx';

const SCREENS = {
  WELCOME: 'welcome',
  FORM: 'form',
  RESULT: 'result',
};

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

const STEP_ORDER = [SCREENS.FORM, SCREENS.RESULT];
const STEP_LABELS = { [SCREENS.FORM]: 'Tus recursos', [SCREENS.RESULT]: 'Tu plan' };

function StepIndicator({ screen }) {
  const currentIdx = STEP_ORDER.indexOf(screen);
  return (
    <ol className="mx-auto mb-8 flex max-w-md items-center justify-between gap-2">
      {STEP_ORDER.map((s, i) => {
        const done = i < currentIdx;
        const active = i === currentIdx;
        return (
          <li key={s} className="flex flex-1 items-center gap-2">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition ${
                active
                  ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30'
                  : done
                  ? 'bg-leaf-500 text-white'
                  : 'bg-slate-200 text-slate-500'
              }`}
            >
              {done ? '✓' : i + 1}
            </span>
            <span
              className={`text-sm font-medium ${
                active ? 'text-brand-700' : 'text-slate-500'
              }`}
            >
              {STEP_LABELS[s]}
            </span>
            {i < STEP_ORDER.length - 1 && (
              <span
                className={`mx-2 h-0.5 flex-1 ${
                  done ? 'bg-leaf-400' : 'bg-slate-200'
                }`}
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}

export default function App() {
  const [screen, setScreen] = useState(SCREENS.WELCOME);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleGenerate(formData) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(
          (data.details && data.details.join(' • ')) || data.error || 'Error generando el plan.'
        );
      }
      setPlan(data.plan);
      setScreen(SCREENS.RESULT);
    } catch (err) {
      setError(err.message || 'No se pudo contactar con el servidor.');
    } finally {
      setLoading(false);
    }
  }

  function handleRestart() {
    setPlan(null);
    setError(null);
    setScreen(SCREENS.FORM);
  }

  return (
    <div className="min-h-full">
      <header className="border-b border-brand-100 bg-white/70 backdrop-blur">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <button
            onClick={() => setScreen(SCREENS.WELCOME)}
            className="flex items-center gap-3 text-left"
            aria-label="Inicio"
          >
            <span className="text-2xl" aria-hidden>
              💧
            </span>
            <span className="text-lg font-semibold text-brand-700">Potabiliza Fácil</span>
          </button>
          <span className="pill" aria-hidden>
            MVP
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10">
        {screen !== SCREENS.WELCOME && <StepIndicator screen={screen} />}

        {screen === SCREENS.WELCOME && <Welcome onStart={() => setScreen(SCREENS.FORM)} />}

        {screen === SCREENS.FORM && (
          <PlanForm onSubmit={handleGenerate} loading={loading} error={error} />
        )}

        {screen === SCREENS.RESULT && plan && (
          <PlanResult plan={plan} onRestart={handleRestart} />
        )}
      </main>

      <footer className="px-6 pb-10 pt-4 text-center text-sm text-slate-500">
        Generado con IA — verifica siempre con fuentes oficiales antes de beber agua dudosa.
      </footer>
    </div>
  );
}
