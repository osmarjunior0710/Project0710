import { describe, expect, it } from 'vitest';
import { defletirAceitaQualquerDano, formulaRedirecionarDefletir, formulaReducaoDefletirAtaques } from './defletirAtaques';

describe('Defletir Ataques', () => {
  it('redução = 1d10 + DES + nível de Monge', () => {
    expect(formulaReducaoDefletirAtaques(3, 5)).toEqual({ formula: '1d10 + 8', mod: 8 });
  });
  it('Destreza negativa reduz o modificador', () => {
    expect(formulaReducaoDefletirAtaques(-1, 3)).toEqual({ formula: '1d10 + 2', mod: 2 });
    expect(formulaReducaoDefletirAtaques(-5, 3).formula).toBe('1d10 - 2');
  });
  it('redirecionar = 2 dados de Artes Marciais + DES', () => {
    expect(formulaRedirecionarDefletir(8, 3)).toEqual({ formula: '2d8 + 3', mod: 3 });
    expect(formulaRedirecionarDefletir(6, -1).formula).toBe('2d6 - 1');
  });
  it('Defletir Energia só no nível 13+', () => {
    expect(defletirAceitaQualquerDano(12)).toBe(false);
    expect(defletirAceitaQualquerDano(13)).toBe(true);
  });
});
