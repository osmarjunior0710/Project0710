// Gerado a partir de dnd-master-referencia.xlsx, aba "Armaduras". Não
// editar valores à mão. Linhas de cabeçalho de categoria filtradas.
//
// `descricaoCompleta` NÃO é texto literal do livro — diferente de Magias,
// o Livro do Jogador (Cap.6 Equipamento) não tem um parágrafo próprio por
// armadura, só a tabela + regras gerais (Categoria/CA/Força/Furtividade/
// Treinamento com Armadura) que valem pra qualquer armadura daquele tipo.
// Cada `descricaoCompleta` aqui é um texto PRÓPRIO que junta a linha da
// tabela com a consequência mecânica de cada regra (ex: o que acontece se
// a Força mínima não for atingida) — conferido contra o Cap.6 do Livro do
// Jogador em 2026-09. Ver AUDITORIA-CONTEUDO.md.

export interface Armadura {
  id: string;
  categoria: string;
  nome: string;
  classeArmadura: string;
  forcaMinima: string;
  furtividade: string;
  peso: string;
  custo: string;
  descricaoCurta: string;
  descricaoCompleta: string;
  fonte: string;
}

export const armaduras: Armadura[] = [
  {
    id: "acolchoada",
    categoria: "Armadura Leve (1 Minuto para Vestir ou Despir)",
    nome: "Acolchoada",
    classeArmadura: "11 + modificador de Des",
    forcaMinima: "—",
    furtividade: "Desvantagem",
    peso: "4 kg",
    custo: "5 PO",
    descricaoCurta: "Armadura Leve. CA 11 + modificador de Des. Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Leve — leva 1 minuto para vestir ou despir. Concede CA 11 + seu modificador de Destreza (sem limite). Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Leve, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "couro",
    categoria: "Armadura Leve (1 Minuto para Vestir ou Despir)",
    nome: "Couro",
    classeArmadura: "11 + modificador de Des",
    forcaMinima: "—",
    furtividade: "—",
    peso: "5 kg",
    custo: "10 PO",
    descricaoCurta: "Armadura Leve. CA 11 + modificador de Des.",
    descricaoCompleta:
      "Armadura Leve — leva 1 minuto para vestir ou despir. Concede CA 11 + seu modificador de Destreza (sem limite). Sem treinamento com Armadura Leve, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "courobatido",
    categoria: "Armadura Leve (1 Minuto para Vestir ou Despir)",
    nome: "Couro Batido",
    classeArmadura: "12 + modificador de Des",
    forcaMinima: "—",
    furtividade: "—",
    peso: "6,5 kg",
    custo: "45 PO",
    descricaoCurta: "Armadura Leve. CA 12 + modificador de Des.",
    descricaoCompleta:
      "Armadura Leve — leva 1 minuto para vestir ou despir. Concede CA 12 + seu modificador de Destreza (sem limite). Sem treinamento com Armadura Leve, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "gibaodepeles",
    categoria: "Armadura Média (5 Minutos para Vestir e 1 Minuto para Despir)",
    nome: "Gibão de Peles",
    classeArmadura: "12 + modificador de Des (máx. 2)",
    forcaMinima: "—",
    furtividade: "—",
    peso: "6 kg",
    custo: "10 PO",
    descricaoCurta: "Armadura Média. CA 12 + modificador de Des (máx. 2).",
    descricaoCompleta:
      "Armadura Média — leva 5 minutos para vestir e 1 minuto para despir. Concede CA 12 + seu modificador de Destreza, até no máximo +2. Sem treinamento com Armadura Média, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "cotademalhaparcial",
    categoria: "Armadura Média (5 Minutos para Vestir e 1 Minuto para Despir)",
    nome: "Cota de Malha Parcial",
    classeArmadura: "13 + modificador de Des (máx. 2)",
    forcaMinima: "—",
    furtividade: "—",
    peso: "10 kg",
    custo: "50 PO",
    descricaoCurta: "Armadura Média. CA 13 + modificador de Des (máx. 2).",
    descricaoCompleta:
      "Armadura Média — leva 5 minutos para vestir e 1 minuto para despir. Concede CA 13 + seu modificador de Destreza, até no máximo +2. Sem treinamento com Armadura Média, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "lorigadeescamas",
    categoria: "Armadura Média (5 Minutos para Vestir e 1 Minuto para Despir)",
    nome: "Loriga de Escamas",
    classeArmadura: "14 + Modificador de Des (máx. 2)",
    forcaMinima: "—",
    furtividade: "Desvantagem",
    peso: "22 kg",
    custo: "50 PO",
    descricaoCurta: "Armadura Média. CA 14 + Modificador de Des (máx. 2). Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Média — leva 5 minutos para vestir e 1 minuto para despir. Concede CA 14 + seu modificador de Destreza, até no máximo +2. Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Média, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "couracapeitoral",
    categoria: "Armadura Média (5 Minutos para Vestir e 1 Minuto para Despir)",
    nome: "Couraça Peitoral",
    classeArmadura: "14 + Modificador de Des (máx. 2)",
    forcaMinima: "—",
    furtividade: "—",
    peso: "10 kg",
    custo: "400 PO",
    descricaoCurta: "Armadura Média. CA 14 + Modificador de Des (máx. 2).",
    descricaoCompleta:
      "Armadura Média — leva 5 minutos para vestir e 1 minuto para despir. Concede CA 14 + seu modificador de Destreza, até no máximo +2. Sem treinamento com Armadura Média, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "placasparcial",
    categoria: "Armadura Média (5 Minutos para Vestir e 1 Minuto para Despir)",
    nome: "Placas Parcial",
    classeArmadura: "15 + Modificador de Des (máx. 2)",
    forcaMinima: "—",
    furtividade: "Desvantagem",
    peso: "20 kg",
    custo: "750 PO",
    descricaoCurta: "Armadura Média. CA 15 + Modificador de Des (máx. 2). Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Média — leva 5 minutos para vestir e 1 minuto para despir. Concede CA 15 + seu modificador de Destreza, até no máximo +2. Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Média, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "cotadeaneis",
    categoria: "Armadura Pesada (10 Minutos para Vestir e 5 Minutos para Despir)",
    nome: "Cota de Anéis",
    classeArmadura: "14",
    forcaMinima: "—",
    furtividade: "Desvantagem",
    peso: "20 kg",
    custo: "30 PO",
    descricaoCurta: "Armadura Pesada. CA 14. Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Pesada — leva 10 minutos para vestir e 5 minutos para despir. Concede CA 14, fixo (não soma modificador de Destreza). Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Pesada, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "cotademalha",
    categoria: "Armadura Pesada (10 Minutos para Vestir e 5 Minutos para Despir)",
    nome: "Cota de Malha",
    classeArmadura: "16",
    forcaMinima: "For 13",
    furtividade: "Desvantagem",
    peso: "27 kg",
    custo: "75 PO",
    descricaoCurta: "Armadura Pesada. CA 16. Requer Força mínima For 13. Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Pesada — leva 10 minutos para vestir e 5 minutos para despir. Concede CA 16, fixo (não soma modificador de Destreza). Se sua Força for menor que 13, seu deslocamento é reduzido em 3 metros enquanto a usa. Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Pesada, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "armaduradetalas",
    categoria: "Armadura Pesada (10 Minutos para Vestir e 5 Minutos para Despir)",
    nome: "Armadura de Talas",
    classeArmadura: "17",
    forcaMinima: "For 15",
    furtividade: "Desvantagem",
    peso: "30 kg",
    custo: "200 PO",
    descricaoCurta: "Armadura Pesada. CA 17. Requer Força mínima For 15. Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Pesada — leva 10 minutos para vestir e 5 minutos para despir. Concede CA 17, fixo (não soma modificador de Destreza). Se sua Força for menor que 15, seu deslocamento é reduzido em 3 metros enquanto a usa. Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Pesada, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "placas",
    categoria: "Armadura Pesada (10 Minutos para Vestir e 5 Minutos para Despir)",
    nome: "Placas",
    classeArmadura: "18",
    forcaMinima: "For 15",
    furtividade: "Desvantagem",
    peso: "32 kg",
    custo: "1.500 PO",
    descricaoCurta: "Armadura Pesada. CA 18. Requer Força mínima For 15. Desvantagem em Furtividade.",
    descricaoCompleta:
      "Armadura Pesada — leva 10 minutos para vestir e 5 minutos para despir. Concede CA 18, fixo (não soma modificador de Destreza). Se sua Força for menor que 15, seu deslocamento é reduzido em 3 metros enquanto a usa. Você tem Desvantagem em testes de Destreza (Furtividade) enquanto a usa. Sem treinamento com Armadura Pesada, você tem Desvantagem em qualquer Teste de D20 que envolva Força ou Destreza, e não pode conjurar magias.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "escudo",
    categoria: "Escudo (Ação Usar Objeto para Equipar ou Desequipar)",
    nome: "Escudo",
    classeArmadura: "+2",
    forcaMinima: "—",
    furtividade: "—",
    peso: "3 kg",
    custo: "10 PO",
    descricaoCurta: "Escudo. CA +2.",
    descricaoCompleta:
      "Escudo — concede +2 de bônus à Classe de Armadura enquanto equipado, somado à sua CA normal. Você só recebe esse bônus se tiver treinamento com Escudo. Equipar ou desequipar um Escudo usa a ação Usar Objeto.",
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
];
