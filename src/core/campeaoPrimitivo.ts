import type { Atributo } from '../data/wizardFixtures';

/** Campeão Primitivo (Bárbaro nível 20) — Força e Constituição sobem
 * +4 cada, até no máximo 25. Automático, sem escolha do jogador
 * (mesmo espírito de um Aumento no Valor de Atributo, só que sem
 * decisão) — por isso quem chama isso nunca pergunta nada, só aplica.
 * Não afeta nenhum atributo além de Força/Constituição. */
export function aplicarCampeaoPrimitivo(valorBase: number, atributo: Atributo, temCaracteristica: boolean): number {
  if (!temCaracteristica || (atributo !== 'FOR' && atributo !== 'CON')) return valorBase;
  return Math.min(25, valorBase + 4);
}
