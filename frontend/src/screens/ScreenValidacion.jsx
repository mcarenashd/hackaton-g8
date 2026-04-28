import { useRef, useState } from 'react';
import {
  StatusBar,
  AppHeader,
  Progress,
  EmojiTile,
  CopilotMark,
} from '../components/PhoneShell';
import { fileToDataUrl } from '../lib/camera';

const ESTADOS = [
  { id: 'clara', image: '/images/water-states/clara.png', label: 'Clara y limpia', ok: true },
  { id: 'turbia', image: '/images/water-states/turbia.png', label: 'Turbia', ok: false },
  { id: 'coloreada', image: '/images/water-states/coloreada.png', label: 'Con color', ok: false },
  { id: 'olorosa', image: '/images/water-states/olorosa.png', label: 'Con olor', ok: false },
];

export default function ScreenValidacion({ onNext, onBack }) {
  const [sel, setSel] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const fileRef = useRef(null);
  const ok = sel !== null && ESTADOS[sel].ok;

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAnalyzing(true);
    try {
      // Convertimos a base64 para que esté listo si conectamos Azure.
      // Por ahora, demo positiva: tras 1.5 s seleccionamos "Clara".
      await fileToDataUrl(file);
      await new Promise((r) => setTimeout(r, 1500));
      setSel(0);
    } finally {
      setAnalyzing(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  }

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
        <label className="photo-drop">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
          <div className="ph-icon" style={{ fontSize: 22 }}>📷</div>
          <div className="body-m" style={{ fontWeight: 500 }}>
            Fotografía el resultado
          </div>
          <div className="body-s">
            <CopilotMark size={10} /> &nbsp;Copilot Vision compara turbidez
          </div>
        </label>

        {analyzing && (
          <div className="ai-bar" style={{ marginTop: 10 }}>
            <div className="pulse" />
            <span>
              <CopilotMark size={10} /> &nbsp;Copilot Vision analizando turbidez…
            </span>
          </div>
        )}

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
        <button className="btn btn-primary" onClick={onNext}>
          Ver kit mínimo →
        </button>
        {sel === null && !analyzing && (
          <div className="hint-text">
            💡 Toma una foto o elige un estado para ver el diagnóstico
          </div>
        )}
      </div>
    </>
  );
}
