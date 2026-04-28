export default function Welcome({ onStart }) {
  return (
    <section className="card mx-auto max-w-2xl text-center">
      <div className="mb-4 text-5xl" aria-hidden>
        💧🌿
      </div>
      <h1 className="text-3xl sm:text-4xl">Potabiliza Fácil</h1>
      <p className="mt-4 text-lg leading-relaxed text-slate-600">
        Genera un <strong>plan personalizado</strong> para potabilizar agua usando solo los
        recursos que tienes a mano. Pensado para situaciones de emergencia, zonas rurales y
        contextos low-cost.
      </p>

      <ul className="mx-auto mt-6 grid max-w-md gap-3 text-left text-slate-700">
        <li className="flex items-start gap-2">
          <span aria-hidden>✅</span>
          <span>Métodos seguros y validados (hervido, SODIS, filtros, cloración…).</span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden>📋</span>
          <span>Pasos claros, materiales y advertencias de seguridad.</span>
        </li>
        <li className="flex items-start gap-2">
          <span aria-hidden>📄</span>
          <span>Descarga el plan en PDF para usarlo sin conexión.</span>
        </li>
      </ul>

      <button onClick={onStart} className="btn-primary mt-8 w-full sm:w-auto">
        Comenzar
        <span aria-hidden>→</span>
      </button>
    </section>
  );
}
