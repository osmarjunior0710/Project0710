import { xpPorNivel } from '../data/rulesets/dnd2024/evolucaoPersonagem';

/** Marco de XP pro próximo nível — `null` quando já está no nível
 * máximo (20), que não tem próximo marco. */
export function proximoMarcoXp(nivelAtual: number): { nivel: number; xpNecessario: number } | null {
  const proximoNivel = nivelAtual + 1;
  const xpNecessario = xpPorNivel[proximoNivel];
  if (xpNecessario === undefined) return null;
  return { nivel: proximoNivel, xpNecessario };
}

/** Progresso REAL dentro do nível atual: quanto do XP deste nível já foi
 * ganho (`atual`) e quanto o nível inteiro pede (`total`) — ex.: nível 2
 * (marco 300) indo pro 3 (marco 900) com 301 XP acumulados = 1 de 600,
 * não 301 de 900. `null` no nível máximo (sem próximo marco). */
export function progressoNoNivelXp(nivelAtual: number, xpAtual: number): { atual: number; total: number } | null {
  const proximo = proximoMarcoXp(nivelAtual);
  if (proximo === null) return null;
  const base = xpPorNivel[nivelAtual] ?? 0;
  const total = proximo.xpNecessario - base;
  return { atual: Math.min(total, Math.max(0, xpAtual - base)), total };
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
