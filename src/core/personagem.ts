// Forma de dado do personagem em construção (escolhas do wizard) +
// funções puras de atributo. Fica em core/ (não em ui/wizard/) porque
// isso é dado de personagem, não componente de tela — o motor de
// cálculo (calculoPersonagem.ts) e o armazenamento (armazenamentoPersonagens.ts)
// dependem deste formato.

import type { Atributo } from '../data/wizardFixtures';
import type { ItemCarrinho } from './loja';

export interface WizardSelection {
  classe: string | null;
  estiloDeLutaEscolhido: string | null;
  maestriaArmaEscolhida: string[];
  periciasClasseEscolhidas: string[];
  /** Ferramentas concedidas por proficiência de classe (ex.: Bardo
   * escolhe 3 Instrumentos Musicais) — diferente de
   * `ferramentaOrigemEscolhida` (Origem só concede 1). */
  ferramentasClasseEscolhidas: string[];
  /** IDs de `invocacoesMisticas.ts` (Bruxo) — Fase 1, ver
   * PENDENCIAS.md "Bruxo — Invocações Místicas Fase 2". */
  invocacoesMisticasEscolhidas: string[];
  truquesEscolhidos: string[];
  /** Livro de Magias (grimório) do Mago — pool de magias CONHECIDAS,
   * maior que `magiasPreparadasEscolhidas` (ver DECISOES-CLASSES.md
   * "Casters", Padrão C). Só preenchido por classes com o recurso
   * "Livro de Magias" em `classes.ts` (hoje só Mago) — `[]` nas
   * demais. Magias Preparadas devem ser um subconjunto desta lista. */
  livroDeMagiasEscolhido: string[];
  magiasPreparadasEscolhidas: string[];
  /** Livro das Sombras (Invocação Mística "Pacto do Tomo", ver
   * DND-Regras.md) — 3 truques + 2 magias de 1º círculo Ritual, de
   * qualquer classe. Só preenchido quando `pacto-do-tomo` está entre
   * `invocacoesMisticasEscolhidas`. */
  livroDasSombrasTruques: string[];
  livroDasSombrasMagias: string[];
  equipamentoClasseEscolhido: 'A' | 'B' | 'C' | null;
  origem: string | null;
  ferramentaOrigemEscolhida: string | null;
  equipamentoOrigemEscolhido: 'A' | 'B' | null;
  /** Escolhas livres de perícia/ferramenta concedidas pelo talento da
   * origem (ex.: Habilidoso — 3 escolhas, qualquer combinação). Nomes
   * de perícia (`Pericia.nome`) e de ferramenta (nome de item do
   * catálogo/`gruposFerramenta`) misturados na mesma lista. */
  proficienciasTalentoOrigemEscolhidas: string[];
  /** Talento Iniciado em Magia (Acólito/Guia/Sábio) — 2 truques + 1
   * magia de 1º círculo da lista de classe fixada em
   * `Origem.talentoOrigemVariante`, mais o atributo de conjuração
   * (livre entre Int/Sab/Car, não precisa bater com a lista). Fixo
   * desde a criação — este talento não ganha truque/magia extra por
   * nível. */
  truquesMagiaIniciadaEscolhidos: string[];
  magiaMagiaIniciadaEscolhida: string | null;
  atributoMagiaIniciadaEscolhido: Atributo | null;
  especie: string | null;
  /** Escolhas da espécie que a UI precisa reconhecer por ID (ver
   * `TracoEspecie.id`) — hoje só o Humano preenche algum destes.
   * `tamanhoEspecieEscolhido` é reaproveitável por qualquer espécie
   * com `tamanho.opcoes` (Aasimar e Tiferino também têm). */
  tamanhoEspecieEscolhido: string | null;
  periciaEspecieEscolhida: string | null;
  talentoEspecieEscolhido: string | null;
  /** Opção de sub-escolha `identidade_permanente` (ex.: cor de dragão
   * do Draconato, ancestralidade do Golias) — nome de
   * `Especie.opcoesSubescolha`, escolhido 1x na criação. */
  subescolhaEspecieEscolhida: string | null;
  /** Escolha extra do talento pego pelo traço Versátil (Humano) —
   * mesma forma de `proficienciasTalentoOrigemEscolhidas`/
   * `truquesMagiaIniciadaEscolhidos`/`magiaMagiaIniciadaEscolhida`/
   * `atributoMagiaIniciadaEscolhido`, só que numa "gaveta" separada.
   * Precisa ser separado porque o Versátil pode escolher um talento do
   * MESMO tipo que o Talento de Origem já concedeu (ex.: Origem Sábio
   * já dá Iniciado em Magia, e o Versátil escolhe Iniciado em Magia de
   * novo numa variante diferente) — se dividisse a mesma gaveta, a
   * escolha de um apagaria a do outro. Ver `TalentoEspecieEscolhasStep`. */
  proficienciasTalentoEspecieEscolhidas: string[];
  /** Lista de classe (Clérigo/Druida/Mago) escolhida livremente pra
   * "Iniciado em Magia" pego pelo Versátil — a Origem fixa isso
   * sozinha (`Origem.talentoOrigemVariante`), mas o Versátil não tem
   * Origem nenhuma pra herdar, então o jogador escolhe. `null` =
   * ainda não escolheu (só relevante quando `talentoEspecieEscolhido`
   * é "iniciado-em-magia"). */
  listaMagiaIniciadaEspecieEscolhida: string | null;
  truquesMagiaIniciadaEspecieEscolhidos: string[];
  magiaMagiaIniciadaEspecieEscolhida: string | null;
  atributoMagiaIniciadaEspecieEscolhido: Atributo | null;
  linguas: string[];
  alinhamento: string | null;
  itens: ItemCarrinho[];
  atributos: Record<Atributo, number | null>;
  bonusEscolhas: Atributo[];
  desbloquearAtributos: boolean;
  xp: number;
  nome: string;
  aparencia: string;
  personalidade: string;
}

