import { describe, it, expect } from 'vitest';
import { condicoesDisponiveisMaosConsagradas, custoTotalMaosConsagradas } from './maosConsagradas';

describe('condicoesDisponiveisMaosConsagradas', () => {
  it('sem Toque Restaurador: só Envenenado (nível 1, Mãos Consagradas base)', () => {
    expect(condicoesDisponiveisMaosConsagradas(false)).toEqual(['Envenenado']);
  });

  it('com Toque Restaurador (nível 14): Envenenado + as 6 novas condições', () => {
    const r = condicoesDisponiveisMaosConsagradas(true);
    expect(r).toContain('Envenenado');
    expect(r).toContain('Amedrontado');
    expect(r).toContain('Atordoado');
    expect(r).toContain('Cego');
    expect(r).toContain('Enfeitiçado');
    expect(r).toContain('Paralisado');
    expect(r).toContain('Surdo');
    expect(r).toHaveLength(7);
  });
});

describe('custoTotalMaosConsagradas', () => {
  it('só cura, sem condição: custo = PV pra curar', () => {
    expect(custoTotalMaosConsagradas(10, 0)).toBe(10);
  });

  it('só condição, sem curar: custo = 5 × número de condições', () => {
    expect(custoTotalMaosConsagradas(0, 1)).toBe(5);
    expect(custoTotalMaosConsagradas(0, 3)).toBe(15);
  });

  it('caso normal — cura E condição juntos no mesmo toque (regra real)', () => {
    expect(custoTotalMaosConsagradas(6, 1)).toBe(11);
  });

  it('borda: nada escolhido, custo 0', () => {
    expect(custoTotalMaosConsagradas(0, 0)).toBe(0);
  });
});
