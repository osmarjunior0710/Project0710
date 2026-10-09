// Explosão Elemental (Monge, Combatente dos Elementos, nível 6) — "Como uma
// ação Usar Magia, você pode gastar 2 Pontos de Foco para fazer com que
// energia elemental exploda em uma Esfera de 6 metros de raio centrada em um
// ponto a até 36 metros de você. Escolha um tipo de dano: Ácido, Elétrico,
// Gélido, Ígneo ou Trovejante. Cada criatura na Esfera deve realizar uma
// salvaguarda de Destreza. Se falhar, uma criatura sofre dano do tipo
// escolhido igual a três jogadas de seus dados de Artes Marciais. Em caso de
// sucesso, uma criatura sofre metade do dano." [codeimplementation]

import { SUBCLASSE_ELEMENTOS } from './sintoniaElemental';

export const CUSTO_FOCO_EXPLOSAO_ELEMENTAL = 2;
export const DADOS_EXPLOSAO_ELEMENTAL = 3;

export function temExplosaoElemental(nivelMonge: number, subclasseMonge: string | null | undefined): boolean {
  return nivelMonge >= 6 && subclasseMonge === SUBCLASSE_ELEMENTOS;
}

export function podeUsarExplosaoElemental(
  nivelMonge: number,
  subclasseMonge: string | null | undefined,
  pontosDeFocoRestantes: number,
): boolean {
  return temExplosaoElemental(nivelMonge, subclasseMonge) && pontosDeFocoRestantes >= CUSTO_FOCO_EXPLOSAO_ELEMENTAL;
}

/** Fórmula do dano: 3 jogadas do dado de Artes Marciais, sem modificador. */
export function formulaDanoExplosaoElemental(ladosArtesMarciais: number): string {
  return `${DADOS_EXPLOSAO_ELEMENTAL}d${ladosArtesMarciais}`;
}

/** Sucesso na salvaguarda = metade do dano (arredonda pra baixo, regra geral). */
export function metadeDoDanoDaExplosao(danoTotal: number): number {
  return Math.floor(danoTotal / 2);
}
