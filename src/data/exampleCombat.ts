// Dados de combate FIXOS pra Fase 0 — as 9 ações genéricas do Cap. 1
// (não são placeholder, ver CLAUDE.md "Marcação de conteúdo
// placeholder" — regra real, mesmo sem cálculo por trás ainda).

export interface AcaoBase {
  nome: string;
  desc: string;
  icone: string;
}

export const acoesBase: AcaoBase[] = [
  { nome: 'Ajudar', desc: 'Ajuda o teste de atributo/ataque de outra criatura, ou presta primeiros socorros', icone: '🤝' },
  { nome: 'Analisar', desc: 'Teste de Inteligência (Arcanismo, História, Investigação, Natureza ou Religião)', icone: '🔍' },
  { nome: 'Correr', desc: 'Ganha movimento adicional igual ao seu Deslocamento', icone: '🏃‍♂️' },
  { nome: 'Esconder', desc: 'Teste de Destreza (Furtividade)', icone: '🫥' },
  { nome: 'Esquivar', desc: 'Ataques contra você têm Desvantagem; suas salvaguardas de Destreza ganham Vantagem', icone: '🛡' },
  { nome: 'Influenciar', desc: 'Teste de Carisma (Atuação, Enganação, Intimidação, Persuasão) ou Sabedoria (Lidar com Animais)', icone: '💬' },
  { nome: 'Preparar', desc: 'Prepara uma ação para executar em resposta a um gatilho definido por você', icone: '⏳' },
  { nome: 'Procurar', desc: 'Teste de Sabedoria (Intuição, Medicina, Percepção ou Sobrevivência)', icone: '👁' },
  { nome: 'Usar Objeto', desc: 'Utilizar um objeto não mágico', icone: '🎒' },
];

export interface AtaqueInfo {
  modAcerto: number;
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
}

