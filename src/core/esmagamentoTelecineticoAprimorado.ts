// Esmagamento Telecinético Aprimorado (Psiônico, subclasse Psicinético,
// nível 10) — "Quando você conjura Telekinetic Crush, pode gastar um
// Dado de Energia Psiônica para modificar a magia de forma que, quer a
// criatura falhe ou seja bem-sucedida no teste de resistência contra a
// magia, seu Deslocamento seja reduzido à metade até o início do seu
// próximo turno. Além disso, você pode rolar o Dado de Energia Psíquica
// gasto e adicionar o valor rolado a uma rolagem de dano da magia."
// A redução de Deslocamento é só texto (o app não rastreia condição de
// inimigo) — mostrada como aviso no popup de Salvaguarda, independente
// do resultado. [codeimplementation]

import type { Magia } from '../data/rulesets/dnd2024/magias';

export function temEsmagamentoTelecineticoAprimorado(nivelPsionico: number): boolean {
  return nivelPsionico >= 10;
}

/** `magia` precisa ser exatamente "Esmagamento Telecinético" — a melhoria não vale pra outras
 * magias, mesmo com a característica e Dado de Energia disponível. */
export function esmagamentoAprimoradoElegivel(magia: Magia, ativo: boolean, dadosRestantes: number): boolean {
  return ativo && magia.nome === 'Esmagamento Telecinético' && dadosRestantes > 0;
}

export const AVISO_ESMAGAMENTO_APRIMORADO =
  'Esmagamento Telecinético Aprimorado: o Deslocamento do alvo é reduzido à metade até o início do seu próximo turno (vale falhando ou passando na salvaguarda).';
