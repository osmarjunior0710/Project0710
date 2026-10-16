// Retaliação Psíquica (Psiônico, UA) — "Imediatamente após uma criatura que
// você possa ver realizar um ataque contra você, você pode usar uma Reação
// para gastar um Dado de Energia Psiônica, rolar o dado e reduzir o dano
// recebido do ataque em um valor igual a duas vezes o número rolado mais o
// seu modificador de Inteligência (mínimo de dois). Além disso, você pode
// forçar o atacante a fazer um teste de resistência de Sabedoria. Em caso de
// falha, o alvo sofre dano Psíquico igual ao dano que você reduziu."
// O app não modela PV/dano de monstro (mesmo caso de Defletir Ataques,
// Ataque de Sopro, Lançar no Inferno etc.) — só rola e mostra os números já
// calculados, junto, na hora; quem aplica na mesa é o jogador.
// [codeimplementation]

import type { ExplicacaoCalculo } from './calculoPersonagem';
import { fmtMod } from './calculoPersonagem';

export function temRetaliacaoPsiquica(disciplinasConhecidas: string[]): boolean {
  return disciplinasConhecidas.includes('retaliacao-psiquica');
}

export function podeAtivarRetaliacaoPsiquica(disciplinasConhecidas: string[], dadosRestantes: number): boolean {
  return temRetaliacaoPsiquica(disciplinasConhecidas) && dadosRestantes > 0;
}

/** Redução de dano (e, se o atacante falhar na salvaguarda, o dano Psíquico
 * que ele sofre — mesmo valor) — "duas vezes o número rolado mais o
 * modificador de Inteligência, mínimo de dois". */
export function reducaoRetaliacaoPsiquica(dadoRolado: number, modInt: number): number {
  return Math.max(2, 2 * dadoRolado + modInt);
}

/** Quebra (ⓘ) da conta acima — "2× o dado rolado + mod. Inteligência,
 * mínimo 2" — pra mostrar na tela como o valor de redução foi calculado. */
export function explicarReducaoRetaliacaoPsiquica(dadoRolado: number, modInt: number): ExplicacaoCalculo {
  const bruto = 2 * dadoRolado + modInt;
  return {
    linhas: [
      { label: `Dado rolado (${dadoRolado}) × 2`, valor: `${2 * dadoRolado}` },
      { label: 'Modificador de Inteligência', valor: fmtMod(modInt) },
    ],
    total: { label: 'Redução de dano (mínimo 2)', valor: `${Math.max(2, bruto)}` },
  };
}
