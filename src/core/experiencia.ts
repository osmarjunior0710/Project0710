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
