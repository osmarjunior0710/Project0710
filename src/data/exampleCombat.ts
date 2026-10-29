// Dados de combate FIXOS pra Fase 0 — as 9 ações genéricas do Cap. 1
// (não são placeholder, ver CLAUDE.md "Marcação de conteúdo
// placeholder" — regra real, mesmo sem cálculo por trás ainda).

import type { ExplicacaoCalculo } from '../core/calculoPersonagem';

export interface AcaoBase {
  nome: string;
  desc: string;
  icone: string;
  /** Nomes de `PericiaFinal` (ver `core/calculoPersonagem.ts`) que essa ação
   * pode rolar — `undefined` = ação sem teste próprio (continua só texto).
   * Quando tem mais de 1 nome, o toque abre uma escolha de qual perícia
   * rolar antes de rolar (ver `AcaoPanelContent.tsx`). */
  periciasTeste?: string[];
}

export const acoesBase: AcaoBase[] = [
  { nome: 'Ajudar', desc: 'Ajuda o teste de atributo/ataque de outra criatura, ou presta primeiros socorros', icone: '🤝' },
  {
    nome: 'Analisar',
    desc: 'Teste de Inteligência (Arcanismo, História, Investigação, Natureza ou Religião)',
    icone: '🔍',
    periciasTeste: ['Arcanismo', 'História', 'Investigação', 'Natureza', 'Religião'],
  },
  { nome: 'Correr', desc: 'Ganha movimento adicional igual ao seu Deslocamento', icone: '🏃‍♂️' },
  { nome: 'Esconder', desc: 'Teste de Destreza (Furtividade)', icone: '🫥', periciasTeste: ['Furtividade'] },
  { nome: 'Esquivar', desc: 'Ataques contra você têm Desvantagem; suas salvaguardas de Destreza ganham Vantagem', icone: '🛡' },
  {
    nome: 'Influenciar',
    desc: 'Teste de Carisma (Atuação, Enganação, Intimidação, Persuasão) ou Sabedoria (Lidar com Animais)',
    icone: '💬',
    periciasTeste: ['Atuação', 'Enganação', 'Intimidação', 'Persuasão', 'Lidar com Animais'],
  },
  { nome: 'Preparar', desc: 'Prepara uma ação para executar em resposta a um gatilho definido por você', icone: '⏳' },
  {
    nome: 'Procurar',
    desc: 'Teste de Sabedoria (Intuição, Medicina, Percepção ou Sobrevivência)',
    icone: '👁',
    periciasTeste: ['Intuição', 'Medicina', 'Percepção', 'Sobrevivência'],
  },
  { nome: 'Usar Objeto', desc: 'Utilizar um objeto não mágico', icone: '🎒' },
];

export interface AtaqueInfo {
  modAcerto: number;
  /** Quebra do `modAcerto` (mod. do atributo usado, Bônus de
   * Proficiência quando soma, bônus de Estilo de Luta) — mesmo
   * formato do "ⓘ" de CA/perícia (`core/calculoPersonagem.ts`), pro
   * popup de rolagem de ataque (B7). */
  explicacaoAcerto: ExplicacaoCalculo;
  danoQuantidade: number;
  danoLados: number;
  danoMod: number;
  danoTipo: string;
  /** `true` = este ataque específico usa Força (Ataque Desarmado
   * sempre; arma Corpo a Corpo sem Acuidade; arma com Acuidade só
   * quando Força ≥ Destreza) — nunca à distância, nunca com atributo
   * forçado (ex.: Pacto da Lâmina). Mesmo cálculo que já decide o
   * bônus de Dano da Fúria em `core/ataque.ts`, só que exposto pra
   * fora agora — precisa disso pra decidir Vantagem do Ataque
   * Imprudente (Bárbaro), que só vale em ataques baseados em Força. */
  usouForca: boolean;
  /** `true` = arma Corpo a Corpo (ou Ataque Desarmado) — diferente de
   * `usouForca`: uma arma com Acuidade usada com Destreza continua
   * Corpo a Corpo, mas `usouForca` fica `false`. Usado por Golpes
   * Radiantes (Paladino nível 11, ver `AcaoPanelContent.tsx`), que
   * exige "arma Corpo a Corpo ou Ataque Desarmado", não "baseado em
   * Força". */
  corpoACorpo: boolean;
  /** `true` = Ataque Desarmado ou arma de Monge (`core/monge.ts`) — Golpe
   * Atordoante (Monge nível 5) só vale nesses ataques. */
  armaDeMonge?: boolean;
}

