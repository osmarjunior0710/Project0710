// Classificação de "tipo de conjurador" pra multiclasse (SDD
// Multiclasse, seção 8.2) — decide como cada classe entra na soma do
// "Nível Equivalente" que consulta a tabela Conjurador Multiclasse
// (`espacosMagiaPorNivelCombinado`, `data/rulesets/dnd2024/multiclasse.ts`).
// Fato de regra confirmado no Livro do Jogador (D&D 5e 2024) — não é
// dado de planilha (a aba "Multiclasse" não tem essa coluna), por
// isso mora aqui como exceção documentada, mesmo padrão de
// `classesProficienciasIniciais.ts`.
//
// - 'completo': todos os níveis entram na soma (Bardo, Clérigo,
//   Druida, Feiticeiro, Mago).
// - 'meio': metade dos níveis, arredondado PRA CIMA (Guardião,
//   Paladino).
// - 'terco-com-subclasse': um terço dos níveis, arredondado PRA BAIXO,
//   e SÓ conta se a subclasse escolhida for a indicada em
//   `subclasseQueAtiva` (Guerreiro/Cavaleiro Místico, Ladino/Trapaceiro
//   Arcano) — sem essa subclasse específica, não entra na conta.
// - 'pacto': Magia de Pacto do Bruxo — NUNCA entra nessa soma, é
//   sempre um pool à parte (ver core/multiclasse.ts, M4b).
// - 'nenhum': classe sem Conjuração (Bárbaro, Monge).

export type TipoConjuradorMulticlasse = 'completo' | 'meio' | 'terco-com-subclasse' | 'pacto' | 'nenhum';

export interface ConjuradorMulticlasse {
  classe: string;
  tipo: TipoConjuradorMulticlasse;
  /** Só preenchido pra `tipo: 'terco-com-subclasse'`. */
  subclasseQueAtiva?: string;
  fonte: string;
}

export const conjuradoresMulticlasse: ConjuradorMulticlasse[] = [
  { classe: 'Bárbaro', tipo: 'nenhum', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Bardo', tipo: 'completo', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Bruxo', tipo: 'pacto', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Clérigo', tipo: 'completo', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Druida', tipo: 'completo', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Feiticeiro', tipo: 'completo', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Guardião', tipo: 'meio', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  {
    classe: 'Guerreiro',
    tipo: 'terco-com-subclasse',
    subclasseQueAtiva: 'Cavaleiro Místico',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Ladino',
    tipo: 'terco-com-subclasse',
    subclasseQueAtiva: 'Trapaceiro Arcano',
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  { classe: 'Mago', tipo: 'completo', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Monge', tipo: 'nenhum', fonte: 'Livro do Jogador (D&D 5e 2024)' },
  { classe: 'Paladino', tipo: 'meio', fonte: 'Livro do Jogador (D&D 5e 2024)' },
];
