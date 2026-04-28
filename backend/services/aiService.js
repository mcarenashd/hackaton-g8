/**
 * Servicio que SIMULA una llamada a un LLM. La función recibe los datos del
 * formulario más el método elegido por la heurística y devuelve un plan
 * estructurado (mismo shape que devolvería un LLM con structured output).
 *
 * Para conectar a un proveedor real, basta con sustituir el cuerpo de
 * `generatePlan` por una llamada HTTP y mapear la respuesta a este shape:
 *
 * {
 *   method: { id, title, summary },
 *   materials: string[],
 *   steps: string[],
 *   warnings: string[],
 *   alternatives: string[],
 *   estimatedTimeMinutes: number,
 *   language: string
 * }
 */

const TEMPLATES = {
  ebullicion: {
    title: 'Hervido tradicional',
    summary:
      'El método más fiable cuando dispones de fuego. Elimina virus, bacterias y parásitos.',
    materials: ['Olla limpia', 'Fuente de calor (fuego o estufa)', 'Tela limpia para pre-filtrar'],
    steps: [
      'Pre-filtra el agua a través de una tela limpia para retirar sedimentos visibles.',
      'Vierte el agua en una olla limpia, sin llenarla del todo.',
      'Lleva el agua a ebullición fuerte (burbujeo continuo).',
      'Mantén el hervor durante al menos 1 minuto (3 minutos si estás a más de 2.000 m de altitud).',
      'Tapa la olla y deja enfriar el agua sin destaparla.',
      'Trasvasa a un recipiente limpio con tapa para almacenarla.',
    ],
    warnings: [
      'No reutilices recipientes que hayan contenido productos químicos.',
      'No bebas el agua hasta que esté tibia o fría: el vapor también puede quemar.',
      'Si el agua sigue turbia tras hervir, vuelve a filtrarla.',
    ],
    alternatives: [
      'Si no tienes olla, puedes usar una lata metálica resistente.',
      'Si te falta combustible, considera el método SODIS (sol + botella PET).',
    ],
    estimatedTimeMinutes: 30,
  },

  sodis: {
    title: 'SODIS — Desinfección solar',
    summary:
      'Usa la radiación UV del sol para inactivar microorganismos. Eficaz si hay sol directo durante 6 h.',
    materials: ['Botellas PET transparentes (≤ 2 L)', 'Tela limpia', 'Superficie reflectante (opcional)'],
    steps: [
      'Filtra el agua con tela limpia para que sea lo más transparente posible.',
      'Llena las botellas PET hasta 3/4 y agítalas 20 segundos para oxigenar.',
      'Termina de llenar las botellas y ciérralas.',
      'Colócalas en posición horizontal, expuestas al sol directo, sobre una superficie clara o metálica.',
      'Espera al menos 6 horas con sol fuerte (2 días si está nublado).',
      'Bebe directamente de la botella o trasvasa a recipiente limpio.',
    ],
    warnings: [
      'No uses botellas de vidrio: bloquean parte de la radiación UV-A.',
      'No uses botellas rayadas u opacas; reduce drásticamente la eficacia.',
      'Si el agua está muy turbia, SODIS NO es suficiente: combina con filtrado o hervido.',
    ],
    alternatives: [
      'Si está muy nublado, complementa con cloración (2 gotas de lejía sin perfume por litro).',
      'Si tienes fuego, prefiere hervir: es más rápido y seguro.',
    ],
    estimatedTimeMinutes: 360,
  },

  filtro_carbon: {
    title: 'Filtro casero de carbón, arena y grava',
    summary:
      'Filtra sedimentos, parte de los químicos y mejora sabor/olor. NO elimina virus por sí solo.',
    materials: [
      'Botella PET de 2 L cortada por la base',
      'Tela limpia o algodón',
      'Carbón vegetal triturado (no briquetas con químicos)',
      'Arena fina lavada',
      'Grava o piedras pequeñas lavadas',
      'Recipiente limpio para recoger el agua',
    ],
    steps: [
      'Corta la base de la botella PET y haz pequeños agujeros en el tapón.',
      'Coloca la botella boca abajo, con el tapón hacia abajo, sobre el recipiente.',
      'Pon una capa de tela/algodón junto al tapón.',
      'Añade una capa de carbón vegetal triturado (~5 cm).',
      'Sobre el carbón, añade una capa de arena fina (~5 cm).',
      'Encima, una capa de grava lavada (~5 cm).',
      'Vierte el agua despacio por arriba y recoge el filtrado abajo.',
      'Hierve o desinfecta el agua filtrada antes de beber.',
    ],
    warnings: [
      'Este filtro NO elimina virus ni todas las bacterias por sí solo.',
      'SIEMPRE combina con hervido, SODIS o cloración antes de beber.',
      'Lava muy bien arena y grava antes de usarlas.',
    ],
    alternatives: [
      'Si no tienes carbón, omite esa capa pero dobla el filtrado y añade cloración.',
      'Si no tienes arena, una tela densa puede sustituir parcialmente.',
    ],
    estimatedTimeMinutes: 45,
  },

  cloracion: {
    title: 'Cloración con lejía doméstica',
    summary:
      'Desinfección química rápida y barata. Elimina la mayoría de bacterias y virus.',
    materials: [
      'Lejía sin perfume ni aditivos (4–6 % de hipoclorito de sodio)',
      'Recipiente limpio con tapa',
      'Tela limpia para pre-filtrar',
      'Cuentagotas o jeringa pequeña',
    ],
    steps: [
      'Pre-filtra el agua con una tela limpia.',
      'Mide 2 gotas de lejía por cada litro de agua clara (4 gotas si está turbia).',
      'Agita el recipiente y déjalo reposar tapado 30 minutos.',
      'Comprueba que el agua tiene un ligero olor a cloro; si no, añade 1 gota más y espera 15 minutos.',
      'Si el sabor a cloro es muy fuerte, trasvasa entre dos recipientes para airear.',
    ],
    warnings: [
      'Usa solo lejía SIN perfume ni jabón.',
      'No mezcles con vinagre, amoníaco u otros productos.',
      'No es eficaz contra Cryptosporidium ni Giardia: en zonas de riesgo, hierve o filtra antes.',
    ],
    alternatives: [
      'Si no tienes lejía, usa pastillas potabilizadoras siguiendo el dosaje del envase.',
      'Si tienes fuego, hervir es más universal y seguro.',
    ],
    estimatedTimeMinutes: 35,
  },

  destilacion_solar: {
    title: 'Destilación solar de emergencia',
    summary:
      'Último recurso si solo tienes sol y plástico. Produce poca agua pero muy pura.',
    materials: [
      'Plástico transparente grande',
      'Recipiente limpio (vaso o lata)',
      'Recipiente más grande o agujero en la tierra',
      'Piedra pequeña',
    ],
    steps: [
      'Cava un agujero o usa un recipiente grande; pon el agua sucia en el fondo.',
      'Coloca el vaso limpio en el centro, sin que entre agua sucia.',
      'Cubre todo con el plástico transparente, sellando los bordes con tierra o piedras.',
      'Pon una piedra pequeña en el centro del plástico para que apunte hacia el vaso.',
      'Espera varias horas bajo sol directo: el agua se evapora y se condensa goteando al vaso.',
      'Recupera el agua condensada del vaso central.',
    ],
    warnings: [
      'Produce muy poca agua: solo para emergencias.',
      'No sirve si no hay sol fuerte.',
      'No elimina compuestos químicos volátiles que evaporan junto al agua.',
    ],
    alternatives: [
      'Si dispones de cualquier otro método, prefiérelo: este es el menos eficiente.',
    ],
    estimatedTimeMinutes: 480,
  },
};

