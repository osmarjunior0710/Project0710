import { describe, it, expect } from 'vitest';
import { deveAplicarVigorImplacavel } from './vigorImplacavel';

describe('deveAplicarVigorImplacavel', () => {
  it('dispara ao cair de PV positivo pra 0', () => {
    expect(deveAplicarVigorImplacavel(5, 0, false)).toBe(true);
  });

  it('não dispara se já estava em 0 (não é uma queda nova)', () => {
    expect(deveAplicarVigorImplacavel(0, 0, false)).toBe(false);
  });

  it('não dispara se já foi usado desde o último Descanso Longo', () => {
    expect(deveAplicarVigorImplacavel(5, 0, true)).toBe(false);
  });

  it('não dispara se o PV não chegou a 0', () => {
    expect(deveAplicarVigorImplacavel(5, 2, false)).toBe(false);
  });
});
