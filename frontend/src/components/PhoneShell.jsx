// components/PhoneShell.jsx
export function StatusBar() {
  return (
    <div className="status-bar">
      <span>9:41</span>
      <span>●●● AquaGuía</span>
    </div>
  );
}

export function Header({ title, step, onBack, showLogo = false }) {
  return (
    <div className="header">
      {showLogo ? (
        <>
          <div className="logo-mark">Aqua<span>Guía</span></div>
          {step && <div style={{ fontSize: 12, color: "#a8d5c2", marginTop: 2 }}>{step}</div>}
        </>
      ) : (
        <div className="header-back">
          <button className="back-arrow" onClick={onBack}>←</button>
          <div>
            <div className="header-title">{title}</div>
            {step && <div className="header-step">{step}</div>}
          </div>
        </div>
      )}
    </div>
  );
}

export function ProgressBar({ current, total }) {
  return (
    <div className="progress-bar">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`progress-seg${i < current ? " done" : ""}`} />
      ))}
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="gen-dots">
      <div className="gen-dot" />
      <div className="gen-dot" />
      <div className="gen-dot" />
    </div>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}
