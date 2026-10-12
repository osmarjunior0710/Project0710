// Opções de Disciplina Psiônica (Psiônico, Unearthed Arcana 2025 — NÃO OFICIAL). Texto literal do PDF
// `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf` (p.7-8), via sdd/sdd-psionico.md seção 4.1.
// Convenção do app: "Dado de Energia Psiônica" em todo lugar (o PDF mistura "Psiônica"/"Psíquica").
// Nenhuma tem mecânica ainda — entram aos poucos (E4b-E4d, ver EmDev.md); por isso todas `placeholder-codeimplementation`.

import type { StatusImplementacao } from './statusImplementacao';

/** Quando a disciplina soma o Dado de Energia Psiônica a uma rolagem de d20: numa perícia da ação correspondente (Procurar,
 * Influenciar, Analisar — o "Estudar" do UA), ou num ataque que errou. */
export type GatilhoDisciplina = { tipo: 'pericia'; pericias: string[] } | { tipo: 'ataque' };

export interface DisciplinaPsionica {
  id: string;
  nome: string;
  descricao: string;
  statusImplementacao: StatusImplementacao;
  /** Só nas disciplinas que se encaixam numa rolagem de d20 (E4b). */
  gatilho?: GatilhoDisciplina;
}

const PH: StatusImplementacao = 'placeholder-codeimplementation';

export const disciplinasPsionicas: DisciplinaPsionica[] = [
  {
    id: 'aperfeicoamento-de-precognicao',
    nome: 'Aperfeiçoamento de Precognição',
    descricao:
      'Ao conjurar uma magia Psiônica da escola de Abjuração ou Adivinhação, você pode gastar um Dado de Energia Psiônica. Role o dado e escolha uma criatura que você possa ver a até 18 metros (que pode ser você mesmo). Até o final do seu próximo turno, a criatura recebe um bônus no próximo Teste de D20 que fizer, igual ao número rolado.',
    statusImplementacao: PH,
  },
  {
    id: 'bio-retorno',
    nome: 'Bio-Retorno',
    descricao:
      'Ao conjurar uma magia Psiônica da escola de Necromancia ou Transmutação, você pode gastar um número de Dados de Energia Psiônica igual ao seu modificador de Inteligência, rolar os dados e ganhar um número de Pontos de Vida Temporários igual ao total dos dados rolados mais o seu modificador de Inteligência (mínimo de um).',
    statusImplementacao: PH,
  },
  {
    id: 'consciencia-expandida',
    nome: 'Consciência Expandida',
    descricao:
      'Ao realizar a ação de Procurar, você pode gastar um Dado de Energia Psiônica, rolá-lo e adicionar o resultado à sua jogada de habilidade. Se isso resultar em sucesso no teste de habilidade, o dado é gasto.',
    statusImplementacao: 'codeimplementation',
    gatilho: { tipo: 'pericia', pericias: ['Intuição', 'Medicina', 'Percepção', 'Sobrevivência'] },
  },
  {
    id: 'defesa-psionica',
    nome: 'Defesa Psiônica',
    descricao:
      'No início do seu turno, você pode gastar um Dado de Energia Psiônica. Até o início do seu próximo turno, você tem Imunidade às condições Amedrontado e Enfeitiçado, e Vantagem em testes de resistência de Inteligência. Se estiver sob uma dessas condições ao ativar essa disciplina, ela termina. Você ainda pode usar outra Disciplina Psiônica neste turno.',
    statusImplementacao: PH,
  },
  {
    id: 'insinuacao-do-id',
    nome: 'Insinuação do Id',
    descricao:
      'Ao conjurar uma magia de psiônico das escolas de Encantamento ou Ilusão que exige um teste de resistência, você pode gastar um Dado de Energia Psiônica. Você rola um Dado de Energia Psiônica e um dos alvos da magia que você possa ver subtrai o total do dado rolado do teste de resistência.',
    statusImplementacao: PH,
  },
  {
    id: 'lingua-diabolica',
    nome: 'Língua Diabólica',
    descricao:
      'Ao realizar a ação de Influenciar, você pode gastar um Dado de Energia Psiônica, rolá-lo e adicionar o resultado à sua jogada de habilidade. Se isso resultar em sucesso no teste de habilidade, o dado é gasto.',
    statusImplementacao: 'codeimplementation',
    gatilho: { tipo: 'pericia', pericias: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão', 'Lidar com Animais'] },
  },
  {
    id: 'mente-agucada',
    nome: 'Mente Aguçada',
    descricao:
      'No início do seu turno, você pode gastar um Dado de Energia Psiônica para aprimorar seus poderes psíquicos destrutivos. Role o dado e anote o número obtido. Você recebe os seguintes benefícios por 1 minuto ou até ficar Incapacitado. Ignorando Psiônicos. O dano de seus ataques com armas, magias Psiônicas e habilidades Psiônicas ignora a Resistência a dano Psíquico. Modo de Ataque. Uma vez por turno, quando você causar dano Psíquico a uma ou mais criaturas, você pode substituir o número obtido em um dos dados de dano pelo número anotado quando você ativou esta Disciplina Psiônica. Ao usar Mente Aguçada, você também pode usar uma Disciplina Psiônica diferente neste turno.',
    statusImplementacao: PH,
  },
  {
    id: 'mente-atenta',
    nome: 'Mente Atenta',
    descricao:
      'Ao realizar a ação de Estudar, você pode gastar um Dado de Energia Psiônica, rolá-lo e adicionar o resultado à jogada de habilidade. Se isso resultar em sucesso no teste de habilidade, o dado é gasto.',
    statusImplementacao: 'codeimplementation',
    gatilho: { tipo: 'pericia', pericias: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'] },
  },
  {
    id: 'mira-inerrante',
    nome: 'Mira Inerrante',
    descricao:
      'Quando errar um ataque, você pode gastar um Dado de Energia Psiônica e adicioná-lo à jogada de ataque. Se isso fizer o ataque acertar, o dado é gasto.',
    statusImplementacao: 'codeimplementation',
    gatilho: { tipo: 'ataque' },
  },
  {
    id: 'pensamentos-destrutivos',
    nome: 'Pensamentos Destrutivos',
    descricao:
      'Ao conjurar uma magia Psiônica da escola de Conjuração ou Evocação que force uma criatura que você possa ver a fazer um teste de resistência contra a magia, você pode gastar um número de Dados de Energia Psiônica igual ao seu modificador de Inteligência e rolá-los. A criatura sofre dano Psíquico igual ao total dos dados rolados mais o seu modificador de Inteligência (mínimo de um), independentemente do resultado do teste de resistência.',
    statusImplementacao: PH,
  },
  {
    id: 'retaliacao-psiquica',
    nome: 'Retaliação Psíquica',
    descricao:
      'Imediatamente após uma criatura que você possa ver realizar um ataque contra você, você pode usar uma Reação para gastar um Dado de Energia Psiônica, rolar o dado e reduzir o dano recebido do ataque em um valor igual a duas vezes o número rolado mais o seu modificador de Inteligência (mínimo de dois). Além disso, você pode forçar o atacante a fazer um teste de resistência de Sabedoria. Em caso de falha, o alvo sofre dano Psíquico igual ao dano que você reduziu.',
    statusImplementacao: PH,
  },
];

export function disciplinaPorId(id: string): DisciplinaPsionica | undefined {
  return disciplinasPsionicas.find((d) => d.id === id);
}
