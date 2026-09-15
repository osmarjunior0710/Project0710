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
// upcast, magia sem ataque/salvaguarda). Entrega 2 sobe pra nível 20
// via Level Up de verdade e multiclassa Clérigo (cura); Entrega 3
// popula a Mochila com o catálogo completo de equipamento. Ver
// EmDev.md.

import type { PersonagemSalvo } from '../core/armazenamentoPersonagens';

export const ID_PERSONAGEM_TESTE_FIXO = 'teste-fixo-mago-clerigo';

export const personagemTesteFixo: PersonagemSalvo = {
  id: ID_PERSONAGEM_TESTE_FIXO,
  criadoEm: '2026-09-15T00:00:00.000Z',
  nivel: 1,
  xp: 0,
  pvAtual: 10,
  pvMax: 10,
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
    // padrão de criação normal.
    atributos: { FOR: 8, DES: 10, CON: 16, INT: 20, SAB: 16, CAR: 8 },
    bonusEscolhas: [],
    desbloquearAtributos: true,
    xp: 0,
    nome: 'Char de Teste Fixo',
    aparencia: '',
    personalidade: '',
  },
  truquesAtual: ['Raio de Fogo', 'Mãos Mágicas', 'Prestidigitação Arcana'],
  livroDeMagiasAtual: ['Mísseis Mágicos', 'Mãos Flamejantes', 'Detectar Magia', 'Escudo Arcano', 'Identificar', 'Sono'],
  magiasPreparadasAtual: ['Mísseis Mágicos', 'Mãos Flamejantes', 'Detectar Magia', 'Escudo Arcano'],
  periciasEspecialistaAtual: [],
  talentosGeraisAtual: [],
};
