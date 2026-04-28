/**
 * Convierte un File (de un input file con capture="environment") en
 * data URL base64 listo para enviar al endpoint /api/vision.
 *
 * También redimensiona a un máximo razonable (1024px lado mayor) para
 * que la subida sea rápida — los modelos de visión de Azure OpenAI no
 * necesitan más resolución que esa.
 */
export async function fileToDataUrl(file, maxSide = 1024) {
  if (!file) throw new Error('No file');

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Redimensionar via canvas para evitar fotos 12 MP del móvil.
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl); // si falla, mandamos el original
    img.src = dataUrl;
  });
}
