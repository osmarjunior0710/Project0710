// Fúria Implacável (Bárbaro nível 11) — ao atingir 0 PV com a Fúria
// ativa, pode tentar uma salvaguarda de Constituição (CD escalando
// +5 a cada uso desde o último descanso) pra voltar com PV. Mesmo
// formato de `core/vigorImplacavel.ts` (transição PV > 0 -> PV = 0),
// mas NUNCA aplica sozinho — é opcional e o app não modela a
// salvaguarda em si (o jogador rola a própria Salvaguarda de
// Constituição na aba Atributos e diz se passou), então isso só
// decide QUANDO oferecer o modal, nunca o resultado.

/** `true` = oferece o modal de Fúria Implacável nesta alteração de PV
 * — só na transição de PV > 0 pra PV = 0, com a Fúria ativa. Dispara
 * de novo a cada vez que isso acontecer (sem "já gasto"); só a CD
 * escala, não o direito de tentar. */
export function deveOferecerFuriaImplacavel(pvAntes: number, pvDepoisSemRegra: number, furiaAtiva: boolean): boolean {
  return furiaAtiva && pvAntes > 0 && pvDepoisSemRegra === 0;
}

/** CD da salvaguarda — 10 na 1ª vez desde o último descanso, +5 a
 * cada uso seguinte (`usos` = quantas vezes já tentou desde então). */
export function cdFuriaImplacavel(usos: number): number {
  return 10 + 5 * usos;
}

/** PV ao passar na salvaguarda — 2x o nível NA CLASSE Bárbaro
 * (nunca o nível total do personagem, em caso de Multiclasse). */
export function pvFuriaImplacavel(nivelBarbaro: number): number {
  return nivelBarbaro * 2;
}
