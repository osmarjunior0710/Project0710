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
//
// Monge / Combatente dos Elementos — "Ápice Elemental" (nível 17) tinha a
// introdução do capítulo do Paladino colada no fim da célula (mesmo problema
// de extração da seção 8 do CLAUDE.md) — cortada, confirmado contra o Livro
// do Jogador (Cap. 3, pág. 165).

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
  /** Truques concedidos de forma fixa por esta característica (ex.:
   * Manipular Elementos → Elementalismo). Ver `core/magiasSubclasse.ts`. */
  truquesConcedidos?: string[];
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
    statusImplementacao: 'codeimplementation',
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
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Mago',
    subclasse: 'Evocador',
    nivel: 14,
    nome: 'Sobrecarga',
    descricao:
      'Você pode aumentar o poder de suas magias. Ao conjurar uma magia de Mago que cause dano com um espaço de magia de 1º a 5º círculo, você pode causar dano máximo com essa magia no turno no qual a conjurar. Ao fazer isso pela primeira vez, você não sofre nenhum efeito adverso. Se usar esta característica novamente antes de completar um Descanso Longo, você sofre 2d12 pontos de dano Necrótico para cada círculo do espaço de magia imediatamente após conjurá-la. Esse dano ignora Resistência e Imunidade. Toda vez que você usa esta característica novamente antes de completar um Descanso Longo, o dano Necrótico por círculo de magia aumenta em 1d12.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
  },
  // Paladino — 4 juramentos. "Arma Sagrada" e "A Ira da Natureza"
  // tinham a legenda de margem lateral da página impressa colada no
  // meio do parágrafo (mesmo problema de extração da seção 8 do
  // CLAUDE.md) — cortada. "Campeão Ancestral" tinha o texto de exemplo
  // de personagens famosos (repetido 2x) colado no final — cortado.
  // "Defesa Gloriosa" e "Alma Vingativa" tinham "Tipo de Ação" mal
  // marcado na planilha, mas o texto diz "executar uma Reação" —
  // corrigido pra "Reação" (mesmo ajuste já feito em outras classes).
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    nivel: 3,
    nome: 'Magias do Juramento da Devoção',
    descricao:
      'A magia do seu juramento garante que você sempre tenha certas magias prontas; ao atingir um nível de Paladino detalhado na tabela Magias do Juramento da Devoção, você sempre tem as magias apresentadas preparadas.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
    magiasFixasPorNivel: {
      3: ['Escudo da Fé', 'Proteção Contra o Bem e o Mal'],
      5: ['Auxílio', 'Zona da Verdade'],
      9: ['Dissipar Magia', 'Sinal de Esperança'],
      13: ['Defensor da Fé', 'Movimentação Livre'],
      17: ['Coluna de Chamas', 'Comunhão'],
    },
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    nivel: 3,
    nome: 'Arma Sagrada',
    descricao:
      'Ao executar a ação Atacar, você pode gastar um uso de seu Canalizar Divindade para imbuir uma arma Corpo a Corpo que você está empunhando com energia positiva. Por 10 minutos ou até usar essa característica novamente, você adiciona seu modificador de Carisma às jogadas de ataque que realizar com essa arma (bônus mínimo de +1) e, cada vez que atingir com ela, você causa o tipo de dano normal da arma ou dano Radiante. Além disso, a arma também emite Luz Plena em um raio de 6 metros e Meia-luz por mais 6 metros. Você pode encerrar este efeito mais cedo (nenhuma ação é necessária). Este efeito também encerra se você não estiver carregando a arma.',
    tipoAcao: 'Grátis',
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    nivel: 7,
    nome: 'Aura de Devoção',
    descricao:
      'Você e seus aliados têm Imunidade à condição Enfeitiçado enquanto estiverem em sua Aura de Proteção. Se um aliado Enfeitiçado entrar na aura, essa condição não tem efeito sobre esse aliado enquanto ele estiver na aura.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'textonly',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    nivel: 15,
    nome: 'Destruição Protetora',
    descricao:
      'Sua destruição mágica agora irradia energia protetora. Ao conjurar Destruição Divina, você e seus aliados têm Cobertura Parcial enquanto estiverem em sua Aura de Proteção. A aura mantém este benefício até o início do seu próximo turno.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'textonly',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Devoção',
    nivel: 20,
    nome: 'Resplendor Sagrado',
    descricao:
      'Como uma Ação Bônus, você pode imbuir sua Aura de Proteção com poder sagrado, concedendo os benefícios abaixo por 10 minutos ou até a encerrar (nenhuma ação é necessária). Após usar esta característica, você não pode utilizá-la novamente até completar um Descanso Longo. Você também pode recuperar seu uso gastando um espaço de magia de 5º círculo (nenhuma ação é necessária). Dano Radiante. Sempre que um inimigo inicia o turno na sua aura, essa criatura sofre dano Radiante igual ao seu modificador de Carisma mais seu Bônus de Proficiência. Luz Solar. A aura é preenchida com Luz Plena que é luz solar. Vigília Consagrada. Você tem Vantagem em qualquer salvaguarda que seja forçado a realizar por um Ínfero ou um Morto-Vivo.',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: 'codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 3,
    nome: 'Atleta Inigualável',
    descricao:
      'Como uma Ação Bônus, você pode gastar um uso do seu Canalizar Divindade para aprimorar seu atletismo. Por 1 hora, você tem Vantagem em testes de Força (Atletismo) e Destreza (Acrobacia), e a distância de seus Saltos Longos e Salto em Altura aumenta em 3 metros (essa distância adicional custa movimento padrão).',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 3,
    nome: 'Destruição Inspiradora',
    descricao:
      'Imediatamente após conjurar Destruição Divina, você pode gastar um uso do seu Canalizar Divindade e distribuir Pontos de Vida Temporários para criaturas à sua escolha a até 9 metros de si, incluindo você. O número total de Pontos de Vida Temporários é igual a 2d8 mais o seu nível de Paladino, dividido entre as criaturas escolhidas, como preferir.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 3,
    nome: 'Magias do Juramento da Glória',
    descricao:
      'A magia do seu juramento garante que você sempre tenha certas magias prontas; ao atingir um nível de Paladino detalhado na tabela Magias do Juramento da Glória, você sempre tem as magias apresentadas preparadas.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
    magiasFixasPorNivel: {
      3: ['Heroísmo', 'Raio Guia'],
      5: ['Aprimorar Atributo', 'Arma Mágica'],
      9: ['Celeridade', 'Proteção contra Energia'],
      13: ['Compulsão', 'Movimentação Livre'],
      17: ['Lendas e Histórias', 'Presença Régia de Yolande'],
    },
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 7,
    nome: 'Aura de Vivacidade',
    descricao:
      'Seu Deslocamento aumenta em 3 metros. Além disso, sempre que um aliado entra em sua Aura de Proteção pela primeira vez em um turno ou inicia o turno dele na aura, o Deslocamento do aliado aumenta em 3 metros até o final do próximo turno dele.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 15,
    nome: 'Defesa Gloriosa',
    descricao:
      'Você pode transformar a defesa em um ataque repentino. Quando você ou outra criatura à sua vista a até 3 metros de você é atingida por uma jogada de ataque, você pode executar uma Reação para conceder um bônus à CA do alvo contra esse ataque, fazendo potencialmente com que o ataque erre. O bônus é igual ao seu modificador de Carisma (mínimo de +1). Se o ataque falhar, você pode realizar um ataque com uma arma contra o atacante como parte desta Reação se o atacante estiver no alcance da sua arma. Você pode usar essa característica um número de vezes igual ao seu modificador de Carisma (mínimo de uma vez) e restaura todos os usos gastos ao completar um Descanso Longo.',
    tipoAcao: 'Reação',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento da Glória',
    nivel: 20,
    nome: 'Lenda Viva',
    descricao:
      'Você pode se fortalecer com as lendas — verdadeiras ou exageradas — de seus grandes feitos. Como uma Ação Bônus, você recebe os benefícios abaixo por 10 minutos. Após usar essa característica, você não pode utilizá-la novamente até completar um Descanso Longo. Você também pode recuperar seu uso gastando um espaço de magia de 5º círculo (nenhuma ação é necessária). Carismático. Você é abençoado com uma presença sobrenatural e tem Vantagem em todos os testes de Carisma. Golpe Infalível. Uma vez em cada um dos seus turnos, ao realizar uma jogada de ataque com uma arma e errar, você pode fazer com que esse ataque atinja. Jogar Novamente a Salvaguarda. Se você falhar em uma salvaguarda, pode usar sua Reação para jogá-la novamente. Você deve usar o novo resultado.',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento de Vingança',
    nivel: 3,
    nome: 'Magias do Juramento de Vingança',
    descricao:
      'A magia do seu juramento garante que você sempre tenha certas magias prontas; quando você atinge um nível de Paladino detalhado na tabela Magias do Juramento de Vingança, você sempre tem as magias apresentadas preparadas.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
    magiasFixasPorNivel: {
      3: ['Marca do Predador', 'Perdição'],
      5: ['Paralisar Pessoa', 'Passo Nebuloso'],
      9: ['Celeridade', 'Proteção contra Energia'],
      13: ['Banimento', 'Porta Dimensional'],
      17: ['Paralisar Monstro', 'Vidência'],
    },
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento de Vingança',
    nivel: 3,
    nome: 'Voto de Inimizade',
    descricao:
      'Ao executar a ação Atacar, você pode gastar um uso de seu Canalizar Divindade para proferir um voto de inimizade contra uma criatura à sua vista a até 9 metros de si. Você tem Vantagem em jogadas de ataque contra a criatura por 1 minuto ou até usar essa característica novamente. Caso a criatura caia a 0 Pontos de Vida antes que o voto termine, você pode transferir o voto para uma criatura diferente a até 9 metros de você (nenhuma ação é necessária).',
    tipoAcao: 'Grátis',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento de Vingança',
    nivel: 7,
    nome: 'Vingador Implacável',
    descricao:
      'Seu foco sobrenatural permite que você evite a retirada de um inimigo. Ao atingir uma criatura com um Ataque de Oportunidade, você pode reduzir o Deslocamento da criatura para 0 até o final do turno atual. Você pode, então, se mover até metade de seu Deslocamento como parte da mesma Reação. Esse movimento não provoca Ataques de Oportunidade.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento de Vingança',
    nivel: 15,
    nome: 'Alma Vingativa',
    descricao:
      'Imediatamente após uma criatura sob o efeito do seu Voto de Inimizade acertar ou errar com uma jogada de ataque, você pode executar uma Reação para realizar um ataque corpo a corpo contra essa criatura se ela estiver ao seu alcance.',
    tipoAcao: 'Reação',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento de Vingança',
    nivel: 20,
    nome: 'Anjo Vingador',
    descricao:
      'Como uma Ação Bônus, você adquire os benefícios abaixo por 10 minutos ou até a encerrar (nenhuma ação é necessária). Após usar esta característica, você não pode utilizá-la novamente até completar um Descanso Longo. Você também pode recuperar seu uso gastando um espaço de magia de 5º círculo (nenhuma ação é necessária). Aura Amedrontadora. Sempre que um inimigo inicia o turno dele em sua Aura de Proteção, ele deve ser bem-sucedido em uma salvaguarda de Sabedoria ou tem a condição Amedrontado por 1 minuto, ou até sofrer qualquer dano. Jogadas de ataque contra a criatura Amedrontada têm Vantagem. Voo. Você cria asas espectrais nas costas e tem um Deslocamento de Voo de 18 metros, além de poder pairar.',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento dos Anciões',
    nivel: 3,
    nome: 'A Ira da Natureza',
    descricao:
      'Como uma ação Usar Magia, você pode gastar um uso do seu Canalizar Divindade para conjurar videiras espectrais em torno de criaturas próximas. Cada criatura à sua escolha que você possa ver a até 4,5 metros de você deve ser bem-sucedida em uma salvaguarda de Força ou tem a condição Contido por 1 minuto. Uma criatura Contida repete a salvaguarda no final de cada um dos turnos dela, encerrando o efeito em caso de sucesso.',
    tipoAcao: 'Ação',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento dos Anciões',
    nivel: 3,
    nome: 'Magias do Juramento dos Anciões',
    descricao:
      'A magia do seu juramento garante que você sempre tenha certas magias prontas; quando você atinge um nível de Paladino detalhado na tabela Magias do Juramento dos Anciões, você sempre tem as magias apresentadas preparadas.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
    magiasFixasPorNivel: {
      3: ['Falar com Animais', 'Golpe Constritor'],
      5: ['Passo Nebuloso', 'Raio Lunar'],
      9: ['Crescimento de Plantas', 'Proteção contra Energia'],
      13: ['Pele-Rocha', 'Tempestade Glacial'],
      17: ['Comunhão com a Natureza', 'Passo Arbóreo'],
    },
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento dos Anciões',
    nivel: 7,
    nome: 'Aura de Resistência',
    descricao:
      'Magia antiga repousa tão fortemente em você que forma uma proteção mística, bloqueando a energia que vem de fora do Plano Material; você e seus aliados têm Resistência a dano Necrótico, Psíquico e Radiantes enquanto estiverem em sua Aura de Proteção.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento dos Anciões',
    nivel: 15,
    nome: 'Sentinela Imortal',
    descricao:
      'Ao ser reduzido a 0 Pontos de Vida e não morto imediatamente, você fica com 1 Ponto de Vida e recupera um número de Pontos de Vida igual a três vezes o seu nível de Paladino. Após usar essa característica, você não pode utilizá-la novamente até completar um Descanso Longo. Além disso, você não pode envelhecer magicamente e sua aparência não envelhece.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Paladino',
    subclasse: 'Juramento dos Anciões',
    nivel: 20,
    nome: 'Campeão Ancestral',
    descricao:
      'Como uma Ação Bônus, você pode imbuir sua Aura de Proteção com poder sagrado, concedendo os benefícios abaixo por 1 minuto ou até a encerrar (nenhuma ação é necessária). Após usar esta característica, você não pode utilizá-la novamente até completar um Descanso Longo. Você também pode restaurar seu uso gastando um espaço de magia de 5º círculo (nenhuma ação é necessária). Aliviar Desafio. Inimigos na sua aura têm Desvantagem em salvaguardas contra suas magias e opções de Canalizar Divindade. Magias Ágeis. Sempre que conjurar uma magia que tenha um tempo de conjuração de uma ação, você pode conjurá-la usando uma Ação Bônus. Regeneração. No início de cada um dos seus turnos, você recupera 10 Pontos de Vida.',
    tipoAcao: 'Ação Bônus',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Monge',
    subclasse: 'Combatente dos Elementos',
    nivel: 3,
    nome: 'Manipular Elementos',
    descricao:
      'Você conhece a magia Elementalismo. Sabedoria é seu atributo de conjuração para ela.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'codeimplementation',
    truquesConcedidos: ['Elementalismo'],
  },
  {
    classe: 'Monge',
    subclasse: 'Combatente dos Elementos',
    nivel: 3,
    nome: 'Sintonia Elemental',
    descricao:
      'No início do seu turno, você pode gastar 1 Ponto de Foco para imbuir-se de energia elemental. A energia dura 10 minutos ou até você ter a condição Incapacitado. Você adquire os seguintes benefícios enquanto esta característica estiver ativa. Ataques Elementais. Ao acertar com seu Ataque Desarmado, você pode causar com ele, à sua escolha, dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante, em vez de seu tipo de dano normal. Ao causar um desses tipos de dano, você também pode forçar o alvo a realizar uma salvaguarda de Força. Se ele falhar, você pode movê-lo até 3 metros em sua direção ou para longe de você, enquanto a energia elemental gira em torno dele. Extensão. Ao realizar um Ataque Desarmado, seu alcance aumenta em 3 metros à medida que a energia elemental se estende por você.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Monge',
    subclasse: 'Combatente dos Elementos',
    nivel: 6,
    nome: 'Explosão Elemental',
    descricao:
      'Como uma ação Usar Magia, você pode gastar 2 Pontos de Foco para fazer com que energia elemental exploda em uma Esfera de 6 metros de raio centrada em um ponto a até 36 metros de você. Escolha um tipo de dano: Ácido, Elétrico, Gélido, Ígneo ou Trovejante. Cada criatura na Esfera deve realizar uma salvaguarda de Destreza. Se falhar, uma criatura sofre dano do tipo escolhido igual a três jogadas de seus dados de Artes Marciais. Em caso de sucesso, uma criatura sofre metade do dano.',
    tipoAcao: 'Ação',
    statusImplementacao: 'placeholder-codeimplementation',
  },
  {
    classe: 'Monge',
    subclasse: 'Combatente dos Elementos',
    nivel: 11,
    nome: 'Passo dos Elementos',
    descricao:
      'Enquanto sua Sintonia Elemental estiver ativa, você também tem um Deslocamento de Natação e de Voo igual ao seu Deslocamento.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-textonly',
  },
  {
    classe: 'Monge',
    subclasse: 'Combatente dos Elementos',
    nivel: 17,
    nome: 'Ápice Elemental',
    descricao:
      'Enquanto sua Sintonia Elemental estiver ativa, você também adquire os seguintes benefícios. Golpes Potencializados. Uma vez em cada um dos seus turnos, você pode causar dano adicional a um alvo igual a uma jogada de seu dado de Artes Marciais ao atingi-lo com um Ataque Desarmado. O dano adicional é do mesmo tipo causado por esse ataque. Passo Destrutivo. Ao usar seu Passo do Vento, seu Deslocamento aumenta em 6 metros até o final do turno. Pela duração, qualquer criatura à sua escolha sofre dano igual a uma jogada de seu dado de Artes Marciais quando você entra em um espaço a até 1,5 metro dela. O tipo de dano fica à sua escolha, entre Ácido, Elétrico, Gélido, Ígneo ou Trovejante. Uma criatura pode sofrer esse dano apenas uma vez por turno. Resistência a Dano. Você adquire Resistência a um dos seguintes tipos de dano à sua escolha: Ácido, Elétrico, Gélido, Ígneo ou Trovejante. No início de cada um dos seus turnos, você pode alterar essa escolha.',
    tipoAcao: 'Passiva / Estática',
    statusImplementacao: 'placeholder-codeimplementation',
  },
];
