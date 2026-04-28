import { useState } from 'react';

const MATERIAL_OPTIONS = [
  { id: 'olla', label: 'Olla / recipiente metálico', icon: '🍲' },
  { id: 'botellas_plastico', label: 'Botellas PET transparentes', icon: '🧴' },
  { id: 'tela', label: 'Tela limpia / algodón', icon: '🧻' },
  { id: 'carbon', label: 'Carbón vegetal', icon: '🪵' },
  { id: 'arena', label: 'Arena fina', icon: '🏖️' },
  { id: 'grava', label: 'Grava / piedras', icon: '🪨' },
  { id: 'cloro', label: 'Lejía sin perfume', icon: '🧪' },
  { id: 'plastico', label: 'Lámina de plástico', icon: '🪟' },
];

const RESOURCE_OPTIONS = [
  { id: 'sol', label: 'Sol directo varias horas', icon: '☀️' },
  { id: 'fuego', label: 'Fuego / estufa', icon: '🔥' },
  { id: 'electricidad', label: 'Electricidad', icon: '⚡' },
];

const WATER_SOURCES = [
  { value: 'rio', label: 'Río o arroyo' },
  { value: 'lago', label: 'Lago o laguna' },
  { value: 'pozo', label: 'Pozo' },
  { value: 'lluvia', label: 'Agua de lluvia' },
  { value: 'grifo_dudoso', label: 'Grifo no fiable' },
  { value: 'otro', label: 'Otro (la describo abajo)' },
];

const LANGUAGES = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'English' },
  { value: 'pt', label: 'Português' },
];

export default function PlanForm({ onSubmit, loading, error }) {
  const [materials, setMaterials] = useState([]);
  const [customMaterials, setCustomMaterials] = useState('');
  const [waterSource, setWaterSource] = useState('rio');
  const [customSource, setCustomSource] = useState('');
  const [dailyLiters, setDailyLiters] = useState(5);
  const [resources, setResources] = useState([]);
  const [customResources, setCustomResources] = useState('');
  const [language, setLanguage] = useState('es');

  function toggle(list, setList, id) {
    setList(list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      materials,
      customMaterials,
      waterSource,
      customSource,
      dailyLiters: Number(dailyLiters),
      resources,
      customResources,
      language,
    });
  }

  const hasMaterials =
    materials.length > 0 || customMaterials.trim().length > 0;
  const sourceComplete = waterSource !== 'otro' || customSource.trim().length > 0;
  const isValid = hasMaterials && Number(dailyLiters) > 0 && sourceComplete;

  return (
    <form onSubmit={handleSubmit} className="card mx-auto max-w-3xl">
      <h2 className="text-2xl">Cuéntanos qué tienes disponible</h2>
      <p className="mt-2 text-slate-600">
        Marca todo lo que tengas a mano. Cuanto más concreto, mejor será el plan.
      </p>

      {/* Materiales */}
      <fieldset className="mt-8">
        <legend className="label">
          🧰 Materiales disponibles
          <span className="ml-2 text-xs font-normal text-slate-500">
            (marca uno o más)
          </span>
        </legend>
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
                <span className="text-xl" aria-hidden>
                  {m.icon}
                </span>
                <span>{m.label}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4">
          <label htmlFor="customMaterials" className="label">
            ¿Tienes otros materiales que no estén en la lista?
          </label>
          <textarea
            id="customMaterials"
            className="input min-h-[80px]"
            placeholder="Ej: filtro de cerámica, jarra Brita, mosquitero, café molido…"
            value={customMaterials}
            onChange={(e) => setCustomMaterials(e.target.value)}
            maxLength={300}
          />
          <p className="mt-1 text-xs text-slate-500">
            Sepáralos por comas o saltos de línea. Los tendremos en cuenta.
          </p>
        </div>
      </fieldset>

      {/* Fuente de agua */}
      <fieldset className="mt-8">
        <legend className="label">💧 Fuente de agua</legend>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="waterSource" className="label">
              Origen
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
              Litros por día
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
            <p className="mt-1 text-xs text-slate-500">
              Como referencia: una persona necesita 2-4 L/día para beber y cocinar.
            </p>
          </div>
        </div>

        {waterSource === 'otro' && (
          <div className="mt-4">
            <label htmlFor="customSource" className="label">
              Describe la fuente
            </label>
            <input
              id="customSource"
              type="text"
              className="input"
              placeholder="Ej: aljibe en azotea, cisterna comunitaria, manantial sin tratar…"
              value={customSource}
              onChange={(e) => setCustomSource(e.target.value)}
              maxLength={200}
              required
            />
          </div>
        )}
      </fieldset>

      {/* Recursos */}
      <fieldset className="mt-8">
        <legend className="label">🌤️ ¿A qué tienes acceso?</legend>
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
                <span className="text-xl" aria-hidden>
                  {r.icon}
                </span>
                <span>{r.label}</span>
              </label>
            );
          })}
        </div>
        <div className="mt-4">
          <label htmlFor="customResources" className="label">
            ¿Otros recursos relevantes?
          </label>
          <textarea
            id="customResources"
            className="input min-h-[60px]"
            placeholder="Ej: panel solar pequeño, generador, agua caliente disponible, nevera…"
            value={customResources}
            onChange={(e) => setCustomResources(e.target.value)}
            maxLength={300}
          />
        </div>
      </fieldset>

      {/* Idioma */}
      <div className="mt-8 max-w-xs">
        <label htmlFor="language" className="label">
          🌐 Idioma del plan
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

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          {!hasMaterials
            ? '↑ Marca al menos un material o escribe uno propio.'
            : !sourceComplete
            ? '↑ Describe brevemente la fuente "Otro".'
            : 'Todo listo: pulsa generar.'}
        </p>
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
