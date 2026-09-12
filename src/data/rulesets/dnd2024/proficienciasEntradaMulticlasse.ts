// Proficiência ganha ao pegar o PRIMEIRO nível numa classe via
// MULTICLASSE (SDD Multiclasse, seção 6, planilha aba "Multiclasse",
// coluna "Proficiências Obtidas" — já importada como texto livre em
// `multiclasse.ts`/`proficienciasMulticlasse`, este arquivo só
// estrutura esse mesmo texto em campos que o código consegue aplicar).
// Sempre um pacote MENOR do que o nível 1 "puro" de
// `proficienciasArmaArmaduraClasse.ts`/`classesProficienciasIniciais.ts`
// — nunca usar essas duas tabelas pra uma classe que não é a primeira
// do personagem.
//
// Só as classes já implementadas no app (Guerreiro, Bardo, Bruxo,
// Mago) — as outras 8 entram quando a classe em si for implementada.
// `periciaAEscolha`/`ferramentaAEscolha` reaproveitam a MESMA lista de
// opções de `classesProficienciasIniciais.ts` (a regra não dá uma
// lista diferente pra multiclasse, só uma quantidade menor) — só
// `quantidade` muda aqui.

export interface ProficienciaEntradaMulticlasse {
  classe: string;
  /** Mesma convenção de texto de `proficienciasArmaArmaduraClasse.ts`
   * (`classeProficienteComArma` faz o match) — string vazia = nenhuma. */
  proficienciaArmas: string;
  /** Mesma convenção de `proficienciasArmaArmaduraClasse.ts`
   * (`classeProficienteComArmadura` faz o match) — string vazia = nenhuma. */
  treinamentoArmadura: string;
  /** `null` = essa classe não dá perícia à escolha ao multiclassar. */
  periciaAEscolha: { quantidade: number } | null;
  /** `null` = essa classe não dá ferramenta à escolha ao multiclassar.
   * `grupo` referencia `gruposFerramenta` (ferramentas.ts), igual
   * `ferramentasEscolha` de `classesProficienciasIniciais.ts`. */
  ferramentaAEscolha: { quantidade: number; grupo: string } | null;
  fonte: string;
}

export const proficienciasEntradaMulticlasse: ProficienciaEntradaMulticlasse[] = [
  {
    classe: 'Guerreiro',
    proficienciaArmas: 'Armas Simples e Marciais',
    treinamentoArmadura: 'Armaduras Leve e Média, Escudos',
    periciaAEscolha: null,
    ferramentaAEscolha: null,
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Bardo',
    proficienciaArmas: '',
    treinamentoArmadura: 'Armadura Leve',
    periciaAEscolha: { quantidade: 1 },
    ferramentaAEscolha: { quantidade: 1, grupo: 'Instrumento Musical' },
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Bruxo',
    proficienciaArmas: '',
    treinamentoArmadura: 'Armadura Leve',
    periciaAEscolha: null,
    ferramentaAEscolha: null,
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
  {
    classe: 'Mago',
    proficienciaArmas: '',
    treinamentoArmadura: '',
    periciaAEscolha: null,
    ferramentaAEscolha: null,
    fonte: 'Livro do Jogador (D&D 5e 2024)',
  },
];
