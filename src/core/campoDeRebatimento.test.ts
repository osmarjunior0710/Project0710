import { describe, it, expect } from 'vitest';
import {
  temCampoDeRebatimento,
  podeAtivarCampoDeRebatimento,
  danoCampoDeRebatimento,
  danoCampoDeRebatimentoSucesso,
} from './campoDeRebatimento';

describe('temCampoDeRebatimento', () => {
  it('nível 5: ainda não bateu o nível 6', () => {
    expect(temCampoDeRebatimento(5)).toBe(false);
  });

  it('nível 6+: disponível', () => {
    expect(temCampoDeRebatimento(6)).toBe(true);
  });
});

describe('podeAtivarCampoDeRebatimento', () => {
  it('sem dados restantes: não pode, mesmo com a característica', () => {
    expect(podeAtivarCampoDeRebatimento(6, 0)).toBe(false);
  });

  it('com dados e característica: pode', () => {
    expect(podeAtivarCampoDeRebatimento(6, 3)).toBe(true);
  });
});

describe('danoCampoDeRebatimento (falha do atacante)', () => {
  it('caso normal: dado + mod. Inteligência', () => {
    expect(danoCampoDeRebatimento(6, 4)).toBe(10);
  });

  it('caso de borda: mod. Inteligência negativo', () => {
    expect(danoCampoDeRebatimento(3, -1)).toBe(2);
  });
});

describe('danoCampoDeRebatimentoSucesso (sucesso do atacante)', () => {
  it('metade arredondada pra baixo', () => {
    expect(danoCampoDeRebatimentoSucesso(6, 5)).toBe(5); // 11 / 2 = 5.5 -> 5
  });

  it('caso de borda: resultado exato (sem arredondar)', () => {
    expect(danoCampoDeRebatimentoSucesso(6, 2)).toBe(4); // 8 / 2 = 4
  });
});
