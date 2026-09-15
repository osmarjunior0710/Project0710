import type { ExplicacaoCalculo } from '../../../core/calculoPersonagem';

/** Dano pendente de rolar (botão "Rolar Dano" no `CombatTab`) — movido
 * pra arquivo próprio (era declarado dentro de `AcaoPanelContent.tsx`)
 * pra `useUsarMagiaPainel.ts`/`BonusPanelContent.tsx`/`ReacaoPanelContent.tsx`
 * poderem importar sem depender de `AcaoPanelContent.tsx` (evita
 * import circular, já que ele passou a usar o hook). */
export interface DanoPendente {
  label: string;
  quantidade: number;
  lados: number;
  mod: number;
  /** Tipo de dano (ex.: "Perfurante") — ausente quando a fonte não é
   * um ataque com arma real (ex.: magia/característica sem tipo
   * definido aqui). Usado só pra habilitar o reroll do Perfurador
   * (ver `core/rerollDanoTalento.ts`). */
  tipoDano?: string;
  /** Quebra do dado de dano (B8) — só presente pra dano de magia
   * (`core/magiaDano.ts`/`core/conjurarMagia.ts`); ataque com arma
   * ainda não tem essa quebra (fora de escopo por enquanto, ver
   * EmDev.md). */
  explicacaoMod?: ExplicacaoCalculo;
  /** Golpe Brutal (Bárbaro nível 9+) — dado extra condicional a
   * acertar, só na jogada de ataque que renunciou à Vantagem do
   * Ataque Imprudente (`AcaoPanelContent.tsx`, `usarGolpeBrutal`).
   * Rola separado do dano normal (2 botões — mesmo padrão do dano
   * condicional de Badalar Fúnebre), sem mod. próprio (mesmo tipo de
   * dano da arma, já em `tipoDano` acima). `null`/ausente = ataque
   * comum, sem Golpe Brutal. */
  golpeBrutal?: { quantidade: number; lados: number } | null;
}
