import { StatusBar, Header, ProgressBar } from '../components/PhoneShell';

const AGUA_OPTIONS = [
  { icon: '🌊', label: 'Río o arroyo' },
  { icon: '🌧️', label: 'Agua de lluvia' },
  { icon: '🪣', label: 'Pozo' },
  { icon: '🚰', label: 'Grifo dudoso' },
  { icon: '🏞️', label: 'Lago / laguna' },
  { icon: '❓', label: 'Otra (la describo)' },
];
const URGENCIA_OPTIONS = [
  { icon: '🆘', label: 'Ahora mismo' },
  { icon: '⏳', label: 'Tengo tiempo' },
];
const PERSONAS_OPTIONS = [
  { icon: '👤', label: '1–2 personas' },
  { icon: '👨‍👩‍👧', label: 'Familia' },
  { icon: '🏘️', label: 'Comunidad' },
  { icon: '🏫', label: 'Escuela' },
];

function ChoiceGroup({ options, value, onChange }) {
  return (
    <div className="choice-row">
      {options.map((opt) => (
        <div
          key={opt.label}
          className={`choice-btn${value === opt.label ? ' selected' : ''}`}
          onClick={() => onChange(opt.label)}
        >
          <span className="icon">{opt.icon}</span>
          {opt.label}
        </div>
      ))}
    </div>
  );
}

export default function ScreenSituacion({ value, onChange, onNext, onBack }) {
  const isOtra = value.agua === 'Otra (la describo)';
  const customOk = !isOtra || (value.customAgua && value.customAgua.trim().length >= 3);
  const isValid = value.agua && value.urgencia && value.personas && customOk;

  return (
    <>
      <StatusBar />
      <Header showLogo title="" step="Paso 1 de 4 · Tu situación" onBack={onBack} />
      <ProgressBar current={1} total={4} />
      <div className="screen-body">
        <div className="section-label">Tipo de agua</div>
        <ChoiceGroup
          options={AGUA_OPTIONS}
          value={value.agua}
          onChange={(v) => onChange({ ...value, agua: v })}
        />

        {isOtra && (
          <input
            type="text"
            className="text-input"
            placeholder="Ej: aljibe, manantial, cisterna comunitaria…"
            value={value.customAgua || ''}
            onChange={(e) => onChange({ ...value, customAgua: e.target.value })}
            maxLength={120}
          />
        )}

        <div className="section-label" style={{ marginTop: 4 }}>
          Urgencia
        </div>
        <ChoiceGroup
          options={URGENCIA_OPTIONS}
          value={value.urgencia}
          onChange={(v) => onChange({ ...value, urgencia: v })}
        />
        <div className="section-label" style={{ marginTop: 4 }}>
          ¿Cuántas personas?
        </div>
        <ChoiceGroup
          options={PERSONAS_OPTIONS}
          value={value.personas}
          onChange={(v) => onChange({ ...value, personas: v })}
        />

        <button className="btn-primary" onClick={onNext} disabled={!isValid}>
          Continuar →
        </button>
        {!isValid && (
          <div className="hint-text">
            {isOtra && !customOk
              ? '↑ Describe brevemente la fuente "Otra".'
              : 'Marca una opción de cada grupo para continuar.'}
          </div>
        )}
      </div>
    </>
  );
}
