// Mecânica das 4 Disciplinas Psiônicas que disparam ao conjurar uma magia (Entrega 4c, ver
// sdd/sdd-psionico.md e core/disciplinasPsionicas.ts `disciplinaParaConjuracao`). Cada uma vira 1
// função própria aqui (CLAUDE.md seção 12.1), mesmo as 2 que são só o valor bruto do dado — marco de
// existência que bate com o dado (`statusImplementacao: 'codeimplementation'` em disciplinasPsionicas.ts).

/** Aperfeiçoamento de Precognição — [codeimplementation]. O bônus concedido é o próprio valor rolado,
 * sem soma — a função existe só como marco (ver comentário do arquivo). */
export function bonusAperfeicoamentoDePrecognicao(dadoRolado: number): number {
  return dadoRolado;
}

/** Insinuação do Id — [codeimplementation]. A redução no teste de resistência do alvo é o próprio
 * valor rolado, sem soma — mesma observação do Aperfeiçoamento de Precognição acima. */
export function reducaoInsinuacaoDoId(dadoRolado: number): number {
  return dadoRolado;
}

/** Bio-Retorno — [codeimplementation]. PV Temporário = soma dos dados rolados + mod. de Inteligência,
 * mínimo de 1 (texto literal: "mínimo de um"). `somaDados` é o total já rolado (0 quando não sobrou
 * dado nenhum pra rolar — mod. de Inteligência 0 ou negativo). */
export function pvTemporarioBioRetorno(somaDados: number, modInt: number): number {
  return Math.max(1, somaDados + modInt);
}

/** Pensamentos Destrutivos — [codeimplementation]. Dano Psíquico extra = soma dos dados rolados +
 * mod. de Inteligência, mínimo de 1 — aplica mesmo se o alvo passar no teste de resistência. */
export function danoPensamentosDestrutivos(somaDados: number, modInt: number): number {
  return Math.max(1, somaDados + modInt);
}
