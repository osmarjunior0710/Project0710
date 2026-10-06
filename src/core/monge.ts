// Monge — funções específicas da classe reaproveitadas por
// core/ataque.ts (Artes Marciais, nível 1). Ver sdd/sdd-monge.md.

import type { Arma } from '../data/rulesets/dnd2024/armas';

/** `true` se a arma conta como "arma de Monge" (Artes Marciais, nível
 * 1: "Armas Simples Corpo a Corpo" ou "Armas Marciais Corpo a Corpo
 * que têm a propriedade Leve") — decide se o ataque pode usar
 * Destreza e o Dado de Artes Marciais, não proficiência (Monge é
 * proficiente com TODAS as Armas Simples, incluindo à Distância, mas
 * só ganha os benefícios de Artes Marciais com estas). */
export function ehArmaDeMonge(arma: Arma): boolean {
  if (arma.categoria === 'Armas Simples Corpo a Corpo') return true;
  return arma.categoria === 'Armas Marciais Corpo a Corpo' && arma.propriedades.includes('Leve');
}
