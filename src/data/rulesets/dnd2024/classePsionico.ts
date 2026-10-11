// Psiônico — classe do Unearthed Arcana 2025 (NÃO OFICIAL). Transcrita à mão do PDF
// `livros-referencia/unearthed-arcana/Psionico_Atualizacoes_UA_2025.pdf` (tradução do canal "conDado"), páginas 3-8.
// Diferente de `classes.ts` (gerado da planilha), este arquivo É a fonte primária da classe — não existe outro lugar de onde
// regenerar (decisão do Osmar, 2026-10: arquivo próprio marcado UA; ver `sdd/sdd-psionico.md` seção 2.1 e CLAUDE.md seção 9).
// Mesmo padrão do Necromante homebrew (`caracteristicasSubclasseHomebrew.ts`). As glosas em inglês entre parênteses do PDF foram
// retiradas do texto; fora isso o texto é literal.
//
// Decisão do Osmar sobre a fonte: a coluna de TRUQUES segue a TABELA do PDF (2 truques nos níveis 1-2, 3 do 3 ao 9, 4 do 10 em diante),
// não a frase "mais um truque nos níveis 4 e 10" do texto, que diverge da tabela.
//
// Status de implementação (CLAUDE.md §12.1): tudo `placeholder-*` na Entrega 1 (a classe existe e entra no Char Multiclasse, mas só os
// motores genéricos — ficha, espaços, ASI — funcionam); cada característica vira `codeimplementation` na entrega que a implementa.

import type { Classe, RecursoClasse } from './classes';
import type { CaracteristicaClasse } from './caracteristicasClasse';

const FONTE = 'Unearthed Arcana 2025 — O Psiônico (não oficial)';

/** Monta `valorPorNivel` (1-20) a partir de uma lista de 20 valores. */
function porNivel(valores: number[]): Record<number, number> {
  const resultado: Record<number, number> = {};
  valores.forEach((v, i) => {
    resultado[i + 1] = v;
  });
  return resultado;
}

// Tabela "Recursos do Psiônico" (PDF p.5), níveis 1-20.
const TRUQUES = [2, 2, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
const MAGIAS_PREPARADAS = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22];
const DADOS_DE_ENERGIA_QUANTIDADE = [4, 4, 4, 4, 6, 6, 6, 6, 8, 8, 8, 8, 10, 10, 10, 10, 12, 12, 12, 12];
const DADOS_DE_ENERGIA_LADOS = [6, 6, 6, 6, 8, 8, 8, 8, 8, 8, 10, 10, 10, 10, 10, 10, 12, 12, 12, 12];
/** Espaços de Magia por círculo (1º ao 9º), níveis 1-20 — conjurador completo. */
const ESPACOS: number[][] = [
  [2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  [0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 1, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 2],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1],
];
const ORDINAL = ['1º', '2º', '3º', '4º', '5º', '6º', '7º', '8º', '9º'];

const recursos: RecursoClasse[] = [
  { nome: 'Truques Conhecidos', recuperaEm: null, valorPorNivel: porNivel(TRUQUES) },
  { nome: 'Magias Preparadas', recuperaEm: null, valorPorNivel: porNivel(MAGIAS_PREPARADAS) },
  // Dados de Energia Psiônica: 2 recursos (quantidade e tamanho do dado), mesmo padrão genérico de `valorRecursoClasse`.
  {
    nome: 'Dados de Energia Psiônica (quantidade)',
    recuperaEm: '1 dado no Descanso Curto, todos no Descanso Longo',
    valorPorNivel: porNivel(DADOS_DE_ENERGIA_QUANTIDADE),
  },
  { nome: 'Dado de Energia Psiônica (lados)', recuperaEm: null, valorPorNivel: porNivel(DADOS_DE_ENERGIA_LADOS) },
  ...ESPACOS.map(
    (linha, i): RecursoClasse => ({
      nome: `Espaços de Magia — ${ORDINAL[i]} Círculo`,
      recuperaEm: 'Descanso Longo',
      valorPorNivel: porNivel(linha),
    }),
  ),
];

