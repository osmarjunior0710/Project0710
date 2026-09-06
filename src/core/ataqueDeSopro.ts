// Ataque de Sopro (Draconato) — quantidade de d10 escala por nível de
// personagem: 1d10 (1-4), 2d10 (5-10), 3d10 (11-16), 4d10 (17+).

export function dadosAtaqueDeSopro(nivel: number): number {
  if (nivel >= 17) return 4;
  if (nivel >= 11) return 3;
  if (nivel >= 5) return 2;
  return 1;
}
