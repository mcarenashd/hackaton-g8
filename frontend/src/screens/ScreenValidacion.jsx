// screens/ScreenValidacion.jsx
import { useState } from "react";
import { StatusBar, Header, ProgressBar } from "../components/PhoneShell";

const ESTADOS = [
  { icon: "✨", label: "Clara y limpia", ok: true },
  { icon: "☁️", label: "Turbia", ok: false },
  { icon: "🟡", label: "Con color", ok: false },
  { icon: "👃", label: "Con olor", ok: false },
];

export default function ScreenValidacion({ onNext, onBack }) {
  const [selected, setSelected] = useState(null);

  const selOk = selected !== null && ESTADOS[selected].ok;

  return (
    <>
      <StatusBar />
      <Header title="¿Cómo quedó el agua?" step="Paso 4 de 4 · Validación" onBack={onBack} />
      <ProgressBar current={4} total={4} />
      <div className="screen-body">
        <div className="section-label">Fotografía el resultado</div>
        <div
          style={{ background: "#eee", borderRadius: 14, height: 100, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, cursor: "pointer", marginBottom: 12, border: "1.5px dashed #bbb" }}
          onClick={() => setSelected(0)}
        >
          📷
        </div>

        <div className="divider-or">o describe cómo está</div>
        <div className="section-label">Estado del agua</div>
        <div className="choice-row">
          {ESTADOS.map((e, i) => (
            <div
              key={e.label}
              className={`choice-btn${selected === i ? " selected" : ""}`}
              onClick={() => setSelected(i)}
            >
              <span className="icon">{e.icon}</span>
              {e.label}
            </div>
          ))}
        </div>

        {selOk && (
          <div className="result-ok" style={{ display: "flex" }}>
            <span style={{ fontSize: 22 }}>✅</span>
            <span style={{ fontSize: 13, color: "#0f4f3a", fontWeight: 500 }}>
              ¡Perfecto! Tu agua está lista para consumir.
            </span>
          </div>
        )}
        {selected !== null && !selOk && (
          <div className="warning-badge">
            <span>⚠️</span>
            <span className="w-text">Repite el proceso o añade un paso de desinfección adicional.</span>
          </div>
        )}

        <button className="btn-primary" onClick={onNext}>Ver kit mínimo →</button>
      </div>
    </>
  );
}
