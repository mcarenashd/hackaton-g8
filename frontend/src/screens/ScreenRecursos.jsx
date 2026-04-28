import { useRef, useState } from 'react';
import {
  StatusBar,
  AppHeader,
  Progress,
  CopilotMark,
  Spinner,
} from '../components/PhoneShell';
import { generarPlan, detectarRecursos } from '../lib/api';
import { fileToDataUrl } from '../lib/camera';

export const RECURSOS_LIST = [
  { id: 'sol', emoji: '☀️', label: 'Luz solar' },
  { id: 'botella', emoji: '🍶', label: 'Botellas PET' },
  { id: 'fuego', emoji: '🔥', label: 'Fuego / calor' },
  { id: 'carbon', emoji: '🪨', label: 'Carbón / arena' },
  { id: 'cloro', emoji: '🧴', label: 'Lejía / cloro' },
  { id: 'tela', emoji: '🧦', label: 'Tela / trapo' },
  { id: 'olla', emoji: '🫙', label: 'Ollas / baldes' },
  { id: 'electricidad', emoji: '⚡', label: 'Electricidad' },
];

export default function ScreenRecursos({
  value,
  onChange,
  custom,
  onCustom,
  situacion,
  onNext,
  onBack,
}) {
  const [detecting, setDetecting] = useState(false);
  const [detectionInfo, setDetectionInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function toggle(id) {
    const next = value.includes(id) ? value.filter((r) => r !== id) : [...value, id];
    onChange(next);
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDetecting(true);
    setDetectionInfo('Analizando con Copilot Vision…');
    setError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      const { detected = [] } = await detectarRecursos(dataUrl);
      const merged = Array.from(new Set([...value, ...detected]));
      onChange(merged);
      setDetectionInfo(
        detected.length
          ? `Detectado: ${detected
              .map((id) => RECURSOS_LIST.find((r) => r.id === id)?.label || id)
              .join(', ')}`
          : 'No se detectaron recursos. Marca manualmente.'
      );
    } catch (err) {
      setError(err.message || 'No se pudo analizar la imagen.');
      setDetectionInfo('');
    } finally {
      setDetecting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }

  async function handleGenerar() {
    setLoading(true);
    setError('');
    try {
      const labels = RECURSOS_LIST.filter((r) => value.includes(r.id)).map((r) => ({
        id: r.id,
        label: r.label,
      }));
      const data = await generarPlan({
        situacion,
        recursos: labels,
        customRecursos: custom,
        customSource: situacion?.customAgua || '',
      });
      onNext(data.plan);
    } catch (e) {
      setError(e.message || 'No se pudo conectar con la IA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const ready = value.length > 0 || (custom && custom.trim().length > 0);

  return (
    <>
      <StatusBar />
      <AppHeader
        eyebrow="Paso 2 · Recursos disponibles"
        title='¿Qué <em>tienes</em><br/>a tu alcance?'
        onBack={onBack}
      />
      <Progress current={2} total={4} />
      <div className="screen">
        <label className="camera-card">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
          />
          <div className="cam-row">
            <div className="cam-l">
              <div className="cam-icon" style={{ fontSize: 22 }}>📸</div>
              <div>
                <div className="cam-title">Fotografía tus recursos</div>
                <div className="cam-sub">
                  <CopilotMark size={10} /> &nbsp;Copilot Vision los detecta
                </div>
              </div>
            </div>
            <div className="cam-cta">SCAN →</div>
          </div>
        </label>

        {detecting && (
          <div className="ai-bar">
            <div className="pulse" />
            <span>
              <CopilotMark size={10} /> &nbsp;{detectionInfo}
            </span>
          </div>
        )}
        {!detecting && detectionInfo && (
          <div className="ai-bar">
            <span style={{ color: 'var(--mid)' }}>✨ {detectionInfo}</span>
          </div>
        )}

        <div className="divider-or">o selecciona manualmente</div>

        <div className="resource-grid">
          {RECURSOS_LIST.map((r) => (
            <div
              key={r.id}
              className={'resource-item' + (value.includes(r.id) ? ' checked' : '')}
              onClick={() => toggle(r.id)}
            >
              <span className="r-icon">{r.emoji}</span>
              <span className="r-label">{r.label}</span>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 18 }}>
          <span className="lbl">✏️ ¿Algo más que tengas?</span>
          <span className="hint">opcional</span>
        </div>
        <textarea
          className="field"
          placeholder="Ej: filtro de cerámica, panel solar, café molido…"
          value={custom}
          onChange={(e) => onCustom(e.target.value)}
          maxLength={300}
        />

        {error && <div className="error-banner">{error}</div>}

        <div className="spacer-16" />
        <button className="btn btn-primary" onClick={handleGenerar} disabled={!ready || loading}>
          {loading ? (
            <>
              <Spinner /> &nbsp;Generando con Copilot…
            </>
          ) : (
            <>✨ Generar plan con Copilot</>
          )}
        </button>
        {!ready && !loading && (
          <div className="hint-text">↑ Marca al menos uno o describe uno propio</div>
        )}
      </div>
    </>
  );
}