const I18N = {
  es: { fallback: 'Plan personalizado de potabilización' },
  en: { fallback: 'Personalized water purification plan' },
  pt: { fallback: 'Plano personalizado de potabilização' },
};

function scaleByLiters(template, dailyLiters) {
  // Pequeño ajuste: si necesita muchos litros, añadir advertencia y materiales.
  const out = {
    ...template,
    materials: [...template.materials],
    warnings: [...template.warnings],
  };
  if (dailyLiters >= 10) {
    out.warnings.push(
      `Necesitas ${dailyLiters} L/día: planifica varias tandas o duplica los recipientes.`
    );
  }
  return out;
}

async function generatePlan(input, methodId) {
  // Simulamos latencia de un LLM real.
  await new Promise((r) => setTimeout(r, 350));

  const base = TEMPLATES[methodId] || TEMPLATES.filtro_carbon;
  const scaled = scaleByLiters(base, input.dailyLiters);
  const lang = input.language || 'es';

  return {
    method: {
      id: methodId,
      title: scaled.title,
      summary: scaled.summary,
    },
    context: {
      waterSource: input.waterSource,
      dailyLiters: input.dailyLiters,
      userMaterials: input.materials,
      userResources: input.resources,
    },
    materials: scaled.materials,
    steps: scaled.steps,
    warnings: scaled.warnings,
    alternatives: scaled.alternatives,
    estimatedTimeMinutes: scaled.estimatedTimeMinutes,
    language: lang,
    generatedAt: new Date().toISOString(),
    headline: I18N[lang]?.fallback || I18N.es.fallback,
  };
}

module.exports = { generatePlan };
