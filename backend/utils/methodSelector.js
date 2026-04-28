/**
 * Heurística sencilla para elegir un método de potabilización según los
 * recursos del usuario. El orden refleja una jerarquía de eficacia/seguridad.
 *
 * Métodos soportados:
 *  - "ebullicion": fuego + olla
 *  - "sodis": sol + botellas PET transparentes
 *  - "filtro_carbon": tela + carbón vegetal + arena/grava
 *  - "cloracion": cloro/lejía sin perfume
 *  - "destilacion_solar": sol + plástico + recipiente (último recurso)
 */
function selectMethod({ materials = [], resources = [] }) {
  const has = (key) => materials.includes(key) || resources.includes(key);

  if (has('fuego') && has('olla')) return 'ebullicion';
  if (has('sol') && has('botellas_plastico')) return 'sodis';
  if (has('cloro')) return 'cloracion';
  if (has('tela') && (has('carbon') || has('arena'))) return 'filtro_carbon';
  if (has('sol') && has('plastico')) return 'destilacion_solar';

  // Fallback: el método más universal si solo hay tela.
  return 'filtro_carbon';
}

module.exports = { selectMethod };
