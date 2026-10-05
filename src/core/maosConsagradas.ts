// Mãos Consagradas (Paladino) — 1 toque só pode curar PV E remover
// condição(ões) ao mesmo tempo (regra real, livro Cap. 3: "você também
// pode gastar 5 desses Pontos de Vida pra curar [condição]..." — o
// Toque Restaurador nível 14 só adiciona mais condições à lista, não
// troca exclusivamente com curar). Custo total = PV pra curar + 5 por
// condição marcada, tudo descontado da MESMA reserva de uma vez.

/** As 6 condições que o Toque Restaurador (nível 14) adiciona, além do
 * Envenenado que a Mãos Consagradas base (nível 1) já remove. */
export const CONDICOES_TOQUE_RESTAURADOR = ['Amedrontado', 'Atordoado', 'Cego', 'Enfeitiçado', 'Paralisado', 'Surdo'];

/** Condições disponíveis pra remover com Mãos Consagradas no nível
 * atual — Envenenado sempre (nível 1), as outras 6 só com Toque
 * Restaurador (nível 14+). */
export function condicoesDisponiveisMaosConsagradas(temToqueRestaurador: boolean): string[] {
  return temToqueRestaurador ? ['Envenenado', ...CONDICOES_TOQUE_RESTAURADOR] : ['Envenenado'];
}

/** Custo total em PV de um único toque de Mãos Consagradas — soma da
 * cura escolhida com 5 PV por condição marcada (nunca restaura PV,
 * só desconta da reserva). */
export function custoTotalMaosConsagradas(pontosCurar: number, numCondicoes: number): number {
  return pontosCurar + 5 * numCondicoes;
}
