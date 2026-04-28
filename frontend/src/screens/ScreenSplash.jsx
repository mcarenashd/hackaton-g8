import { StatusBar } from "../components/PhoneShell";

export default function ScreenSplash({ onNext }) {
  return (
    <>
      <StatusBar />
      <div className="splash-body">
        <div className="splash-droplet">
          <div className="splash-inner" />
        </div>
        <div className="splash-title">
          Aqua<span>Guía</span>
        </div>
        <div className="splash-tagline">
          Purifica tu agua con lo que tienes.<br />
          La IA genera tu plan personalizado.
        </div>
        <div className="splash-sdg">
          <div className="sdg-pill">ODS 6 · Agua limpia</div>
          <div className="sdg-pill">ODS 7 · Energía</div>
        </div>
        <button className="splash-btn" onClick={onNext}>
          Comenzar →
        </button>
        <div className="splash-note">Sin registro · Funciona sin internet</div>
      </div>
    </>
  );
}
