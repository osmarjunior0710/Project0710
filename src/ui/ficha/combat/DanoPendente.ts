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
}
