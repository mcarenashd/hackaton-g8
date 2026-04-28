/**
 * Servicio que SIMULA una llamada a un LLM. La función recibe los datos del
 * formulario más el método elegido por la heurística y devuelve un plan
 * estructurado (mismo shape que devolvería un LLM con structured output).
 *
 * Para conectar a un proveedor real, basta con sustituir el cuerpo de
 * `generatePlan` por una llamada HTTP y mapear la respuesta a este shape:
 *
 * {
 *   method: { id, title, summary, difficulty },
 *   materials: string[],
 *   steps: string[],
 *   warnings: string[],
 *   alternatives: string[],
 *   tips: string[],
 *   customConsiderations: string[],
 *   estimatedTimeMinutes: number,
 *   personalizedNote: string,
 *   language: string
 * }
 */
const { buildConsiderations } = require('../utils/customResources');

const TEMPLATES = {
  ebullicion: {
    title: 'Hervido tradicional',
    summary:
      'El método más fiable cuando dispones de fuego. Elimina virus, bacterias y parásitos.',
    difficulty: 'fácil',
    materials: [
      'Olla limpia con tapa',
      'Fuente de calor (fuego, estufa o brasero)',
      'Tela limpia para pre-filtrar',
      'Recipiente con tapa para almacenar',
    ],
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
    tips: [
      'Almacena el agua hervida en un recipiente cerrado para evitar recontaminación.',
      'Si el agua tiene mal sabor tras hervir, trasvásala entre dos recipientes para airearla.',
      'Aprovecha el mismo fuego para hervir varias tandas seguidas.',
    ],
    estimatedTimeMinutes: 30,
  },

  sodis: {
    title: 'SODIS — Desinfección solar',
    summary:
      'Usa la radiación UV del sol para inactivar microorganismos. Eficaz si hay sol directo durante 6 h.',
    difficulty: 'fácil',
    materials: [
      'Botellas PET transparentes (≤ 2 L)',
      'Tela limpia',
      'Superficie reflectante (chapa, papel aluminio)',
    ],
    steps: [
      'Filtra el agua con tela limpia para que sea lo más transparente posible.',
      'Llena las botellas PET hasta 3/4 y agítalas 20 segundos para oxigenar.',
      'Termina de llenar las botellas y ciérralas.',
      'Colócalas en horizontal, expuestas al sol directo, sobre una superficie clara o metálica.',
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
    tips: [
      'Marca la fecha y hora en cada botella para llevar control de exposición.',
      'En zonas frías, una superficie negra debajo de la botella aumenta la eficacia.',
      'Reutiliza solo botellas en buen estado: cámbialas cada 6 meses si se opacan.',
    ],
    estimatedTimeMinutes: 360,
  },

  filtro_carbon: {
    title: 'Filtro casero de carbón, arena y grava',
    summary:
      'Filtra sedimentos, parte de los químicos y mejora sabor/olor. NO elimina virus por sí solo.',
    difficulty: 'media',
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
    tips: [
      'Cambia el carbón cada 1-2 semanas según uso: empieza a oler raro cuando se satura.',
      'Las primeras tandas pueden salir oscuras: descártalas hasta que el agua salga clara.',
      'Etiqueta el filtro con la fecha de montaje.',
    ],
    estimatedTimeMinutes: 45,
  },

  cloracion: {
    title: 'Cloración con lejía doméstica',
    summary:
      'Desinfección química rápida y barata. Elimina la mayoría de bacterias y virus.',
    difficulty: 'fácil',
    materials: [
      'Lejía sin perfume ni aditivos (4-6 % de hipoclorito de sodio)',
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
    tips: [
      'Guarda la lejía en lugar fresco y oscuro: pierde eficacia con el tiempo.',
      'Si el frasco lleva más de un año abierto, dobla la dosis o cambia de método.',
      'Una jeringa de 1 ml es mucho más precisa que un cuentagotas casero.',
    ],
    estimatedTimeMinutes: 35,
  },

  destilacion_solar: {
    title: 'Destilación solar de emergencia',
    summary:
      'Último recurso si solo tienes sol y plástico. Produce poca agua pero muy pura.',
    difficulty: 'avanzada',
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
    tips: [
      'En zonas calurosas, añade hojas verdes en el fondo: liberan humedad extra.',
      'Sella bien los bordes con tierra para que no escape el vapor.',
    ],
    estimatedTimeMinutes: 480,
  },
};

const SOURCE_WARNINGS = {
  rio: 'El agua de río puede arrastrar materia fecal y parásitos: el pre-filtrado es obligatorio.',
  lago: 'Los lagos suelen tener más algas y cianobacterias: filtra y nunca confíes solo en SODIS.',
  pozo: 'Si el pozo está cerca de letrinas o ganadería, considera contaminación química, no solo biológica.',
  lluvia:
    'Si recoges lluvia desde un techo, descarta los primeros minutos: arrastran polvo, excrementos de aves y plomo.',
  grifo_dudoso:
    'Si la red puede tener cortes, puede haber entrada de contaminantes por presión negativa: trata siempre antes de beber.',
  otro: 'Fuente no estándar: extrema precauciones y combina al menos dos métodos.',
};

const I18N = {
  es: { fallback: 'Plan personalizado de potabilización' },
  en: { fallback: 'Personalized water purification plan' },
  pt: { fallback: 'Plano personalizado de potabilização' },
};

function scaleByLiters(template, dailyLiters) {
  const out = {
    ...template,
    materials: [...template.materials],
    warnings: [...template.warnings],
    tips: [...(template.tips || [])],
  };
  if (dailyLiters >= 10) {
    out.warnings.push(
      `Necesitas ${dailyLiters} L/día: planifica varias tandas o duplica los recipientes.`
    );
  }
  if (dailyLiters >= 20) {
    out.tips.push('Para volúmenes grandes, considera procesar por lotes durante el día.');
  }
  return out;
}

function buildPersonalizedNote(input) {
  const fragments = [];
  if (input.customMaterials?.length) {
    fragments.push(
      `Hemos considerado tus materiales adicionales: ${input.customMaterials.join(', ')}.`
    );
  }
  if (input.customResources?.length) {
    fragments.push(
      `También hemos tenido en cuenta: ${input.customResources.join(', ')}.`
    );
  }
  if (input.waterSource === 'otro' && input.customSource) {
    fragments.push(`Fuente declarada: "${input.customSource}".`);
  }
  return fragments.join(' ');
}

async function generatePlan(input, methodId) {
  // Simulamos latencia de un LLM real.
  await new Promise((r) => setTimeout(r, 350));

  const base = TEMPLATES[methodId] || TEMPLATES.filtro_carbon;
  const scaled = scaleByLiters(base, input.dailyLiters);
  const lang = input.language || 'es';

  // Advertencia contextual según fuente de agua.
  const sourceWarning = SOURCE_WARNINGS[input.waterSource];
  if (sourceWarning) scaled.warnings.unshift(sourceWarning);

  // Si el usuario aportó materiales custom, los reflejamos en la lista.
  const finalMaterials = [...scaled.materials];
  if (input.customMaterials?.length) {
    finalMaterials.push(
      ...input.customMaterials.map((m) => `${m} (aportado por ti)`)
    );
  }

  // Consejos específicos por cada item custom que aportó el usuario.
  const customConsiderations = buildConsiderations({
    customMaterials: input.customMaterials || [],
    customResources: input.customResources || [],
  });

  return {
    method: {
      id: methodId,
      title: scaled.title,
      summary: scaled.summary,
      difficulty: scaled.difficulty,
    },
    context: {
      waterSource: input.waterSource,
      waterSourceLabel:
        input.waterSource === 'otro' && input.customSource
          ? input.customSource
          : input.waterSource,
      dailyLiters: input.dailyLiters,
      userMaterials: input.materials,
      userResources: input.resources,
      customMaterials: input.customMaterials || [],
      customResources: input.customResources || [],
      customSource: input.customSource || '',
    },
    materials: finalMaterials,
    steps: scaled.steps,
    warnings: scaled.warnings,
    alternatives: scaled.alternatives,
    tips: scaled.tips,
    customConsiderations,
    estimatedTimeMinutes: scaled.estimatedTimeMinutes,
    personalizedNote: buildPersonalizedNote(input),
    language: lang,
    generatedAt: new Date().toISOString(),
    headline: I18N[lang]?.fallback || I18N.es.fallback,
  };
}

module.exports = { generatePlan };
