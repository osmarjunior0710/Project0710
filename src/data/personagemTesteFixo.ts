// Personagem de teste FIXO — "🧪 Char de Teste Fixo" (Lista de
// Personagens), pedido do Osmar pra parar de depender do gerador
// aleatório (`core/geradorPersonagemTeste.ts`) toda vez que precisa
// forçar um cenário específico (upcast, truque escalando, salvaguarda,
// cura) — o aleatório já travou validação Playwright várias vezes
// nesta sessão (B7 Entrega 4, B8) por não conseguir mirar numa magia
// específica. Dado congelado (não gerado em tempo de execução), mesmo
// padrão de `personagemDemo.ts` — escolhas feitas à mão, não sorteadas.
//
// Entrega 1 (nível 1, Mago só): atributos propositalmente extremos
// (INT 20, FOR/CAR 8) e truques/magias escolhidos pra cobrir os casos
// de teste mais usados (ataque que escala por nível, salvaguarda com
// upcast, magia sem ataque/salvaguarda). `selecao.*Escolhidos`/
// `*Escolhidas` continuam congelados no estado de CRIAÇÃO (nível 1) —
// mesmo padrão de `personagemDemo.ts`, onde `selecao.truquesEscolhidos`
// (2, criação) é bem menor que `truquesAtual` (4, nível 20 já
// crescido/trocado). O progresso de verdade mora só nos campos
// `*Atual`.
//
// Entrega 2 (este bloco): sobe pra nível 20 — 17 níveis de Mago +
// multiclasse com 3 níveis de Bardo (Clérigo, cogitado originalmente,
// ainda não existe no app — ver EmDev.md). Contagens de
// truques/livro/magias preparadas por nível calculadas com as MESMAS
// fórmulas do motor real (`core/recursosClasse.ts`), escolhas de QUAL
// magia sempre feitas à mão (nunca sorteadas) — cobre Upcast até
// círculo 9 (combinado Mago+Bardo), ASI, subclasse (Necromante/
// Colégio do Conhecimento, as únicas implementadas de cada classe) e
// cura de verdade (Curar Ferimentos/Palavra Curativa, via Bardo).
// Entrega 3 popula a Mochila com o catálogo completo de equipamento.
// Ver EmDev.md.

import type { PersonagemSalvo } from '../core/armazenamentoPersonagens';

export const ID_PERSONAGEM_TESTE_FIXO = 'teste-fixo-mago-clerigo';

