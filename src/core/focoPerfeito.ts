// Foco Perfeito (Monge, nível 15) — "Ao jogar Iniciativa e não usar
// Metabolismo Incomum, você recupera Pontos de Foco gastos até ter 4, se
// tiver 3 ou menos." [codeimplementation]

/** Quantos Pontos de Foco o Foco Perfeito devolve (0 = nada). */
export function pontosDeFocoRecuperadosFocoPerfeito(nivelMonge: number, pontosDeFocoRestantes: number): number {
  if (nivelMonge < 15 || pontosDeFocoRestantes > 3) return 0;
  return 4 - Math.max(0, pontosDeFocoRestantes);
}
