import { describe, expect, it } from 'vitest';
import { podeLevelUpPorXp, proximoMarcoXp } from './experiencia';

describe('proximoMarcoXp', () => {
  it('retorna o próximo nível e o XP mínimo dele', () => {
    expect(proximoMarcoXp(1)).toEqual({ nivel: 2, xpNecessario: 300 });
    expect(proximoMarcoXp(4)).toEqual({ nivel: 5, xpNecessario: 6500 });
  });

  it('retorna null no nível máximo (20) — não tem próximo marco', () => {
    expect(proximoMarcoXp(20)).toBeNull();
  });
});

describe('podeLevelUpPorXp', () => {
  it('true quando o XP acumulado já bate o mínimo do próximo nível', () => {
    expect(podeLevelUpPorXp(1, 300)).toBe(true);
    expect(podeLevelUpPorXp(1, 500)).toBe(true);
  });

  it('false quando falta XP, e sempre false no nível máximo', () => {
    expect(podeLevelUpPorXp(1, 299)).toBe(false);
    expect(podeLevelUpPorXp(20, 999999)).toBe(false);
  });
});
