/**
 * Componentes compartidos por todas las pantallas — portados del prototipo v2.
 */

export function StatusBar({ onDark = false }) {
  return (
    <div className={'status-bar' + (onDark ? ' on-dark' : '')}>
      <span>9:41</span>
      <div className="right">
        <svg width="18" height="11" viewBox="0 0 18 11" fill="none">
          <path d="M1 8.5h2v2H1zM5 6.5h2v4H5zM9 4h2v6.5H9zM13 1.5h2v9h-2z" fill="currentColor" />
        </svg>
        <svg width="16" height="11" viewBox="0 0 16 11" fill="none">
          <path
            d="M8 2.5c2.2 0 4.2.85 5.7 2.25l1.05-1.05A9.45 9.45 0 008 1.05a9.45 9.45 0 00-6.75 2.65l1.05 1.05A8.45 8.45 0 018 2.5zm0 3.2c1.4 0 2.65.55 3.6 1.45l1.05-1.05A6.5 6.5 0 008 4.55a6.5 6.5 0 00-4.65 1.55l1.05 1.05A5.2 5.2 0 018 5.7zm0 3.2c.6 0 1.15.25 1.55.65l-1.55 1.55-1.55-1.55c.4-.4.95-.65 1.55-.65z"
            fill="currentColor"
          />
        </svg>
        <svg width="26" height="11" viewBox="0 0 26 11" fill="none">
          <rect x="0.5" y="0.5" width="22" height="10" rx="2.5" stroke="currentColor" opacity="0.5" />
          <rect x="2" y="2" width="17" height="7" rx="1" fill="currentColor" />
          <rect x="23.5" y="3.5" width="1.5" height="4" rx="0.5" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}

export function AppHeader({ eyebrow, title, onBack, action }) {
  return (
    <div className="app-header">
      {onBack && (
        <button className="icon-btn" onClick={onBack} aria-label="Atrás">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M9 2L4 7l5 5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <div className="titles">
        {eyebrow && <div className="eyebrow">{eyebrow}</div>}
        {title && <div className="title" dangerouslySetInnerHTML={{ __html: title }} />}
      </div>
      {action}
    </div>
  );
}

export function Progress({ current, total }) {
  return (
    <div className="progress-track">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={
            'progress-seg' +
            (i < current - 1 ? ' done' : i === current - 1 ? ' active done' : '')
          }
        />
      ))}
    </div>
  );
}

export function Dots() {
  return (
    <div className="dots">
      <span className="dot" />
      <span className="dot" />
      <span className="dot" />
    </div>
  );
}

export function CopilotMark({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-label="Copilot">
      <defs>
        <linearGradient id="cpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.78 0.16 200)" />
          <stop offset="50%" stopColor="oklch(0.72 0.16 240)" />
          <stop offset="100%" stopColor="oklch(0.68 0.18 285)" />
        </linearGradient>
      </defs>
      <path d="M12 2c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6z" fill="url(#cpGrad)" />
      <path
        d="M19 13c-.5 1.5-1.5 2.5-3 3 1.5.5 2.5 1.5 3 3 .5-1.5 1.5-2.5 3-3-1.5-.5-2.5-1.5-3-3z"
        fill="url(#cpGrad)"
        opacity="0.85"
      />
    </svg>
  );
}

export function EmojiTile({ emoji, image, label, sub, selected, onClick }) {
  return (
    <button
      className={'e-tile' + (selected ? ' selected' : '')}
      onClick={onClick}
      type="button"
    >
      {image ? (
        <img src={image} alt="" className="e-image" />
      ) : (
        <span className="e-emoji" aria-hidden>
          {emoji}
        </span>
      )}
      <span className="e-label">{label}</span>
      {sub && <span className="e-sub">{sub}</span>}
    </button>
  );
}

export function Spinner() {
  return <div className="spinner" />;
}
