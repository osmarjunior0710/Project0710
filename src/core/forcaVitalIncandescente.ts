// Força Vital Incandescente (Psiônico, nível 20) — "Você queima sua
// força vital para alcançar poderes psíquicos superiores. Uma vez por
// turno, ao rolar um ou mais Dados de Energia Psiônica para uma
// habilidade Psion ou Disciplina Psiônica, você pode gastar um ou dois
// de seus Dados de Pontos de Vida. Para cada Dado de Pontos de Vida
// gasto, role um Dado de Energia Psiônica adicional e some os números
// rolados ao total. Essa rolagem não consome o Dado de Energia
// Psiônica." [codeimplementation]

export function temForcaVitalIncandescente(nivelPsionico: number): boolean {
  return nivelPsionico >= 20;
}

/** Quantos Dados de Vida dá pra oferecer agora — nunca mais do que o
 * jogador tem disponível (qualquer tipo, somados), e no máximo 2
 * (limite da própria regra). 0 = não oferece nada. */
export function maximoDadosDeVidaForcaVital(dadosDeVidaRestantesTotal: number): 0 | 1 | 2 {
  if (dadosDeVidaRestantesTotal <= 0) return 0;
  return dadosDeVidaRestantesTotal >= 2 ? 2 : 1;
}
