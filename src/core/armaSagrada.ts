/** Arma Sagrada (Paladino, Juramento da Devoção, nível 3) — ver
 * `sdd/sdd-paladino-devocao.md` seção 2. [codeimplementation] */

/** Bônus de acerto da Arma Sagrada: mod. de Carisma, mínimo +1 —
 * mesma fórmula de Aura de Proteção (`core/recursosClasse.ts`). */
export function bonusArmaSagrada(modCarisma: number): number {
  return Math.max(1, modCarisma);
}

/** A regra fala em "arma Corpo a Corpo que você está empunhando" — o
 * app só rastreia 1 arma equipada por vez pro "Atacar" (ver
 * `AcaoPanelContent.tsx`), então a elegibilidade é simplesmente: o
 * ataque atual é Corpo a Corpo E não é Ataque Desarmado (Desarmado
 * não é uma arma segurada, mesmo tendo `corpoACorpo: true`). */
export function armaElegivelParaArmaSagrada(nomeAtaque: string, corpoACorpo: boolean): boolean {
  return corpoACorpo && nomeAtaque !== 'Ataque Desarmado';
}
