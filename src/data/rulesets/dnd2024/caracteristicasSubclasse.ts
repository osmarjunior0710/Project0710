import type { StatusImplementacao } from './statusImplementacao';

// Gerado a partir de dnd-master-referencia.xlsx, aba "Subclasses". Não
// editar valores à mão.
//
// Bardo / Colégio do Conhecimento + Bruxo / Patrono Ínfero + Bárbaro /
// Trilha da Árvore do Mundo + Mago / Evocador importados — as outras 3
// de Bardo (Bravura, Dança, Glamour), as outras 3 de Bruxo (Arquifada,
// Celestial, Grande Antigo), as outras 3 de Bárbaro (Berserker,
// Coração Selvagem, Fanático) e as outras 3 subclasses oficiais de
// Mago (Abjurador, Adivinhador, Ilusionista) entram sob demanda, mesmo
// padrão de `caracteristicasClasse.ts`.
//
// "Tipo de Ação (auto, revisar)" da planilha marcou "Palavras de
// Interrupção" como "Passiva / Estática" — errado, o texto da própria
// descrição diz "você pode executar uma Reação". Corrigido aqui pra
// "Reação" (mesmo tipo de ajuste manual já feito em
// `caracteristicasClasse.ts` pro Contra-Encantamento do Bardo).
//
// Bruxo / Patrono Ínfero — "Lançar no Inferno" (nível 14) tinha o
// início da seção de Clérigo colado no final da célula (mesmo
// problema de extração já documentado no CLAUDE.md seção 8) — cortado
// na importação, mantendo só o parágrafo de regra real. Também tinha
// um espaço quebrando a palavra "tem" ("e t em a condição") — corrigido.
//
// Bárbaro / Trilha da Árvore do Mundo — "Raízes Devastadoras" (nível
// 10) tinha a legenda de margem lateral da página impressa
// ("Subclasse Trilha da" / "Árvore do Mundo") colada no meio do
// parágrafo (mesmo problema de extração da seção 8 do CLAUDE.md) —
// cortada, confirmado contra o Livro do Jogador (Cap. 3). "Ramos da
// Árvore" (nível 6) tinha "Tipo de Ação" marcado como "Passiva /
// Estática" na planilha, mas o texto diz "você pode executar uma
// Reação" — corrigido pra "Reação" (mesmo ajuste já feito em Palavras
// de Interrupção do Bardo).
//
// Mago / Evocador — "Sobrecarga" (nível 14) tinha a legenda de margem
// lateral da página impressa ("Subclasse Evocador") colada no fim da
// célula (mesmo problema de extração da seção 8 do CLAUDE.md) —
// cortada, confirmado contra o Livro do Jogador (Cap. 3).

export interface CaracteristicaSubclasse {
  classe: string;
  subclasse: string;
  nivel: number;
  nome: string;
  descricao: string;
  tipoAcao: string;
  /** Ver CLAUDE.md §12.1. Opcional — preenchido só na classe/subclasse do
   * foco em andamento; `undefined` nas demais (ainda não classificadas). */
  statusImplementacao?: StatusImplementacao;
  /** Só "Magias de Pacto do Ínfero" (Bruxo) hoje — lista fixa de
   * magias sempre preparadas por nível de classe, sem escolha do
   * jogador (diferente de "Descobertas Mágicas" do Bardo, que É uma
   * escolha). `undefined` nas outras características. */
  magiasFixasPorNivel?: Record<number, string[]>;
}

