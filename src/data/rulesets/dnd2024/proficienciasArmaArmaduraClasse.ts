// Gerado a partir de dnd-master-referencia.xlsx, aba "Proficiências de
// Classe" (adicionada pelo Osmar, extraída do Cap. 3 do Livro do Jogador).
// Não editar valores à mão.
//
// Cobre só Proficiência com Armas e Treinamento com Armadura — perícias à
// escolha e equipamento inicial de classe continuam vindo de
// classesProficienciasIniciais.ts (exceção transcrita do livro, planilha
// ainda não tem essas duas colunas).

export interface ProficienciaArmaArmadura {
  classe: string;
  proficienciaArmas: string;
  treinamentoArmadura: string;
  fonte: string;
}

export const proficienciasArmaArmaduraClasse: ProficienciaArmaArmadura[] = [
  {
    classe: "Bárbaro",
    proficienciaArmas: "Armas Simples e Marciais",
    treinamentoArmadura: "Armaduras Leve e Média, Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Bardo",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Armadura Leve",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Bruxo",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Armadura Leve",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Clérigo",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Armaduras Leve e Média, Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Druida",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Armadura Leve e Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Feiticeiro",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Nenhuma",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Guardião",
    proficienciaArmas: "Armas Simples e Marciais",
    treinamentoArmadura: "Armaduras Leve e Média, Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Guerreiro",
    proficienciaArmas: "Armas Simples e Marciais",
    treinamentoArmadura: "Armaduras Leve, Média e Pesada, Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Ladino",
    proficienciaArmas: "Armas Simples e Armas Marciais com propriedade Acuidade ou Leve",
    treinamentoArmadura: "Armadura Leve",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Mago",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Nenhuma",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Monge",
    proficienciaArmas: "Armas Simples, Armas Marciais Corpo a Corpo com propriedade Leve",
    treinamentoArmadura: "Nenhuma (perde Defesa sem Armadura se usar)",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Paladino",
    proficienciaArmas: "Armas Simples e Marciais",
    treinamentoArmadura: "Armaduras Leve, Média e Pesada, Escudos",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    classe: "Psiônico",
    proficienciaArmas: "Armas Simples",
    treinamentoArmadura: "Nenhuma",
    fonte: "Unearthed Arcana 2025 — O Psiônico (não oficial)",
  },
];
