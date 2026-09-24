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
  /** Bárbaro nível 3 — perícia extra escolhida no Level Up (uma vez só,
   * ver `LevelUpShell.tsx` passo `conhecimentoPrimordial`) + Força no
   * lugar de outro atributo em Acrobacia/Furtividade/Intimidação/
   * Percepção/Sobrevivência enquanto a Fúria estiver ativa (ver
   * `calcularPericias`, parâmetro `substituicaoForca`). */
  conhecimentoPrimordial: 'Conhecimento Primordial',
  /** Mago nível 2 — escolha de 1 perícia entre 6 fixas (Arcanismo,
   * História, Investigação, Medicina, Natureza, Religião), sempre
   * grátis + Especialização (dobra) na escolhida. Ver
   * `LevelUpShell.tsx` passo `academico`. */
  academico: 'Acadêmico',
  /** Mago nível 18 — escolhe 1 magia de 1º e 1 de 2º círculo (tempo de
   * conjuração de Ação) do Livro de Magias; ficam sempre preparadas e
   * conjuram no círculo mais baixo sem gastar Espaço. Ver
   * `LevelUpShell.tsx` passo `maestriaDeMagias`, `core/maestriaDeMagias.ts`. */
  maestriaDeMagias: 'Maestria de Magias',
  /** Mago nível 20 — escolhe 2 magias de 3º círculo do Livro de Magias
   * (permanente, sem regra de troca); ficam sempre preparadas e cada
   * uma pode ser conjurada 1x no 3º círculo sem gastar Espaço,
   * recarregando em Descanso Curto OU Longo. Ver `LevelUpShell.tsx`
   * passo `assinaturaMagica`, `core/assinaturaMagica.ts`. */
  assinaturaMagica: 'Assinatura Mágica',
  /** Bárbaro nível 7 — Vantagem em jogadas de Iniciativa. Ver
   * `CombatTab.tsx` (`alternarIniciativa`). */
  instintosPrimitivos: 'Instintos Primitivos',
  /** Bárbaro nível 9 — com Ataque Imprudente ativo, renuncia à
   * Vantagem numa jogada de ataque pra ganhar dado extra + efeito à
   * escolha. Ver `AcaoPanelContent.tsx`/`CombatTab.tsx`. */
  golpeBrutal: 'Golpe Brutal',
  /** Bárbaro nível 13 (mais 2 efeitos) e 17 (2d10 + 2 efeitos de uma
   * vez) — MESMO nome nos 2 níveis, conte repetições com
   * `contarRepeticoesCaracteristica` (padrão de Indomável/Surto de
   * Ação) pra distinguir os 2 patamares, nunca `caracteristicaDesbloqueada`
   * sozinho. */
  golpeBrutalFortalecido: 'Golpe Brutal Fortalecido',
  /** Bárbaro nível 11 — ao cair a 0 PV com a Fúria ativa, pode tentar
   * uma salvaguarda de Constituição (CD escalando) pra voltar com PV.
   * Ver `core/furiaImplacavel.ts`, `FichaShell.tsx` (`alterarPv`). */
  furiaImplacavel: 'Fúria Implacável',
  /** Bárbaro nível 15 — recupera todos os usos gastos de Fúria 1x
   * entre Descansos Longos. Ver `FichaShell.tsx`
   * (`recuperarFuriaPersistente`). */
  furiaPersistente: 'Fúria Persistente',
  /** Bárbaro nível 18 — teste/salvaguarda de Força com total menor que
   * o valor de Força vira automaticamente esse valor. Ver
   * `core/forcaIndomavel.ts`, `RollContext.tsx`. */
  forcaIndomavel: 'Força Indomável',
  /** Bárbaro nível 20 — Força e Constituição sobem +4, até no máximo
   * 25. Ver `core/campeaoPrimitivo.ts`. */
  campeaoPrimitivo: 'Campeão Primitivo',
} as const;

export type IdCaracteristicaClasse = keyof typeof ID_CARACTERISTICA_CLASSE;
