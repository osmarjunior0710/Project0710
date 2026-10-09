// Defletir Ataques (Monge, nível 3) / Defletir Energia (nível 13) — ver
// sdd/sdd-monge.md seção 7. Reação que REDUZ o dano recebido; o app só
// rola/mostra os números, quem desconta do PV é o jogador.

/** Redução = 1d10 + mod. Destreza + nível de Monge (fórmula pro rolador). */
export function formulaReducaoDefletirAtaques(desMod: number, nivelMonge: number): { formula: string; mod: number } {
  const mod = desMod + nivelMonge;
  return { formula: `1d10 ${mod < 0 ? '-' : '+'} ${Math.abs(mod)}`, mod };
}

/** Redirecionar (1 Foco, quando a redução zera o dano): 2 jogadas do dado
 * de Artes Marciais + mod. Destreza. */
export function formulaRedirecionarDefletir(ladosArtesMarciais: number, desMod: number): { formula: string; mod: number } {
  return { formula: `2d${ladosArtesMarciais} ${desMod < 0 ? '-' : '+'} ${Math.abs(desMod)}`, mod: desMod };
}

/** `true` a partir do nível 13 (Defletir Energia): qualquer tipo de dano,
 * não só Contundente/Cortante/Perfurante. */
export function defletirAceitaQualquerDano(nivelMonge: number): boolean {
  return nivelMonge >= 13;
}
