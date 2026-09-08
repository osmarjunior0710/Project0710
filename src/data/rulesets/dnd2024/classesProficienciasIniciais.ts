// Exceção documentada ao padrão "só planilha" (ver CLAUDE.md seção 3 e
// DECISOES-DESIGN.md) — igual descricoesOrigens.ts. A aba "Progressão de
// Classe" não tem coluna de perícia à escolha nem de equipamento inicial
// de classe (diferente do equipamento de Origem, que já vem da
// planilha). Transcrito direto das tabelas "Traços Básicos de
// Guerreiro" (pág. 127) e "Traços Básicos de Bardo" (pág. 57), Livro
// do Jogador (D&D 5e 2024) — com autorização explícita do Osmar, que
// enviou o PDF dos capítulos.
//
// Proficiência com Armas e Treinamento com Armadura NÃO estão mais aqui
// — o Osmar adicionou a aba "Proficiências de Classe" na planilha, então
// isso agora vem de `proficienciasArmaArmaduraClasse.ts` (dado real,
// não exceção).
//
// Se um dia a planilha ganhar as colunas que faltam aqui, este arquivo
// pode ser apagado e o campo migrado pra dentro de classes.ts via
// regeneração normal.

export interface ItemEquipamento {
  nome: string;
  quantidade: number;
  unidade: string | null;
}

export interface OpcaoEquipamentoClasse {
  rotulo: string;
  itens: ItemEquipamento[];
  ouro: number;
}

export interface ProficienciasIniciaisClasse {
  classeId: string;
  periciasEscolha: { quantidade: number; opcoes: string[] };
  /** Só classes com proficiência de ferramenta na criação (ex.: Bardo
   * escolhe 3 Instrumentos Musicais) — Guerreiro não tem, por isso é
   * opcional. `grupo` referencia `gruposFerramenta` (ferramentas.ts). */
  ferramentasEscolha?: { quantidade: number; grupo: string };
  equipamentoInicial: OpcaoEquipamentoClasse[];
  fonte: string;
}

export const proficienciasIniciaisClasse: Record<string, ProficienciasIniciaisClasse> = {
  guerreiro: {
    classeId: 'guerreiro',
    periciasEscolha: {
      quantidade: 2,
      opcoes: [
        'Acrobacia',
        'Atletismo',
        'História',
        'Intimidação',
        'Intuição',
        'Lidar com Animais',
        'Percepção',
        'Persuasão',
        'Sobrevivência',
      ],
    },
    equipamentoInicial: [
      {
        rotulo: 'A',
        itens: [
          { nome: 'Cota de Malha', quantidade: 1, unidade: null },
          { nome: 'Espada Grande', quantidade: 1, unidade: null },
          { nome: 'Mangual', quantidade: 1, unidade: null },
          { nome: 'Azagaia', quantidade: 8, unidade: null },
          { nome: 'Kit de Explorador de Masmorras', quantidade: 1, unidade: null },
        ],
        ouro: 4,
      },
      {
        rotulo: 'B',
        itens: [
          { nome: 'Couro Batido', quantidade: 1, unidade: null },
          { nome: 'Cimitarra', quantidade: 1, unidade: null },
          { nome: 'Espada Curta', quantidade: 1, unidade: null },
          { nome: 'Arco Longo', quantidade: 1, unidade: null },
          { nome: 'Flecha', quantidade: 20, unidade: null },
          { nome: 'Aljava', quantidade: 1, unidade: null },
          { nome: 'Kit de Explorador de Masmorras', quantidade: 1, unidade: null },
        ],
        ouro: 11,
      },
      {
        rotulo: 'C',
        itens: [],
        ouro: 155,
      },
    ],
    fonte: 'Livro do Jogador (D&D 5e 2024), Cap. 3, pág. 127',
  },
  bardo: {
    classeId: 'bardo',
    // "Escolha quaisquer 3 perícias (veja o capítulo 1)" — diferente do
    // Guerreiro (lista curta fixa), Bardo escolhe de TODAS as 18
    // perícias do jogo.
    periciasEscolha: {
      quantidade: 3,
      opcoes: [
        'Acrobacia', 'Arcanismo', 'Atletismo', 'Atuação', 'Enganação', 'Furtividade',
        'História', 'Intimidação', 'Intuição', 'Investigação', 'Lidar com Animais',
        'Medicina', 'Natureza', 'Percepção', 'Persuasão', 'Prestidigitação', 'Religião',
        'Sobrevivência',
      ],
    },
    ferramentasEscolha: { quantidade: 3, grupo: 'Instrumento Musical' },
    equipamentoInicial: [
      {
        rotulo: 'A',
        itens: [
          { nome: 'Couro', quantidade: 1, unidade: null },
          { nome: 'Adaga', quantidade: 2, unidade: null },
          { nome: 'Instrumento Musical', quantidade: 1, unidade: null },
          { nome: 'Kit de Artista', quantidade: 1, unidade: null },
        ],
        ouro: 19,
      },
      {
        rotulo: 'B',
        itens: [],
        ouro: 90,
      },
    ],
    fonte: 'Livro do Jogador (D&D 5e 2024), Cap. 3, pág. 57',
  },
  bruxo: {
    classeId: 'bruxo',
    periciasEscolha: {
      quantidade: 2,
      opcoes: ['Arcanismo', 'Enganação', 'História', 'Intimidação', 'Investigação', 'Natureza', 'Religião'],
    },
    // Sem ferramentasEscolha — Bruxo não tem proficiência de
    // ferramenta na criação (diferente do Bardo).
    equipamentoInicial: [
      {
        rotulo: 'A',
        itens: [
          { nome: 'Couro', quantidade: 1, unidade: null },
          { nome: 'Foice', quantidade: 1, unidade: null },
          { nome: 'Adaga', quantidade: 2, unidade: null },
          { nome: 'Orbe', quantidade: 1, unidade: null },
          { nome: 'Livro', quantidade: 1, unidade: null },
          { nome: 'Kit de Erudito', quantidade: 1, unidade: null },
        ],
        ouro: 15,
      },
      {
        rotulo: 'B',
        itens: [],
        ouro: 100,
      },
    ],
    fonte: 'Livro do Jogador (D&D 5e 2024), Cap. 3, pág. 69',
  },
  mago: {
    classeId: 'mago',
    periciasEscolha: {
      quantidade: 2,
      opcoes: ['Arcanismo', 'História', 'Intuição', 'Investigação', 'Medicina', 'Natureza', 'Religião'],
    },
    // Sem ferramentasEscolha — Mago não tem proficiência de ferramenta
    // na criação.
    equipamentoInicial: [
      {
        rotulo: 'A',
        itens: [
          { nome: 'Adaga', quantidade: 2, unidade: null },
          { nome: 'Foco Arcano (Cajado)', quantidade: 1, unidade: null },
          { nome: 'Kit de Erudito', quantidade: 1, unidade: null },
          { nome: 'Livro de Magias', quantidade: 1, unidade: null },
          { nome: 'Túnica', quantidade: 1, unidade: null },
        ],
        ouro: 5,
      },
      {
        rotulo: 'B',
        itens: [],
        ouro: 55,
      },
    ],
    fonte: 'Livro do Jogador (D&D 5e 2024), Cap. 3, pág. 147',
  },
};
