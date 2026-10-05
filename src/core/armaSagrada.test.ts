import { describe, it, expect } from 'vitest';
import { bonusArmaSagrada, armaElegivelParaArmaSagrada } from './armaSagrada';

describe('bonusArmaSagrada', () => {
  it('Carisma negativo: ainda garante o mínimo de +1', () => {
    expect(bonusArmaSagrada(-1)).toBe(1);
  });

  it('Carisma +5: usa o modificador normal', () => {
    expect(bonusArmaSagrada(5)).toBe(5);
  });
});

describe('armaElegivelParaArmaSagrada', () => {
  it('arma corpo a corpo de verdade: elegível', () => {
    expect(armaElegivelParaArmaSagrada('Espada Longa', true)).toBe(true);
  });

  it('Ataque Desarmado: nunca elegível, mesmo sendo corpo a corpo', () => {
    expect(armaElegivelParaArmaSagrada('Ataque Desarmado', true)).toBe(false);
  });

  it('arma à distância: não elegível', () => {
    expect(armaElegivelParaArmaSagrada('Besta Pesada', false)).toBe(false);
  });
});