export const caracteristicasSubclasse: CaracteristicaSubclasse[] = [
  {
    classe: 'Bardo',
    subclasse: 'Colégio do Conhecimento',
    nivel: 3,
    nome: 'Palavras de Interrupção',
    descricao:
      'Você aprende a usar sua sagacidade para distrair, confundir e diminuir sobrenaturalmente a confiança e a competência dos outros. Quando uma criatura à sua vista a até 18 metros de você realizar uma jogada de dano, ou for bem-sucedida em um teste de atributo ou jogada de ataque, você pode executar uma Reação para gastar um uso da sua Inspiração de Bardo. Jogue o dado de Inspiração de Bardo e subtraia o número jogado do resultado da criatura, reduzindo o dano ou transformando potencialmente o sucesso em fracasso.',
    tipoAcao: 'Reação',
  },
  {
    classe: 'Bardo',
    subclasse: 'Colégio do Conhecimento',
    nivel: 3,
    nome: 'Proficiências Bônus',
    descricao: 'Você adquire proficiência em três perícias à sua escolha.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    subclasse: 'Colégio do Conhecimento',
    nivel: 6,
    nome: 'Descobertas Mágicas',
    descricao:
      'Você aprende duas magias à sua escolha. Essas magias podem vir da lista de magias de Clérigo, Druida ou Mago, ou uma combinação dessas listas (veja a seção da classe para a respectiva lista de magias). A magia escolhida deve ser um truque ou uma magia para a qual você tenha espaços de magia disponíveis, conforme mostrado na tabela Características de Bardo. Você sempre tem as magias escolhidas preparadas e, sempre que adquirir um novo nível de Bardo, pode substituir uma das magias por outra que atenda a esses requisitos.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    subclasse: 'Colégio do Conhecimento',
    nivel: 14,
    nome: 'Perícia Inigualável',
    descricao:
      'Quando você realizar um teste de atributo ou uma jogada de ataque e falhar, pode gastar um uso da Inspiração de Bardo; jogue o dado da Inspiração de Bardo e adicione o resultado jogado ao d20, transformando potencialmente a falha em sucesso. Se falhar, o uso da Inspiração de Bardo não é gasto.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    subclasse: 'Patrono Ínfero',
    nivel: 3,
    nome: 'Bênção do Tenebroso',
    descricao:
      'Ao reduzir um inimigo a 0 Pontos de Vida, você adquire Pontos de Vida Temporários iguais ao seu modificador de Carisma mais seu nível de Bruxo (mínimo de 1 Ponto de Vida Temporário). Você também recebe esse benefício se outra pessoa reduzir um inimigo a até 3 metros de você a 0 Pontos de Vida.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    subclasse: 'Patrono Ínfero',
    nivel: 3,
    nome: 'Magias de Pacto do Ínfero',
    descricao:
      'A magia do seu patrono assegura que você sempre tenha algumas magias disponíveis; ao atingir um nível de Bruxo indicado na tabela Magias do Ínfero, você sempre tem essas magias preparadas. Magias do Ínfero — Nível 3: Comando, Mãos Flamejantes, Raio Ardente, Sugestão. Nível 5: Bola de Fogo, Nuvem Fétida. Nível 7: Escudo Ardente, Muralha de Fogo. Nível 9: Missão, Praga de Insetos.',
    tipoAcao: 'Passiva / Estática',
    magiasFixasPorNivel: {
      3: ['Comando', 'Mãos Flamejantes', 'Raio Ardente', 'Sugestão'],
      5: ['Bola de Fogo', 'Nuvem Fétida'],
      7: ['Escudo Ardente', 'Muralha de Fogo'],
      9: ['Missão', 'Praga de Insetos'],
    },
  },
  {
    classe: 'Bruxo',
    subclasse: 'Patrono Ínfero',
    nivel: 6,
    nome: 'A Sorte do Próprio Tenebroso',
    descricao:
      'Você pode chamar seu patrono Ínfero para alterar o destino a seu favor. Ao realizar um teste de atributo ou uma salvaguarda, você pode usar essa característica para adicionar 1d10 à sua jogada. Você pode fazer isso após ver a jogada, mas antes que qualquer um dos efeitos da jogada ocorra. Você pode usar essa característica um número de vezes igual ao seu modificador de Carisma (mínimo de uma vez), no máximo uma vez por jogada, e restaura todos os usos gastos ao completar um Descanso Longo.',
    tipoAcao: 'Recurso limitado (revisar tipo de ativação)',
  },
  {
    classe: 'Bruxo',
    subclasse: 'Patrono Ínfero',
    nivel: 10,
    nome: 'Resistência Ínfera',
    descricao:
      'Ao completar um Descanso Curto ou Longo, escolha um tipo de dano, exceto Energético. Você tem Resistência a esse tipo de dano até escolher um tipo de dano diferente com esta característica.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    subclasse: 'Patrono Ínfero',
    nivel: 14,
    nome: 'Lançar no Inferno',
    descricao:
      'Uma vez por turno, ao atingir uma criatura com uma jogada de ataque, você pode tentar transportar instantaneamente o alvo para os Planos Inferiores. O alvo deve ser bem-sucedido em uma salvaguarda de Carisma contra a CD para evitar sua magia, ou ele desaparece e atravessa uma paisagem de pesadelo. O alvo sofre 8d10 pontos de dano Psíquico se não for um Ínfero e tem a condição Incapacitado até o final do seu próximo turno, quando retorna ao espaço que ocupava anteriormente ou ao espaço desocupado mais próximo. Você pode usar esta característica novamente após completar um Descanso Longo, a menos que gaste um espaço de Magia de Pacto (nenhuma ação é necessária) para restaurar seu uso.',
    tipoAcao: 'Grátis',
  },
  {
    classe: 'Bárbaro',
    subclasse: 'Trilha da Árvore do Mundo',
    nivel: 3,
    nome: 'Vitalidade da Árvore',
    descricao:
      'Sua Fúria se conecta à força vital da Árvore do Mundo. Você adquire os seguintes benefícios. Força Revigorante. No início de cada um dos seus turnos enquanto sua Fúria estiver ativa, você pode escolher outra criatura a até 3 metros de você para receber Pontos de Vida Temporários. Para determinar a quantidade de Pontos de Vida Temporários, jogue um número de d6s igual ao seu bônus de Dano da Fúria e some os valores. Se qualquer um desses Pontos de Vida Temporários ainda estiverem ativos quando sua Fúria terminar, eles desaparecem. Surto de Vitalidade. Ao ativar sua Fúria, você recebe um número de Pontos de Vida Temporários igual ao seu nível de Bárbaro.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bárbaro',
    subclasse: 'Trilha da Árvore do Mundo',
    nivel: 6,
    nome: 'Ramos da Árvore',
    descricao:
      'Sempre que uma criatura que você pode ver começar o turno a até 9 metros de você enquanto sua Fúria estiver ativa, você pode executar uma Reação para convocar ramos espectrais da Árvore do Mundo ao redor dela. O alvo deve ser bem-sucedido em uma salvaguarda de Força (CD 8 mais seu modificador de Força e seu Bônus de Proficiência) ou é teleportado para um espaço desocupado à sua vista a até 1,5 metro de você ou no espaço desocupado mais próximo à sua vista. Depois que o alvo se teleportar, você pode reduzir o Deslocamento dele a 0 até o final do turno atual.',
    tipoAcao: 'Reação',
  },
  {
    classe: 'Bárbaro',
    subclasse: 'Trilha da Árvore do Mundo',
    nivel: 10,
    nome: 'Raízes Devastadoras',
    descricao:
      'Durante o seu turno, seu alcance é 3 metros maior com qualquer arma corpo a corpo que tenha a propriedade Pesada ou Versátil, à medida que as raízes da Árvore do Mundo se estendem a partir de você. Quando você atinge com tal arma no seu turno, pode ativar a propriedade de maestria Derrubar ou Empurrar, além de outra propriedade de maestria que você estiver utilizando com a arma.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bárbaro',
    subclasse: 'Trilha da Árvore do Mundo',
    nivel: 14,
    nome: 'Percorrer a Árvore',
    descricao:
      'Ao ativar sua Fúria e, como uma Ação Bônus enquanto ela estiver ativa, você pode se teleportar a até 18 metros para um espaço desocupado à sua vista. Além disso, uma vez por Fúria, você pode aumentar o alcance desse teleporte para 45 metros. Ao fazer isso, você também pode levar até seis criaturas voluntárias que estejam a até 3 metros de você. Cada criatura se teleporta para um espaço desocupado à sua escolha a até 3 metros do seu destino.',
    tipoAcao: 'Ação Bônus',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 3,
    nome: 'Truque Potente',
    descricao:
      'Seus truques que causam dano afetam até criaturas que evitam os efeitos deles. Ao conjurar um truque em uma criatura e errar o ataque ou o alvo ser bem-sucedido na salvaguarda contra o truque, ele sofre metade do dano (se houver), mas não sofre efeitos adicionais do truque.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 3,
    nome: 'Versado em Evocação',
    descricao:
      'Escolha duas magias de Mago da escola de Evocação, cada uma deve ser de 2º círculo ou inferior, e adicione-as gratuitamente ao seu livro de magias. Além disso, ao adquirir acesso a um novo círculo de espaços de magia nesta classe, você pode adicionar gratuitamente uma magia de Mago da escola de Evocação ao seu livro de magias. A magia escolhida deve ser de um círculo para o qual você tenha espaços de magia.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 6,
    nome: 'Esculpir Magias',
    descricao:
      'Você pode criar zonas de segurança nos efeitos das suas evocações. Ao conjurar uma magia de Evocação que afeta criaturas à sua vista, você pode escolher um número delas igual a 1 mais o círculo da magia. Criaturas escolhidas são bem-sucedidas automaticamente em suas salvaguardas e não sofrem dano se normalmente sofreriam metade do dano em caso de sucesso.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'textonly',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 10,
    nome: 'Evocação Potencializada',
    descricao:
      'Ao conjurar uma magia de Mago da escola de Evocação, você pode adicionar seu modificador de Inteligência a uma jogada de dano dessa magia.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 14,
    nome: 'Sobrecarga',
    descricao:
      'Você pode aumentar o poder de suas magias. Ao conjurar uma magia de Mago que cause dano com um espaço de magia de 1º a 5º círculo, você pode causar dano máximo com essa magia no turno no qual a conjurar. Ao fazer isso pela primeira vez, você não sofre nenhum efeito adverso. Se usar esta característica novamente antes de completar um Descanso Longo, você sofre 2d12 pontos de dano Necrótico para cada círculo do espaço de magia imediatamente após conjurá-la. Esse dano ignora Resistência e Imunidade. Toda vez que você usa esta característica novamente antes de completar um Descanso Longo, o dano Necrótico por círculo de magia aumenta em 1d12.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
];
