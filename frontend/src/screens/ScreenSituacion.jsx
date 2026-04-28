import { StatusBar, AppHeader, Progress, EmojiTile } from '../components/PhoneShell';

const AGUA = [
  { id: 'rio', emoji: '🌊', label: 'Río o arroyo' },
  { id: 'lluvia', emoji: '🌧️', label: 'Agua de lluvia' },
  { id: 'pozo', emoji: '🪣', label: 'Pozo' },
  { id: 'grifo', emoji: '🚰', label: 'Grifo dudoso' },
  { id: 'lago', emoji: '🏞️', label: 'Lago / laguna' },
  { id: 'otra', emoji: '❓', label: 'Otra (la describo)' },
];
const URGENCIA = [
  { id: 'ahora', emoji: '🆘', label: 'Ahora mismo' },
  { id: 'tiempo', emoji: '⏳', label: 'Tengo tiempo' },
];
const PERSONAS = [
  { id: '1-2', emoji: '👤', label: '1–2 personas' },
  { id: 'fam', emoji: '👨‍👩‍👧', label: 'Familia' },
  { id: 'com', emoji: '🏘️', label: 'Comunidad' },
  { id: 'esc', emoji: '🏫', label: 'Escuela' },
];

export default function ScreenSituacion({ value, onChange, onNext, onBack }) {
  const isOtra = value.agua === 'Otra (la describo)';
  const customOk = !isOtra || (value.customAgua && value.customAgua.trim().length >= 3);
  const ready = value.agua && value.urgencia && value.personas && customOk;

  return (
    <>
      <StatusBar />
      <AppHeader
        eyebrow="Paso 1 · Tu situación"
        title='¿Qué <em>agua</em><br/>vas a tratar?'
        onBack={onBack}
      />
      <Progress current={1} total={4} />
      <div className="screen">
        <div className="section-label">
          <span className="lbl">💧 Fuente del agua</span>
          <span className="hint">elige una</span>
        </div>
        <div className="tiles">
          {AGUA.map((o) => (
            <EmojiTile
              key={o.id}
              emoji={o.emoji}
              label={o.label}
              selected={value.agua === o.label}
              onClick={() => onChange({ ...value, agua: o.label })}
            />
          ))}
        </div>

        {isOtra && (
          <input
            type="text"
            className="field"
            placeholder="Ej: aljibe, manantial, cisterna comunitaria…"
            value={value.customAgua || ''}
            onChange={(e) => onChange({ ...value, customAgua: e.target.value })}
            maxLength={120}
            style={{ marginTop: 8 }}
          />
        )}

        <div className="section-label">
          <span className="lbl">⏰ Urgencia</span>
        </div>
        <div className="tiles">
          {URGENCIA.map((o) => (
            <EmojiTile
              key={o.id}
              emoji={o.emoji}
              label={o.label}
              selected={value.urgencia === o.label}
              onClick={() => onChange({ ...value, urgencia: o.label })}
            />
          ))}
        </div>

        <div className="section-label">
          <span className="lbl">👥 ¿Para cuántas personas?</span>
        </div>
        <div className="tiles">
          {PERSONAS.map((o) => (
            <EmojiTile
              key={o.id}
              emoji={o.emoji}
              label={o.label}
              selected={value.personas === o.label}
              onClick={() => onChange({ ...value, personas: o.label })}
            />
          ))}
        </div>

        <div className="spacer-16" />
        <button className="btn btn-primary" onClick={onNext} disabled={!ready}>
          Continuar →
        </button>
        {!ready && (
          <div className="hint-text">
            {isOtra && !customOk
              ? '↑ Describe brevemente la fuente "Otra"'
              : 'Elige una opción de cada grupo'}
          </div>
        )}
      </div>
    </>
  );
}
