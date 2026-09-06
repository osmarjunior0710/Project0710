// Personagem fixo de demonstração — pedido do Osmar pra ter uma URL
// estável (`/ficha/{ID_PERSONAGEM_DEMO}`) que qualquer navegador
// alcança, útil pra dar acesso a outra IA/pessoa ver a UI sem precisar
// criar um personagem antes. Dado congelado (não gerado em tempo de
// execução) pra garantir que todo navegador que abrir essa URL veja
// exatamente o mesmo personagem — gerado 1 vez com
// `core/geradorPersonagemTeste.ts` (Bardo/Colégio do Conhecimento,
// Origem Artista, Espécie Humano, nível 20) e congelado aqui. Ver
// `core/personagemDemo.ts` pra lógica de "criar se não existir" e
// `DECISOES-DESIGN.md`.
//
// Importante: o armazenamento hoje é só local (`localStorage`, ver
// `core/armazenamentoPersonagens.ts`) — não existe backend
// compartilhado ainda. Essa URL funciona em QUALQUER navegador porque
// o app recria esse personagem congelado ali (nunca de outro jeito)
// na primeira visita se ele ainda não existir localmente, não porque
// os dados vêm de um servidor.

import type { PersonagemSalvo } from '../core/armazenamentoPersonagens';

export const ID_PERSONAGEM_DEMO = 'demo-bardo-colegio-conhecimento';

export const personagemDemo: PersonagemSalvo = {
  id: ID_PERSONAGEM_DEMO,
  criadoEm: '2026-09-01T00:00:00.000Z',
  nivel: 20,
  xp: 0,
  pvAtual: 143,
  pvMax: 143,
  selecao: {
    classe: 'Bardo',
    estiloDeLutaEscolhido: null,
    maestriaArmaEscolhida: [],
    periciasClasseEscolhidas: ['Prestidigitação', 'Enganação', 'Persuasão'],
    ferramentasClasseEscolhidas: ['Xilofone', 'Flauta', 'Flauta de Pan'],
    invocacoesMisticasEscolhidas: [],
    truquesEscolhidos: ['Amigos', 'Mensagem'],
    magiasPreparadasEscolhidas: ['Fogo das Fadas', 'Heroísmo', 'Perdição', 'Escrita Ilusória'],
    livroDasSombrasTruques: [],
    livroDasSombrasMagias: [],
    equipamentoClasseEscolhido: 'A',
    origem: 'Artista',
    ferramentaOrigemEscolhida: 'Flauta de Pan',
    equipamentoOrigemEscolhido: 'A',
    proficienciasTalentoOrigemEscolhidas: [],
    truquesMagiaIniciadaEscolhidos: [],
    magiaMagiaIniciadaEscolhida: null,
    atributoMagiaIniciadaEscolhido: null,
    especie: 'Humano',
    tamanhoEspecieEscolhido: 'Médio (cerca de 1,20-2,10 metros de altura)',
    periciaEspecieEscolhida: 'Intimidação',
    talentoEspecieEscolhido: 'habilidoso',
    subescolhaEspecieEscolhida: null,
    proficienciasTalentoEspecieEscolhidas: ['Percepção', 'Investigação', 'Medicina'],
    listaMagiaIniciadaEspecieEscolhida: null,
    truquesMagiaIniciadaEspecieEscolhidos: [],
    magiaMagiaIniciadaEspecieEscolhida: null,
    atributoMagiaIniciadaEspecieEscolhido: null,
    linguas: ['Comum', 'Infernal', 'Gigante'],
    alinhamento: 'Caótico e Bom',
    itens: [],
    atributos: { FOR: 15, DES: 12, CON: 15, INT: 13, SAB: 8, CAR: 15 },
    bonusEscolhas: ['FOR', 'INT', 'CAR'],
    desbloquearAtributos: false,
    xp: 0,
    nome: 'Sira Nuvem-de-Fogo',
    aparencia: '',
    personalidade: '',
  },
  subclasseAtual: 'Colégio do Conhecimento',
  estiloDeLutaAtual: null,
  truquesAtual: ['Proteção Contra Lâminas', 'Trovão', 'Prestidigitação Arcana', 'Reparar'],
  magiasPreparadasAtual: [
    'Leque Cromático',
    'Perdição',
    'Detectar Pensamentos',
    'Imagem Silenciosa',
    'Ligação Telepática de Rary',
    'Nuvem de Adagas',
    'Falar com Mortos',
    'Invisibilidade',
    'Identificar',
    'Espada de Mordenkainen',
    'Paralisar Pessoa',
    'Rajada Prismática',
    'Despertar',
    'Dominar Pessoa',
    'Sussurros Dissonantes',
    'Suplício',
    'Miragem Arcana',
    'Limpar a Mente',
    'Glifo de Proteção',
    'Ressurreição',
    'Dança Irresistível de Otto',
    'Fonte do Luar',
  ],
  periciasEspecialistaAtual: ['Prestidigitação', 'Persuasão', 'Enganação', 'Atuação'],
  talentosGeraisAtual: [
    'especialista-em-armaduras-pesadas',
    'aumento-no-valor-de-atributo',
    'aumento-no-valor-de-atributo',
    'tocado-pelas-fadas',
  ],
};
