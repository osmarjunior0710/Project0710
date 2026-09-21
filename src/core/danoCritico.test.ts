import { describe, expect, it } from 'vitest';
import { danoComCritico } from './danoCritico';

describe('danoComCritico', () => {
  it('sem crítico mantém os dados e o modificador', () => {
    const r = danoComCritico({ quantidade: 1, lados: 8, mod: 3 }, false);
    expect(r).toEqual({ quantidade: 1, gruposExtras: undefined, formula: '1d8 + 3' });
  });

  it('crítico dobra os dados e NÃO dobra o modificador', () => {
    const r = danoComCritico({ quantidade: 1, lados: 8, mod: 3 }, true);
    expect(r.quantidade).toBe(2);
    expect(r.formula).toBe('2d8 + 3');
  });

  it('crítico dobra também os grupos extras (Golpe Brutal/Ataque Furtivo)', () => {
    const r = danoComCritico({ quantidade: 2, lados: 6, mod: 0, gruposExtras: [{ quantidade: 1, lados: 10 }] }, true);
    expect(r.quantidade).toBe(4);
    expect(r.gruposExtras).toEqual([{ quantidade: 2, lados: 10 }]);
    expect(r.formula).toBe('4d6 + 2d10');
  });

  it('borda: sem modificador não escreve "+ 0"', () => {
    expect(danoComCritico({ quantidade: 1, lados: 4, mod: 0 }, false).formula).toBe('1d4');
  });
});
