import { describe, it, expect } from 'vitest';
import { dadosAtaqueDeSopro, explicarCdAtaqueDeSopro } from './ataqueDeSopro';

describe('dadosAtaqueDeSopro', () => {
  it('1d10 nos níveis 1-4', () => {
    expect(dadosAtaqueDeSopro(1)).toBe(1);
    expect(dadosAtaqueDeSopro(4)).toBe(1);
  });

  it('2d10 nos níveis 5-10', () => {
    expect(dadosAtaqueDeSopro(5)).toBe(2);
    expect(dadosAtaqueDeSopro(10)).toBe(2);
  });

  it('3d10 nos níveis 11-16', () => {
    expect(dadosAtaqueDeSopro(11)).toBe(3);
    expect(dadosAtaqueDeSopro(16)).toBe(3);
  });

  it('4d10 no nível 17+', () => {
    expect(dadosAtaqueDeSopro(17)).toBe(4);
    expect(dadosAtaqueDeSopro(20)).toBe(4);
  });
});

describe('explicarCdAtaqueDeSopro', () => {
  it('CD base 8 + mod. CON + Bônus de Proficiência (caso normal)', () => {
    expect(explicarCdAtaqueDeSopro(3, 2)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. CON', valor: '+3' },
        { label: 'Bônus de Proficiência', valor: '+2' },
      ],
      total: { label: 'CD', valor: '13' },
    });
  });

  it('mod. CON negativo (borda)', () => {
    expect(explicarCdAtaqueDeSopro(-1, 2)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. CON', valor: '-1' },
        { label: 'Bônus de Proficiência', valor: '+2' },
      ],
      total: { label: 'CD', valor: '9' },
    });
  });
});
