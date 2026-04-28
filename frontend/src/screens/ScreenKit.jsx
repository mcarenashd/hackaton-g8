import { StatusBar, AppHeader, CopilotMark } from '../components/PhoneShell';

/** Catálogo low-cost. `needsFor` indica qué métodos requieren cada item. */
const CATALOGO = [
  { id: 'botella', emoji: '🍶', name: 'Botella PET 2L transparente', meta: 'Cualquier tienda', price: 0.5, needsFor: ['sodis', 'destilacion_solar', 'filtro_carbon'] },
  { id: 'cloro', emoji: '🧴', name: 'Lejía doméstica (500ml)', meta: 'Cloro 5%, sin perfume', price: 1.2, needsFor: ['cloracion'] },
  { id: 'carbon', emoji: '⚫', name: 'Carbón vegetal (lavado)', meta: '~ 500 g', price: 0.3, needsFor: ['filtro_carbon'] },
  { id: 'olla', emoji: '🫙', name: 'Olla 5L con tapa', meta: 'Para hervir o almacenar', price: 2.0, needsFor: ['ebullicion'] },
  { id: 'tela', emoji: '🧦', name: 'Tela de algodón (filtro)', meta: 'Doblar 4 veces', price: 0.5, needsFor: ['*'] },
];

function buildKit(plan, recursos) {
  if (!plan) return CATALOGO.map((i) => ({ ...i, have: false }));
  const have = new Set(recursos);
  const methodId = plan.method.id;
  return CATALOGO.filter(
    (item) => item.needsFor.includes('*') || item.needsFor.includes(methodId)
  ).map((item) => ({ ...item, have: have.has(item.id) }));
}

export default function ScreenKit({ plan, recursos = [], onReset, onBack }) {
  const items = buildKit(plan, recursos);
  const toBuy = items.filter((i) => !i.have);
  const total = toBuy.reduce((a, k) => a + k.price, 0).toFixed(2);
  const hasMethod = plan?.method?.title;

  return (
    <>
      <StatusBar />
      <AppHeader
        eyebrow="Lista priorizada por Copilot"
        title='Tu <em>kit</em> mínimo'
        onBack={onBack}
      />
      <div className="screen">
        <div className="total-hero">
          <div className="lbl">
            <CopilotMark size={10} /> &nbsp;COSTO TOTAL ESTIMADO
          </div>
          <div className="total">
            <em>$</em>
            {total}
            <small>USD</small>
          </div>
          <div className="total-sub">
            {toBuy.length === 0
              ? 'Ya tienes todo lo necesario. ¡Empieza ya!'
              : `${toBuy.length} ${toBuy.length === 1 ? 'ítem' : 'ítems'} para tratar agua${
                  hasMethod ? ` con ${plan.method.title}` : ''
                } durante meses.`}
          </div>
        </div>

        <div className="section-label">
          <span className="lbl">🛒 Lista priorizada</span>
          <span className="hint">orden de uso</span>
        </div>

        <div className="kit-list">
          {items.map((k) => (
            <div key={k.id} className={'kit-row' + (k.have ? ' have' : '')}>
              <div className="kr-num">{k.emoji}</div>
              <div>
                <div className="kr-name">{k.name}</div>
                <div className="kr-meta">
                  {k.meta}
                  {k.have ? ' · ✓ ya lo tienes' : ''}
                </div>
              </div>
              <div className="kr-price">{k.have ? '—' : `$${k.price.toFixed(2)}`}</div>
            </div>
          ))}
        </div>

        <div className="impact-card">
          <div className="imp-head">
            <span className="eyebrow">📍 PRÓXIMOS PASOS SUGERIDOS</span>
          </div>
          <div className="body-s" style={{ lineHeight: 1.6 }}>
            • Pregunta en tu farmacia o tienda comunitaria.<br />
            • Compra en grupo: sale más barato y se distribuye.<br />
            • Tras el primer uso, valida en la pantalla anterior.
          </div>
        </div>

        <button className="btn btn-primary" onClick={onReset}>
          💧 Iniciar nuevo plan
        </button>
        <div className="spacer-12" />
        <button className="btn btn-ghost" onClick={onBack}>
          ← Volver al plan
        </button>
      </div>
    </>
  );
}