export const personagemTesteFixo: PersonagemSalvo = {
  id: ID_PERSONAGEM_TESTE_FIXO,
  criadoEm: '2026-09-15T00:00:00.000Z',
  nivel: 20,
  xp: 0,
  pvAtual: 193,
  pvMax: 193,
  classes: [
    { classe: 'Mago', nivel: 17, subclasse: 'Necromante' },
    { classe: 'Bardo', nivel: 3, subclasse: 'Colégio do Conhecimento' },
  ],
  classeAtivaAtual: 'Mago',
  subclasseAtual: 'Necromante',
  // Multiclasse (entrada em Bardo) — perícia + Instrumento Musical à
  // escolha, quantidade menor que a de criação normal (ver
  // `proficienciasEntradaMulticlasse.ts`).
  periciasMulticlasseAtual: ['Persuasão'],
  ferramentasMulticlasseAtual: ['Alaúde'],
  selecao: {
    classe: 'Mago',
    estiloDeLutaEscolhido: null,
    maestriaArmaEscolhida: [],
    periciasClasseEscolhidas: ['Arcanismo', 'Investigação'],
    ferramentasClasseEscolhidas: [],
    invocacoesMisticasEscolhidas: [],
    // Raio de Fogo: ataque de magia com Aprimoramento de Truque (escala
    // 5/11/17) — cobre o caso "ataque" + escalonamento de truque.
    truquesEscolhidos: ['Raio de Fogo', 'Mãos Mágicas', 'Prestidigitação Arcana'],
    // Livro de Magias (grimório) — pool de magias CONHECIDAS do Mago.
    livroDeMagiasEscolhido: ['Mísseis Mágicos', 'Mãos Flamejantes', 'Detectar Magia', 'Escudo Arcano', 'Identificar', 'Sono'],
    // Mãos Flamejantes: salvaguarda com Upcast "dado-por-círculo" —
    // cobre o caso "salvaguarda" + escalonamento por círculo. Mísseis
    // Mágicos: sem ataque/salvaguarda (acerta sempre), Upcast
    // "alvo-por-círculo" — 3º caso de escalonamento diferente.
    magiasPreparadasEscolhidas: ['Mísseis Mágicos', 'Mãos Flamejantes', 'Detectar Magia', 'Escudo Arcano'],
    livroDasSombrasTruques: [],
    livroDasSombrasMagias: [],
    equipamentoClasseEscolhido: 'A',
    origem: 'Sábio',
    ferramentaOrigemEscolhida: null,
    equipamentoOrigemEscolhido: 'A',
    proficienciasTalentoOrigemEscolhidas: [],
    // Iniciado em Magia (talento da Origem Sábio, variante Mago) — 2
    // truques + 1 magia de 1º círculo, sempre disponíveis de graça.
    truquesMagiaIniciadaEscolhidos: ['Toque Chocante', 'Golpe Certeiro'],
    magiaMagiaIniciadaEscolhida: 'Orbe Cromático',
    atributoMagiaIniciadaEscolhido: 'INT',
    especie: 'Anão',
    tamanhoEspecieEscolhido: null,
    periciaEspecieEscolhida: null,
    talentoEspecieEscolhido: null,
    subescolhaEspecieEscolhida: null,
    proficienciasTalentoEspecieEscolhidas: [],
    listaMagiaIniciadaEspecieEscolhida: null,
    truquesMagiaIniciadaEspecieEscolhidos: [],
    magiaMagiaIniciadaEspecieEscolhida: null,
    atributoMagiaIniciadaEspecieEscolhido: null,
    linguas: ['Comum', 'Anão', 'Élfico'],
    alinhamento: 'Neutro e Bom',
    itens: [],
    // Extremos propositais: INT 20 (conjuração forte), FOR/CAR 8 (bem
    // fraco) — "situação estranha" pedida pelo Osmar, não um array
    // padrão de criação normal. CON/DES já refletem os 4 ASI de Mago
    // (níveis 4/8/12/16, sempre "Aumento no Valor de Atributo") — 2
    // foram pra CON (até bater no teto 20) e 2 pra DES, ver
    // `talentosGeraisAtual` abaixo.
    atributos: { FOR: 8, DES: 14, CON: 20, INT: 20, SAB: 16, CAR: 8 },
    bonusEscolhas: [],
    desbloquearAtributos: true,
    xp: 0,
    nome: 'Char de Teste Fixo',
    aparencia: '',
    personalidade: '',
  },
  // Truques Conhecidos no nível 20: 5 do Mago (`valorRecursoClasse`,
  // nível 17) + 2 do Bardo (nível 3) — Toque Necrótico/Raio de Gelo
  // somam mais 2 truques de dano do Mago; Golpe Certeiro/Zombaria
  // Perversa cobrem ataque e salvaguarda em truque de Bardo.
  truquesAtual: ['Raio de Fogo', 'Mãos Mágicas', 'Prestidigitação Arcana', 'Toque Necrótico', 'Raio de Gelo', 'Golpe Certeiro', 'Zombaria Perversa'],
  // Livro de Magias (só Mago tem esse recurso) — 38 magias no nível
  // 17, espalhadas do 1º ao 9º círculo (o Mago sozinho já destrava
  // círculo 9 nesse nível). Escolha deliberada, não a lista completa
  // do catálogo (221 magias) nem as N primeiras em ordem alfabética.
  livroDeMagiasAtual: [
    'Detectar Magia', 'Escudo Arcano', 'Identificar', 'Mãos Flamejantes', 'Mísseis Mágicos', 'Sono', 'Alarme', 'Compreender Idiomas',
    'Invisibilidade', 'Levitação', 'Raio Ardente', 'Sugestão', 'Teia',
    'Bola de Fogo', 'Contramagia', 'Dissipar Magia', 'Relâmpago', 'Voo',
    'Banimento', 'Confusão', 'Muralha de Fogo', 'Polimorfia',
    'Cone de Frio', 'Dominar Pessoa', 'Telecinese', 'Muralha de Pedra',
    'Desintegrar', 'Globo de Invulnerabilidade', 'Sugestão em Massa', 'Corrente de Relâmpagos',
    'Teleporte', 'Rajada Prismática', 'Dedo da Morte',
    'Dominar Monstro', 'Campo Antimagia', 'Clone',
    'Chuva de Meteoros', 'Desejo',
  ],
  // Magias Preparadas combinadas (22 do Mago + 6 do Bardo = 28) — lista
  // única, mesmo padrão de `truquesAtual`/`magiasPreparadasAtual` já
  // usado pra multiclasse no resto do app (não separado por classe).
  // Curar Ferimentos/Palavra Curativa (Bardo) cobrem cura de verdade —
  // o motivo inteiro de somar uma 2ª classe nesta entrega.
  magiasPreparadasAtual: [
    'Mísseis Mágicos', 'Mãos Flamejantes', 'Detectar Magia', 'Escudo Arcano',
    'Invisibilidade', 'Raio Ardente', 'Sugestão',
    'Bola de Fogo', 'Contramagia', 'Relâmpago',
    'Banimento', 'Polimorfia',
    'Cone de Frio', 'Dominar Pessoa',
    'Desintegrar', 'Globo de Invulnerabilidade',
    'Teleporte', 'Rajada Prismática',
    'Dominar Monstro', 'Clone',
    'Chuva de Meteoros', 'Desejo',
    'Curar Ferimentos', 'Palavra Curativa', 'Heroísmo', 'Perdição', 'Cativar', 'Detectar Pensamentos',
  ],
  // Especialista (Bardo nível 2, dentro dos 3 níveis multiclassados) —
  // 2 perícias que o personagem já era proficiente (mesma regra de
  // sempre: nunca concede proficiência nova, só dobra o bônus numa que
  // já tinha).
  periciasEspecialistaAtual: ['Arcanismo', 'Investigação'],
  // 4 ASI de Mago (níveis 4/8/12/16) — todas "Aumento no Valor de
  // Atributo" (ver `atributos` acima pra onde os pontos foram).
  talentosGeraisAtual: [
    'aumento-no-valor-de-atributo',
    'aumento-no-valor-de-atributo',
    'aumento-no-valor-de-atributo',
    'aumento-no-valor-de-atributo',
  ],
};
