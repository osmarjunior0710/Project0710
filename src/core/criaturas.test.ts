import { describe, it, expect } from 'vitest';
import { caCriatura, pvMaxCriatura } from './criaturas';
import { criaturas } from '../data/rulesets/dnd2024/criaturas';

function acha(id: string) {
  const c = criaturas.find((c) => c.id === id);
  if (!c) throw new Error(`criatura "${id}" não encontrada`);
  return c;
}

describe('caCriatura', () => {
  it('caso normal — Gato tem CA 12', () => {
    expect(caCriatura(acha('gato'))).toBe(12);
  });

  it('caso de borda — Zumbi tem CA baixa (8), ainda deve converter certo', () => {
    expect(caCriatura(acha('zumbi'))).toBe(8);
  });
});

describe('pvMaxCriatura', () => {
  it('caso normal — Gato tem PV 2 (1d4)', () => {
    expect(pvMaxCriatura(acha('gato'))).toBe(2);
  });

  it('caso de borda — Aranha tem PV 1, fórmula com subtração "1d4 – 1"', () => {
    expect(pvMaxCriatura(acha('aranha'))).toBe(1);
  });
});
