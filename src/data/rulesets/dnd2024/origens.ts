// Gerado a partir de dnd-master-referencia.xlsx, aba "Antecedentes".
// Não editar valores à mão — regenerar a partir da planilha se algo mudar.
//
// Correção de dado aplicada na importação: a planilha (aba Antecedentes)
// grafa o talento da origem Artesão como "Artífice", mas o nome oficial é
// "Artifista" (confirmado no Livro do Jogador 2024 e na aba Talentos da
// própria planilha). Ver DECISOES-DESIGN.md.
//
// Nomes de item ajustados pra bater exatamente com o catálogo de
// equipamento (`equipamentoAventura.ts`) — `buscarPesoItem` busca por
// nome exato, então "Roupas de Viagem"/"Fantasia"/"Roupas Finas"/
// "Balde de Ferro" (como o livro descreve) viravam "sem peso
// cadastrado" na Mochila por não baterem com "Roupas, Viagem"/
// "Roupas, Fantasia"/"Roupas, Finas"/"Balde" (como o catálogo grafa).
// Os 3 "Livro (tema)" (orações/filosofia/história) viraram só "Livro"
// pelo mesmo motivo — o catálogo não tem variante temática; o tema
// original fica em comentário ao lado de cada linha. Ver
// PENDENCIAS.md "Itens sem peso cadastrado" pro resto da auditoria
// (Flecha/Virote avulsos e Kit de Jogos ainda têm lacuna própria,
// não é erro de nome).

import type { Atributo } from '../../wizardFixtures';

export interface ItemEquipamentoOrigem {
  nome: string;
  quantidade: number;
  unidade: string | null;
}

export type FerramentaOrigem =
  | { categoria: 'fixa'; nome: string }
  | { categoria: 'escolha'; grupo: string };

export interface Origem {
  id: string;
  nome: string;
  nomeIngles: string;
  atributosElegiveis: Atributo[];
  talentoOrigemId: string;
  talentoOrigemVariante: string | null;
  pericias: [string, string];
  ferramenta: FerramentaOrigem;
  equipamentoOpcaoA: { itens: ItemEquipamentoOrigem[]; ouro: number };
  equipamentoOpcaoB: { ouro: number };
  /** false = talento de origem pede seleção extra sem UI própria ainda
   *  (ver PENDENCIAS.md). Aparece "(em breve)" e não-selecionável. */
  disponivel: boolean;
  fonte: string;
}

