// Truques + magia sempre preparada concedidos pelo talento "Iniciado
// em Magia" (Acólito/Guia/Sábio via Origem, ou avulso via Versátil do
// Humano) — diferente de `magiasEspecie.ts` (gatilho é nível de
// PERSONAGEM, cresce com o tempo), a escolha aqui é feita 1x na
// criação (`TalentoOrigemEscolhasStep`/`TalentoEspecieEscolhasStep`) e
// fica fixa depois — este talento não ganha truque/magia extra por
// nível. Um personagem nunca tem os dois ao mesmo tempo pela mesma
// fonte, mas Origem + Versátil são fontes independentes — por isso as
// duas "gavetas" (`...Escolhidos`/`...EspecieEscolhidos`) são somadas.

import type { WizardSelection } from './personagem';

export function truquesMagiaIniciada(selection: WizardSelection): string[] {
  return [...selection.truquesMagiaIniciadaEscolhidos, ...selection.truquesMagiaIniciadaEspecieEscolhidos];
}

export function magiasMagiaIniciada(selection: WizardSelection): string[] {
  return [selection.magiaMagiaIniciadaEscolhida, selection.magiaMagiaIniciadaEspecieEscolhida].filter(
    (m): m is string => m !== null,
  );
}

/** `true` quando o talento Iniciado em Magia já concedeu algo — usado
 * por `core/conjuracao.ts` pra contar como fonte de conjuração mesmo
 * numa classe sem magia. */
export function temMagiaIniciada(selection: WizardSelection): boolean {
  return truquesMagiaIniciada(selection).length > 0 || magiasMagiaIniciada(selection).length > 0;
}
