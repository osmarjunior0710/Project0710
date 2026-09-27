// Progressão de magia (Magias Preparadas + Espaços de Magia 1º-5º
// Círculo) dos "meio-conjuradores" — Guardião e Paladino. Confirmada
// IDÊNTICA, número por número, entre as duas classes na planilha
// (`Progressão de Classe`) — ver DECISOES-DADOS.md "Progressão de
// círculo dos meio-conjuradores". Tabela oficial, nunca calcular por
// fórmula (mesma regra já registrada pra Magias Preparadas em geral).

import type { RecursoClasse } from './classes';

interface NivelMeioConjurador {
  magiasPreparadas: number;
  /** Espaços de Magia, índice 0 = 1º Círculo até índice 4 = 5º Círculo. */
  espacos: [number, number, number, number, number];
}

const PROGRESSAO_MEIO_CONJURADOR: Record<number, NivelMeioConjurador> = {
  1: { magiasPreparadas: 2, espacos: [2, 0, 0, 0, 0] },
  2: { magiasPreparadas: 3, espacos: [2, 0, 0, 0, 0] },
  3: { magiasPreparadas: 4, espacos: [3, 0, 0, 0, 0] },
  4: { magiasPreparadas: 5, espacos: [3, 0, 0, 0, 0] },
  5: { magiasPreparadas: 6, espacos: [4, 2, 0, 0, 0] },
  6: { magiasPreparadas: 6, espacos: [4, 2, 0, 0, 0] },
  7: { magiasPreparadas: 7, espacos: [4, 3, 0, 0, 0] },
  8: { magiasPreparadas: 7, espacos: [4, 3, 0, 0, 0] },
  9: { magiasPreparadas: 9, espacos: [4, 3, 2, 0, 0] },
  10: { magiasPreparadas: 9, espacos: [4, 3, 2, 0, 0] },
  11: { magiasPreparadas: 10, espacos: [4, 3, 3, 0, 0] },
  12: { magiasPreparadas: 10, espacos: [4, 3, 3, 0, 0] },
  13: { magiasPreparadas: 11, espacos: [4, 3, 3, 1, 0] },
  14: { magiasPreparadas: 11, espacos: [4, 3, 3, 1, 0] },
  15: { magiasPreparadas: 12, espacos: [4, 3, 3, 2, 0] },
  16: { magiasPreparadas: 12, espacos: [4, 3, 3, 2, 0] },
  17: { magiasPreparadas: 14, espacos: [4, 3, 3, 3, 1] },
  18: { magiasPreparadas: 14, espacos: [4, 3, 3, 3, 1] },
  19: { magiasPreparadas: 15, espacos: [4, 3, 3, 3, 2] },
  20: { magiasPreparadas: 15, espacos: [4, 3, 3, 3, 2] },
};

function porNivel(campo: (n: NivelMeioConjurador) => number): Record<number, number> {
  const out: Record<number, number> = {};
  for (let nivel = 1; nivel <= 20; nivel++) out[nivel] = campo(PROGRESSAO_MEIO_CONJURADOR[nivel]);
  return out;
}

/** `RecursoClasse[]` prontos pra entrar no array `recursos` de
 * Guardião/Paladino em `classes.ts` (junto dos recursos próprios de
 * cada classe, ex: Maestria em Arma, Canalizar Divindade). */
export function recursosDeMagiaMeioConjurador(): RecursoClasse[] {
  return [
    { nome: 'Magias Preparadas', recuperaEm: null, valorPorNivel: porNivel((n) => n.magiasPreparadas) },
    { nome: 'Espaços de Magia — 1º Círculo', recuperaEm: 'Descanso Longo', valorPorNivel: porNivel((n) => n.espacos[0]) },
    { nome: 'Espaços de Magia — 2º Círculo', recuperaEm: 'Descanso Longo', valorPorNivel: porNivel((n) => n.espacos[1]) },
    { nome: 'Espaços de Magia — 3º Círculo', recuperaEm: 'Descanso Longo', valorPorNivel: porNivel((n) => n.espacos[2]) },
    { nome: 'Espaços de Magia — 4º Círculo', recuperaEm: 'Descanso Longo', valorPorNivel: porNivel((n) => n.espacos[3]) },
    { nome: 'Espaços de Magia — 5º Círculo', recuperaEm: 'Descanso Longo', valorPorNivel: porNivel((n) => n.espacos[4]) },
  ];
}