export const classePsionico: Classe = {
  id: 'psionico',
  nome: 'Psiônico',
  atributoPrimario: 'Inteligência',
  dadoDeVida: 'd6',
  salvaguardas: ['INT', 'SAB'],
  nivelSubclasse: 3,
  recursos,
  progressao: [
    { nivel: 1, bonusProficiencia: '+2', caracteristicas: ['Conjuração', 'Poder Psiônico', 'Telecinese Sutil'] },
    { nivel: 2, bonusProficiencia: '+2', caracteristicas: ['Disciplina Psiônica'] },
    { nivel: 3, bonusProficiencia: '+2', caracteristicas: ['Subclasse de Psiônico'] },
    { nivel: 4, bonusProficiencia: '+2', caracteristicas: ['Aumento no Valor de Atributo'] },
    { nivel: 5, bonusProficiencia: '+3', caracteristicas: ['Restauração Psiônica', 'Disciplina Psiônica'] },
    { nivel: 6, bonusProficiencia: '+3', caracteristicas: ['Característica de Subclasse'] },
    { nivel: 7, bonusProficiencia: '+3', caracteristicas: ['Surto Psiônico'] },
    { nivel: 8, bonusProficiencia: '+3', caracteristicas: ['Aumento no Valor de Atributo'] },
    { nivel: 9, bonusProficiencia: '+4', caracteristicas: [] },
    { nivel: 10, bonusProficiencia: '+4', caracteristicas: ['Disciplina Psiônica', 'Característica de Subclasse'] },
    { nivel: 11, bonusProficiencia: '+4', caracteristicas: [] },
    { nivel: 12, bonusProficiencia: '+4', caracteristicas: ['Aumento no Valor de Atributo'] },
    { nivel: 13, bonusProficiencia: '+5', caracteristicas: ['Disciplina Psiônica'] },
    { nivel: 14, bonusProficiencia: '+5', caracteristicas: ['Característica de Subclasse'] },
    { nivel: 15, bonusProficiencia: '+5', caracteristicas: [] },
    { nivel: 16, bonusProficiencia: '+5', caracteristicas: ['Aumento no Valor de Atributo'] },
    { nivel: 17, bonusProficiencia: '+6', caracteristicas: ['Disciplina Psiônica'] },
    { nivel: 18, bonusProficiencia: '+6', caracteristicas: ['Reservas Psiônicas'] },
    { nivel: 19, bonusProficiencia: '+6', caracteristicas: ['Dádiva Épica'] },
    { nivel: 20, bonusProficiencia: '+6', caracteristicas: ['Força Vital Incandescente'] },
  ],
  disponivel: true,
  fonte: FONTE,
};

const PH = 'placeholder-codeimplementation' as const;

