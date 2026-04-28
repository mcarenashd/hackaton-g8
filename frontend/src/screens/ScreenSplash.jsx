import { StatusBar, CopilotMark } from '../components/PhoneShell';

export default function ScreenSplash({ onNext }) {
  return (
    <>
      <StatusBar onDark />
      <div className="splash">
        <div className="eyebrow-row">
          <span className="ey">
            <CopilotMark size={11} /> &nbsp;CON MICROSOFT COPILOT
          </span>
          <span className="ver">v1.0</span>
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
    </>
  );
}
