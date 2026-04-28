import { StatusBar, Header } from '../components/PhoneShell';

/**
 * Catálogo low-cost. `needsFor` indica qué métodos requieren cada item.
 * Mostramos solo los que faltan según los recursos que el usuario marcó.
 */
const CATALOGO = [
  {
    id: 'botella',
    icon: '🍶',
    name: 'Botella PET 2L transparente',
    price: 0.5,
    needsFor: ['sodis', 'destilacion_solar', 'filtro_carbon'],
  },
  {
    id: 'cloro',
    icon: '🧴',
    name: 'Lejía sin perfume (500ml)',
    price: 1.2,
    needsFor: ['cloracion'],
  },
  { id: 'carbon', icon: '🪨', name: 'Carbón vegetal', price: 0.3, needsFor: ['filtro_carbon'] },
  { id: 'olla', icon: '🫙', name: 'Olla 5L', price: 2.0, needsFor: ['ebullicion'] },
  { id: 'tela', icon: '🧦', name: 'Tela de algodón (filtro)', price: 0.5, needsFor: ['*'] },
];

function buildKit(plan, recursos) {
  if (!plan) return CATALOGO; // fallback completo si no hay plan
  const have = new Set(recursos);
  return CATALOGO.filter(
    (item) =>
      !have.has(item.id) &&
      (item.needsFor.includes('*') || item.needsFor.includes(plan.method.id))
  );
}

export default function ScreenKit({ plan, recursos = [], onReset, onBack }) {
  const items = buildKit(plan, recursos);
  const total = items.reduce((s, i) => s + i.price, 0);

  return (
    <>
      <StatusBar />
      <Header
        title="Tu kit mínimo"
        step={
          plan
            ? `Para método: ${plan.method.title} · Costo estimado`
            : 'Generado por IA · Costo estimado'
        }
        onBack={onBack}
      />
      <div className="screen-body">
        <div className="card">
          <div className="section-label">
            {items.length === 0
              ? '✅ Ya tienes todo lo necesario'
              : 'Lista de compras priorizada'}
          </div>
          {items.length === 0 ? (
            <div style={{ fontSize: 13, color: '#0f4f3a', lineHeight: 1.5 }}>
              Con los recursos que marcaste, no necesitas comprar nada. ¡Empieza ya!
            </div>
          ) : (
            <>
              {items.map((item) => (
                <div className="kit-item" key={item.id}>
                  <div className="kit-left">
                    <span style={{ fontSize: 18 }}>{item.icon}</span>
                    <span style={{ fontSize: 13, color: '#333' }}>{item.name}</span>
                  </div>
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#0f4f3a' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>
              ))}
              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: '1.5px solid #0f4f3a',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: 13, fontWeight: 500, color: '#333' }}>
                  Total estimado
                </span>
                <span style={{ fontSize: 18, fontWeight: 500, color: '#0f4f3a' }}>
                  ${total.toFixed(2)}
                </span>
              </div>
            </>
          )}
        </div>

        <div className="card">
          <div className="section-label">Próximos pasos sugeridos</div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            <li style={{ fontSize: 12, color: '#555', padding: '6px 0', lineHeight: 1.5 }}>
              📍 Pregunta a tu farmacia local o tienda comunitaria por estos materiales.
            </li>
            <li style={{ fontSize: 12, color: '#555', padding: '6px 0', lineHeight: 1.5 }}>
              👥 Comparte el plan con tu comunidad: sale más barato comprar en grupo.
            </li>
            <li style={{ fontSize: 12, color: '#555', padding: '6px 0', lineHeight: 1.5 }}>
              🧪 Tras el primer uso, valida el resultado en la pantalla anterior.
            </li>
          </ul>
        </div>

        <button className="btn-primary" onClick={onReset}>
          Volver al inicio
        </button>
      </div>
    </>
  );
}
