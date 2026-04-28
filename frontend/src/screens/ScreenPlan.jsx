import { useEffect, useRef, useState } from 'react';
import { StatusBar, Header, ProgressBar, LoadingDots } from '../components/PhoneShell';
import { getStepIcon } from '../lib/pictos';
import { generarIlustracion } from '../lib/api';
import { speak, stop, isSpeaking, isSupported as ttsSupported } from '../lib/tts';

// Métodos cubiertos por imágenes generadas con DALL-E 3 (Microsoft Designer).
// Si el método no está aquí, caemos al endpoint /api/illustration (SVG stub
// o, con Azure, DALL-E real on-demand).
const METHOD_IMAGES = {
  ebullicion: '/images/methods/ebullicion.png',
  sodis: '/images/methods/sodis.png',
  filtro_carbon: '/images/methods/filtro-carbon.png',
  cloracion: '/images/methods/cloracion.png',
  destilacion_solar: '/images/methods/destilacion-solar.png',
};

function StepCard({ step, index, visible }) {
  const text = `${step.title} ${step.text}`;
  const { icon, accent } = getStepIcon(text);
  return (
    <div className={`step-card${visible ? ' visible' : ''}`}>
      <div className="step-picto-area" style={{ background: accent }}>
        <span className="step-emoji" aria-hidden="true">{icon}</span>
      </div>
      <div className="step-body">
        <div className="step-header">
          <div className="step-num">{index + 1}</div>
          <div className="step-title">{step.title}</div>
        </div>
        {step.text && <div className="step-text">{step.text}</div>}
        {step.time && <div className="step-time">⏱ {step.time}</div>}
      </div>
    </div>
  );
}

function buildSpokenScript(plan) {
  const intro = `Plan de potabilización: ${plan.method.title}. ${plan.method.summary}.`;
  const stepsText = plan.steps
    .map((s, i) => `Paso ${i + 1}: ${s.title}. ${s.text || ''}`)
    .join('. ');
  const safety = plan.warnings?.length
    ? ` Importante: ${plan.warnings.slice(0, 2).join('. ')}.`
    : '';
  return `${intro} ${stepsText}.${safety}`;
}

