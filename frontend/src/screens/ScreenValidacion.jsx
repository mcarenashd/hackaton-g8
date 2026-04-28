import { useState } from 'react';
import { StatusBar, Header, ProgressBar } from '../components/PhoneShell';

const ESTADOS = [
  { id: 'clara', img: '/images/water-states/clara.png', label: 'Clara y limpia', ok: true },
  { id: 'turbia', img: '/images/water-states/turbia.png', label: 'Turbia', ok: false },
  { id: 'coloreada', img: '/images/water-states/coloreada.png', label: 'Con color', ok: false },
  { id: 'olorosa', img: '/images/water-states/olorosa.png', label: 'Con olor', ok: false },
];

export default function ScreenValidacion({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);
  const selOk = selected !== null && ESTADOS[selected].ok;

  return (
    <>
      <StatusBar />
      <Header title="¿Cómo quedó el agua?" step="Paso 4 de 4 · Validación" onBack={onBack} />
      <ProgressBar current={4} total={4} />
      <div className="screen-body">
        <div className="section-label">Compara con tu agua</div>
        <p style={{ fontSize: 12, color: '#555', marginBottom: 12, lineHeight: 1.5 }}>
          Toca la imagen que más se parezca a tu resultado.
        </p>

        <div className="water-grid">
          {ESTADOS.map((e, i) => (
            <div
              key={e.id}
              className={`water-card${selected === i ? ' selected' : ''}${e.ok ? ' ok' : ''}`}
              onClick={() => setSelected(i)}
            >
              <img src={e.img} alt={e.label} />
              <div className="water-card-label">{e.label}</div>
            </div>
          ))}
        </div>

        {selOk && (
          <div className="result-ok" style={{ display: 'flex' }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <span style={{ fontSize: 13, color: '#0f4f3a', fontWeight: 500 }}>
              ¡Perfecto! Tu agua está lista para consumir.
            </span>
          </div>
        )}
        {selected !== null && !selOk && (
          <div className="warning-badge">
            <span>⚠️</span>
            <span className="w-text">
              Repite el proceso o añade un paso de desinfección adicional.
            </span>
          </div>
        )}

        <button className="btn-primary" onClick={onNext} disabled={selected === null}>
          Ver kit mínimo →
        </button>
      </div>
    </>
  );
}
