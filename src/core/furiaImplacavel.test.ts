import { describe, it, expect } from 'vitest';
import { deveOferecerFuriaImplacavel, cdFuriaImplacavel, pvFuriaImplacavel } from './furiaImplacavel';

describe('deveOferecerFuriaImplacavel', () => {
  it('dispara ao cair de PV positivo pra 0, com Fúria ativa', () => {
    expect(deveOferecerFuriaImplacavel(5, 0, true)).toBe(true);
  });

  it('não dispara sem a Fúria ativa', () => {
    expect(deveOferecerFuriaImplacavel(5, 0, false)).toBe(false);
  });

  it('não dispara se já estava em 0 (não é uma queda nova)', () => {
    expect(deveOferecerFuriaImplacavel(0, 0, true)).toBe(false);
  });

  it('não dispara se o PV não chegou a 0', () => {
    expect(deveOferecerFuriaImplacavel(5, 2, true)).toBe(false);
  });

  it('dispara de novo mesmo já tendo acontecido antes no mesmo descanso (só a CD escala, não o direito de tentar)', () => {
    expect(deveOferecerFuriaImplacavel(3, 0, true)).toBe(true);
  });
});

describe('cdFuriaImplacavel', () => {
  it('CD 10 na 1ª vez (0 usos ainda)', () => {
    expect(cdFuriaImplacavel(0)).toBe(10);
  });

  it('CD sobe +5 a cada uso seguinte', () => {
    expect(cdFuriaImplacavel(1)).toBe(15);
    expect(cdFuriaImplacavel(2)).toBe(20);
  });
});

describe('pvFuriaImplacavel', () => {
  it('PV vira 2x o nível NA CLASSE Bárbaro', () => {
    expect(pvFuriaImplacavel(11)).toBe(22);
  });

  it('borda: nível 20 (2x = 40)', () => {
    expect(pvFuriaImplacavel(20)).toBe(40);
  });
});