export default function ScreenPlan({ plan, situacion, recursos, onValidar, onKit, onBack }) {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const [wowState, setWowState] = useState({ status: 'idle', url: '', caption: '', error: '' });
  const [speaking, setSpeaking] = useState(false);
  const speakInterval = useRef(null);

  const steps = plan?.steps || [];

  useEffect(() => {
    setVisibleSteps([]);
    if (!plan) return;
    steps.forEach((_, i) => {
      setTimeout(() => setVisibleSteps((prev) => [...prev, i]), i * 200 + 150);
    });
  }, [plan]);

  useEffect(() => {
    return () => {
      stop();
      if (speakInterval.current) clearInterval(speakInterval.current);
    };
  }, []);

  async function handleWow() {
    // Si tenemos una imagen pre-generada con DALL-E para este método,
    // la mostramos instantáneamente (sin llamada de red).
    const localImage = METHOD_IMAGES[plan.method.id];
    if (localImage) {
      setWowState({
        status: 'done',
        url: localImage,
        caption: 'Ilustración educativa generada con DALL-E 3 (Microsoft Designer).',
        error: '',
      });
      return;
    }
    // Fallback: pedimos al backend (SVG stub si no hay Azure, DALL-E si la hay).
    setWowState({ status: 'loading', url: '', caption: '', error: '' });
    try {
      const data = await generarIlustracion({
        situacion,
        recursos,
        methodId: plan.method.id,
      });
      setWowState({
        status: 'done',
        url: data.url || '',
        caption: data.caption || 'Ilustración educativa generada con IA.',
        error: '',
      });
    } catch (e) {
      setWowState({
        status: 'error',
        url: '',
        caption: '',
        error: e.message || 'No se pudo generar la ilustración.',
      });
    }
  }

  function handleSpeak() {
    if (speaking) {
      stop();
      setSpeaking(false);
      if (speakInterval.current) clearInterval(speakInterval.current);
      return;
    }
    if (!ttsSupported()) {
      alert('Tu navegador no soporta lectura por voz.');
      return;
    }
    speak(buildSpokenScript(plan), { lang: 'es-ES' });
    setSpeaking(true);
    speakInterval.current = setInterval(() => {
      if (!isSpeaking()) {
        setSpeaking(false);
        clearInterval(speakInterval.current);
      }
    }, 400);
  }

  if (!plan) return null;

  return (
    <>
      <StatusBar />
      <Header
        title="Tu plan personalizado"
        step="Paso 3 de 4 · IA + ilustraciones"
        onBack={onBack}
      />
      <ProgressBar current={3} total={4} />
      <div className="screen-body">
        <div className="safety-badge">
          <span>🛡️</span>
          <span className="safe-text">
            Método: <strong>{plan.method.title}</strong>
            {plan.method.difficulty ? ` · Dificultad: ${plan.method.difficulty}` : ''}
          </span>
        </div>

        <div className={`ai-mode-pill ${plan.aiPowered ? 'live' : 'demo'}`}>
          {plan.aiPowered
            ? '✨ Plan personalizado por GPT-4o · Ilustraciones DALL-E 3'
            : '🎨 Plan adaptado a tu contexto · Ilustraciones DALL-E 3'}
        </div>

        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-label">Resumen para tu caso</div>
          <div style={{ fontSize: 13, color: '#222', lineHeight: 1.5 }}>{plan.method.summary}</div>
        </div>

        {steps.map((step, i) => (
          <StepCard key={i} step={step} index={i} visible={visibleSteps.includes(i)} />
        ))}

        {plan.customConsiderations?.length > 0 && (
          <div className="card">
            <div className="section-label">🎒 Cómo usar tus recursos extra</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {plan.customConsiderations.map((c, i) => (
                <li
                  key={i}
                  style={{
                    fontSize: 12,
                    color: '#0f4f3a',
                    background: '#e8f5ef',
                    borderRadius: 8,
                    padding: '8px 10px',
                    marginBottom: 6,
                    lineHeight: 1.5,
                  }}
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="card" style={{ marginBottom: 12 }}>
          <div className="section-label">Ilustración detallada con IA</div>
          <div style={{ fontSize: 12, color: '#555', marginBottom: 10, lineHeight: 1.5 }}>
            Genera una ilustración del proceso completo usando Copilot Designer.
          </div>
          <button
            className="btn-wow"
            onClick={handleWow}
            disabled={wowState.status === 'loading' || wowState.status === 'done'}
          >
            {wowState.status === 'loading'
              ? '⏳ Generando…'
              : wowState.status === 'done'
              ? '✅ Ilustración lista'
              : '✨ Generar ilustración'}
          </button>
          <div style={{ fontSize: 10, color: '#a8d5c2', textAlign: 'center', marginTop: 4 }}>
            Copilot Designer · Imagen única para tu plan
          </div>
        </div>

        {wowState.status === 'loading' && (
          <div className="generated-img-box" style={{ display: 'block', marginBottom: 12 }}>
            <div style={{ padding: 24, textAlign: 'center' }}>
              <LoadingDots />
              <div style={{ fontSize: 12, color: '#666', marginTop: 8 }}>
                Generando ilustración con IA…
              </div>
            </div>
          </div>
        )}
        {wowState.status === 'done' && wowState.url && (
          <div className="generated-img-box" style={{ display: 'block', marginBottom: 12 }}>
            <img src={wowState.url} alt="Ilustración generada por IA" />
            <div className="generated-img-caption">{wowState.caption}</div>
          </div>
        )}
        {wowState.status === 'error' && (
          <div className="error-banner">{wowState.error}</div>
        )}

        {plan.warnings?.length > 0 && (
          <div className="warning-badge">
            <span>⚠️</span>
            <span className="w-text">{plan.warnings[0]}</span>
          </div>
        )}

        <div className="action-row">
          <div className="action-pill" onClick={handleSpeak}>
            {speaking ? '⏸ Detener' : '🔊 Escuchar'}
          </div>
          <div className="action-pill" onClick={onValidar}>
            🧪 Validar agua
          </div>
        </div>
        <button className="btn-secondary" onClick={onKit}>
          Ver mi kit mínimo →
        </button>
      </div>
    </>
  );
}
