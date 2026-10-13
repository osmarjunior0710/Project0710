// Defesa Psiônica (Psiônico, UA) — "No início do seu turno, você pode gastar
// um Dado de Energia Psiônica. Até o início do seu próximo turno, você tem
// Imunidade às condições Amedrontado e Enfeitiçado, e Vantagem em testes de
// resistência de Inteligência... Você ainda pode usar outra Disciplina
// Psiônica neste turno." (não conta no limite de "1 disciplina comum por
// turno", ver `DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO`.)
// Toggle sem encerramento manual: "Fim do Turno" encerra (é literalmente o
// fim do período "até o início do próximo turno"); Descanso Curto (1h) e
// Descanso Longo (8h) também encerram, por serem bem mais longos que isso.
// [codeimplementation]

export function temDefesaPsionica(disciplinasConhecidas: string[]): boolean {
  return disciplinasConhecidas.includes('defesa-psionica');
}

export function podeAtivarDefesaPsionica(disciplinasConhecidas: string[], dadosRestantes: number): boolean {
  return temDefesaPsionica(disciplinasConhecidas) && dadosRestantes > 0;
}
