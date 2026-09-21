import { xpPorNivel } from '../data/rulesets/dnd2024/evolucaoPersonagem';

/** Marco de XP pro próximo nível — `null` quando já está no nível
 * máximo (20), que não tem próximo marco. */
export function proximoMarcoXp(nivelAtual: number): { nivel: number; xpNecessario: number } | null {
  const proximoNivel = nivelAtual + 1;
  const xpNecessario = xpPorNivel[proximoNivel];
  if (xpNecessario === undefined) return null;
  return { nivel: proximoNivel, xpNecessario };
}

/** `true` quando o XP acumulado já basta pro próximo nível (>=, nunca
 * <) — nível 20 sempre retorna `false` (não tem pra onde subir). */
export function podeLevelUpPorXp(nivelAtual: number, xpAtual: number): boolean {
  const marco = proximoMarcoXp(nivelAtual);
  if (marco === null) return false;
  return xpAtual >= marco.xpNecessario;
}

/** XP em forma curta pra caber num espaço pequeno (centro do anel de XP):
 * 999 → "999", 1500 → "1,5k", 85000 → "85k", 1200000 → "1,2M". */
export function xpCompacto(xp: number): string {
  const fmt = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(1).replace('.', ','));
  if (xp < 1000) return String(xp);
  if (xp < 1_000_000) return `${fmt(Math.round(xp / 100) / 10)}k`;
  return `${fmt(Math.round(xp / 100_000) / 10)}M`;
}
