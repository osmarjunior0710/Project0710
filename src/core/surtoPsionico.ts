// Surto Psiônico (Psiônico, nível 7) — "Além disso, após rolar um ou
// mais Dados de Energia Psiônica, você pode gastar um de seus Dados de
// Vida para tratar qualquer resultado de 1, 2 ou 3 nesses dados como
// se fosse 4." (a planilha grafa "Dados de Energia Psíquica" nessa
// frase — mesmo recurso "Dados de Energia Psiônica" do resto da
// classe). Sem rolar o Dado de Vida — é só consumido, não como cura.
// [codeimplementation]

export function temSurtoPsionico(nivelPsionico: number): boolean {
  return nivelPsionico >= 7;
}

/** Quantos valores ≤3 existem num conjunto de Dados de Energia
 * Psiônica já rolados — 0 = nada a melhorar (Surto não deveria nem
 * ser oferecido). */
export function dadosElegiveisSurtoPsionico(valores: number[]): number {
  return valores.filter((v) => v <= 3).length;
}

/** Aplica a regra: cada valor ≤3 vira 4, o resto fica intacto. */
export function aplicarSurtoPsionicoEmValores(valores: number[]): number[] {
  return valores.map((v) => (v <= 3 ? 4 : v));
}
