// Truques + magias "sempre preparadas" concedidas pela sub-escolha
// `linhagem_com_progressao_magica` de uma espécie (ex.: Linhagem
// Élfica do Elfo, Linhagem Gnômica do Gnomo) — diferente de
// `magiasPactoDoInfero.ts` (gatilho é NÍVEL DE PERSONAGEM, não nível
// de classe, já que espécie não tem classe própria).

import { especies } from '../data/rulesets/dnd2024/especies';
import type { WizardSelection } from './personagem';

function opcaoEscolhida(selection: WizardSelection) {
  const especie = especies.find((e) => e.nome === selection.especie);
  return especie?.opcoesSubescolha?.find((o) => o.nome === selection.subescolhaEspecieEscolhida) ?? null;
}

/** Nomes dos truques concedidos de forma permanente — junta o
 * `Especie.truqueFixo` (igual pra qualquer personagem da espécie, ex.:
 * Taumaturgia do Tiferino) com os `truquesConhecidos` da linhagem/
 * legado escolhido (variam por opção, ex.: Rajada de Veneno só pro
 * Legado Abissal). `[]` se a espécie não conceder nenhum. */
export function truquesEspecie(selection: WizardSelection): string[] {
  const especie = especies.find((e) => e.nome === selection.especie);
  return [...(especie?.truqueFixo ? [especie.truqueFixo] : []), ...(opcaoEscolhida(selection)?.truquesConhecidos ?? [])];
}

/** `true` quando a espécie concede alguma magia própria (truque fixo
 * ou de linhagem, ou magia de nível 1/3/5) — usado por
 * `core/conjuracao.ts` pra contar como fonte de conjuração mesmo numa
 * classe sem magia (ex.: Guerreiro Elfo ainda conjura o truque da
 * linhagem). */
export function temMagiaDeEspecie(selection: WizardSelection): boolean {
  const opcao = opcaoEscolhida(selection);
  return Boolean(
    truquesEspecie(selection).length || opcao?.magiaNivel1 || opcao?.magiaNivel3 || opcao?.magiaNivel5,
  );
}

/** Nomes das magias sempre preparadas já desbloqueadas no nível de
 * PERSONAGEM atual (1, 3 e 5, acumulando) — lista fixa, sem escolha do
 * jogador. */
export function magiasEspecie(selection: WizardSelection, nivelPersonagem: number): string[] {
  const opcao = opcaoEscolhida(selection);
  if (!opcao) return [];
  const resultado: string[] = [];
  if (nivelPersonagem >= 1 && opcao.magiaNivel1) resultado.push(opcao.magiaNivel1);
  if (nivelPersonagem >= 3 && opcao.magiaNivel3) resultado.push(opcao.magiaNivel3);
  if (nivelPersonagem >= 5 && opcao.magiaNivel5) resultado.push(opcao.magiaNivel5);
  return resultado;
}
