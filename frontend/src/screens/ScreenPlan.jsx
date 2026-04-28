import { useEffect, useRef, useState } from 'react';
import {
  StatusBar,
  AppHeader,
  Progress,
  Dots,
  CopilotMark,
} from '../components/PhoneShell';
import ShareModal from '../components/ShareModal';
import { getStepIcon } from '../lib/pictos';
import { generarIlustracion } from '../lib/api';
import { speak, stop, isSpeaking, isSupported as ttsSupported } from '../lib/tts';

// Imágenes DALL-E ya generadas (Microsoft Designer). Si el método no
// tiene imagen pre-generada, caemos al endpoint /api/illustration.
const METHOD_IMAGES = {
  ebullicion: '/images/methods/ebullicion.png',
  sodis: '/images/methods/sodis.png',
  filtro_carbon: '/images/methods/filtro-carbon.png',
  cloracion: '/images/methods/cloracion.png',
  destilacion_solar: '/images/methods/destilacion-solar.png',
};

// Stats compactas que se muestran en el method-hero.
function buildStats(plan) {
  const minutes = plan.estimatedTimeMinutes || 0;
  const time = minutes >= 60 ? `${Math.round((minutes / 60) * 10) / 10}h` : `${minutes}m`;
  const dailyL = plan.context?.dailyLiters;
  const difficulty = plan.method?.difficulty || '—';
  return [
    { v: time, l: 'Tiempo' },
    { v: dailyL ? `${dailyL}L` : '—', l: 'L/día' },
    { v: difficulty, l: 'Dificultad' },
  ];
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
  const [visible, setVisible] = useState([]);
  const [wow, setWow] = useState({ status: 'idle', url: '', caption: '', error: '' });
  const [speaking, setSpeaking] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const speakInterval = useRef(null);

  const steps = plan?.steps || [];

  useEffect(() => {
    setVisible([]);
    if (!plan) return;
    steps.forEach((_, i) => {
      setTimeout(() => setVisible((p) => [...p, i]), 200 + i * 220);
    });
  }, [plan]);

  useEffect(
    () => () => {
      stop();
      if (speakInterval.current) clearInterval(speakInterval.current);
    },
    []
  );

  async function handleGenerateIllust() {
    const local = METHOD_IMAGES[plan.method.id];
    if (local) {
      setWow({
        status: 'done',
        url: local,
        caption:
          'Ilustración generada por Microsoft Copilot Designer · DALL·E 3.',
        error: '',
      });
      return;
    }
    setWow({ status: 'loading', url: '', caption: '', error: '' });
    try {
      const data = await generarIlustracion({
        situacion,
        recursos,
        methodId: plan.method.id,
      });
      setWow({
        status: 'done',
        url: data.url || '',
        caption: data.caption || 'Ilustración educativa.',
        error: '',
      });
    } catch (e) {
      setWow({
        status: 'error',
        url: '',
        caption: '',
        error: e.message || 'Error al generar.',
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

  const stats = buildStats(plan);
  const aiTag = plan.aiPowered
    ? 'GENERADO POR GPT-4o (AZURE)'
    : 'GENERADO POR COPILOT';

  return (
    <>
      <StatusBar />
      <AppHeader
        eyebrow="Paso 3 · Tu plan"
        title='Plan <em>personalizado</em>'
        onBack={onBack}
      />
      <Progress current={3} total={4} />
      <div className="screen">
        <div className="method-hero">
          <div className="meta-row">
            <span className="tag">
              <CopilotMark size={10} /> &nbsp;{aiTag}
            </span>
            <span className="badge">🛡️ Validado OMS</span>
          </div>
          <div className="method-name">
            Método <em>{plan.method.title}</em>
          </div>
          <div className="method-sub">{plan.method.summary}</div>
          <div className="stats">
            {stats.map((s, i) => (
              <div className="stat" key={i}>
                <div className="stat-v">
                  <em>{s.v}</em>
                </div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="section-label">
          <span className="lbl">📋 Pasos · {steps.length}</span>
          <span className="hint">tap "Escuchar" para leer</span>
        </div>

        <div className="steps-list">
          {steps.map((s, i) => {
            const text = `${s.title} ${s.text}`;
            const { icon } = getStepIcon(text);
            return (
              <div
                key={i}
                className={'step-card' + (visible.includes(i) ? ' visible' : '')}
              >
                <div className="step-picto">
                  <span className="step-num">{String(i + 1).padStart(2, '0')}</span>
                  <span style={{ fontSize: 38, lineHeight: 1 }}>{icon}</span>
                </div>
                <div className="step-body">
                  <div className="step-title">{s.title}</div>
                  {s.text && <div className="step-text">{s.text}</div>}
                  {s.time && <div className="step-time">⏱ {s.time}</div>}
                </div>
              </div>
            );
          })}
        </div>

        {plan.customConsiderations?.length > 0 && (
          <>
            <div className="section-label" style={{ marginTop: 16 }}>
              <span className="lbl">🎒 Tus recursos extra</span>
              <span className="hint">consejo por item</span>
            </div>
            <div className="custom-considerations">
              {plan.customConsiderations.map((c, i) => (
                <div key={i} className="item">
                  {c}
                </div>
              ))}
            </div>
          </>
        )}

        <div className="illust-card">
          <div className="illust-head">
            <span className="lbl">
              <CopilotMark size={10} /> &nbsp;COPILOT DESIGNER
            </span>
            <span className="by">Imagen única</span>
          </div>
          {wow.status === 'idle' && (
            <div className="illust-empty">
              <div className="body-s" style={{ marginBottom: 12 }}>
                Genera una ilustración del proceso completo<br />
                con la IA de Microsoft Copilot.
              </div>
              <button className="btn btn-aqua" onClick={handleGenerateIllust}>
                ✨ Generar con Copilot Designer
              </button>
            </div>
          )}
          {wow.status === 'loading' && (
            <div className="illust-empty">
              <div style={{ marginBottom: 10 }}>
                <Dots />
              </div>
              <div className="body-s">Copilot Designer creando ilustración…</div>
            </div>
          )}
          {wow.status === 'done' && wow.url && (
            <>
              <div className="illust-art">
                <img src={wow.url} alt="Ilustración del método" />
              </div>
              <div className="illust-cap">{wow.caption}</div>
            </>
          )}
          {wow.status === 'error' && (
            <div className="illust-empty">
              <div className="error-banner">{wow.error}</div>
            </div>
          )}
        </div>

        <div className="note safe">
          <span className="icon">🛡️</span>
          <span className="txt">
            Plan basado en plantillas validadas por la <strong>OMS</strong>,
            personalizado por <strong>Copilot</strong> con tus recursos.
          </span>
        </div>

        {plan.warnings?.length > 0 && (
          <div className="note warn">
            <span className="icon">⚠️</span>
            <span className="txt">{plan.warnings[0]}</span>
          </div>
        )}

        <div className="actions-grid">
          <button className="btn-pill" onClick={handleSpeak}>
            {speaking ? '⏸ Detener' : '🔊 Escuchar'}
          </button>
          <button className="btn-pill" onClick={onValidar}>
            🧪 Validar agua
          </button>
          <button className="btn-pill" onClick={() => setShareOpen(true)}>
            📲 Compartir
          </button>
          <button className="btn-pill" onClick={onKit}>
            🛒 Kit mínimo
          </button>
        </div>
        <div className="spacer-12" />
        <button className="btn btn-primary" onClick={onKit}>
          Ver mi kit mínimo →
        </button>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
