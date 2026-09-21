import { describe, expect, it } from 'vitest';
import { podeLevelUpPorXp, proximoMarcoXp, xpCompacto } from './experiencia';

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

describe('xpCompacto', () => {
  it('abaixo de mil mostra o número inteiro', () => {
    expect(xpCompacto(0)).toBe('0');
    expect(xpCompacto(999)).toBe('999');
  });

  it('milhares viram k (com 1 casa só quando precisa) e milhões viram M', () => {
    expect(xpCompacto(1000)).toBe('1k');
    expect(xpCompacto(1500)).toBe('1,5k');
    expect(xpCompacto(85000)).toBe('85k');
    expect(xpCompacto(1_200_000)).toBe('1,2M');
  });
});
