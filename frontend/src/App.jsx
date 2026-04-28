import { useState } from 'react';
import { CopilotMark } from './components/PhoneShell';
import ScreenSplash from './screens/ScreenSplash';
import ScreenSituacion from './screens/ScreenSituacion';
import ScreenRecursos from './screens/ScreenRecursos';
import ScreenPlan from './screens/ScreenPlan';
import ScreenValidacion from './screens/ScreenValidacion';
import ScreenKit from './screens/ScreenKit';

const SCREEN_LABELS = ['Splash', 'Situación', 'Recursos', 'Plan', 'Validación', 'Kit'];
const SCREEN_EMOJIS = ['💧', '🌊', '📸', '📋', '🧪', '🛒'];

export default function App() {
  const [screen, setScreen] = useState(0);
  const [situacion, setSituacion] = useState({
    agua: '',
    customAgua: '',
    urgencia: '',
    personas: '',
  });
  const [recursos, setRecursos] = useState([]);
  const [custom, setCustom] = useState('');
  const [plan, setPlan] = useState(null);

  const screens = [
    <ScreenSplash key="s" onNext={() => setScreen(1)} />,
    <ScreenSituacion
      key="t"
      value={situacion}
      onChange={setSituacion}
      onNext={() => setScreen(2)}
      onBack={() => setScreen(0)}
    />,
    <ScreenRecursos
      key="r"
      value={recursos}
      custom={custom}
      onChange={setRecursos}
      onCustom={setCustom}
      situacion={situacion}
      onNext={(planData) => {
        setPlan(planData);
        setScreen(3);
      }}
      onBack={() => setScreen(1)}
    />,
    <ScreenPlan
      key="p"
      plan={plan}
      situacion={situacion}
      recursos={recursos}
      onValidar={() => setScreen(4)}
      onKit={() => setScreen(5)}
      onBack={() => setScreen(2)}
    />,
    <ScreenValidacion
      key="v"
      onNext={() => setScreen(5)}
      onBack={() => setScreen(3)}
    />,
    <ScreenKit
      key="k"
      plan={plan}
      recursos={recursos}
      onReset={() => {
        setScreen(0);
        setPlan(null);
        setRecursos([]);
        setCustom('');
        setSituacion({ agua: '', customAgua: '', urgencia: '', personas: '' });
      }}
      onBack={() => setScreen(3)}
    />,
  ];

  return (
    <div className="stage">
      <div className="stage-grid">
        {/* Panel izquierdo: branding y stats */}
        <aside className="stage-side left">
          <div className="brand-eyebrow">
            <CopilotMark size={11} /> &nbsp;HACKATHON MICROSOFT · ODS 6 & 7
          </div>
          <div className="brand-name">
            Aqua<em>Guía</em>
          </div>
          <div className="brand-sub">
            IA generativa de Microsoft Copilot que convierte cualquier agua en agua segura,
            usando solo lo que ya tienes en casa.
          </div>
          <div className="brand-meta">
            <span className="chip">MICROSOFT COPILOT</span>
            <span className="chip">AZURE OPENAI</span>
            <span className="chip">COPILOT VISION</span>
            <span className="chip">DALL·E 3</span>
            <span className="chip">PWA OFFLINE</span>
          </div>
          <div className="stat-block" style={{ marginTop: 8 }}>
            <div className="stat-num">
              2.<em>2</em>B
            </div>
            <div className="stat-label">Personas sin acceso a agua segura</div>
          </div>
          <div className="stat-block">
            <div className="stat-num">
              $<em>4</em>.50
            </div>
            <div className="stat-label">Costo estimado del kit mínimo</div>
          </div>
        </aside>

        {/* Phone center */}
        <div className="phone" data-screen-label={`0${screen + 1} ${SCREEN_LABELS[screen]}`}>
          {screens[screen]}
        </div>

        {/* Panel derecho: navegación entre pantallas (atajo demo) */}
        <aside className="stage-side right">
          <div className="brand-eyebrow">— Flujo de la app</div>
          <div className="stat-block">
            {SCREEN_LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setScreen(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '8px 0',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  opacity: i === screen ? 1 : 0.5,
                  transition: 'opacity 0.2s',
                  background: 'transparent',
                  border: 'none',
                  borderBottomColor: 'rgba(255,255,255,0.06)',
                  borderBottomStyle: 'solid',
                  borderBottomWidth: '1px',
                  color: 'inherit',
                  width: '100%',
                  textAlign: 'left',
                  font: 'inherit',
                }}
              >
                <span style={{ fontSize: 18, width: 22 }}>{SCREEN_EMOJIS[i]}</span>
                <span
                  style={{
                    fontFamily: 'Instrument Serif, serif',
                    fontSize: 22,
                    fontStyle: i === screen ? 'italic' : 'normal',
                    color: 'white',
                    letterSpacing: '-0.01em',
                  }}
                >
                  {label}
                </span>
              </button>
            ))}
          </div>
          <div className="brand-sub" style={{ marginTop: 12, fontSize: 12 }}>
            Tap cualquier paso para saltar.<br />
            Demo en stub mode — los planes se generan con plantillas + GPT-4o cuando esté la key de Azure.
          </div>
        </aside>
      </div>
    </div>
  );
}
