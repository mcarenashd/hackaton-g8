import { downloadPlanPDF } from '../utils/pdfGenerator.js';

const SOURCE_LABELS = {
  rio: 'Río o arroyo',
  lago: 'Lago o laguna',
  pozo: 'Pozo',
  lluvia: 'Agua de lluvia',
  grifo_dudoso: 'Grifo no fiable',
  otro: 'Otra fuente',
};

const DIFFICULTY_STYLES = {
  fácil: 'bg-leaf-100 text-leaf-800',
  media: 'bg-amber-100 text-amber-800',
  avanzada: 'bg-rose-100 text-rose-800',
};

function Section({ title, icon, children }) {
  return (
    <section className="mt-8">
      <h3 className="flex items-center gap-2 text-xl">
        <span aria-hidden>{icon}</span>
        {title}
      </h3>
      <div className="mt-3 text-slate-700">{children}</div>
    </section>
  );
}

function formatTime(min) {
  if (min < 60) return `${min} min`;
  const h = Math.round((min / 60) * 10) / 10;
  return `${h} h`;
}

export default function PlanResult({ plan, onRestart }) {
  const {
    method,
    materials,
    steps,
    warnings,
    alternatives,
    tips = [],
    customConsiderations = [],
    estimatedTimeMinutes,
    headline,
    context,
    personalizedNote,
  } = plan;

  function handleDownload() {
    downloadPlanPDF(plan);
  }

  const sourceLabel =
    context.waterSource === 'otro' && context.customSource
      ? `Otra: ${context.customSource}`
      : SOURCE_LABELS[context.waterSource] || context.waterSource;

  const difficultyClass =
    DIFFICULTY_STYLES[method.difficulty] || 'bg-slate-100 text-slate-800';

  return (
    <article className="mx-auto max-w-3xl">
      <div className="card">
        <p className="text-sm uppercase tracking-wider text-brand-600">{headline}</p>
        <h2 className="mt-1 text-3xl">{method.title}</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-700">{method.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="pill">⏱ ~{formatTime(estimatedTimeMinutes)}</span>
          <span className="pill">💧 {context.dailyLiters} L/día</span>
          <span className="pill">📍 {sourceLabel}</span>
          {method.difficulty && (
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${difficultyClass}`}
            >
              🎯 Dificultad: {method.difficulty}
            </span>
          )}
        </div>

        {personalizedNote && (
          <div className="mt-6 rounded-xl border border-brand-200 bg-brand-50/70 px-4 py-3 text-sm text-brand-900">
            <span className="font-semibold">Personalizado para ti — </span>
            {personalizedNote}
          </div>
        )}

        <Section title="Materiales necesarios" icon="🧰">
          <ul className="grid list-disc gap-1 pl-5 sm:grid-cols-2">
            {materials.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        </Section>

        <Section title="Pasos a seguir" icon="📋">
          <ol className="space-y-3">
            {steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{s}</span>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="Advertencias de seguridad" icon="⚠️">
          <ul className="space-y-2">
            {warnings.map((w, i) => (
              <li
                key={i}
                className="rounded-lg border-l-4 border-amber-400 bg-amber-50 px-4 py-2 text-amber-900"
              >
                {w}
              </li>
            ))}
          </ul>
        </Section>

        {customConsiderations.length > 0 && (
          <Section title="Cómo usar tus recursos extra" icon="🎒">
            <p className="mb-3 text-sm text-slate-500">
              Consejos concretos para aprovechar lo que añadiste tú:
            </p>
            <ul className="space-y-2">
              {customConsiderations.map((c, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-brand-200 bg-brand-50/60 px-4 py-3 text-brand-900"
                >
                  {c}
                </li>
              ))}
            </ul>
          </Section>
        )}

        {alternatives?.length > 0 && (
          <Section title="Alternativas si te falta algo" icon="🔄">
            <ul className="list-disc space-y-1 pl-5">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>
          </Section>
        )}

        {tips.length > 0 && (
          <Section title="Tips útiles" icon="💡">
            <ul className="grid gap-2 sm:grid-cols-2">
              {tips.map((t, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-leaf-200 bg-leaf-50 px-4 py-3 text-sm text-leaf-900"
                >
                  {t}
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between">
        <button onClick={onRestart} className="btn-secondary w-full sm:w-auto">
          <span aria-hidden>↺</span>
          Generar otro plan
        </button>
        <button onClick={handleDownload} className="btn-primary w-full sm:w-auto">
          <span aria-hidden>⬇</span>
          Descargar PDF
        </button>
      </div>
    </article>
  );
}
