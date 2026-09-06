// Gerado a partir de dnd-master-referencia.xlsx, aba "Espécies".
// Não editar valores à mão.
//
// Schema de sub-escolha decidido em DECISOES-DESIGN.md ("Dados —
// Espécies têm 3 naturezas diferentes de sub-escolha"). Das 6 espécies
// com sub-escolha, todas já têm as opções estruturadas em
// `opcoesSubescolha` (ver `OpcaoSubescolha`). Draconato/Golias/Elfo/
// Gnomo/Tiferino escolhem 1x no wizard (`identidade_permanente`/
// `linhagem_com_progressao_magica`). Aasimar (`escolha_reutilizavel`)
// é diferente: a Revelação Celestial é escolhida de novo A CADA USO em
// combate, não no wizard — ver `core/especieSubescolha.ts`
// (`opcoesEscolhaReutilizavel`) e a UI em `BonusPanelContent.tsx`.
//
// Todas as 10 espécies do Livro do Jogador 2024 já estão liberadas
// (`disponivel: true`) — o que falta agora é só mecânica de traço
// ATIVO em Combat, não mais dado/wizard. Ver `EmDev.md` item 8.
//
// introducaoCurta vem da coluna "Descrição Curta (auto, revisar)" —
// gerada automaticamente (corta na frase mais próxima de ~350
// caracteres), usada aqui a pedido do Osmar mesmo antes de revisão
// manual completa (mesmo padrão de "ponto de partida, não fonte de
// verdade" já usado com outras colunas auto/revisar do projeto).

import type { SentidoConcedido } from './sentidos';

export interface Tamanho {
  fixo: string | null;
  opcoes: string[] | null;
}

export interface TracoEspecie {
  nome: string;
  descricao: string;
  /** Sentido passivo permanente concedido por este traço (ver
   * `sentidos.ts`) — `null`/ausente pra traço que não concede sentido,
   * ou que concede de forma ativada/temporária (ex.: Conhecimento de
   * Pedras do Anão, Ação Bônus com usos limitados — não entra aqui,
   * só sentido sempre-ligado conta). */
  sentidoConcedido?: SentidoConcedido | null;
  /** ID estável pra traço que o código precisa RECONHECER (não só
   * exibir) — ver CLAUDE.md seção 13. Nunca comparar por `nome`.
   * Hoje usado pelos 2 traços do Humano que abrem uma escolha própria
   * no wizard (`'habil'`, `'versatil'`) e pelos traços de espécies
   * `identidade_permanente` cujo texto depende do tipo de dano da
   * sub-escolha (`usaTipoDanoDaSubescolha`, ver `Especie.opcoesSubescolha`). */
  id?: string;
  /** Traço cujo efeito varia pelo tipo de dano da opção de sub-escolha
   * escolhida (ex.: Ataque de Sopro e Resistência a Dano do Draconato,
   * que mudam conforme a cor de dragão) — resolvido em tempo de
   * leitura a partir de `Especie.opcoesSubescolha`, nunca duplicado
   * como valor fixo aqui. */
  usaTipoDanoDaSubescolha?: boolean;
  /** Traço cujo texto já lista TODAS as opções de sub-escolha (ex.:
   * Ancestralidade Gigante do Golias, que descreve as 6 ancestralidades
   * dentro do próprio traço) — a UI mostra, junto do texto original
   * (nunca alterado), qual `descricaoEfeito` de `Especie.opcoesSubescolha`
   * foi escolhida. Diferente de `usaTipoDanoDaSubescolha` (efeito
   * distribuído em outros traços, ex. Draconato). */
  usaDescricaoEfeitoDaSubescolha?: boolean;
  /** Traço que concede proficiência numa perícia à escolha, restrita a
   * uma lista curta (ex.: Sentidos Aguçados do Elfo — Intuição,
   * Percepção ou Sobrevivência) — reaproveita o mesmo campo
   * `WizardSelection.periciaEspecieEscolhida` do Hábil (Humano), só
   * filtrando as opções mostradas. `undefined` = sem restrição (não
   * usado hoje, já que Hábil não define este campo). */
  opcoesPericia?: string[];
}

export type NaturezaSubescolha =
  | 'identidade_permanente'
  | 'linhagem_com_progressao_magica'
  | 'escolha_reutilizavel';

export interface Subescolha {
  nome: string;
  natureza: NaturezaSubescolha;
}

/** Uma opção de sub-escolha `identidade_permanente` OU
 * `linhagem_com_progressao_magica` (ex.: cada cor de dragão do
 * Draconato, cada ancestralidade do Golias, cada linhagem do Elfo) —
 * escolhida 1x na criação, nunca muda depois (mesma experiência de
 * escolha nas duas naturezas, só o que a escolha desbloqueia depois
 * difere — ver `NaturezaSubescolha`). Campos opcionais porque cada
 * espécie usa só o subconjunto que faz sentido pro seu texto:
 * - `tipoDano` — Draconato (traços que dependem de um tipo de dano
 *   único, ver `TracoEspecie.usaTipoDanoDaSubescolha`).
 * - `descricaoEfeito` — Golias (efeito completo, próprio traço já
 *   lista todas as opções) e Elfo/Tiferino (benefício de nível 1 da
 *   linhagem/legado).
 * - `sentidoConcedido` — quando a opção muda um sentido já concedido
 *   por outro traço da espécie (ex.: Drow aumenta o alcance da Visão
 *   no Escuro) — somado em `core/sentidos.ts` junto das outras fontes,
 *   nunca sobrescrevendo o traço original.
 * - `truquesConhecidos` — nomes dos truques concedidos de forma
 *   permanente (`linhagem_com_progressao_magica`; ver
 *   `core/magiasEspecie.ts`) — normalmente 1, Gnomo das Rochas
 *   concede 2 (Prestidigitação Arcana + Reparar).
 * - `magiaNivel1`/`magiaNivel3`/`magiaNivel5` — nome da magia sempre
 *   preparada desbloqueada automaticamente nesse nível DE PERSONAGEM
 *   (não de classe) — só `linhagem_com_progressao_magica`.
 *   `magiaNivel1` é raro (Gnomo do Bosque — Falar com Animais desde a
 *   criação); Elfo/Tiferino só usam nível 3/5. */
