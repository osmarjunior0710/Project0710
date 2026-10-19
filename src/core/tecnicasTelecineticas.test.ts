import { describe, it, expect } from 'vitest';
import { temTecnicasTelecineticas, danoProjetilTelecinetico } from './tecnicasTelecineticas';

describe('temTecnicasTelecineticas', () => {
  it('nível 2: ainda não bateu o nível 3', () => {
    expect(temTecnicasTelecineticas(2)).toBe(false);
  });

  it('nível 3+: disponível', () => {
    expect(temTecnicasTelecineticas(3)).toBe(true);
    expect(temTecnicasTelecineticas(20)).toBe(true);
  });
});

describe('danoProjetilTelecinetico', () => {
  it('repassa o valor do dado da Propulsão (caso normal, dado maior)', () => {
    expect(danoProjetilTelecinetico(8)).toBe(8);
  });

  it('caso de borda: valor mínimo possível (1, do 1d4 ou de um Dado de Energia)', () => {
    expect(danoProjetilTelecinetico(1)).toBe(1);
  });
});
