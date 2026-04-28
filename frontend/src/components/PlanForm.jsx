import { useState } from 'react';

const MATERIAL_OPTIONS = [
  { id: 'olla', label: 'Olla / recipiente metálico' },
  { id: 'botellas_plastico', label: 'Botellas PET transparentes' },
  { id: 'tela', label: 'Tela limpia / algodón' },
  { id: 'carbon', label: 'Carbón vegetal' },
  { id: 'arena', label: 'Arena fina' },
  { id: 'grava', label: 'Grava / piedras' },
  { id: 'cloro', label: 'Lejía sin perfume' },
  { id: 'plastico', label: 'Lámina de plástico' },
];

const RESOURCE_OPTIONS = [
  { id: 'sol', label: 'Sol directo varias horas' },
  { id: 'fuego', label: 'Fuego / estufa' },
  { id: 'electricidad', label: 'Electricidad' },
];

const WATER_SOURCES = [
  { value: 'rio', label: 'Río o arroyo' },
  { value: 'lago', label: 'Lago o laguna' },
  { value: 'pozo', label: 'Pozo' },
  { value: 'lluvia', label: 'Agua de lluvia' },
  { value: 'grifo_dudoso', label: 'Grifo no fiable' },
  { value: 'otro', label: 'Otro' },
];

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

export default function PlanForm({ onSubmit, loading, error }) {
  const [materials, setMaterials] = useState([]);
  const [waterSource, setWaterSource] = useState('rio');
  const [dailyLiters, setDailyLiters] = useState(5);
  const [resources, setResources] = useState([]);
  const [language, setLanguage] = useState('es');

  function toggle(list, setList, id) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      materials,
      waterSource,
      dailyLiters: Number(dailyLiters),
      resources,
      language,
    });
  }

  const isValid = materials.length > 0 && Number(dailyLiters) > 0;

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-3xl">
      <h2 className="text-2xl">Cuéntanos qué tienes disponible</h2>
      <p className="mt-2 text-slate-600">
        Marca los materiales y recursos a tu alcance. Adaptaremos el plan a tu situación.
      </p>

      {/* Materiales */}
      <fieldset className="mt-8">
        <legend className="label">Materiales disponibles</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {MATERIAL_OPTIONS.map((m) => {
            const checked = materials.includes(m.id);
            return (
              <label key={m.id} className={`checkbox ${checked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(materials, setMaterials, m.id)}
                />
                <span>{m.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Fuente de agua */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="waterSource" className="label">
            Fuente de agua
          </label>
          <select
            id="waterSource"
            className="input"
            value={waterSource}
            onChange={(e) => setWaterSource(e.target.value)}
          >
            {WATER_SOURCES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="dailyLiters" className="label">
            Litros de agua por día
          </label>
          <input
            id="dailyLiters"
            type="number"
            min="1"
            max="1000"
            step="1"
            className="input"
            value={dailyLiters}
            onChange={(e) => setDailyLiters(e.target.value)}
          />
        </div>
      </div>

      {/* Recursos */}
      <fieldset className="mt-8">
        <legend className="label">Acceso a</legend>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {RESOURCE_OPTIONS.map((r) => {
            const checked = resources.includes(r.id);
            return (
              <label key={r.id} className={`checkbox ${checked ? 'is-checked' : ''}`}>
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggle(resources, setResources, r.id)}
                />
                <span>{r.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {/* Idioma */}
      <div className="mt-8 max-w-xs">
        <label htmlFor="language" className="label">
          Idioma del plan
        </label>
        <select
          id="language"
          className="input"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          {LANGUAGES.map((l) => (
            <option key={l.value} value={l.value}>
              {l.label}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div
          role="alert"
          className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800"
        >
          {error}
        </div>
      )}

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        <button
          type="submit"
          disabled={!isValid || loading}
          className="btn-primary w-full sm:w-auto"
        >
          {loading ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Generando…
            </>
          ) : (
            <>
              Generar plan
              <span aria-hidden>✨</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