export const caracteristicasClassePsionico: CaracteristicaClasse[] = [
  {
    classe: 'Psiônico',
    nivel: 1,
    nome: 'Conjuração',
    descricao:
      'Você aprendeu a canalizar energia mágica usando o poder da sua mente. Veja o Livro do Jogador para as regras sobre conjuração. As informações abaixo explicam como aplicar essas regras às magias do psiônico, que aparecem na lista de magias do psiônico mais adiante nesta descrição de classe. Truques. Você conhece dois truques de psiônico à sua escolha. Ilusão Menor e Arremesso Telecinético são recomendados. Sempre que você ganhar um nível de psiônico, pode substituir um dos truques aprendidos por este recurso por outro truque de psiônico à sua escolha. Ao atingir os níveis 4 e 10, você aprende mais um truque de psiônico, conforme indicado na coluna de Truques da tabela de Recursos do Psiônico. Espaços de Magia. A tabela de Recursos do Psiônico mostra quantos espaços de magia você possui para conjurar suas magias de 1º nível ou superior. Você recupera todos os espaços de magia gastos ao terminar um Descanso Longo. Magias Preparadas de 1º Nível ou Superior. Você prepara a lista de magias de 1º nível ou superior disponíveis para conjurar com este recurso. Para começar, escolha quatro magias de 1º nível de psiônico. Enfeitiçar Pessoa, Comando, Sussurros Dissonantes e Armadura Arcana são recomendadas. O número de magias na sua lista aumenta conforme você sobe de nível de psiônico, como mostrado na coluna de Magias Preparadas da tabela de Recursos do Psiônico. Sempre que esse número aumentar, escolha mais magias de psiônico até atingir o novo total. As magias escolhidas devem ser de um nível para o qual você possua espaços de magia. Por exemplo, se você for um psiônico de 3º nível, sua lista de magias preparadas pode incluir até seis magias de psiônico de 1º e 2º níveis, em qualquer combinação. Se outro recurso de psiônico conceder magias sempre preparadas, essas magias não contam contra o seu número de magias preparadas por este recurso, mas ainda contam como magias de psiônico para você. Alterar Suas Magias Preparadas. Sempre que você subir de nível como psiônico, pode substituir uma das magias da sua lista por outra magia de psiônico de um nível que você possa conjurar. Atributo de Conjuração. Inteligência é seu atributo de conjuração para as magias de psiônico. Conjuração Psiônica. Quando você conjura uma magia de psiônico, essa magia não exige componentes Verbais nem Materiais, mesmo que a entrada de "Componentes" da magia inclua "V" ou "M" — com exceção de componentes materiais que sejam consumidos pela magia ou que tenham um custo especificado. (Nota do app: vale a coluna de Truques da tabela — 3 truques já no nível 3 e 4 no nível 10; a frase "níveis 4 e 10" diverge da tabela do próprio PDF.)',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 1,
    nome: 'Poder Psiônico',
    descricao:
      'Você abriga uma fonte profunda de energia psíquica dentro de si. Essa energia é representada pelos seus Dados de Energia Psiônica. Seu nível de psiônico determina o tamanho e a quantidade desses dados, como indicado nas colunas Dado de Energia e Nº de Dados da tabela de Recursos do Psiônico. Seus Dados de Energia Psiônica são usados para aprimorar ou abastecer certos recursos do psiônico. Você começa com dois desses recursos: Impulso Telecinético e Conexão Telepática, descritos abaixo. Alguns de seus poderes consomem os Dados de Energia Psiônica, conforme especificado na descrição do recurso, e você não pode usá-lo se ele exigir o gasto de dado e você não tiver nenhum disponível. Você recupera um dado gasto ao finalizar um Descanso Curto, e recupera todos ao terminar um Descanso Longo. Alguns recursos que usam Dados de Energia Psiônica exigem que o alvo faça um teste de resistência. A CD desses testes é igual à CD de Magia determinada pela característica Conjuração da classe. Impulso Telecinético. Como uma Ação Bônus, escolha uma criatura Grande ou menor que você possa ver a até 9 metros. O alvo deve passar em um teste de resistência de Força ou será empurrado (ou puxado — à sua escolha) para uma direção reta a uma distância igual a 1,5 metros. Alternativamente, você pode rolar um Dado de Energia Psiônica ao realizar esta Ação Bônus, e a distância percorrida é igual a 5 vezes o número rolado. O dado só é gasto se o alvo falhar na resistência. Conexão Telepática. Você possui telepatia com alcance de 9 metros. Como uma Ação Bônus, você pode gastar um Dado de Energia Psiônica. Pela próxima hora, o alcance da sua telepatia aumenta em metros igual a 3 vezes o número rolado. Na primeira vez que você usar esta Ação Bônus após cada Descanso Longo, você não gasta o Dado de Energia Psiônica. Em todas as outras vezes que usar esta habilidade, você gasta o dado.',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 1,
    nome: 'Telecinese Sutil',
    descricao:
      'Você conhece o truque Mão Mágica. Você pode conjurá-lo sem componentes somáticos, e pode tornar a mão espectral invisível ao conjurá-la.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 2,
    nome: 'Disciplina Psiônica',
    descricao:
      'Você aprende técnicas psíquicas adicionais alimentadas pelos seus Dados de Energia Psiônica. Você adquire duas disciplinas à sua escolha, como Consciência Expandida e Insinuação do Id. As disciplinas estão descritas na seção Opções de Disciplina Psiônica mais adiante nesta descrição de classe. Você pode usar apenas uma disciplina por turno, e apenas uma vez por turno, a menos que a descrição diga o contrário. Sempre que você subir de nível como psiônico, pode substituir uma disciplina conhecida por outra. Você aprende uma opção adicional no nível 5, 10, 13 e 17.',
    tipoAcao: 'Variável',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 3,
    nome: 'Subclasse de Psiônico',
    descricao:
      'Você adquire uma subclasse de psiônico à sua escolha. As subclasses Metamorfo, Dobrador Psíquico, Psicinético e Telepata estão descritas após esta seção da classe. Uma subclasse é uma especialização que concede recursos em certos níveis de psiônico. A partir de agora, você adquire os recursos da sua subclasse que corresponderem ao seu nível de psiônico ou inferiores.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 4,
    nome: 'Aumento no Valor de Atributo',
    descricao:
      'Você adquire o feito Melhoria no Valor de Atributo ou outro feito de sua escolha para o qual atenda aos pré-requisitos. Você adquire este recurso novamente nos níveis 8, 12 e 16 de psiônico.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Psiônico',
    nivel: 5,
    nome: 'Restauração Psiônica',
    descricao:
      'Você pode realizar uma meditação que concentra a mente por 1 minuto. Ao final dela, você recupera os Dados de Energia Psiônica gastos. Após usar essa habilidade, você não poderá usá-la novamente até concluir um Descanso Longo.',
    tipoAcao: '1 minuto',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 5,
    nome: 'Disciplina Psiônica',
    descricao: 'Você aprende uma opção adicional de Disciplina Psiônica (ver o nível 2 desta classe).',
    tipoAcao: 'Variável',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 7,
    nome: 'Surto Psiônico',
    descricao:
      'Além disso, após rolar um ou mais Dados de Energia Psíquica, você pode gastar um de seus Dados de Vida para tratar qualquer resultado de 1, 2 ou 3 nesses dados como se fosse 4.',
    tipoAcao: 'Grátis',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 10,
    nome: 'Disciplina Psiônica',
    descricao: 'Você aprende uma opção adicional de Disciplina Psiônica (ver o nível 2 desta classe).',
    tipoAcao: 'Variável',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 13,
    nome: 'Disciplina Psiônica',
    descricao: 'Você aprende uma opção adicional de Disciplina Psiônica (ver o nível 2 desta classe).',
    tipoAcao: 'Variável',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 17,
    nome: 'Disciplina Psiônica',
    descricao: 'Você aprende uma opção adicional de Disciplina Psiônica (ver o nível 2 desta classe).',
    tipoAcao: 'Variável',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 18,
    nome: 'Reservas Psiônicas',
    descricao: 'Ao rolar a Iniciativa, você recupera os usos gastos de Dados de Energia Psiônica até ter quatro, caso tenha menos que isso.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: PH,
  },
  {
    classe: 'Psiônico',
    nivel: 19,
    nome: 'Dádiva Épica',
    descricao:
      'Você adquire um feito de Dádiva Épica ou outro feito de sua escolha para o qual atenda aos pré-requisitos. Dádiva da Resistência a Energia é recomendada.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Psiônico',
    nivel: 20,
    nome: 'Força Vital Incandescente',
    descricao:
      'Você queima sua força vital para alcançar poderes psíquicos superiores. Uma vez por turno, ao rolar um ou mais Dados de Energia Psiônica para uma habilidade Psion ou Disciplina Psiônica, você pode gastar um ou dois de seus Dados de Pontos de Vida. Para cada Dado de Pontos de Vida gasto, role um Dado de Energia Psiônica adicional e some os números rolados ao total. Essa rolagem não consome o Dado de Energia Psiônica.',
    tipoAcao: 'Grátis',
    statusImplementacao: PH,
  },
];
