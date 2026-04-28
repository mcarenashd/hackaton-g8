/**
 * Reglas que VARÍAN el plan en función del contexto del usuario, sin
 * llamar al LLM. Se aplican al template antes de devolverlo.
 *
 * El objetivo: que, aún en modo stub (sin Azure), el plan cambie
 * visiblemente cuando cambia la situación.
 */

// Pre-paso específico según fuente — se inserta como paso 1.
const SOURCE_PRESTEPS = {
  rio: 'Llena un balde y déjalo reposar 10 minutos para que sedimente lo más pesado; usa solo el agua de arriba para los pasos siguientes.',
  lago: 'Recoge agua lejos de la orilla, donde haya menos algas y materia flotante. Si ves manchas verdes, busca otra zona.',
  pozo: 'Si el pozo está cerca de letrinas o ganadería, espera a que el agua salga clara durante un minuto antes de recoger.',
  lluvia:
    'Descarta los primeros 2-3 minutos de lluvia (arrastran polvo, excrementos de aves y plomo del techo). Recoge solo después.',
  grifo_dudoso:
    'Deja correr el grifo 30 segundos antes de recoger, sobre todo tras un corte de agua.',
  otro: 'Inspecciona la fuente: si ves color, olor o partículas extrañas, busca una alternativa antes de tratar.',
};

// Mensajes según urgencia.
const URGENCIA_HINTS = {
  'Ahora mismo':
    '🚨 URGENTE: prioriza la opción más rápida. Si tienes fuego, hierve aunque sea solo 1 minuto — es seguro y ya.',
  'Tengo tiempo':
    '✅ Sin prisa: si puedes, deja el agua en reposo unas horas antes de tratar — la sedimentación natural ayuda mucho.',
};

// Modificadores según nº personas.
function scaleForGroup(personas, dailyLiters) {
  switch (personas) {
    case '1–2 personas':
      return {
        scaleNote: `Para ${personas}: con 1-2 botellas/recipientes te bastan ${dailyLiters} L/día.`,
        batchTip: 'Procesa una sola tanda al día; cabe en una olla de 5 L.',
      };
    case 'Familia':
      return {
        scaleNote: `Para una familia (${dailyLiters} L/día): prepara 2-3 tandas distribuidas durante el día.`,
        batchTip: 'Designa a una persona responsable cada día para no romper la rotación.',
      };
    case 'Comunidad':
      return {
        scaleNote: `Para una comunidad (${dailyLiters} L/día): organizad turnos por hogares y un punto central de tratamiento.`,
        batchTip:
          'Considera bidones de 20 L con grifo: facilitan el reparto y reducen contaminación cruzada.',
      };
    case 'Escuela':
      return {
        scaleNote: `Para una escuela (${dailyLiters} L/día): coordina con el personal docente; evita interrupciones por agua sucia.`,
        batchTip:
          'Establece horarios fijos de tratamiento (antes del recreo, antes del comedor) para que no falte.',
      };
    default:
      return { scaleNote: '', batchTip: '' };
  }
}

/**
 * Aplica todas las variaciones al plan ya escalado. Devuelve un plan
 * modificado: pasos con pre-paso por fuente, advertencias adicionales
 * por urgencia, tips por escala, y notas integradas.
 */
function applyContextVariations(scaled, input) {
  const out = {
    ...scaled,
    steps: [...scaled.steps],
    warnings: [...scaled.warnings],
    tips: [...(scaled.tips || [])],
  };

  // 1) Pre-paso adaptado a la fuente — se prepende como nuevo paso 1.
  const preStep = SOURCE_PRESTEPS[input.waterSource];
  if (preStep) out.steps = [preStep, ...out.steps];

  // 2) Hint por urgencia → primer aviso destacado.
  const urgencia = input.situacion?.urgencia;
  const urgHint = URGENCIA_HINTS[urgencia];
  if (urgHint) out.warnings = [urgHint, ...out.warnings];

  // 3) Escalado por grupo → tip y advertencia.
  const personas = input.situacion?.personas;
  const { scaleNote, batchTip } = scaleForGroup(personas, input.dailyLiters);
  if (scaleNote) out.warnings.push(scaleNote);
  if (batchTip) out.tips.unshift(batchTip);

  return out;
}

/**
 * Inserta los recursos custom dentro de los pasos donde encajan
 * naturalmente. Por ejemplo: si el método incluye "filtra con tela" y
 * el usuario aportó "filtro de cerámica", el filtro de cerámica se
 * inserta como mejora del paso de filtrado.
 *
 * Devuelve `{ steps, integratedItems }`.
 */
function integrateCustomResources(steps, customMaterials, methodId) {
  if (!customMaterials || customMaterials.length === 0) {
    return { steps, integratedItems: [] };
  }

  const integratedItems = [];
  const newSteps = [...steps];

  // Mapeo de patrones → en qué paso insertar mejora.
  const integrations = [
    {
      pattern: /(ceramica|cerámica|filtro de jarra|brita)/i,
      stepKeyword: /filtra|filtrar|tela/i,
      enhancer: (item) =>
        `Tras el paso anterior, pasa el agua por tu ${item}: retiene bacterias y la mayoría de protozoos.`,
    },
    {
      pattern: /(panel solar|placa solar)/i,
      stepKeyword: /sol|expon/i,
      enhancer: (item) =>
        `Aprovecha tu ${item}: si puede mover una bomba pequeña, agita el agua durante la exposición solar.`,
    },
    {
      pattern: /(pastilla|tableta).*(potabiliz)/i,
      stepKeyword: /(cloro|lejia|lejía|desinfect)/i,
      enhancer: (item) => `Alternativa equivalente: usa ${item} siguiendo la dosis del envase.`,
    },
    {
      pattern: /uv|lampara uv|steripen/i,
      stepKeyword: /(beber|listo|trasvasa)/i,
      enhancer: (item) =>
        `Como paso final extra: aplica tu ${item} sobre el agua ya tratada para máxima seguridad.`,
    },
  ];

  for (const item of customMaterials) {
    for (const rule of integrations) {
      if (rule.pattern.test(item)) {
        const idx = newSteps.findIndex((s) =>
          rule.stepKeyword.test(typeof s === 'string' ? s : s.text || s.title || '')
        );
        if (idx >= 0) {
          const insertion = rule.enhancer(item);
          newSteps.splice(idx + 1, 0, insertion);
          integratedItems.push(item);
          break;
        }
      }
    }
  }

  return { steps: newSteps, integratedItems };
}

module.exports = { applyContextVariations, integrateCustomResources };
