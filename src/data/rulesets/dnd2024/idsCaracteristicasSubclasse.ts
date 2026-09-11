// Mapa de característica de SUBCLASSE (nome de exibição) -> ID estável —
// ver CLAUDE.md seção 13 ("todo código novo que reconhece regra
// programaticamente usa ID, nunca nome de exibição"). Companheiro de
// `idsCaracteristicasClasse.ts` (aquele cobre característica de CLASSE
// base; este cobre as de SUBCLASSE, lidas por
// `caracteristicaSubclasseDesbloqueada` em `core/levelUp.ts`).
//
// IMPORTANTE: esse mapa NÃO vem da planilha — é anotado à mão, igual
// ao `ID_CARACTERISTICA_CLASSE`. Cobre toda característica de
// subclasse que o código PRECISA reconhecer hoje (Bruxo/Patrono Ínfero
// + Necromante homebrew). Se o nome de exibição de uma dessas mudar
// numa revisão editorial da planilha (Bruxo) ou do PDF homebrew
// (Necromante — "ainda não é regra oficial", ver `BadgeHomebrew.tsx`),
// atualize só o valor aqui — o resto do código nunca volta a comparar
// por nome.
export const ID_CARACTERISTICA_SUBCLASSE = {
  // Bruxo — Patrono Ínfero
  magiasDePactoDoInfero: 'Magias de Pacto do Ínfero',
  palavrasDeInterrupcao: 'Palavras de Interrupção',
  periciaInigualavel: 'Perícia Inigualável',
  bencaoDoTenebroso: 'Bênção do Tenebroso',
  aSorteDoProprioTenebroso: 'A Sorte do Próprio Tenebroso',
  resistenciaInfera: 'Resistência Ínfera',
  lancarNoInferno: 'Lançar no Inferno',
  // Bruxo — genéricas (qualquer Patrono)
  proficienciasBonus: 'Proficiências Bônus',
  descobertasMagicas: 'Descobertas Mágicas',
  // Necromante (Mago, homebrew)
  grimorioDeNecromancia: 'Grimório de Necromancia',
  legiaoDosMortos: 'Legião dos Mortos',
  colheitaDosMortos: 'Colheita dos Mortos',
  mestreDaMorte: 'Mestre da Morte',
} as const;

export type IdCaracteristicaSubclasse = keyof typeof ID_CARACTERISTICA_SUBCLASSE;