export function criarSelecaoInicial(): WizardSelection {
  return {
    classe: null,
    estiloDeLutaEscolhido: null,
    maestriaArmaEscolhida: [],
    periciasClasseEscolhidas: [],
    ferramentasClasseEscolhidas: [],
    invocacoesMisticasEscolhidas: [],
    truquesEscolhidos: [],
    livroDeMagiasEscolhido: [],
    magiasPreparadasEscolhidas: [],
    livroDasSombrasTruques: [],
    livroDasSombrasMagias: [],
    equipamentoClasseEscolhido: null,
    origem: null,
    ferramentaOrigemEscolhida: null,
    equipamentoOrigemEscolhido: null,
    proficienciasTalentoOrigemEscolhidas: [],
    truquesMagiaIniciadaEscolhidos: [],
    magiaMagiaIniciadaEscolhida: null,
    atributoMagiaIniciadaEscolhido: null,
    especie: null,
    tamanhoEspecieEscolhido: null,
    periciaEspecieEscolhida: null,
    talentoEspecieEscolhido: null,
    subescolhaEspecieEscolhida: null,
    proficienciasTalentoEspecieEscolhidas: [],
    listaMagiaIniciadaEspecieEscolhida: null,
    truquesMagiaIniciadaEspecieEscolhidos: [],
    magiaMagiaIniciadaEspecieEscolhida: null,
    atributoMagiaIniciadaEspecieEscolhido: null,
    linguas: ['Comum'],
    alinhamento: null,
    itens: [],
    atributos: { FOR: null, DES: null, CON: null, INT: null, SAB: null, CAR: null },
    bonusEscolhas: [],
    desbloquearAtributos: false,
    xp: 0,
    nome: '',
    aparencia: '',
    personalidade: '',
  };
}

export function modificador(valor: number): number {
  return Math.floor((valor - 10) / 2);
}

export function modFmt(valor: number): string {
  const mod = modificador(valor);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Aplica um Aumento no Valor de Atributo (Level Up) — cada código em
 * `codigos` soma +1 (repetido 2x no mesmo = +2), capado em 20 (máximo
 * de atributo, regra real). `codigos` vem de `LevelUpShell`'s
 * `asiEscolhas` — 1 entrada por ponto distribuído. */
export function aumentarAtributos(atributos: Record<Atributo, number | null>, codigos: Atributo[]): Record<Atributo, number | null> {
  const atualizado = { ...atributos };
  for (const codigo of codigos) {
    const atual = atualizado[codigo] ?? 0;
    atualizado[codigo] = Math.min(20, atual + 1);
  }
  return atualizado;
}

export function valorFinalAtributo(selection: WizardSelection, atributo: Atributo): number | null {
  const base = selection.atributos[atributo];
  if (base === null || base === undefined) return null;
  const bonus = selection.bonusEscolhas.filter((x) => x === atributo).length;
  return base + bonus;
}