export const origens: Origem[] = [
  {
    id: "acolito",
    nome: "Acólito",
    nomeIngles: "Acolyte",
    atributosElegiveis: ["INT", "SAB", "CAR"],
    talentoOrigemId: "iniciado-em-magia",
    talentoOrigemVariante: "Clérigo",
    pericias: ["Intuição", "Religião"],
    ferramenta: { categoria: 'fixa', nome: "Suprimentos de Calígrafo" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Suprimentos de Calígrafo", quantidade: 1, unidade: null },
        { nome: "Livro", quantidade: 1, unidade: null }, // livro de orações — catálogo não tem variante temática, ver DECISOES-FICHA.md
        { nome: "Símbolo Sagrado", quantidade: 1, unidade: null },
        { nome: "Pergaminho", quantidade: 10, unidade: "folhas" },
        { nome: "Túnica", quantidade: 1, unidade: null }
      ],
      ouro: 8,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: false,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "andarilho",
    nome: "Andarilho",
    nomeIngles: "Wayfarer",
    atributosElegiveis: ["DES", "SAB", "CAR"],
    talentoOrigemId: "sortudo",
    talentoOrigemVariante: null,
    pericias: ["Furtividade", "Intuição"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Ladrão" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Adaga", quantidade: 2, unidade: null },
        { nome: "Ferramentas de Ladrão", quantidade: 1, unidade: null },
        { nome: "Kit de Jogos", quantidade: 1, unidade: null },
        { nome: "Algibeira", quantidade: 2, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null },
        { nome: "Saco de Dormir", quantidade: 1, unidade: null }
      ],
      ouro: 16,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "artesao",
    nome: "Artesão",
    nomeIngles: "Artisan",
    atributosElegiveis: ["FOR", "DES", "INT"],
    talentoOrigemId: "artifista",
    talentoOrigemVariante: null,
    pericias: ["Investigação", "Persuasão"],
    ferramenta: { categoria: 'escolha', grupo: "Ferramentas de Artesão" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Ferramentas de Artesão", quantidade: 1, unidade: null },
        { nome: "Algibeira", quantidade: 2, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 32,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "artista",
    nome: "Artista",
    nomeIngles: "Entertainer",
    atributosElegiveis: ["FOR", "DES", "CAR"],
    talentoOrigemId: "musico",
    talentoOrigemVariante: null,
    pericias: ["Acrobacia", "Atuação"],
    ferramenta: { categoria: 'escolha', grupo: "Instrumento Musical" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Instrumento Musical", quantidade: 1, unidade: null },
        { nome: "Espelho", quantidade: 1, unidade: null },
        { nome: "Roupas, Fantasia", quantidade: 2, unidade: null },
        { nome: "Perfume", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 11,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "charlatao",
    nome: "Charlatão",
    nomeIngles: "Charlatan",
    atributosElegiveis: ["DES", "CON", "CAR"],
    talentoOrigemId: "habilidoso",
    talentoOrigemVariante: null,
    pericias: ["Enganação", "Prestidigitação"],
    ferramenta: { categoria: 'fixa', nome: "Kit de Falsificação" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Kit de Falsificação", quantidade: 1, unidade: null },
        { nome: "Roupas, Fantasia", quantidade: 1, unidade: null },
        { nome: "Roupas, Finas", quantidade: 1, unidade: null }
      ],
      ouro: 15,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "criminoso",
    nome: "Criminoso",
    nomeIngles: "Criminal",
    atributosElegiveis: ["DES", "CON", "INT"],
    talentoOrigemId: "alerta",
    talentoOrigemVariante: null,
    pericias: ["Furtividade", "Prestidigitação"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Ladrão" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Adaga", quantidade: 2, unidade: null },
        { nome: "Ferramentas de Ladrão", quantidade: 1, unidade: null },
        { nome: "Algibeira", quantidade: 2, unidade: null },
        { nome: "Pé de Cabra", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 16,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "eremita",
    nome: "Eremita",
    nomeIngles: "Hermit",
    atributosElegiveis: ["CON", "SAB", "CAR"],
    talentoOrigemId: "curandeiro",
    talentoOrigemVariante: null,
    pericias: ["Medicina", "Religião"],
    ferramenta: { categoria: 'fixa', nome: "Kit de Herbalismo" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Cajado", quantidade: 1, unidade: null },
        { nome: "Kit de Herbalismo", quantidade: 1, unidade: null },
        { nome: "Lâmpada", quantidade: 1, unidade: null },
        { nome: "Livro", quantidade: 1, unidade: null }, // livro de filosofia — catálogo não tem variante temática, ver DECISOES-FICHA.md
        { nome: "Óleo", quantidade: 3, unidade: "frascos" },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null },
        { nome: "Saco de Dormir", quantidade: 1, unidade: null }
      ],
      ouro: 16,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "escriba",
    nome: "Escriba",
    nomeIngles: "Scribe",
    atributosElegiveis: ["DES", "INT", "SAB"],
    talentoOrigemId: "habilidoso",
    talentoOrigemVariante: null,
    pericias: ["Investigação", "Percepção"],
    ferramenta: { categoria: 'fixa', nome: "Suprimentos de Calígrafo" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Suprimentos de Calígrafo", quantidade: 1, unidade: null },
        { nome: "Lâmpada", quantidade: 1, unidade: null },
        { nome: "Óleo", quantidade: 3, unidade: "frascos" },
        { nome: "Pergaminho", quantidade: 12, unidade: "folhas" },
        { nome: "Roupas, Finas", quantidade: 1, unidade: null }
      ],
      ouro: 23,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "fazendeiro",
    nome: "Fazendeiro",
    nomeIngles: "Farmer",
    atributosElegiveis: ["FOR", "CON", "SAB"],
    talentoOrigemId: "vigoroso",
    talentoOrigemVariante: null,
    pericias: ["Lidar com Animais", "Natureza"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Carpinteiro" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Foice", quantidade: 1, unidade: null },
        { nome: "Ferramentas de Carpinteiro", quantidade: 1, unidade: null },
        { nome: "Kit de Curandeiro", quantidade: 1, unidade: null },
        { nome: "Balde", quantidade: 1, unidade: null },
        { nome: "Pá", quantidade: 1, unidade: null }
      ],
      ouro: 30,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "guarda",
    nome: "Guarda",
    nomeIngles: "Guard",
    atributosElegiveis: ["FOR", "INT", "SAB"],
    talentoOrigemId: "alerta",
    talentoOrigemVariante: null,
    pericias: ["Atletismo", "Percepção"],
    ferramenta: { categoria: 'escolha', grupo: "Kit de Jogos" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Lança", quantidade: 1, unidade: null },
        { nome: "Besta Leve", quantidade: 1, unidade: null },
        { nome: "Virote", quantidade: 20, unidade: null },
        { nome: "Kit de Jogos", quantidade: 1, unidade: null },
        { nome: "Aljava", quantidade: 1, unidade: null },
        { nome: "Grilhões", quantidade: 1, unidade: null },
        { nome: "Lanterna Coberta", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 12,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "guia",
    nome: "Guia",
    nomeIngles: "Guide",
    atributosElegiveis: ["DES", "CON", "SAB"],
    talentoOrigemId: "iniciado-em-magia",
    talentoOrigemVariante: "Druida",
    pericias: ["Furtividade", "Sobrevivência"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Cartógrafo" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Arco Curto", quantidade: 1, unidade: null },
        { nome: "Flecha", quantidade: 20, unidade: null },
        { nome: "Ferramentas de Cartógrafo", quantidade: 1, unidade: null },
        { nome: "Aljava", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null },
        { nome: "Saco de Dormir", quantidade: 1, unidade: null },
        { nome: "Tenda", quantidade: 1, unidade: null }
      ],
      ouro: 3,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: false,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "marinheiro",
    nome: "Marinheiro",
    nomeIngles: "Sailor",
    atributosElegiveis: ["FOR", "DES", "SAB"],
    talentoOrigemId: "valentao-de-taverna",
    talentoOrigemVariante: null,
    pericias: ["Acrobacia", "Percepção"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Navegador" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Adaga", quantidade: 1, unidade: null },
        { nome: "Ferramentas de Navegador", quantidade: 1, unidade: null },
        { nome: "Corda", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 20,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "mercador",
    nome: "Mercador",
    nomeIngles: "Merchant",
    atributosElegiveis: ["CON", "INT", "CAR"],
    talentoOrigemId: "sortudo",
    talentoOrigemVariante: null,
    pericias: ["Lidar com Animais", "Persuasão"],
    ferramenta: { categoria: 'fixa', nome: "Ferramentas de Navegador" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Ferramentas de Navegador", quantidade: 1, unidade: null },
        { nome: "Algibeira", quantidade: 2, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 22,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "nobre",
    nome: "Nobre",
    nomeIngles: "Noble",
    atributosElegiveis: ["FOR", "INT", "CAR"],
    talentoOrigemId: "habilidoso",
    talentoOrigemVariante: null,
    pericias: ["História", "Persuasão"],
    ferramenta: { categoria: 'escolha', grupo: "Kit de Jogos" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Kit de Jogos", quantidade: 1, unidade: null },
        { nome: "Perfume", quantidade: 1, unidade: null },
        { nome: "Roupas, Finas", quantidade: 1, unidade: null }
      ],
      ouro: 29,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "sabio",
    nome: "Sábio",
    nomeIngles: "Sage",
    atributosElegiveis: ["CON", "INT", "SAB"],
    talentoOrigemId: "iniciado-em-magia",
    talentoOrigemVariante: "Mago",
    pericias: ["Arcanismo", "História"],
    ferramenta: { categoria: 'fixa', nome: "Suprimentos de Calígrafo" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Cajado", quantidade: 1, unidade: null },
        { nome: "Suprimentos de Calígrafo", quantidade: 1, unidade: null },
        { nome: "Livro", quantidade: 1, unidade: null }, // livro de história — catálogo não tem variante temática, ver DECISOES-FICHA.md
        { nome: "Pergaminho", quantidade: 8, unidade: "folhas" },
        { nome: "Túnica", quantidade: 1, unidade: null }
      ],
      ouro: 8,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: false,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "soldado",
    nome: "Soldado",
    nomeIngles: "Soldier",
    atributosElegiveis: ["FOR", "DES", "CON"],
    talentoOrigemId: "atacante-selvagem",
    talentoOrigemVariante: null,
    pericias: ["Atletismo", "Intimidação"],
    ferramenta: { categoria: 'escolha', grupo: "Kit de Jogos" },
    equipamentoOpcaoA: {
      itens: [
        { nome: "Lança", quantidade: 1, unidade: null },
        { nome: "Arco Curto", quantidade: 1, unidade: null },
        { nome: "Flecha", quantidade: 20, unidade: null },
        { nome: "Kit de Curandeiro", quantidade: 1, unidade: null },
        { nome: "Kit de Jogos", quantidade: 1, unidade: null },
        { nome: "Aljava", quantidade: 1, unidade: null },
        { nome: "Roupas, Viagem", quantidade: 1, unidade: null }
      ],
      ouro: 14,
    },
    equipamentoOpcaoB: { ouro: 50 },
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
];
