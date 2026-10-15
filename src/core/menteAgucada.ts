// Mente Aguçada (Psiônico, UA) — "No início do seu turno, você pode gastar
// um Dado de Energia Psiônica para aprimorar seus poderes psíquicos
// destrutivos. Role o dado e anote o número obtido. Você recebe os
// seguintes benefícios por 1 minuto ou até ficar Incapacitado. Ignorando
// Psiônicos... Modo de Ataque. Uma vez por turno, quando você causar dano
// Psíquico a uma ou mais criaturas, você pode substituir o número obtido em
// um dos dados de dano pelo número anotado quando você ativou esta
// Disciplina Psiônica." (não conta no limite de "1 disciplina comum por
// turno", ver `DISCIPLINAS_QUE_NAO_CONTAM_NO_TURNO`.)
// Toggle com encerramento MANUAL (diferente de Defesa Psiônica): a duração
// real é "1 minuto ou até Incapacitado", não "até o início do próximo
// turno" — não dá pra automatizar pelo "Fim do Turno" sozinho (mesmo caso
// já tratado em Defesa Superior do Monge). Descanso Curto (1h) e Longo (8h)
// são bem mais longos que "1 minuto", então esses sim encerram sozinhos
// (mesmo raciocínio já aplicado em Defesa Psiônica). [codeimplementation]

export function temMenteAgucada(disciplinasConhecidas: string[]): boolean {
  return disciplinasConhecidas.includes('mente-agucada');
}

export function podeAtivarMenteAgucada(disciplinasConhecidas: string[], dadosRestantes: number): boolean {
  return temMenteAgucada(disciplinasConhecidas) && dadosRestantes > 0;
}

/** Estrutura mínima de 1 dado rolado — espelha `DadoIndividual` de
 * `ui/roll/RollContext.tsx` sem importar de lá (core nunca depende de
 * ui, CLAUDE.md §4). */
export interface DadoRoladoMinimo {
  id: string;
  valor: number | '🎲';
}

/** "Modo de Ataque" — decide SE a troca é oferecida e o texto dela, dado o
 * contexto de uma rolagem de dano concluída. Sempre escolhe o MENOR dado
 * (nunca pede pro jogador decidir qual) e só oferece quando o número
 * anotado é estritamente MAIOR que ele — trocar por um valor igual/menor
 * nunca ajuda. `null` em qualquer caso sem oferta válida. */
export function avaliarTrocaMenteAgucada(input: {
  tipoDano: string | null | undefined;
  ativa: boolean;
  anotado: number | null;
  usadoNesteTurno: boolean;
  dadosIndividuais: DadoRoladoMinimo[] | undefined;
}): { texto: string; dadoId: string; novoValor: number } | null {
  if (input.tipoDano !== 'Psíquico') return null;
  if (!input.ativa || input.usadoNesteTurno || input.anotado === null) return null;
  const numericos = (input.dadosIndividuais ?? []).filter((d): d is DadoRoladoMinimo & { valor: number } => typeof d.valor === 'number');
  if (numericos.length === 0) return null;
  const menorDado = numericos.reduce((a, b) => (a.valor <= b.valor ? a : b));
  if (input.anotado <= menorDado.valor) return null;
  return {
    texto: `Trocar menor resultado (${menorDado.valor}) por (${input.anotado})`,
    dadoId: menorDado.id,
    novoValor: input.anotado,
  };
}
