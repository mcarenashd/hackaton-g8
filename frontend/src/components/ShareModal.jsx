import { useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { CopilotMark } from './PhoneShell';

const PROD_URL = 'https://hackaton-g8.vercel.app/';

/**
 * Modal con un QR de la URL pública para que en una demo cualquiera
 * pueda escanear y abrir la app en su móvil. Usa la URL de producción
 * si estamos sirviendo desde localhost (para testing del modal en dev),
 * o `window.location.origin` si ya estamos en prod.
 */
export default function ShareModal({ open, onClose }) {
  const url =
    typeof window !== 'undefined' && window.location.host.includes('localhost')
      ? PROD_URL
      : (typeof window !== 'undefined' ? window.location.origin + '/' : PROD_URL);

  useEffect(() => {
    if (!open) return;
    function onKey(e) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="share-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Compartir AquaGuía"
    >
      <div className="share-card" onClick={(e) => e.stopPropagation()}>
        <button className="share-close" onClick={onClose} aria-label="Cerrar">
          ×
        </button>

        <div className="share-eyebrow">
          <CopilotMark size={11} /> &nbsp;ESCANEA PARA ABRIR
        </div>
        <div className="share-title">
          Aqua<em>Guía</em>
        </div>

        <div className="share-qr-wrap">
          <QRCodeSVG
            value={url}
            size={220}
            level="M"
            includeMargin={false}
            bgColor="#ffffff"
            fgColor="#0a1f2c"
            imageSettings={{
              src: '/images/hero-splash.png',
              height: 44,
              width: 44,
              excavate: true,
            }}
          />
        </div>

        <div className="share-url">{url}</div>
        <div className="share-foot">
          Apunta la cámara de tu móvil al QR para probar la app.
        </div>
      </div>
    </div>
  );
}
