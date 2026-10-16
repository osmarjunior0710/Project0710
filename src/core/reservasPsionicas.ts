// Reservas Psiônicas (Psiônico, nível 18) — "Ao rolar a Iniciativa,
// você recupera os usos gastos de Dados de Energia Psiônica até ter
// quatro, caso tenha menos que isso." Automático — sem escolha do
// jogador (mesmo molde de Foco Perfeito do Monge, core/focoPerfeito.ts).
// [codeimplementation]

/** Quantos Dados de Energia Psiônica a Reservas Psiônicas devolve (0 = nada). */
export function dadosRecuperadosReservasPsionicas(nivelPsionico: number, dadosEnergiaRestantes: number): number {
  if (nivelPsionico < 18 || dadosEnergiaRestantes > 3) return 0;
  return 4 - Math.max(0, dadosEnergiaRestantes);
}
