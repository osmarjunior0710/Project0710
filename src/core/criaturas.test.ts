import { describe, it, expect } from 'vitest';
import { caCriatura, pvMaxCriatura, valorAtributoCriatura, ndCriatura } from './criaturas';
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

describe('valorAtributoCriatura', () => {
  it('caso normal — Gato tem DES 15', () => {
    expect(valorAtributoCriatura(acha('gato'), 'DES')).toBe(15);
  });

  it('caso de borda — Gato tem FOR 3 (valor baixo, 1 dígito)', () => {
    expect(valorAtributoCriatura(acha('gato'), 'FOR')).toBe(3);
  });
});

describe('ndCriatura', () => {
  it('caso normal — Elefante tem ND inteiro (4)', () => {
    expect(ndCriatura(acha('elefante'))).toBe(4);
  });

  it('caso de borda — Zumbi tem ND fracionário (1/4)', () => {
    expect(ndCriatura(acha('zumbi'))).toBe(0.25);
  });
});
