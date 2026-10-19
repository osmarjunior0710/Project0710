// Técnicas Telecinéticas (Psiônico, subclasse Psicinético, nível 3) —
// "Ao usar Propulsão Telecinética, você pode rolar 1d4 e usar o número
// rolado em vez de gastar um Dado de Energia Psiônica. Além disso,
// quando um alvo falha no teste de resistência contra sua Propulsão
// Telecinética, você pode impor um dos seguintes efeitos a esse alvo:
// Impulso (+3m de velocidade até o início do seu próximo turno),
// Desorientar (sem Ataques de Oportunidade até o início do seu próximo
// turno) ou Projétil Telecinético (dano de Força igual ao valor rolado
// no dado usado na Propulsão — Dado de Energia Psiônica ou o 1d4
// novo)." [codeimplementation]

export function temTecnicasTelecineticas(nivelPsionico: number): boolean {
  return nivelPsionico >= 3;
}

/** Mesmos nomes exibidos nos `opt-card` do popup de escolha (`EscolherEfeitoModal`) — nome
 * dobra como texto mostrado E como chave de comparação, mesmo padrão de `EFEITOS_GOLPE_BRUTAL`. */
export type EfeitoTecnicasTelecineticas = 'Nenhum' | 'Impulso' | 'Desorientar' | 'Projétil Telecinético';

/** Dano de Força do Projétil Telecinético — sempre igual ao valor que
 * saiu no dado usado pra Propulsão Telecinética (Dado de Energia
 * Psiônica ou o 1d4 de Técnicas Telecinéticas), nunca uma rolagem
 * própria nova. */
export function danoProjetilTelecinetico(valorDoDadoDaPropulsao: number): number {
  return valorDoDadoDaPropulsao;
}