export interface OpcaoSubescolha {
  nome: string;
  tipoDano?: string;
  descricaoEfeito?: string;
  sentidoConcedido?: SentidoConcedido;
  truquesConhecidos?: string[];
  magiaNivel1?: string;
  magiaNivel3?: string;
  magiaNivel5?: string;
}

export interface Especie {
  id: string;
  nome: string;
  nomeIngles: string;
  tipoCriatura: string;
  tamanho: Tamanho;
  deslocamento: string;
  introducao: string;
  introducaoCurta: string;
  traços: TracoEspecie[];
  subescolha: Subescolha | null;
  /** Opções da sub-escolha, só preenchido pras espécies já
   * estruturadas (ver comentário no topo do arquivo) — `undefined`
   * pras que ainda têm o dado só como texto corrido no traço. */
  opcoesSubescolha?: OpcaoSubescolha[];
  /** Truque concedido pra TODA a espécie, sem depender da sub-escolha
   * (ex.: Presença Sobrenatural do Tiferino — Taumaturgia, igual pra
   * qualquer Legado Ínfero escolhido). Diferente de
   * `OpcaoSubescolha.truquesConhecidos`, que só o jogador que escolheu
   * aquela opção específica recebe. */
  truqueFixo?: string;
  disponivel: boolean;
  fonte: string;
}

