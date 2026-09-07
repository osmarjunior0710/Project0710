// Gerado a partir de dnd-master-referencia.xlsx, aba "Características
// de Classe". Não editar valores à mão.
//
// Guerreiro e Bardo importados por enquanto (base, sem subclasses). Na
// célula da planilha, as descrições dos níveis 2 ("Mente Tática"), 5
// ("Ataque Extra") e 20 ("Três Ataques Extras") do Guerreiro, e "Conjuração"
// (1) e "Palavras de Criação" (20) do Bardo, vêm com uma tabela/lista
// inteira colada dentro do texto (problema de extração da planilha,
// mesmo padrão já visto em "Ferramentas de Entalhador" da aba
// Ferramentas) — removido ao importar aqui, mantendo o parágrafo de
// regra intacto e idêntico ao original. Registrado em PENDENCIAS.md.

export interface CaracteristicaClasse {
  classe: string;
  nivel: number;
  nome: string;
  descricao: string;
  tipoAcao: string;
}

export const caracteristicasClasse: CaracteristicaClasse[] = [
  {
    classe: 'Guerreiro',
    nivel: 1,
    nome: 'Estilo de Luta',
    descricao:
      'Você aprimorou suas proezas marciais e tem um talento de Estilo de Luta à sua escolha (veja também o capítulo 5). Sempre que atinge um nível de Guerreiro, você pode substituir o talento que escolheu por um talento diferente de Estilo de Luta.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 1,
    nome: 'Maestria em Arma',
    descricao:
      'Seu treinamento com armas permite que você utilize as propriedades de maestria com três tipos de armas Simples ou Marciais à sua escolha. Sempre que completar um Descanso Longo, você pode praticar movimentos com armas e alterar uma dessas escolhas de armas. Ao alcançar certos níveis de Guerreiro, você adquire a habilidade de usar as propriedades de maestria de mais tipos de armas, conforme mostrado na coluna Maestria em Armas da tabela Características de Guerreiro.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 1,
    nome: 'Recuperar Fôlego',
    descricao:
      'Você tem uma reserva limitada de resistência física e mental que pode usar. Como uma Ação Bônus, você pode usá-la para recuperar Pontos de Vida iguais a 1d10 mais seu nível de Guerreiro. Você pode usar essa característica duas vezes. Você recupera um uso gasto quando completa um Descanso Curto e restaura todos os usos gastos quando completa um Descanso Longo. Ao atingir certos níveis de Guerreiro, você adquire mais usos dessa característica, conforme mostrado na coluna Recuperar Fôlego da tabela Características de Guerreiro.',
    tipoAcao: 'Ação Bônus',
  },
  {
    classe: 'Guerreiro',
    nivel: 2,
    nome: 'Mente Tática',
    descricao:
      'Você tem uma mente para táticas dentro e fora do campo de batalha. Ao falhar em um teste de atributo, você pode gastar um uso de seu Recuperar Fôlego para tentar alcançar a vitória. Em vez de recuperar Pontos de Vida, você joga 1d10 e adiciona o resultado ao teste de atributo, potencialmente transformando-o em sucesso. Se o teste ainda assim falhar, esse uso do Recuperar Fôlego não é gasto.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 2,
    nome: 'Surto de Ação',
    descricao:
      'Você pode se esforçar além de seus limites normais por um momento. No seu turno, você pode executar uma ação adicional, exceto a ação Usar Magia. Após usar esta característica, você não pode usá-la novamente até completar um Descanso Curto ou Longo. A partir do nível 17, você pode usá-lo duas vezes antes de um descanso, mas apenas uma vez em um turno.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 3,
    nome: 'Subclasse de Guerreiro',
    descricao:
      'Você adquire uma subclasse de Guerreiro à sua escolha. As subclasses Campeão, Cavaleiro Místico, Combatente Psíquico e Mestre da Batalha estão detalhadas após a descrição desta classe. Uma subclasse é uma especialidade que concede a você características em determinados níveis de Guerreiro. Pelo resto de sua jornada, você adquire cada uma das características de sua subclasse de seu nível de Guerreiro ou menor.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 4,
    nome: 'Aumento no Valor de Atributo',
    descricao:
      'Você adquire o talento Aumento no Valor de Atributo (veja o capítulo 5) ou outro talento à sua escolha para o qual atenda os pré-requisitos. Você adquire essa característica novamente nos níveis 6, 8, 12, 14 e 16 de Guerreiro.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 5,
    nome: 'Ajuste Tático',
    descricao:
      'Sempre que executar uma Ação Bônus para seu Recuperar Fôlego, você pode mover-se até metade do seu Deslocamento sem provocar Ataques de Oportunidade.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 5,
    nome: 'Ataque Extra',
    descricao: 'Você pode atacar duas vezes, em vez de uma, sempre que executar a ação Atacar no seu turno.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 9,
    nome: 'Indomável',
    descricao:
      'Ao falhar em uma salvaguarda, você pode jogá-la novamente adicionando um bônus igual ao seu nível de Guerreiro. Você deve usar o novo resultado e não pode usar essa característica novamente até completar um Descanso Longo. A partir do nível 13, você pode usar essa característica duas vezes antes de um Descanso Longo e três vezes antes de um Descanso Longo ao atingir o nível 17.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 9,
    nome: 'Mestre Tático',
    descricao:
      'Ao atacar com uma arma cuja propriedade de maestria você pode usar, você pode substituir essa propriedade pela propriedade Empurrar, Drenar ou Lentidão para esse ataque.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 11,
    nome: 'Dois Ataques Extras',
    descricao: 'Você pode atacar três vezes, em vez de uma, sempre que executar a ação Atacar no seu turno.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 13,
    nome: 'Ataques Estudados',
    descricao:
      'Você estuda seus oponentes e aprende com cada ataque que realiza. Se você realizar uma jogada de ataque contra uma criatura e errar, você tem Vantagem em sua próxima jogada de ataque contra essa criatura antes do final do seu próximo turno.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 19,
    nome: 'Dádiva Épica',
    descricao:
      'Você adquire o talento Dádiva Épica (veja o capítulo 5) ou outro talento à sua escolha para o qual se qualifica. Dádiva da Proeza em Combate é recomendada.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Guerreiro',
    nivel: 20,
    nome: 'Três Ataques Extras',
    descricao: 'Você pode atacar quatro vezes, em vez de uma, sempre que executar a ação Atacar no seu turno.',
    tipoAcao: 'Passiva / Estática',
  },
  // Bardo — as células "Conjuração" (nível 1) e "Palavras de Criação"
  // (nível 20) tinham conteúdo de OUTRA parte do livro colado dentro
  // (a tabela de progressão inteira, e a lista de magias de Bardo
  // inteira, respectivamente) — mesmo problema de extração documentado
  // no CLAUDE.md pra outras classes/subclasses. Removido aqui,
  // mantendo o parágrafo de regra real intacto. "Inspiração Superior"
  // também tinha uma frase solta de outra seção colada no fim,
  // removida. Ver PENDENCIAS.md.
  {
    classe: 'Bardo',
    nivel: 1,
    nome: 'Inspiração de Bardo',
    descricao:
      'Você pode inspirar outros sobrenaturalmente por meio de palavras, música ou dança. Essa inspiração é representada pelo seu dado de Inspiração de Bardo, que é um d6. Usando Inspiração de Bardo. Como uma Ação Bônus, você pode inspirar outra criatura a até 18 metros de você que possa vê-lo ou ouvi-lo. Essa criatura recebe um de seus dados de Inspiração de Bardo. Uma criatura pode ter apenas um dado de Inspiração de Bardo de cada vez. Uma vez, dentro da próxima uma hora, após a criatura falhar em um Teste de D20, ela pode jogar o dado de Inspiração de Bardo e adicionar o resultado ao D20, transformando potencialmente a falha em sucesso. O dado de Inspiração de Bardo é gasto quando for jogado. Quantidade de Usos. Você pode conceder um dado de Inspiração de Bardo um número de vezes igual ao seu modificador de Carisma (mínimo de uma vez), e você restaura todos os usos gastos ao completar um Descanso Longo. Em Níveis Superiores. Seu dado de Inspiração de Bardo muda quando você atinge certos níveis de Bardo, conforme mostrado na coluna Dados de Inspiração da tabela Características de Bardo. O dado se torna um d8 no nível 5, um d10 no nível 10 e um d12 no nível 15.',
    tipoAcao: 'Ação Bônus',
  },
  {
    classe: 'Bardo',
    nivel: 1,
    nome: 'Conjuração',
    descricao:
      'Você aprendeu a conjurar magias através de suas artes bárdicas. Veja o capítulo 7 para as regras sobre conjuração de magias. As informações abaixo detalham como você utiliza essas regras com as magias de Bardo, explicadas na lista de magias de Bardo mais adiante na descrição da classe. Truques. Você conhece dois truques à sua escolha da lista de magias de Bardo. Luzes Dançantes e Zombaria Perversa são recomendadas. Sempre que você alcança um nível de Bardo, pode substituir um dos seus truques por outro truque à sua escolha da lista de magias de Bardo. Ao atingir os níveis 4 e 10, você aprende mais um truque à sua escolha da lista de magias de Bardo, conforme mostrado na coluna Truques da tabela Características de Bardo. Espaços de Magia. A tabela Características de Bardo mostra quantos espaços de magia você tem para conjurar suas magias de 1º círculo ou superior. Você restaura todos os espaços gastos quando completa um Descanso Longo. Magias Preparadas de 1º Círculo ou Superior. Você prepara a lista de magias de 1º círculo ou superior que estão disponíveis para você conjurar com esta característica. Para começar, escolha quatro magias de 1º círculo da lista de magias de Bardo. Enfeitiçar Pessoa, Leque Cromático, Palavra Curativa e Sussurros Dissonantes são recomendadas. O número de magias em sua lista aumenta à medida que você alcança níveis de Bardo, conforme mostrado na coluna Magias Preparadas da tabela Características de Bardo. Sempre que esse número aumentar, escolha magias adicionais da lista de magias de Bardo até que o número de magias em sua lista corresponda ao número da tabela. As magias escolhidas devem ser de um círculo para o qual você possui espaços de magia. Por exemplo, se você é um Bardo de nível 3, sua lista de magias preparadas pode incluir seis magias de 1º ou 2º círculo em qualquer combinação. Se outra característica de Bardo lhe der magias que você sempre tem preparadas, essas magias não contam para o número de magias que você pode preparar com esta característica, mas essas magias, de outra forma, contam como magias de Bardo para você. Mudando Suas Magias Preparadas. Sempre que você obtém um nível de Bardo, pode substituir uma magia em sua lista por outra magia de Bardo para a qual você tem espaços de magia. Atributo de Conjuração. Carisma é seu atributo de conjuração para suas magias de Bardo. Foco de Conjuração. Você pode usar um Instrumento Musical como Foco de Conjuração para suas magias de Bardo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 2,
    nome: 'Especialista',
    descricao:
      'Você obtém Especialização (veja o glossário de regras) em duas de suas perícias, à sua escolha, nas quais já seja proficiente. Atuação e Persuasão são recomendadas se você tiver proficiência nelas. No nível 9 de Bardo, você obtém Especialização em mais duas perícias nas quais já seja proficiente à sua escolha.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 2,
    nome: 'Pau pra Toda Obra',
    descricao:
      'Você pode adicionar metade do seu Bônus de Proficiência (arredondado para baixo) a qualquer teste de atributo que realizar que use uma perícia à qual não possua proficiência e que não use seu Bônus de Proficiência. Por exemplo, se você realizar um teste de Força (Atletismo) e não tiver proficiência em Atletismo, pode adicionar metade do seu Bônus de Proficiência ao teste.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 3,
    nome: 'Subclasse de Bardo',
    descricao:
      'Você adquire uma subclasse de Bardo à sua escolha. As subclasses Colégio da Bravura, Colégio da Dança, Colégio do Conhecimento e Colégio do Glamour estão detalhadas após a descrição desta classe. Uma subclasse é uma especialização que lhe concede características em determinados níveis de Bardo. Durante toda sua jornada, você adquire cada característica de sua subclasse que corresponda ao seu nível de Bardo ou inferior.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 4,
    nome: 'Aumento no Valor de Atributo',
    descricao:
      'Você adquire o talento Aumento no Valor de Atributo (veja o capítulo 5) ou outro talento à sua escolha para o qual atenda os pré-requisitos. Você adquire essa característica novamente nos níveis 8, 12 e 16 de Bardo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 5,
    nome: 'Fonte de Inspiração',
    descricao:
      'Você agora restaura todos os seus usos gastos de Inspiração de Bardo quando completa um Descanso Curto ou Longo. Além disso, você pode gastar um espaço de magia (nenhuma ação necessária) para recuperar um uso gasto de Inspiração de Bardo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 7,
    nome: 'Contra-Encantamento',
    descricao:
      'Você pode usar notas musicais ou palavras de poder para interromper efeitos que influenciam a mente. Se você ou uma criatura a até 9 metros de você falhar em uma salvaguarda contra um efeito que aplica as condições Amedrontado ou Enfeitiçado, você pode executar uma Reação para jogar novamente a salvaguarda, e a nova jogada tem Vantagem.',
    tipoAcao: 'Reação',
  },
  {
    classe: 'Bardo',
    nivel: 10,
    nome: 'Segredos Mágicos',
    descricao:
      'Você aprendeu segredos de várias tradições mágicas. Sempre que você alcançar um nível de Bardo (incluindo este nível) e o número de Magias Preparadas na tabela Características de Bardo aumentar, você pode escolher qualquer uma das novas magias preparadas da lista de magias de Bardo, Clérigo, Druida e Mago, e as magias escolhidas contam como magias de Bardo para você (veja a seção de cada classe para a respectiva lista de magias). Além disso, sempre que você substituir uma magia preparada para esta classe, pode trocá-la por uma magia dessas listas.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 18,
    nome: 'Inspiração Superior',
    descricao:
      'Quando você jogar Iniciativa, recupera usos gastos de Inspiração de Bardo até ter dois, se tiver menos do que isso.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 19,
    nome: 'Dádiva Épica',
    descricao:
      'Você adquire um talento Dádiva Épica (veja o capítulo 5) ou outro talento à sua escolha para o qual atenda os pré-requisitos. A Dádiva da Recordação de Magia é recomendada.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bardo',
    nivel: 20,
    nome: 'Palavras de Criação',
    descricao:
      'Você dominou duas das Palavras de Criação: as palavras de vida e morte. Portanto, você sempre tem as magias Palavra de Poder: Matar e Palavra de Poder: Salvar preparadas. Quando você conjura qualquer uma dessas magias, pode escolher uma segunda criatura que está a até 3 metros do primeiro alvo.',
    tipoAcao: 'Passiva / Estática',
  },
  // Bruxo — a célula "Magia de Pacto" (nível 1) na planilha vem com a
  // tabela "Características de Bruxo" inteira colada dentro do texto
  // (mesmo problema de extração já visto em Guerreiro/Bardo) —
  // removida aqui, mantendo o parágrafo de regra igual ao livro
  // (Cap. 3, p. 69-70, conferido célula a célula contra o PDF).
  {
    classe: 'Bruxo',
    nivel: 1,
    nome: 'Invocações Místicas',
    descricao:
      'Você descobriu Invocações Místicas, fragmentos de conhecimento proibido que lhe conferem uma habilidade mágica permanente ou outros ensinamentos. Você recebe uma invocação à sua escolha, como Pacto do Tomo. As invocações são descritas na seção "Opções de Invocações Místicas" mais adiante na descrição desta classe. Pré-requisitos. Se uma invocação tiver um pré-requisito, você deve atendê-lo para aprender essa invocação. Por exemplo, se uma invocação exigir que você seja um Bruxo de nível 5 ou superior, você pode selecionar a invocação quando alcançar o nível 5 de Bruxo. Substituindo e Recebendo outras Invocações. Ao alcançar um nível de Bruxo, você pode substituir uma de suas invocações por outra para a qual se qualifica. Você não pode substituir uma invocação se ela for um pré-requisito para outra invocação que você tenha. Ao alcançar certos níveis de Bruxo, você adquire mais invocações à sua escolha, conforme mostrado na coluna Invocações da tabela Características de Bruxo. Você não pode escolher a mesma invocação mais de uma vez, a menos que a descrição da invocação indique o contrário.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 1,
    nome: 'Magia de Pacto',
    descricao:
      'Por meio de uma cerimônia oculta, você realizou um pacto com uma entidade misteriosa para obter poderes mágicos. Essa voz nas sombras é enigmática, mas a dádiva concedida por ela é clara: a habilidade de conjurar magias. Veja o capítulo 7 para as regras de conjuração. As informações a seguir explicam como aplicar essas regras às magias de Bruxo, que estão listadas mais adiante na descrição da classe. Truques. Você conhece dois truques de Bruxo à sua escolha. Prestidigitação Arcana e Raio Místico são recomendados. Ao alcançar um nível de Bruxo, você pode substituir um dos seus truques dessa característica por outro truque de Bruxo à sua escolha. Ao atingir os níveis 4 e 10 de Bruxo, você aprende mais um truque de Bruxo à sua escolha, conforme detalhado na coluna Truques da tabela Características de Bruxo. Espaços de Magia. A tabela Características de Bruxo mostra quantos espaços de magia você tem para conjurar suas magias de Bruxo de 1º a 5º círculo. A tabela também mostra o círculo desses espaços, todos do mesmo círculo. Você restaura todos os espaços de Magia de Pacto gastos ao completar um Descanso Curto ou Longo. Por exemplo, quando você é um Bruxo de nível 5, você tem dois espaços de magia de 3º círculo. Para conjurar a magia Raio de Bruxa de 1º círculo, você deve gastar um desses espaços e conjurá-la como uma magia de 3º círculo. Magias Preparadas de 1º Círculo ou Superior. Você prepara a lista de magias de 1º círculo ou superior que estão disponíveis para você conjurar com essa característica. Para começar, escolha duas magias de Bruxo de 1º círculo. Danação e Enfeitiçar Pessoa são recomendadas. O número de magias em sua lista aumenta à medida que você alcança níveis de Bruxo, conforme mostrado na coluna Magias Preparadas da tabela Características de Bruxo. Quando esse número aumentar, escolha magias adicionais de Bruxo até que o número de magias em sua lista corresponda ao número da tabela. As magias escolhidas devem ser de um círculo não superior mostrado na coluna círculo do Espaço da tabela para o seu nível. Quando você atinge o nível 6, por exemplo, você aprende uma nova magia de Bruxo, que pode ser de 1º a 3º círculo. Se outra característica de Bruxo lhe concede magias sempre preparadas, elas não contam para o número de magias que você pode preparar com essa característica, mas ainda são consideradas magias de Bruxo para você. Mudando Suas Magias Preparadas. Sempre que você ganha um nível de Bruxo, pode substituir uma magia da sua lista por outra magia de Bruxo elegível. Atributo de Conjuração. Carisma é o atributo de conjuração para suas magias de Bruxo. Foco de Conjuração. Você pode usar um Foco Arcano como um Foco de Conjuração para suas magias de Bruxo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 2,
    nome: 'Astúcia Mágica',
    descricao:
      'Ao final de um rito esotérico que você pode realizar por 1 minuto, você recupera os espaços de magia das Magias de Pacto gastos em um número igual à metade da sua quantidade máxima (arredondado para cima). Você pode usar esta característica novamente após completar um Descanso Longo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 3,
    nome: 'Subclasse de Bruxo',
    descricao:
      'Você adquire uma subclasse de Bruxo à sua escolha. As subclasses Patrono Arquifada, Patrono Celestial, Patrono O Grande Antigo e Patrono Ínfero estão detalhadas após a descrição desta classe. Uma subclasse é uma especialidade que concede a você características em determinados níveis de Bruxo. Durante toda sua jornada, você adquire cada uma das características de sua subclasse de seu nível de Bruxo ou menor.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 4,
    nome: 'Aumento no Valor de Atributo',
    descricao:
      'Você adquire o talento Aumento no Valor de Atributo (veja o capítulo 5) ou outro talento à sua escolha para o qual atenda os pré-requisitos. Você adquire essa característica novamente nos níveis 8, 12 e 16 de Bruxo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 9,
    nome: 'Contatar Patrono',
    descricao:
      'No passado, você entrava em contato com seu patrono por meio de intermediários. Agora, você pode se comunicar diretamente com ele. Você sempre tem a magia Contato Extraplanar preparada. Com esta característica, você pode conjurar a magia sem gastar um espaço de magia para entrar em contato com seu patrono, e você é bem-sucedido automaticamente na salvaguarda da magia. Você pode conjurar a magia com esta característica novamente após completar um Descanso Longo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 11,
    nome: 'Arcana Mística',
    descricao:
      'Seu patrono lhe concede um segredo mágico chamado arcanum. Escolha uma magia de Bruxo de 6º círculo com este arcanum. Você pode conjurar sua magia arcanum uma vez sem gastar um espaço de magia, e novamente desta forma após completar um Descanso Longo. Conforme mostrado na tabela Características de Bruxo, você recebe outra magia de Bruxo à sua escolha que pode ser conjurada deste modo ao atingir os níveis de Bruxo 13 (magia de 7º círculo), 15 (magia de 8º círculo) e 17 (magia de 9º círculo). Você restaura todos os usos da sua Arcana Mística ao completar um Descanso Longo. Ao alcançar um nível de Bruxo, você pode substituir uma de suas magias de arcanum por outra magia de Bruxo do mesmo círculo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 19,
    nome: 'Dádiva Épica',
    descricao:
      'Você adquire o talento Dádiva Épica (veja o capítulo 5) ou outro talento à sua escolha para o qual se qualifica. O talento Dádiva do Destino é recomendado.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Bruxo',
    nivel: 20,
    nome: 'Mestre Místico',
    descricao:
      'Ao usar sua característica Astúcia Mágica, você restaura todos os seus espaços de magia gastos das suas Magias de Pacto.',
    // Coluna auto-classificada da planilha diz "Reação" — provável
    // falso positivo do heurístico (não é uma Reação de verdade, é
    // upgrade automático de Astúcia Mágica), mas mantido como veio,
    // sem editar à mão (campo não é lido por nenhum código hoje).
    tipoAcao: 'Reação',
  },
  // Mago — mesmo problema de extração já documentado (Guerreiro/Bardo/
  // Bruxo): 3 células tinham conteúdo de OUTRA parte do livro colado
  // dentro, cortado aqui mantendo só o parágrafo de regra real:
  // "Conjuração" (nv1) tinha a tabela de progressão inteira colada no
  // meio; "Acadêmico" (nv2) tinha o quadro lateral "Expandindo e
  // Substituindo um Livro de Magias" colado no fim (regra de
  // downtime opcional, fora do escopo de cálculo do app, não faz
  // falta pro motor); "Maestria de Magias" (nv18) tinha uma legenda de
  // ilustração solta no meio ("A rainha élfica Yolande..."); "Assinatura
  // Mágica" (nv20) tinha a lista de magias de Mago inteira (todos os 9
  // círculos) colada no fim. Também corrigido um espaço faltando em
  // "Subclasse de Mago" ("desta classe.Uma subclasse" → "desta
  // classe. Uma subclasse"), mesmo tipo de typo já corrigido no Patrono
  // Ínfero do Bruxo.
  {
    classe: 'Mago',
    nivel: 1,
    nome: 'Adepto de Ritual',
    descricao:
      'Você pode conjurar qualquer magia como um Ritual se essa magia tiver o marcador Ritual e a magia estiver em seu livro de magias. Você não precisa ter a magia preparada, mas deve ler o livro para conjurar uma magia deste modo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 1,
    nome: 'Conjuração',
    descricao:
      'Como estudante de magia arcana, você aprendeu a conjurar magias. Veja o capítulo 7 para as regras sobre conjuração de magias. As informações abaixo detalham como você usa essas regras com magias de Mago, que aparecem na lista de magias de Mago mais adiante na descrição da classe. Truques. Você conhece três truques de Mago à sua escolha. Luz, Mãos Mágicas e Raio de Gelo são recomendados. Ao completar um Descanso Longo, você pode substituir um dos seus truques dessa característica por outro truque de Mago à sua escolha. Ao atingir os níveis 4 e 10 de Mago, você aprende mais um truque de Mago à sua escolha, conforme detalhado na coluna Truques da tabela Características de Mago. Livro de Magias. Seu aprendizado de mago culminou na criação de um livro único: seu livro de magias. É um objeto Minúsculo que pesa 1,5 quilo, contém 100 páginas e pode ser lido apenas por você ou por alguém que conjure Identificar. Você determina a aparência e os materiais do livro, como um tomo com bordas douradas ou uma coleção de pergaminhos amarrados com barbante. O livro contém as magias de 1º círculo ou superior que você conhece. Ele começa com seis magias de mago 1º círculo à sua escolha. Armadura Arcana, Detectar Magia, Mísseis Mágicos, Onda Trovejante, Queda Suave e Sono são recomendadas. Ao atingir um nível de Mago após o primeiro, adicione duas magias de Mago à sua escolha ao seu livro de magias. Cada uma dessas magias deve ser de um círculo para o qual você tenha espaços de magia, conforme detalhado na tabela Características de Mago. As magias são o ponto culminante da pesquisa arcana que você faz regularmente. Espaços de Magia. A tabela Características de Mago mostra quantos espaços de magia você tem para conjurar suas magias de 1º círculo ou superior. Você restaura todos os espaços gastos ao completar um Descanso Longo. Magias Preparadas de 1º Círculo ou Superior. Você prepara a lista de magias de 1º círculo ou superior que estão disponíveis para você conjurar com essa característica. Para isso, escolha quatro magias do seu livro de magias. As magias escolhidas devem ser de um círculo para o qual você tenha espaços de magia. O número de magias em sua lista aumenta à medida que você alcança níveis de Mago, conforme detalhado na coluna Magias Preparadas da tabela Características de Mago. Sempre que esse número aumentar, escolha magias adicionais de Mago até que o número de magias em sua lista corresponda ao número na tabela. As magias escolhidas devem ser de um círculo para o qual você possua espaços de magia. Por exemplo, se você é um Mago de nível 3, sua lista de magias preparadas, escolhidas do seu livro de magias, pode incluir seis magias de 1º ou 2º círculo, em qualquer combinação. Se outra característica de Mago lhe conceder magias que você sempre tem preparadas, essas magias não contam para o número de magias que você pode preparar com esta característica, mas essas magias, de outra forma, contam como magias de Mago para você. Mudando Suas Magias Preparadas. Ao completar um Descanso Longo, você pode alterar sua lista de magias preparadas, substituindo qualquer uma das magias por outras do seu livro de magias. Atributo de Conjuração. Inteligência é seu atributo de conjuração para suas magias de Mago. Foco de Conjuração. Você pode usar um Foco Arcano ou seu livro de magias como um Foco de Conjuração para suas magias de Mago.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 1,
    nome: 'Recuperação Arcana',
    descricao:
      'Você pode recuperar um pouco de sua energia mágica estudando seu livro de magias. Ao completar um Descanso Curto, você pode escolher recuperar espaços de magia gastos. Os espaços de magia podem ter um círculo combinado igual a não mais da metade do seu nível de Mago (arredondado para cima), e nenhum dos espaços pode ser de 6º círculo ou superior. Por exemplo, se você é um Mago de nível 4, pode recuperar um valor de até dois círculos de espaços de magia, recuperando um espaço de magia de 2º círculo ou dois espaços de magia de 1º círculo. Você pode usar esta característica novamente após completar um Descanso Longo.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 2,
    nome: 'Acadêmico',
    descricao:
      'Enquanto estudava magia, você também se especializou em outro campo de estudo. Escolha uma das seguintes perícias nas quais você tem proficiência: Arcanismo, História, Investigação, Medicina, Natureza ou Religião. Você tem Especialização na perícia escolhida.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 3,
    nome: 'Subclasse de Mago',
    descricao:
      'Você adquire uma subclasse de Mago à sua escolha. As subclasses Abjurador, Adivinhador, Evocador e Ilusionista estão detalhadas após a descrição desta classe. Uma subclasse é uma especialidade que concede a você características em determinados níveis de Mago. Durante toda sua jornada, você adquire cada uma das características de sua subclasse de seu nível de Mago ou menor.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 4,
    nome: 'Aumento no Valor de Atributo',
    descricao:
      'Você adquire o talento Aumento no Valor de Atributo (veja o capítulo 5) ou outro talento à sua escolha para o qual atenda os pré-requisitos. Você adquire essa característica novamente nos níveis 8, 12 e 16 de Mago.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 5,
    nome: 'Memorizar Magia',
    descricao:
      'Ao completar um Descanso Curto, você pode estudar seu livro de magias e substituir uma das magias de Mago de 1º círculo ou superior que você preparou para sua característica Conjuração por outra magia de 1º círculo ou superior do livro.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 18,
    nome: 'Maestria de Magias',
    descricao:
      'Você alcançou tal domínio sobre certas magias que pode conjurá-las à vontade. Escolha uma magia de 1º e uma de 2º círculo em seu livro de magias que tenham um tempo de conjuração de uma ação. Você sempre tem essas magias preparadas, e pode conjurá-las em seu círculo mais baixo sem gastar um espaço de magia. Para conjurar qualquer uma delas em um círculo superior, você deve gastar um espaço de magia. Ao completar um Descanso Longo, você pode estudar seu livro de magias e substituir uma dessas magias por uma magia elegível do mesmo círculo do livro.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 19,
    nome: 'Dádiva Épica',
    descricao:
      'Você adquire o talento Dádiva Épica (veja o capítulo 5) ou outro talento à sua escolha para o qual se qualifica. Dádiva da Recordação de Magia é recomendado.',
    tipoAcao: 'Passiva / Estática',
  },
  {
    classe: 'Mago',
    nivel: 20,
    nome: 'Assinatura Mágica',
    descricao:
      'Escolha duas magias de 3º círculo em seu livro de magias como suas assinaturas mágicas. Você sempre tem essas magias preparadas e pode conjurá-las, cada uma delas, uma vez no 3º círculo sem gastar um espaço de magia. Ao realizar isso, você não pode conjurá-las deste modo novamente até completar um Descanso Curto ou Longo. Para conjurar uma das magias em um círculo superior, você deve gastar um espaço de magia.',
    tipoAcao: 'Passiva / Estática',
  },
];
