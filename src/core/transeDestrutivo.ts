// Transe Destrutivo (Psiônico, subclasse Psicinético, nível 6) — "No início do seu turno, você
// pode gastar um Dado de Energia Psiônica para entrar em um estado destrutivo. Pelos próximos 10
// minutos, você ganha Deslocamento de Voo de 20 pés e pode pairar. Além disso, sempre que você
// conjurar uma magia usando um espaço de magia, pode rolar seu Dado de Energia Psiônica e
// adicionar o valor rolado a uma rolagem de dano dessa magia. Essa rolagem não consome o Dado de
// Energia Psiônica." O Deslocamento de Voo é só texto informativo (o app não rastreia
// movimento/voo). A ativação em si (gastar 1 Dado de Energia, entrar no estado) dura 10 minutos —
// não bate com nenhum gatilho automático do app, então encerra manual (mesmo caso de Mente
// Aguçada); Descanso Curto (1h) e Longo (8h) encerram sozinhos, por serem bem mais longos.
// [codeimplementation]

export function podeAtivarTranseDestrutivo(disponivel: boolean, dadosRestantes: number): boolean {
  return disponivel && dadosRestantes > 0;
}

/** O bônus de dano (rolar o Dado de Energia Psiônica GRÁTIS e somar) exige: característica
 * disponível, estado ativo, e a magia ter usado um Espaço de Magia DE VERDADE — mesmo par
 * `circuloUsado`/`gastouEspacoDeVerdade` já usado pela Colheita Macabra
 * (`core/conjurarMagia.ts`), pra excluir truque e magia concedida de graça sem gastar espaço
 * nenhum. Nunca checa `dadosRestantes`: a regra explicitamente diz que essa rolagem não consome
 * o Dado de Energia Psiônica, então não existe estado de "sem dados" aqui. */
export function transeDestrutivoDanoElegivel(disponivel: boolean, ativo: boolean, circuloUsado: number, gastouEspacoDeVerdade: boolean): boolean {
  return disponivel && ativo && gastouEspacoDeVerdade && circuloUsado > 0;
}
