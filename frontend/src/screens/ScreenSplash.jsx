import { useState } from 'react';
import { StatusBar, CopilotMark } from '../components/PhoneShell';
import ShareModal from '../components/ShareModal';

export default function ScreenSplash({ onNext }) {
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <StatusBar onDark />
      <div className="splash">
        <div className="eyebrow-row">
          <span className="ey">
            <CopilotMark size={11} /> &nbsp;CON MICROSOFT COPILOT
          </span>
          <button
            className="splash-share-btn"
            onClick={() => setShareOpen(true)}
            aria-label="Compartir AquaGuía"
            type="button"
          >
            📲 Compartir
          </button>
        </div>

        <div className="splash-droplet-wrap">
          <img src="/images/hero-splash.png" alt="AquaGuía" className="hero" />
          <div className="hero-credit">
            <CopilotMark size={10} /> &nbsp;Generado con Microsoft Designer · DALL·E 3
          </div>
        </div>

        <div className="splash-title">
          Aqua<em>Guía</em>
        </div>
        <div className="splash-tagline">
          Convierte cualquier agua en agua segura<br />
          con lo que tienes a mano. Plan creado por la IA de Microsoft, paso a paso.
        </div>
        <div className="sdg-pills">
          <div className="sdg-pill">
            <em>ODS 6</em>💧 Agua limpia
          </div>
          <div className="sdg-pill">
            <em>ODS 7</em>⚡ Energía
          </div>
          <div className="sdg-pill">
            <em>ODS 3</em>❤️ Salud
          </div>
        </div>

        <button className="btn btn-aqua" onClick={onNext}>
          Comenzar →
        </button>
        <div className="splash-foot">
          <CopilotMark size={11} /> &nbsp; HECHO CON COPILOT · AZURE OPENAI
        </div>
      </div>

      <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} />
    </>
  );
}
