// Gerado a partir de dnd-master-referencia.xlsx, aba "Multiclasse". Não
// editar valores à mão — regenerar a partir da planilha se algo mudar.
// Ver EmDevB.md (Fase M) e PENDENCIAS.md "Personagem multiclasse".
//
// 3 tabelas da aba, importadas 1:1:
// - `preRequisitosMulticlasse` — atributo mínimo (sempre 13) pra poder
//   multiclassar PRA ou DENTRO de cada classe (precisa valer na classe
//   atual e na nova, ver regra real no Livro do Jogador).
// - `proficienciasMulticlasse` — o que se ganha ao pegar o 1º nível
//   numa classe nova por multiclasse (sempre menos que o equipamento/
//   proficiência de quem começa nela — ex: sem armadura Pesada, sem
//   Foco/Símbolo Sagrado). Texto livre por ora (só descrição/UI ainda,
//   igual ao campo `outro` de `PrerequisitosTalento`) — se algum dia
//   precisar aplicar proficiência automaticamente, decidir estrutura
//   nova (mesmo padrão de `proficienciasIniciaisClasse.ts`) quando
//   chegar a vez de fazer isso de verdade.
// - `espacosMagiaPorNivelCombinado` — tabela oficial de Espaços de
//   Magia pra conjurador multiclasse (Bárbaro/Guerreiro/Ladino contam
//   0 nessa soma; meio-conjuradores como Guardião/Paladino contam
//   metade do nível, arredondado pra baixo; Bruxo — Magia de Pacto —
//   NUNCA entra aqui, sempre separado). O "Nível Combinado" em si (a
//   soma que indexa essa tabela) é calculado em `core/`, não faz parte
//   do dado.

import type { Atributo } from '../../wizardFixtures';

export interface PreRequisitoMulticlasse {
  classe: string;
  /** Atributos que precisam estar em 13+ nas DUAS classes envolvidas
   * (a atual e a nova) pra poder multiclassar. */
  atributosMinimos: Atributo[];
  /** `'todos'` = precisa dos 13+ em TODOS os atributos listados (ex:
   * Guardião — Destreza E Sabedoria); `'qualquer'` = basta 1 deles (só
   * o Guerreiro — Força OU Destreza). Irrelevante com 1 atributo só. */
  modo: 'todos' | 'qualquer';
  fonte: string;
}

export const preRequisitosMulticlasse: PreRequisitoMulticlasse[] = [
  { classe: 'Bárbaro', atributosMinimos: ['FOR'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Bardo', atributosMinimos: ['CAR'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Bruxo', atributosMinimos: ['CAR'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Clérigo', atributosMinimos: ['SAB'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Druida', atributosMinimos: ['SAB'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Feiticeiro', atributosMinimos: ['CAR'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Guardião', atributosMinimos: ['DES', 'SAB'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Guerreiro', atributosMinimos: ['FOR', 'DES'], modo: 'qualquer', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Ladino', atributosMinimos: ['DES'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Mago', atributosMinimos: ['INT'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Monge', atributosMinimos: ['DES', 'SAB'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Paladino', atributosMinimos: ['FOR', 'CAR'], modo: 'todos', fonte: 'Livro do Jogador (D&D 5e 2024)' },
];

export interface ProficienciasMulticlasse {
  classe: string;
  proficienciasObtidas: string;
  fonte: string;
}

export const proficienciasMulticlasse: ProficienciasMulticlasse[] = [
  {
    classe: 'Bárbaro',
    proficienciasObtidas: 'Dado de Ponto de Vida, proficiência com armas Marciais e treinamento com Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Bardo',
    proficienciasObtidas:
      'Dado de Ponto de Vida, proficiência em uma perícia à sua escolha, proficiência com um Instrumento Musical à sua escolha e treinamento com armadura Leve.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Bruxo',
    proficienciasObtidas: 'Dado de Ponto de Vida e treinamento com armadura Leve.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Clérigo',
    proficienciasObtidas: 'Dado de Ponto de Vida e treinamento com armadura Leve, Média e Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Druida',
    proficienciasObtidas: 'Dado de Ponto de Vida e treinamento com armadura Leve e Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Feiticeiro',
    proficienciasObtidas: 'Apenas o Dado de Ponto de Vida.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Guardião',
    proficienciasObtidas:
      'Dado de Ponto de Vida, proficiência com armas Marciais, proficiência em uma perícia à sua escolha da lista de perícias de Guardião e treinamento com armaduras Leves, Médias e Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Guerreiro',
    proficienciasObtidas: 'Dado de Ponto de Vida, proficiência com armas Marciais e treinamento com armaduras Leves e Médias e Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Ladino',
    proficienciasObtidas:
      'Dado de Ponto de Vida, proficiência em uma perícia à sua escolha da lista de perícias do Ladino, proficiência com Ferramentas de Ladrão e treinamento com armadura Leve.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Mago',
    proficienciasObtidas: 'Apenas o Dado de Ponto de Vida.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Monge',
    proficienciasObtidas: 'Apenas o Dado de Ponto de Vida.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Paladino',
    proficienciasObtidas: 'Dado de Ponto de Vida, proficiência com armas Marciais e treinamento com armaduras Leves, Médias e Escudos.',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
];

export interface EspacosMagiaNivelCombinado {
  nivelCombinado: number;
  /** Índice 0 = 1º círculo, índice 8 = 9º círculo. `0` = "—" na
   * planilha (nenhum espaço desse círculo ainda nesse Nível Combinado). */
  espacosPorCirculo: number[];
  fonte: string;
}

export const espacosMagiaPorNivelCombinado: EspacosMagiaNivelCombinado[] = [
  { nivelCombinado: 1, espacosPorCirculo: [2, 0, 0, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 2, espacosPorCirculo: [3, 0, 0, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 3, espacosPorCirculo: [4, 2, 0, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 4, espacosPorCirculo: [4, 3, 0, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 5, espacosPorCirculo: [4, 3, 2, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 6, espacosPorCirculo: [4, 3, 3, 0, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 7, espacosPorCirculo: [4, 3, 3, 1, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 8, espacosPorCirculo: [4, 3, 3, 2, 0, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 9, espacosPorCirculo: [4, 3, 3, 3, 1, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 10, espacosPorCirculo: [4, 3, 3, 3, 2, 0, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 11, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 12, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 0, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 13, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 1, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 14, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 1, 0, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 15, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 1, 1, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 16, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 1, 1, 0], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 17, espacosPorCirculo: [4, 3, 3, 3, 2, 1, 1, 1, 1], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 18, espacosPorCirculo: [4, 3, 3, 3, 3, 1, 1, 1, 1], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 19, espacosPorCirculo: [4, 3, 3, 3, 3, 2, 1, 1, 1], fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { nivelCombinado: 20, espacosPorCirculo: [4, 3, 3, 3, 3, 2, 2, 1, 1], fonte: 'Livro do Jogador (D&D 5e 2024)' },
];