export const especies: Especie[] = [
  {
    id: "anao",
    nome: "Anão",
    nomeIngles: "Dwarf",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Médio (cerca de 1,20-1,50 metro de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Anões foram criados da terra nos tempos antigos por uma divindade da forja, conhecida por diversos nomes como Moradin e Reorx. Esse deus conferiu aos anões uma afinidade por pedra, metal e pela vida subterrânea, além de torná-los resilientes como as montanhas, com uma expectativa de vida de cerca de 350 anos. Baixos e frequentemente barbudos, os anões originais esculpiram cidades e fortalezas nas montanhas e sob a terra. Suas lendas mais antigas relatam conflitos com monstros tanto do topo das montanhas quanto da Umbraeterna, sejam eles gigantes imponentes ou horrores subterrâneos. Motivados por essas histórias, anões de diversas culturas costumam cantar sobre proezas valentes — especialmente sobre os pequenos superando os poderosos. Em alguns mundos do multiverso, os primeiros povoados de anões foram erguidos em colinas ou montanhas, e as famílias que descendem desses locais são conhecidas como anões da colina ou anões da montanha. Os cenários de Greyhawk e Dragonlance incluem essas comunidades.",
    introducaoCurta: "Anões foram criados da terra nos tempos antigos por uma divindade da forja, conhecida por diversos nomes como Moradin e Reorx. Esse deus conferiu aos anões uma afinidade por pedra, metal e pela vida subterrânea, além de torná-los resilientes como as montanhas, com uma expectativa de vida de cerca de 350 anos.",
    traços: [
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 36 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 36 } },
      { nome: "Resistência a Toxinas", descricao: "Você tem Resistência a Dano Venenoso. Você também tem Vantagem nas salvaguardas que realizar para evitar ou encerrar a condição Envenenado." },
      { nome: "Tenacidade Anã", descricao: "Seus Pontos de Vida máximos aumentam em 1, e novamente em 1, sempre que você atinge um nível de personagem." },
      { nome: "Conhecimento de Pedras", descricao: "Como uma Ação Bônus, você adquire Sismiconsciência com um alcance de 18 metros por 10 minutos. Você deve estar em, ou tocar, uma superfície de pedra para usar a Sismiconsciência. A pedra pode ser natural ou trabalhada. Você pode usar essa Ação Bônus um número de vezes igual ao seu Bônus de Proficiência, e você restaura todos os usos gastos quando completa um Descanso Longo." },
    ],
    subescolha: null,
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "orc",
    nome: "Orc",
    nomeIngles: "Orc",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Médio (cerca de 1,80-2,10 metros de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Os orcs atribuem sua origem a Gruumsh, um poderoso deus que percorria os vastos espaços do Plano Material. Ele dotou seus filhos com habilidades para explorar planícies, cavernas e mares agitados, enfrentando os monstros que ali habitam. Mesmo ao se devotar a outros deuses, os orcs mantêm os dons de Gruumsh: resistência, determinação e a habilidade de enxergar na escuridão. Orcs são, em média, altos e robustos, com pele cinza, orelhas pontiagudas e caninos inferiores proeminentes como pequenas presas. Em muitos mundos, orcs jovens aprendem sobre as grandes jornadas e desafios enfrentados por seus ancestrais. Inspirados por essas histórias, muitos se questionam quando Gruumsh os chamará para igualar os feitos heroicos do passado e se serão dignos de sua bênção. Outros, no entanto, preferem deixar esses contos para trás e buscar seu próprio caminho.",
    introducaoCurta: "Os orcs atribuem sua origem a Gruumsh, um poderoso deus que percorria os vastos espaços do Plano Material. Ele dotou seus filhos com habilidades para explorar planícies, cavernas e mares agitados, enfrentando os monstros que ali habitam.",
    traços: [
      { nome: "Pico de Adrenalina", descricao: "Você pode executar a ação Correr como uma Ação Bônus. Ao executar isso, você adquire um número de Pontos de Vida Temporários igual ao seu Bônus de Proficiência. Você pode usar este traço um número de vezes igual ao seu Bônus de Proficiência, e você restaura todos os usos gastos quando completa um Descanso Curto ou Longo." },
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 36 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 36 } },
      { nome: "Vigor Implacável", descricao: "Ao ser reduzido a 0 Pontos de Vida, mas não morto imediatamente, você fica com 1 Ponto de Vida. Após usar este traço, você não pode fazê-lo novamente até completar um Descanso Longo." },
    ],
    subescolha: null,
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "pequenino",
    nome: "Pequenino",
    nomeIngles: "Halfling",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Pequeno (cerca de 0,60-0,90 metro de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Guiados por deuses que valorizam a vida, o lar e a lareira, os pequeninos buscam paraísos bucólicos onde família e comunidade moldam suas vidas. Apesar disso, muitos têm um espírito aventureiro, embarcando em jornadas de descoberta que lhes permitem explorar o mundo e fazer novos amigos. Seu tamanho, semelhante ao de uma criança humana, os ajuda a passar despercebidos nas multidões e a se espremer em espaços apertados. Quem já conviveu com pequeninos, especialmente os mais aventureiros, viu provavelmente a “sorte dos pequeninos” em ação. Quando estão em perigo, uma força invisível parece intervir em seu favor. Muitos acreditam nessa sorte e a atribuem a deuses benevolentes como Yondalla, Brandobaris e Charmalaine. Esse dom pode também contribuir para a sua longevidade, que é de cerca de 150 anos. As comunidades de pequeninos têm diversas formas. Para cada condado isolado em uma região intocada, existe um sindicato do crime como o Clã Boromar em Eberron ou uma gangue territorial como as de Dark Sun. Pequeninos que habitam o subsolo são chamados de austeros ou robustos, enquanto os nômades e os que convivem com humanos e outras criaturas altas são conhecidos como pés-ligeiros ou companheiros-altos.",
    introducaoCurta: "Guiados por deuses que valorizam a vida, o lar e a lareira, os pequeninos buscam paraísos bucólicos onde família e comunidade moldam suas vidas. Apesar disso, muitos têm um espírito aventureiro, embarcando em jornadas de descoberta que lhes permitem explorar o mundo e fazer novos amigos.",
    traços: [
      { nome: "Corajoso", descricao: "Você tem Vantagem nas salvaguardas que realizar para evitar ou encerrar a condição Amedrontado." },
      { nome: "Agilidade Pequenina", descricao: "Você pode se mover pelo espaço de qualquer criatura que seja um tamanho maior que você, mas você não pode parar no mesmo espaço." },
      { nome: "Sorte", descricao: "Ao tirar 1 no D20 de um Teste de D20, você pode jogar novamente o dado e deve usar a nova jogada." },
      { nome: "Furtividade Natural", descricao: "Você pode executar a ação Esconder mesmo quando estiver encoberto apenas por uma criatura que seja pelo menos um tamanho maior que você." },
    ],
    subescolha: null,
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "humano",
    nome: "Humano",
    nomeIngles: "Human",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: null, opcoes: ["Médio (cerca de 1,20-2,10 metros de altura)", "Pequeno (cerca de 0,60-1,20 metro de altura)"] },
    deslocamento: "9 metros",
    introducao: "Presentes em todo o multiverso, os humanos são variados e numerosos, buscando alcançar o máximo em seus anos de vida. Sua ambição e habilidade são admiradas, respeitadas e temidas em muitos mundos. Os humanos são tão diversos em aparência quanto as populações da Terra e adoram muitos deuses. Embora os estudiosos debatem a origem da humanidade, acredita-se que uma das primeiras reuniões humanas ocorreu em Sigil, a cidade em forma de toro no centro do multiverso, onde nasceu o idioma Comum. A partir desse ponto, os humanos se espalharam por todo o multiverso, levando ao cosmopolitismo da Cidade das Portas.",
    introducaoCurta: "Presentes em todo o multiverso, os humanos são variados e numerosos, buscando alcançar o máximo em seus anos de vida. Sua ambição e habilidade são admiradas, respeitadas e temidas em muitos mundos. Os humanos são tão diversos em aparência quanto as populações da Terra e adoram muitos deuses.",
    traços: [
      { nome: "Eficiente", descricao: "Você adquire Inspiração Heroica sempre que completar um Descanso Longo." },
      { nome: "Hábil", descricao: "Você adquire proficiência em uma perícia à sua escolha.", id: 'habil' },
      { nome: "Versátil", descricao: "Você adquire um talento de Origem à sua escolha (veja o capítulo 5). Habilidoso é recomendado.", id: 'versatil' },
    ],
    subescolha: null,
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "aasimar",
    nome: "Aasimar",
    nomeIngles: "Aasimar",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: null, opcoes: ["Médio (cerca de 1,20-2,10 metros de altura)", "Pequeno (cerca de 0,60-1,20 metro de altura)"] },
    deslocamento: "9 metros",
    introducao: "Aasimar (pronuncia-se AH-sih-mar) são mortais que carregam uma centelha dos Planos Superiores dentro de suas almas. Sejam descendentes de um ser angelical ou infundido com poder celestial, eles podem impulsionar essa centelha para trazer luz, cura e fúria celestial. Um aasimar pode surgir entre qualquer população de mortais. Eles se parecem com seus pais, mas vivem até 160 anos e têm características que sugerem sua herança celestial, como sardas metálicas, olhos luminosos, uma auréola ou a cor da pele de um anjo (prata, verde opalescente ou vermelho acobreado). Essas características começam sutis e se tornam óbvias quando o aasimar aprende a revelar sua natureza celestial completa.",
    introducaoCurta: "Aasimar (pronuncia-se AH-sih-mar) são mortais que carregam uma centelha dos Planos Superiores dentro de suas almas. Sejam descendentes de um ser angelical ou infundido com poder celestial, eles podem impulsionar essa centelha para trazer luz, cura e fúria celestial. Um aasimar pode surgir entre qualquer população de mortais.",
    traços: [
      { nome: "Resistência Celestial", descricao: "Você tem Resistência a dano Necrótico e Radiante." },
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 18 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 18 } },
      { nome: "Mãos Curativas", descricao: "Você executa uma ação Usar Magia, toca uma criatura e joga um número de d4s igual ao seu Bônus de Proficiência. A criatura restaura número de Pontos de Vida igual ao total jogado. Após usar esse traço, você não pode usá-lo novamente até completar um Descanso Longo." },
      { nome: "Portador da Luz", descricao: "Você conhece o truque Luz. Carisma é seu atributo de conjuração para isso." },
      { nome: "Revelação Celestial", descricao: "No nível 3 de personagem, você pode se transformar como uma Ação Bônus usando uma das opções abaixo (escolha a opção cada vez que você se transformar). A transformação se mantém por 1 minuto ou até você a encerrar (nenhuma ação é necessária). Uma vez que você se transforma, não pode fazê-lo novamente até completar um Descanso Longo. Uma vez em cada um dos seus turnos, até que a transformação termine, você pode infligir dano adicional a um alvo ao causar dano a ele com um ataque ou uma magia. O dano adicional é igual ao seu Bônus de Proficiência, e o tipo de dano adicional é Necrótico para Manto Necrótico ou Radiante para Asas Celestiais e Transfiguração Radiante. Aqui estão as opções de transformação: Asas Celestiais. Duas asas espectrais brotam em suas costas temporariamente. Até que a transformação se encerre, você tem um Deslocamento de Voo igual ao seu Deslocamento. Manto Necrótico. Seus olhos se tornam brevemente poças de escuridão, e asas que não voam brotam em suas costas temporariamente. Criaturas que não sejam seus aliados a até 3 metros de você devem ser bem-sucedidas em uma salvaguarda de Carisma (CD 8 + seu modificador de Carisma e seu Bônus de Proficiência) ou têm a condição Amedrontado até o final do seu próximo turno. Transfiguração Radiante. Luz abrasadora irradia temporariamente de seus olhos e boca. Pela duração da transformação, você emite Luz Plena em um raio de 3 metros e Meia-luz por mais 3 metros, e no fim de cada um de seus turnos, cada criatura a até 3 metros de você sofre dano Radiante igual ao seu Bônus de Proficiência." },
    ],
    subescolha: { nome: "Revelação Celestial", natureza: "escolha_reutilizavel" },
    opcoesSubescolha: [
      {
        nome: "Asas Celestiais",
        tipoDano: "Radiante",
        descricaoEfeito: "Duas asas espectrais brotam em suas costas temporariamente. Até que a transformação se encerre, você tem um Deslocamento de Voo igual ao seu Deslocamento.",
      },
      {
        nome: "Manto Necrótico",
        tipoDano: "Necrótico",
        descricaoEfeito: "Seus olhos se tornam brevemente poças de escuridão, e asas que não voam brotam em suas costas temporariamente. Criaturas que não sejam seus aliados a até 3 metros de você devem ser bem-sucedidas em uma salvaguarda de Carisma (CD 8 + seu modificador de Carisma e seu Bônus de Proficiência) ou têm a condição Amedrontado até o final do seu próximo turno.",
      },
      {
        nome: "Transfiguração Radiante",
        tipoDano: "Radiante",
        descricaoEfeito: "Luz abrasadora irradia temporariamente de seus olhos e boca. Pela duração da transformação, você emite Luz Plena em um raio de 3 metros e Meia-luz por mais 3 metros, e no fim de cada um de seus turnos, cada criatura a até 3 metros de você sofre dano Radiante igual ao seu Bônus de Proficiência.",
      },
    ],
    truqueFixo: "Luz",
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "draconato",
    nome: "Draconato",
    nomeIngles: "Dragonborn",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Médio (cerca de 1,50-2,10 metros de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Os ancestrais dos draconatos nasceram dos ovos de dragões cromáticos e metálicos. Uma narrativa diz que esses ovos foram abençoados pelos deuses dracônicos Bahamut e Tiamat, que desejavam criar seres à sua imagem no multiverso. Outra versão afirma que os dragões geraram o primeiro draconato sem a intervenção divina. Independentemente da origem, os draconatos estabeleceram lares no Plano Material. Os draconatos parecem dragões bípedes sem asas — escamosos, de olhos brilhantes, com ossos grossos e chifres na cabeça — e sua coloração e outras características lembram seus ancestrais dracônicos.",
    introducaoCurta: "Os ancestrais dos draconatos nasceram dos ovos de dragões cromáticos e metálicos. Uma narrativa diz que esses ovos foram abençoados pelos deuses dracônicos Bahamut e Tiamat, que desejavam criar seres à sua imagem no multiverso. Outra versão afirma que os dragões geraram o primeiro draconato sem a intervenção divina.",
    traços: [
      { nome: "Herança Dracônica", descricao: "Sua linhagem deriva de um progenitor dracônico. Escolha o tipo de dragão da tabela Herança Dracônica. Sua escolha afeta suas características de Ataque de Sopro e Resistência a Dano, bem como sua aparência. Tabela Herança Dracônica (Dragão: Tipo de Dano) — Azul: Elétrico; Branco: Gélido; Bronze: Elétrico; Cobre: Ácido; Latão: Ígneo; Negro: Ácido; Ouro: Ígneo; Prata: Gélido; Verde: Venenoso; Vermelho: Ígneo." },
      { nome: "Ataque de Sopro", descricao: "Ao executar a ação Atacar no seu turno, você pode substituir um de seus ataques por uma emissão de energia mágica em um Cone de 4,5 metros ou em uma Linha de 9 metros de comprimento e 1,5 metros de largura (escolha a forma a cada vez). Cada criatura nessa área deve realizar uma salvaguarda de Destreza (CD 8 + seu modificador de Constituição e seu Bônus de Proficiência). Se falhar, uma criatura sofre 1d10 pontos de dano do tipo determinado por seu traço Herança Dracônica. Em caso de sucesso, uma criatura sofre metade do dano. Esse dano aumenta em 1d10 quando você atinge os níveis de personagem 5 (2d10), 11 (3d10) e 17 (4d10). Você pode usar esse Ataque de Sopro um número de vezes igual ao seu Bônus de Proficiência, e você restaura todos os usos gastos quando completa um Descanso Longo.", usaTipoDanoDaSubescolha: true },
      { nome: "Resistência a Dano", descricao: "Você tem Resistência ao tipo de dano determinado por seu traço Herança Dracônica.", usaTipoDanoDaSubescolha: true },
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 18 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 18 } },
      { nome: "Voo Dracônico", descricao: "No nível 5 do personagem, você pode canalizar magia dracônica para beneficiar de um voo temporário. Como uma Ação Bônus, você cria asas espectrais nas costas que duram 10 minutos ou até que você as retraia (nenhuma ação é necessária) ou tem a condição Incapacitado. Pela duração, você tem um Deslocamento de Voo igual ao seu Deslocamento. Suas asas parecem feitas da mesma energia que o seu Ataque de Sopro. Após usar esse traço, você não pode usá-lo novamente até completar um Descanso Longo." },
    ],
    subescolha: { nome: "Herança Dracônica", natureza: "identidade_permanente" },
    opcoesSubescolha: [
      { nome: "Azul", tipoDano: "Elétrico" },
      { nome: "Branco", tipoDano: "Gélido" },
      { nome: "Bronze", tipoDano: "Elétrico" },
      { nome: "Cobre", tipoDano: "Ácido" },
      { nome: "Latão", tipoDano: "Ígneo" },
      { nome: "Negro", tipoDano: "Ácido" },
      { nome: "Ouro", tipoDano: "Ígneo" },
      { nome: "Prata", tipoDano: "Gélido" },
      { nome: "Verde", tipoDano: "Venenoso" },
      { nome: "Vermelho", tipoDano: "Ígneo" },
    ],
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "elfo",
    nome: "Elfo",
    nomeIngles: "Elf",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Médio (cerca de 1,50-1,80 metro de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Criados por Corellon, os primeiros elfos podiam mudar de forma à vontade. Essa habilidade foi perdida quando Corellon os amaldiçoou por conspirarem com Lolth, que falhou em usurpar seu domínio. Após a queda de Lolth no Abismo, a maioria dos elfos a renunciou e recebeu o perdão de Corellon, mas o que ele havia tomado deles se perdeu para sempre. Impossibilitados de mudar de forma à vontade, os elfos recuaram para Faéria, onde sua tristeza aumentou sob a influência daquele plano. Com o tempo, a curiosidade levou muitos a explorar outros planos de existência, incluindo mundos do Plano Material. Elfos possuem orelhas pontudas e não têm pelos faciais ou corporais. Vivem cerca de 750 anos e não dormem, mas entram em transe para descansar, mantendo a consciência do ambiente enquanto revisitam memórias e meditações. Um ambiente transforma sutilmente os elfos depois que eles o habitam por um milênio ou mais, e lhes concede certos tipos de magia. Altos elfos, drow e elfos silvestres são exemplos de elfos transformados assim. Altos elfos receberam magia das encruzilhadas entre Faéria e o Plano Material. Em alguns mundos, esses elfos são conhecidos por outros nomes, como elfos solares ou lunares em Reinos Esquecidos, Silvanesti e Qualinesti em Dragonlance, e Aereni em Eberron. Os drow normalmente residem em Umbraeterna, que os moldou. Embora alguns indivíduos e sociedades drow evitem essa região, eles ainda carregam sua magia. No cenário de Eberron, os drow habitam florestas tropicais e ruínas ciclópicas no continente de Xen’drik. Elfos silvestres, também conhecidos como elfos selvagens, elfos verdes e elfos dos bosques, carregam a magia das florestas primitivas. Grugach são elfos silvestres reclusos de Greyhawk, enquanto Kagonesti e Tairnadal são elfos silvestres de Dragonlance e Eberron, respectivamente. Um navio parte de uma cidade construída pelos altos elfos.",
    introducaoCurta: "Criados por Corellon, os primeiros elfos podiam mudar de forma à vontade. Essa habilidade foi perdida quando Corellon os amaldiçoou por conspirarem com Lolth, que falhou em usurpar seu domínio. Após a queda de Lolth no Abismo, a maioria dos elfos a renunciou e recebeu o perdão de Corellon, mas o que ele havia tomado deles se perdeu para sempre.",
    traços: [
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 18 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 18 } },
      { nome: "Linhagem Élfica", descricao: "Você é de uma linhagem que lhe concede habilidades sobrenaturais. Escolha uma linhagem da tabela Linhagem Élfica. Você adquire o benefício de nível 1 dessa linhagem. Ao atingir os níveis 3 e 5, você aprende uma magia de círculo superior, conforme indicado na tabela. Essa magia está sempre preparada e pode ser conjurada uma vez sem usar um espaço de magia, restaurando essa capacidade ao completar um Descanso Longo. Além disso, você pode conjurá-la usando qualquer espaço de magia apropriado que possua. Inteligência, Sabedoria ou Carisma é seu atributo de conjuração para as magias que você conjura com este traço (escolha o atributo quando selecionar a linhagem). Tabela Linhagem Élfica — Alto Elfo: Nível 1: você conhece o truque Prestidigitação Arcana (sempre que completar um Descanso Longo, pode substituir este truque por outro da lista de magias de Mago); Nível 3: Detectar Magia; Nível 5: Passo Nebuloso. Drow: Nível 1: o alcance da sua Visão no Escuro aumenta para 36 metros e você também conhece o truque Luzes Dançantes; Nível 3: Fogo das Fadas; Nível 5: Escuridão. Elfo Silvestre: Nível 1: seu Deslocamento aumenta para 10,5 metros e você também conhece o truque Arte Druídica; Nível 3: Passos Largos; Nível 5: Passos Sem Rastro.", usaDescricaoEfeitoDaSubescolha: true },
      { nome: "Ancestralidade Feérica", descricao: "Você tem Vantagem ao realizar salvaguardas para evitar ou encerrar a condição Enfeitiçado." },
      { nome: "Sentidos Aguçados", descricao: "Você tem proficiência na perícia Intuição, Percepção ou Sobrevivência.", opcoesPericia: ["Intuição", "Percepção", "Sobrevivência"] },
      { nome: "Transe", descricao: "Você pode completar um Descanso Longo em 4 horas ao meditar, sem a necessidade de dormir, mantendo a consciência, e magia não pode forçá-lo a dormir." },
    ],
    subescolha: { nome: "Linhagem Élfica", natureza: "linhagem_com_progressao_magica" },
    opcoesSubescolha: [
      {
        nome: "Alto Elfo",
        descricaoEfeito: "Você conhece o truque Prestidigitação Arcana (sempre que completar um Descanso Longo, pode substituir este truque por outro da lista de magias de Mago).",
        truquesConhecidos: ["Prestidigitação Arcana"],
        magiaNivel3: "Detectar Magia",
        magiaNivel5: "Passo Nebuloso",
      },
      {
        nome: "Drow",
        descricaoEfeito: "O alcance da sua Visão no Escuro aumenta para 36 metros e você também conhece o truque Luzes Dançantes.",
        truquesConhecidos: ["Luzes Dançantes"],
        magiaNivel3: "Fogo das Fadas",
        magiaNivel5: "Escuridão",
        sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 36 },
      },
      {
        nome: "Elfo Silvestre",
        descricaoEfeito: "Seu Deslocamento aumenta para 10,5 metros e você também conhece o truque Arte Druídica.",
        truquesConhecidos: ["Arte Druídica"],
        magiaNivel3: "Passos Largos",
        // "Passo Sem Rastro" (singular) — assim que está no catálogo de
        // Magias (magias.ts, id "passosemrastro"); o texto oficial do
        // traço de Elfo (linha acima, nunca alterado) usa "Passos Sem
        // Rastro" (plural). Divergência de nome entre as 2 abas da
        // planilha mestra — avisado ao Osmar, usando aqui o nome que
        // bate com o catálogo real pra busca funcionar.
        magiaNivel5: "Passo Sem Rastro",
      },
    ],
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "gnomo",
    nome: "Gnomo",
    nomeIngles: "Gnome",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Pequeno (cerca de 0,90-1,20 metro de altura)", opcoes: null },
    deslocamento: "9 metros",
    introducao: "Gnomos são seres mágicos criados por deuses da invenção, ilusões e vida subterrânea. Raramente vistos por outros, devido à sua natureza reservada e à tendência de viver em florestas e tocas, os gnomos compensaram sua estatura com inteligência, confundindo predadores com armadilhas e túneis labirínticos. Aprenderam magia de deuses como Garl Brilhouro- -Resplandecente, Baervan Passagresteandante e Baravar Capasombriomanto, que os visitaram disfarçados. Isso resultou nas linhagens de gnomos do bosque e gnomos das rochas. Os gnomos são um povo pequeno com olhos grandes e orelhas pontudas, que vivem cerca de 425 anos. Muitos gnomos gostam da sensação de um teto sobre a cabeça, mesmo que esse “teto” não seja nada mais do que um chapéu.",
    introducaoCurta: "Gnomos são seres mágicos criados por deuses da invenção, ilusões e vida subterrânea. Raramente vistos por outros, devido à sua natureza reservada e à tendência de viver em florestas e tocas, os gnomos compensaram sua estatura com inteligência, confundindo predadores com armadilhas e túneis labirínticos.",
    traços: [
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 18 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 18 } },
      { nome: "Astúcia de Gnomo", descricao: "Você tem Vantagem em salvaguardas de Inteligência, Sabedoria e Carisma." },
      { nome: "Linhagem Gnômica", descricao: "Você pertence a uma linhagem que lhe confere habilidades sobrenaturais. Escolha uma das seguintes opções; sua escolha determina se Inteligência, Sabedoria ou Carisma é seu atributo de conjuração para as magias desse traço (escolha o atributo quando selecionar a linhagem): Gnomo das Rochas. Você conhece os truques Prestidigitação Arcana e Reparar. Além disso, você pode gastar 10 minutos conjurando Prestidigitação Arcana para fabricar um dispositivo mecânico minúsculo (CA 5, 1 PV), como um brinquedo, isqueiro mecânico ou caixa de música. Ao fabricar o dispositivo, você determina a função dele escolhendo um efeito de Prestidigitação Arcana; o dispositivo produz esse efeito sempre que você ou outra criatura executa uma Ação Bônus para ativá-lo com um toque. Se o efeito escolhido tiver opções possíveis, você escolhe uma dessas opções para o dispositivo ao fabricá-lo. Por exemplo, se você escolher o efeito de Brincar com Fogo da magia, você determina se o dispositivo acende ou extingue fogo; o dispositivo não faz ambas as coisas. Você pode ter três desses dispositivos ao mesmo tempo, e cada um se desfaz 8 horas após ser fabricado ou quando você o desmonta com um toque como uma ação Usar Objeto. Gnomo do Bosque. Você conhece o truque Ilusão Menor. Você também sempre tem a magia Falar com Animais preparada. É possível conjurá-la sem um espaço de magia um número de vezes igual ao seu Bônus de Proficiência, e você restaura todos os usos gastos quando completa um Descanso Longo. Você também pode usar qualquer espaço de magia que tiver para conjurá-la.", usaDescricaoEfeitoDaSubescolha: true },
    ],
    subescolha: { nome: "Linhagem Gnômica", natureza: "linhagem_com_progressao_magica" },
    opcoesSubescolha: [
      {
        nome: "Gnomo das Rochas",
        descricaoEfeito: "Você conhece os truques Prestidigitação Arcana e Reparar. Além disso, você pode gastar 10 minutos conjurando Prestidigitação Arcana para fabricar um dispositivo mecânico minúsculo (CA 5, 1 PV), como um brinquedo, isqueiro mecânico ou caixa de música — mesmo efeito de Prestidigitação Arcana, ativado com um toque como Ação Bônus. Você pode ter três desses dispositivos ao mesmo tempo.",
        truquesConhecidos: ["Prestidigitação Arcana", "Reparar"],
      },
      {
        nome: "Gnomo do Bosque",
        descricaoEfeito: "Você conhece o truque Ilusão Menor. Você também sempre tem a magia Falar com Animais preparada, conjurável sem espaço de magia um número de vezes igual ao seu Bônus de Proficiência (recarrega em Descanso Longo), além de com qualquer espaço de magia que tiver.",
        truquesConhecidos: ["Ilusão Menor"],
        magiaNivel1: "Falar com Animais - Traço de Gnomo",
      },
    ],
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "golias",
    nome: "Golias",
    nomeIngles: "Goliath",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: "Médio (cerca de 2,10-2,40 metros de altura)", opcoes: null },
    deslocamento: "10,5 metros",
    introducao: "Os golias, que se destacam pela altura, são descendentes distantes de gigantes. Cada um deles possui as bênçãos dos antigos gigantes, manifestadas em diversos dons sobrenaturais, como o crescimento rápido e a habilidade de alcançar temporariamente a estatura de seus parentes gigantes. Os golias possuem características físicas que refletem a aparência de gigantes em suas linhagens familiares. Alguns têm o aspecto de gigantes da pedra, enquanto outros se assemelham a gigantes do fogo. Apesar de suas origens, os golias traçaram seu próprio caminho no multiverso, livres dos conflitos internos que devastaram os gigantes por séculos, e almejam alcançar alturas superiores às de seus ancestrais.",
    introducaoCurta: "Os golias, que se destacam pela altura, são descendentes distantes de gigantes. Cada um deles possui as bênçãos dos antigos gigantes, manifestadas em diversos dons sobrenaturais, como o crescimento rápido e a habilidade de alcançar temporariamente a estatura de seus parentes gigantes.",
    traços: [
      { nome: "Ancestralidade Gigante", descricao: "Você é descendente de Gigantes. Escolha um dos seguintes benefícios — um benefício sobrenatural de sua ancestralidade; você pode usar o benefício escolhido um número de vezes igual ao seu Bônus de Proficiência, e você restaura todos os usos gastos quando completa um Descanso Longo: Arrepio do Gelo (Gigante do Gelo). Ao atingir um alvo com uma jogada de ataque e causar dano a ele, você também pode infligir 1d6 pontos de dano Gélido a esse alvo e reduzir o Deslocamento dele em 3 metros até o início do seu próximo turno. Queimadura de Fogo (Gigante de Fogo). Ao atingir um alvo com uma jogada de ataque e causar dano a ele, você também pode causar 1d10 pontos de dano Ígneo a esse alvo. Resistência da Pedra (Gigante da Pedra). Ao sofrer dano, pode executar uma Reação para jogar 1d12. Adicione seu modificador de Constituição ao número obtido e reduza o dano desse total. Salto da Nuvem (Gigante das Nuvens). Como uma Ação Bônus, você se teleporta magicamente até 9 metros para um espaço desocupado à sua vista. Tombo da Colina (Gigante da Colina). Ao atingir uma criatura Grande ou menor com uma jogada de ataque e causar dano a ela, você pode impor a esse alvo a condição Caído. Trovão da Tempestade (Gigante da Tempestade). Ao sofrer dano de uma criatura a até 18 metros de você, você pode executar uma Reação para causar 1d8 pontos de dano Trovejante a essa criatura.", usaDescricaoEfeitoDaSubescolha: true },
      { nome: "Forma Grande", descricao: "A partir do nível 5 de personagem, você pode alterar seu tamanho para Grande como uma Ação Bônus se estiver em um espaço grande o suficiente. Essa transformação se mantém por 10 minutos ou até que você a encerrar (nenhuma ação é necessária). Pela duração, você tem Vantagem em testes de Força, e seu Deslocamento aumenta em 3 metros. Após usar este traço, você não pode utilizá-lo novamente até completar um Descanso Longo." },
      { nome: "Porte Poderoso", descricao: "Você tem Vantagem em qualquer teste de atributo que realizar para encerrar a condição Imobilizado. Você também conta como um tamanho maior ao determinar sua capacidade de carga." },
    ],
    subescolha: { nome: "Ancestralidade Gigante", natureza: "identidade_permanente" },
    opcoesSubescolha: [
      { nome: "Arrepio do Gelo (Gigante do Gelo)", descricaoEfeito: "Ao atingir um alvo com uma jogada de ataque e causar dano a ele, você também pode infligir 1d6 pontos de dano Gélido a esse alvo e reduzir o Deslocamento dele em 3 metros até o início do seu próximo turno." },
      { nome: "Queimadura de Fogo (Gigante de Fogo)", descricaoEfeito: "Ao atingir um alvo com uma jogada de ataque e causar dano a ele, você também pode causar 1d10 pontos de dano Ígneo a esse alvo." },
      { nome: "Resistência da Pedra (Gigante da Pedra)", descricaoEfeito: "Ao sofrer dano, pode executar uma Reação para jogar 1d12. Adicione seu modificador de Constituição ao número obtido e reduza o dano desse total." },
      { nome: "Salto da Nuvem (Gigante das Nuvens)", descricaoEfeito: "Como uma Ação Bônus, você se teleporta magicamente até 9 metros para um espaço desocupado à sua vista." },
      { nome: "Tombo da Colina (Gigante da Colina)", descricaoEfeito: "Ao atingir uma criatura Grande ou menor com uma jogada de ataque e causar dano a ela, você pode impor a esse alvo a condição Caído." },
      { nome: "Trovão da Tempestade (Gigante da Tempestade)", descricaoEfeito: "Ao sofrer dano de uma criatura a até 18 metros de você, você pode executar uma Reação para causar 1d8 pontos de dano Trovejante a essa criatura." },
    ],
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
  {
    id: "tiferino",
    nome: "Tiferino",
    nomeIngles: "Tiefling",
    tipoCriatura: "Humanoide",
    tamanho: { fixo: null, opcoes: ["Médio (cerca de 1,20-2,10 metros de altura)", "Pequeno (cerca de 0,90-1,20 metro de altura)"] },
    deslocamento: "9 metros",
    introducao: "Os tiferinos nascem nos Planos Inferiores ou têm ancestrais que se originaram lá. Estão ligados por sangue a um diabo, demônio ou outro Ínfero. Essa conexão representa o legado ínfero do tiferino, prometendo poder, mas não influi em sua perspectiva moral. Um tiferino decide aceitar ou lamentar seu legado ínfero. Os três legados são descritos a seguir. A entropia do Abismo, o caos do Pandemônio e o desespero do Cárceri atraem os tiferinos com legado abissal. Chifres, pelos, presas e aromas peculiares são características comuns desses tiferinos, que em sua maioria possuem sangue demoníaco correndo em suas veias. Os tiferinos com o legado ctônico sentem não apenas o puxão de Cárceri, mas também a ganância de Gehenna e a escuridão do Hades. Alguns aparentam ser cadavéricos, enquanto outros possuem a beleza sobrenatural de um súcubo ou características físicas comuns a uma megera da noite, um yugoloth ou outro ancestral ínfero Neutro e Mau. O legado infernal liga os tiferinos não apenas à Gehenna, mas também aos Nove Infernos e aos intensos campos de batalha de Aqueronte. Características físicas comuns incluem chifres, espinhos, caudas, olhos dourados e um leve odor de enxofre ou fumaça, sendo que a maioria desses tiferinos têm ancestrais diabólicos.",
    introducaoCurta: "Os tiferinos nascem nos Planos Inferiores ou têm ancestrais que se originaram lá. Estão ligados por sangue a um diabo, demônio ou outro Ínfero. Essa conexão representa o legado ínfero do tiferino, prometendo poder, mas não influi em sua perspectiva moral. Um tiferino decide aceitar ou lamentar seu legado ínfero.",
    traços: [
      { nome: "Visão no Escuro", descricao: "Você tem Visão no Escuro com um alcance de 18 metros.", sentidoConcedido: { tipo: 'visaoNoEscuro', alcanceMetros: 18 } },
      { nome: "Legado Ínfero", descricao: "Você é o portador de um legado que lhe confere poderes sobrenaturais. Escolha um legado da tabela Legados Ínferos. Você adquire o benefício de nível 1 do legado escolhido. Ao atingir os níveis de personagem 3 e 5, você aprende magias de círculo superior, conforme indicado na tabela. Essas magias estão sempre preparadas e podem ser conjuradas uma vez sem usar um espaço de magia, sendo restauradas quando completa um Descanso Longo. Além disso, você pode conjurá-las utilizando qualquer espaço de magia que possua do círculo correspondente. Atributos como Inteligência, Sabedoria ou Carisma servem como seu atributo de conjuração para essas magias (escolha um atributo ao selecionar o legado). Tabela Legados Ínferos — Abissal: Nível 1: Resistência a dano Venenoso e o truque Rajada de Veneno; Nível 3: Raio Nauseante; Nível 5: Paralisar Pessoa. Ctônico: Nível 1: Resistência a dano Necrótico e o truque Toque Necrótico; Nível 3: Vitalidade Vazia; Nível 5: Raio do Enfraquecimento. Infernal: Nível 1: Resistência a dano Ígneo e o truque Raio de Fogo; Nível 3: Repreensão Diabólica; Nível 5: Escuridão.", usaDescricaoEfeitoDaSubescolha: true },
      { nome: "Presença Sobrenatural", descricao: "Você conhece o truque Taumaturgia. Ao conjurar com este traço, a magia usa o mesmo atributo de conjuração que você usa para sua Característica Legado Ínfero." },
    ],
    subescolha: { nome: "Legado Ínfero", natureza: "linhagem_com_progressao_magica" },
    opcoesSubescolha: [
      {
        nome: "Abissal",
        descricaoEfeito: "Resistência a dano Venenoso e o truque Rajada de Veneno.",
        truquesConhecidos: ["Rajada de Veneno"],
        magiaNivel3: "Raio Nauseante",
        magiaNivel5: "Paralisar Pessoa",
      },
      {
        nome: "Ctônico",
        descricaoEfeito: "Resistência a dano Necrótico e o truque Toque Necrótico.",
        truquesConhecidos: ["Toque Necrótico"],
        magiaNivel3: "Vitalidade Vazia",
        magiaNivel5: "Raio do Enfraquecimento",
      },
      {
        nome: "Infernal",
        descricaoEfeito: "Resistência a dano Ígneo e o truque Raio de Fogo.",
        truquesConhecidos: ["Raio de Fogo"],
        magiaNivel3: "Repreensão Diabólica",
        magiaNivel5: "Escuridão",
      },
    ],
    truqueFixo: "Taumaturgia",
    disponivel: true,
    fonte: "Livro do Jogador (D&D 5e 2024)",
  },
];
