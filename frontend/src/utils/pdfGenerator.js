import jsPDF from 'jspdf';

const MARGIN_X = 15;
const PAGE_WIDTH = 210; // A4 mm
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const SOURCE_LABELS = {
  rio: 'Río o arroyo',
  lago: 'Lago o laguna',
  pozo: 'Pozo',
  lluvia: 'Agua de lluvia',
  grifo_dudoso: 'Grifo no fiable',
  otro: 'Otra fuente',
};

/**
 * Genera y descarga un PDF con el plan de potabilización.
 * Usa jsPDF (sin dependencias extra) para mantenerlo low-cost.
 */
export function downloadPlanPDF(plan) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 20;

  const writeWrapped = (text, opts = {}) => {
    const { size = 11, bold = false, color = [40, 40, 40], gap = 5 } = opts;
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, CONTENT_WIDTH);
    for (const line of lines) {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, MARGIN_X, y);
      y += size * 0.5;
    }
    y += gap;
  };

  // Encabezado
  doc.setFillColor(40, 125, 138); // brand-600
  doc.rect(0, 0, PAGE_WIDTH, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Potabiliza Fácil — Plan personalizado', MARGIN_X, 9.5);

  y = 22;
  writeWrapped(plan.method.title, { size: 18, bold: true, color: [30, 80, 90], gap: 2 });
  writeWrapped(plan.method.summary, { size: 11, color: [80, 80, 80], gap: 4 });

  if (plan.method.difficulty) {
    writeWrapped(`Dificultad: ${plan.method.difficulty}`, {
      size: 11,
      bold: true,
      color: [40, 125, 138],
      gap: 4,
    });
  }

  // Contexto
  writeWrapped('Contexto', { size: 13, bold: true, color: [40, 125, 138] });
  const sourceText =
    plan.context.waterSource === 'otro' && plan.context.customSource
      ? `Otra: ${plan.context.customSource}`
      : SOURCE_LABELS[plan.context.waterSource] || plan.context.waterSource;
  writeWrapped(
    `Fuente: ${sourceText} • Litros/día: ${plan.context.dailyLiters} • Tiempo estimado: ${plan.estimatedTimeMinutes} min`,
    { size: 11 }
  );

  if (plan.personalizedNote) {
    writeWrapped(`Personalizado: ${plan.personalizedNote}`, {
      size: 11,
      color: [40, 100, 110],
      gap: 6,
    });
  }

  // Materiales
  writeWrapped('Materiales necesarios', { size: 13, bold: true, color: [40, 125, 138] });
  plan.materials.forEach((m) => writeWrapped(`• ${m}`, { size: 11, gap: 1 }));
  y += 4;

  // Pasos
  writeWrapped('Pasos', { size: 13, bold: true, color: [40, 125, 138] });
  plan.steps.forEach((s, i) => writeWrapped(`${i + 1}. ${s}`, { size: 11, gap: 1.5 }));
  y += 4;

  // Advertencias
  writeWrapped('Advertencias de seguridad', { size: 13, bold: true, color: [180, 80, 0] });
  plan.warnings.forEach((w) =>
    writeWrapped(`! ${w}`, { size: 11, color: [120, 60, 0], gap: 1 })
  );
  y += 4;

  // Alternativas
  if (plan.alternatives?.length) {
    writeWrapped('Alternativas', { size: 13, bold: true, color: [44, 126, 63] });
    plan.alternatives.forEach((a) =>
      writeWrapped(`→ ${a}`, { size: 11, color: [50, 90, 60], gap: 1 })
    );
    y += 4;
  }

  // Consideraciones específicas para tus recursos extra
  if (plan.customConsiderations?.length) {
    writeWrapped('Cómo usar tus recursos extra', {
      size: 13,
      bold: true,
      color: [40, 125, 138],
    });
    plan.customConsiderations.forEach((c) =>
      writeWrapped(`• ${c}`, { size: 11, color: [40, 100, 110], gap: 1 })
    );
    y += 4;
  }

  // Tips
  if (plan.tips?.length) {
    writeWrapped('Tips útiles', { size: 13, bold: true, color: [44, 126, 63] });
    plan.tips.forEach((t) =>
      writeWrapped(`💡 ${t}`, { size: 11, color: [50, 90, 60], gap: 1 })
    );
  }

  // Pie
  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.text(
    `Generado por Potabiliza Fácil — ${new Date(plan.generatedAt).toLocaleString()}`,
    MARGIN_X,
    290
  );

  const fileName = `potabiliza-facil-${plan.method.id}-${Date.now()}.pdf`;
  doc.save(fileName);
}
