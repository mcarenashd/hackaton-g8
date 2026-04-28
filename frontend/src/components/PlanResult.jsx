import { downloadPlanPDF } from '../utils/pdfGenerator.js';

function Section({ title, icon, children }) {
  return (
    <section className="mt-6">
      <h3 className="flex items-center gap-2 text-xl">
        <span aria-hidden>{icon}</span>
        {title}
      </h3>
      <div className="mt-3 text-slate-700">{children}</div>
    </section>
  );
}

export default function PlanResult({ plan, onRestart }) {
  const {
    method,
    materials,
    steps,
    warnings,
    alternatives,
    estimatedTimeMinutes,
    headline,
    context,
  } = plan;

  function handleDownload() {
    downloadPlanPDF(plan);
  }

  return (
    <article className="mx-auto max-w-3xl">
      <div className="card">
        <p className="text-sm uppercase tracking-wider text-brand-600">{headline}</p>
        <h2 className="mt-1 text-3xl">{method.title}</h2>
        <p className="mt-3 text-lg leading-relaxed text-slate-700">{method.summary}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="pill">⏱ ~{estimatedTimeMinutes} min</span>
          <span className="pill">💧 {context.dailyLiters} L/día</span>
          <span className="pill">📍 Fuente: {context.waterSource}</span>
        </div>

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

        {alternatives?.length > 0 && (
          <Section title="Alternativas si te falta algo" icon="🔄">
            <ul className="list-disc space-y-1 pl-5">
              {alternatives.map((a, i) => (
                <li key={i}>{a}</li>
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
