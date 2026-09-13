/** Detecção de suporte a WebGL do aparelho — mesma checagem clássica
 * usada por engines 3D em geral (tenta criar um contexto WebGL2/WebGL
 * num `<canvas>` descartável, sem montar nada na tela). `@3d-dice/
 * dice-box` (BabylonJS por trás) precisa disso pra funcionar; sem
 * suporte, o Dado 3D (Fase B, ver `sdd/sdd-dado-3d.md`) cai pro 2D
 * automaticamente, mesmo com a preferência do jogador marcada em 3D. */
export function suportaWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}
