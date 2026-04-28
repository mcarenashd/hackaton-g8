const STATS = [
  { value: '2.000M', label: 'personas en el mundo no tienen agua potable segura' },
  { value: '5', label: 'métodos cubiertos: hervido, SODIS, filtro, cloración, destilación' },
  { value: '< 1 min', label: 'para generar tu plan personalizado' },
];

const STEPS = [
  { n: 1, title: 'Cuéntanos tus recursos', text: 'Materiales, fuente de agua y energía disponibles.' },
  { n: 2, title: 'La IA arma tu plan', text: 'Adaptado a tu contexto, con pasos claros y seguros.' },
  { n: 3, title: 'Descárgalo en PDF', text: 'Úsalo offline o compártelo con tu comunidad.' },
];

export default function Welcome({ onStart }) {
  return (
    <div className="space-y-10">
      <section className="card mx-auto max-w-3xl text-center">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1 text-sm font-medium text-brand-700">
          <span aria-hidden>💧</span> Agua segura, low-cost, para todos
        </div>
        <h1 className="mt-3 text-4xl sm:text-5xl">Potabiliza Fácil</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-slate-600">
          Genera un <strong>plan personalizado</strong> para potabilizar agua con solo los
          recursos que tienes a mano. Pensado para emergencias, zonas rurales y contextos
          de bajo presupuesto.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-brand-100 bg-white/70 p-4 text-left"
            >
              <div className="text-2xl font-semibold text-brand-700">{s.value}</div>
              <div className="mt-1 text-sm text-slate-600">{s.label}</div>
            </div>
          ))}
        </div>

        <button onClick={onStart} className="btn-primary mt-10 w-full sm:w-auto">
          Comenzar ahora
          <span aria-hidden>→</span>
        </button>
        <p className="mt-3 text-xs text-slate-500">Gratuito · sin registro · funciona offline tras descargar el PDF</p>
      </section>

      <section className="mx-auto max-w-3xl">
        <h2 className="text-center text-2xl">¿Cómo funciona?</h2>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="card flex flex-col gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-lg font-bold text-white">
                {s.n}
              </div>
              <h3 className="text-lg">{s.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl">
        <div className="card bg-leaf-50/60">
          <h2 className="flex items-center gap-2 text-xl">
            <span aria-hidden>🛡️</span> Métodos respaldados por organismos sanitarios
          </h2>
          <p className="mt-2 text-slate-700">
            Las técnicas que usamos (hervido, SODIS, filtros caseros multicapa, cloración
            con hipoclorito, destilación solar) están documentadas por la OMS, EAWAG y
            organizaciones de cooperación internacional. Este MVP las adapta a tu
            contexto, pero siempre validamos: <strong>en caso de duda, consulta con
            personal sanitario local.</strong>
          </p>
        </div>
      </section>
    </div>
  );
}
