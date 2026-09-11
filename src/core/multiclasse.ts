// Multiclasse — Fase M0 (fundamento de schema, nada visível na tela
// ainda). Ver PENDENCIAS.md "Personagem multiclasse — schema da ficha
// ainda assume 1 classe só".
//
// `PersonagemSalvo` ainda guarda `nivel`/`selecao.classe`/
// `subclasseAtual` como campos soltos (formato antigo, 1 classe só) —
// `classes` é o array novo que os substitui aos poucos. Personagem
// salvo ANTES desta entrega não tem `classes` ainda;
// `classesDoPersonagem` migra na hora da leitura (mesmo padrão de
// "campo ausente cai pro antigo" já usado em `FichaShell.tsx` pra
// `truquesAtual`/`espacosGastosPorCirculo` etc.), nunca sobrescreve o
// salvo sozinho — só quem confirmar um Level Up escolhendo classe (Fase
// M2) grava `classes` de verdade.

import type { PersonagemSalvo } from './armazenamentoPersonagens';
import type { Atributo } from '../data/wizardFixtures';
import {
  preRequisitosMulticlasse,
  espacosMagiaPorNivelCombinado,
  type PreRequisitoMulticlasse,
} from '../data/rulesets/dnd2024/multiclasse';

export interface PersonagemClasse {
  /** Nome da classe (ex: "Mago") — mesmo formato usado em `selecao.classe`. */
  classe: string;
  /** Nível NESSA classe — não confundir com o nível TOTAL do
   * personagem (soma de todas as classes), ver `nivelTotalPersonagem`. */
  nivel: number;
  /** Subclasse escolhida NESSA classe — `null`/ausente = ainda não
   * escolhida (classe abaixo do nível de subclasse dela). */
  subclasse?: string | null;
}

/** Classes do personagem, já migradas pro formato novo — se
 * `personagemSalvo.classes` existir, usa direto; senão deriva 1
 * elemento único dos campos antigos (`selecao.classe`/`nivel`/
 * `subclasseAtual`), preservando o comportamento de todo personagem
 * salvo antes desta entrega (hoje, 100% dos personagens). */
export function classesDoPersonagem(personagemSalvo: PersonagemSalvo): PersonagemClasse[] {
  if (personagemSalvo.classes) return personagemSalvo.classes;
  if (!personagemSalvo.selecao.classe) return [];
  return [
    {
      classe: personagemSalvo.selecao.classe,
      nivel: personagemSalvo.nivel,
      subclasse: personagemSalvo.subclasseAtual ?? null,
    },
  ];
}

/** Nível TOTAL do personagem (soma do nível em cada classe) — usado
 * por qualquer regra que escale pelo nível do personagem como um todo
 * (Bônus de Proficiência, XP), nunca por uma característica de classe
 * específica. */
export function nivelTotalPersonagem(classes: PersonagemClasse[]): number {
  return classes.reduce((soma, c) => soma + c.nivel, 0);
}

/** Nível do personagem NUMA classe específica — `0` se ele não tiver
 * nenhum nível nela (nunca multiclassou pra lá). Usado por qualquer
 * característica que escale pelo nível DAQUELA classe (ex: Espaços de
 * Magia de Mago, Legião dos Mortos do Necromante). */
export function nivelNaClasse(classes: PersonagemClasse[], nomeClasse: string): number {
  return classes.find((c) => c.classe === nomeClasse)?.nivel ?? 0;
}

/** Pré-requisito de atributo mínimo pra multiclassar PRA essa classe —
 * `undefined` se o nome não bater com nenhuma linha da planilha (ex:
 * classe ainda não implementada no app). */
export function preRequisitoDaClasse(nomeClasse: string): PreRequisitoMulticlasse | undefined {
  return preRequisitosMulticlasse.find((p) => p.classe === nomeClasse);
}

/** `true` = os atributos finais atendem o pré-requisito de uma classe
 * (13+ em todos, quando `modo: 'todos'`; 13+ em pelo menos 1, quando
 * `modo: 'qualquer'` — único caso hoje é o Guerreiro, Força OU
 * Destreza). Multiclassar exige isso valer na classe atual E na nova
 * (ver regra real) — quem chama confere as duas, passando o
 * pré-requisito de cada uma. */
export function atendePreRequisitoMulticlasse(
  atributosFinais: Record<Atributo, number>,
  preRequisito: PreRequisitoMulticlasse,
): boolean {
  const atende = (a: Atributo) => (atributosFinais[a] ?? 0) >= 13;
  return preRequisito.modo === 'qualquer' ? preRequisito.atributosMinimos.some(atende) : preRequisito.atributosMinimos.every(atende);
}

/** Espaços de Magia (por círculo, índice 0 = 1º) pro Nível Combinado
 * de conjuração multiclasse — `null` se fora da faixa 1-20 (não deve
 * acontecer, nível combinado nunca passa de 20). Ver
 * `data/rulesets/dnd2024/multiclasse.ts` — como calcular o Nível
 * Combinado em si (full/meio-conjurador, Bruxo sempre fora) fica pra
 * quando essa tabela for aplicada de verdade (Fase M4). */
export function espacosMagiaParaNivelCombinado(nivelCombinado: number): number[] | null {
  return espacosMagiaPorNivelCombinado.find((e) => e.nivelCombinado === nivelCombinado)?.espacosPorCirculo ?? null;
}
