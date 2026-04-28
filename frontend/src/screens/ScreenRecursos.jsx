import { useRef, useState } from 'react';
import { StatusBar, Header, ProgressBar, Spinner } from '../components/PhoneShell';
import { generarPlan, detectarRecursos } from '../lib/api';
import { fileToDataUrl } from '../lib/camera';

export const RECURSOS_LIST = [
  { id: 'sol', icon: '☀️', label: 'Luz solar' },
  { id: 'botella', icon: '🍶', label: 'Botellas PET' },
  { id: 'fuego', icon: '🔥', label: 'Fuego / calor' },
  { id: 'carbon', icon: '🪨', label: 'Carbón / arena' },
  { id: 'cloro', icon: '🧴', label: 'Lejía / cloro' },
  { id: 'tela', icon: '🧦', label: 'Tela / trapo' },
  { id: 'olla', icon: '🫙', label: 'Ollas / baldes' },
  { id: 'electricidad', icon: '⚡', label: 'Electricidad' },
];

export default function ScreenRecursos({
  value,
  onChange,
  customRecursos,
  onChangeCustom,
  situacion,
  onNext,
  onBack,
}) {
  const [detecting, setDetecting] = useState(false);
  const [detectionInfo, setDetectionInfo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  function toggleRecurso(id) {
    const next = value.includes(id) ? value.filter((r) => r !== id) : [...value, id];
    onChange(next);
  }

  async function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setDetecting(true);
    setDetectionInfo('Analizando imagen con Copilot Vision...');
    setError('');
    try {
      const dataUrl = await fileToDataUrl(file);
      const { detected = [], rawText = '' } = await detectarRecursos(dataUrl);
      const merged = Array.from(new Set([...value, ...detected]));
      onChange(merged);
      setDetectionInfo(
        detected.length > 0
          ? `Detectado: ${detected
              .map((id) => RECURSOS_LIST.find((r) => r.id === id)?.label || id)
              .join(', ')}`
          : 'No se detectaron recursos conocidos. Marca manualmente.'
      );
      if (rawText) console.log('[vision] raw:', rawText);
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
        customRecursos,
        customSource: situacion.customAgua || '',
      });
      onNext(data.plan);
    } catch (e) {
      setError(e.message || 'No se pudo conectar con la IA. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  const hasAny = value.length > 0 || (customRecursos && customRecursos.trim().length > 0);

  return (
    <>
      <StatusBar />
      <Header
        title="¿Qué tienes disponible?"
        step="Paso 2 de 4 · Recursos"
        onBack={onBack}
      />
      <ProgressBar current={2} total={4} />
      <div className="screen-body">
        <label className="camera-zone">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhoto}
            style={{ display: 'none' }}
          />
          <div style={{ fontSize: 24, marginBottom: 6 }}>📸</div>
          <div className="cam-label">Fotografía tus recursos</div>
          <div className="cam-sub">Copilot Vision los detecta automáticamente</div>
        </label>

        {detecting && (
          <div className="ai-detecting" style={{ marginTop: 8 }}>
            <Spinner />
            <span>{detectionInfo}</span>
          </div>
        )}
        {!detecting && detectionInfo && (
          <div className="ai-detecting" style={{ marginTop: 8 }}>
            <span>✨</span>
            <span>{detectionInfo}</span>
          </div>
        )}

        <div className="divider-or">o selecciona manualmente</div>
        <div className="section-label">Marca todo lo que tienes</div>

        <div className="resource-grid">
          {RECURSOS_LIST.map((r) => (
            <div
              key={r.id}
              className={`resource-item${value.includes(r.id) ? ' checked' : ''}`}
              onClick={() => toggleRecurso(r.id)}
            >
              <div className="check-badge">✓</div>
              <span className="r-icon">{r.icon}</span>
              <span className="r-label">{r.label}</span>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 6 }}>
          ¿Algo más que tengas?
        </div>
        <textarea
          className="text-input textarea"
          placeholder="Ej: filtro de cerámica, panel solar, café molido…"
          value={customRecursos}
          onChange={(e) => onChangeCustom(e.target.value)}
          maxLength={300}
        />

        {error && <div className="error-banner">{error}</div>}

        <button className="btn-primary" onClick={handleGenerar} disabled={loading || !hasAny}>
          {loading ? 'Generando plan...' : 'Generar plan con IA →'}
        </button>
        {!hasAny && !loading && (
          <div className="hint-text">↑ Marca al menos un recurso o describe uno propio.</div>
        )}
      </div>
    </>
  );
}
