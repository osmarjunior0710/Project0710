// Mapa de característica de classe (nome de exibição) -> ID estável —
// ver CLAUDE.md seção 13 ("todo código novo que reconhece regra
// programaticamente usa ID, nunca nome de exibição").
//
// IMPORTANTE: esse campo NÃO vem da planilha — é anotado à mão, igual
// ao `efeitoMecanico` em `talentos.ts`. Cobre só as características
// que `core/levelUp.ts` PRECISA reconhecer por código hoje (ASI,
// Dádiva Épica, Estilo de Luta, Especialista/Especialização, Ataque
// Extra e variantes). Se o nome de exibição de uma dessas mudar numa
// revisão editorial da planilha (ver CLAUDE.md seção 3), atualize só
// o valor aqui — o resto do código nunca volta a comparar por nome.
export const ID_CARACTERISTICA_CLASSE = {
  asi: 'Aumento no Valor de Atributo',
  dadivaEpica: 'Dádiva Épica',
  estiloDeLuta: 'Estilo de Luta',
  especialista: 'Especialista',
  especializacao: 'Especialização',
  ataqueExtra: 'Ataque Extra',
  doisAtaquesExtras: 'Dois Ataques Extras',
  tresAtaquesExtras: 'Três Ataques Extras',
  /** Bárbaro nível 1 (também existe uma versão do Monge — não
   * implementado ainda) — CA sem armadura vira 10 + DES + CON em vez
   * do padrão 10 + DES. Ver `calcularCAEquipado`. */
  defesaSemArmadura: 'Defesa sem Armadura',
  /** Bárbaro nível 2 — Vantagem em Salvaguarda de Destreza. Ver
   * `AtributosTab.tsx`. */
  sentidoDePerigo: 'Sentido de Perigo',
  /** Bárbaro nível 2 — toggle na 1ª jogada de ataque do turno, dá
   * Vantagem em ataques baseados em Força até o Fim do Turno. Ver
   * `AcaoPanelContent.tsx`/`FichaShell.tsx`. */
  ataqueImprudente: 'Ataque Imprudente',
} as const;

export type IdCaracteristicaClasse = keyof typeof ID_CARACTERISTICA_CLASSE;
