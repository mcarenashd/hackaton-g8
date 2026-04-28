import { useState } from 'react';
import {
  StatusBar,
  AppHeader,
  Progress,
  EmojiTile,
  CopilotMark,
} from '../components/PhoneShell';

const ESTADOS = [
  { id: 'clara', image: '/images/water-states/clara.png', label: 'Clara y limpia', ok: true },
  { id: 'turbia', image: '/images/water-states/turbia.png', label: 'Turbia', ok: false },
  { id: 'coloreada', image: '/images/water-states/coloreada.png', label: 'Con color', ok: false },
  { id: 'olorosa', image: '/images/water-states/olorosa.png', label: 'Con olor', ok: false },
];

export default function ScreenValidacion({ onNext, onBack }) {
  const [sel, setSel] = useState(null);
  const ok = sel !== null && ESTADOS[sel].ok;

  return (
    <>
      <StatusBar />
      <AppHeader
        eyebrow="Paso 4 · Validación"
        title='¿Cómo quedó <em>el agua</em>?'
        onBack={onBack}
      />
      <Progress current={4} total={4} />
      <div className="screen">
        <div className="section-label">
          <span className="lbl">📷 Verificación con foto</span>
          <span className="hint">opcional</span>
        </div>
        <div className="photo-drop">
          <div className="ph-icon" style={{ fontSize: 22 }}>📷</div>
          <div className="body-m" style={{ fontWeight: 500 }}>
            Fotografía el resultado
          </div>
          <div className="body-s">
            <CopilotMark size={10} /> &nbsp;Copilot Vision compara turbidez
          </div>
        </div>

        <div className="divider-or">o compara con estas referencias</div>

        <div className="tiles">
          {ESTADOS.map((e, i) => (
            <EmojiTile
              key={e.id}
              image={e.image}
              label={e.label}
              selected={sel === i}
              onClick={() => setSel(i)}
            />
          ))}
        </div>

        {ok && (
          <div className="result-ok">
            <div className="check-circle">✓</div>
            <div>
              <div className="r-title">Agua segura para beber 💧</div>
              <div className="r-sub">
                Consume en 24 h o refrigera. Repite el proceso para cada lote.
              </div>
            </div>
          </div>
        )}
        {sel !== null && !ok && (
          <div className="note warn">
            <span className="icon">⚠️</span>
            <span className="txt">
              Repite el proceso o añade cloro (2 gotas/L, esperar 30 min).
            </span>
          </div>
        )}

        <div className="spacer-16" />
        <button className="btn btn-primary" onClick={onNext} disabled={sel === null}>
          Ver kit mínimo →
        </button>
      </div>
    </>
  );
}
