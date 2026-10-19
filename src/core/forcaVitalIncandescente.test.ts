import { describe, expect, it } from 'vitest';
import { maximoDadosDeVidaForcaVital, temForcaVitalIncandescente } from './forcaVitalIncandescente';

describe('forcaVitalIncandescente', () => {
  it('temForcaVitalIncandescente só a partir do nível 20', () => {
    expect(temForcaVitalIncandescente(19)).toBe(false);
    expect(temForcaVitalIncandescente(20)).toBe(true);
  });

  it('maximoDadosDeVidaForcaVital nunca passa de 2, mesmo com muitos restantes', () => {
    expect(maximoDadosDeVidaForcaVital(10)).toBe(2);
    expect(maximoDadosDeVidaForcaVital(2)).toBe(2);
  });

  it('maximoDadosDeVidaForcaVital reflete 1 ou 0 restantes', () => {
    expect(maximoDadosDeVidaForcaVital(1)).toBe(1);
    expect(maximoDadosDeVidaForcaVital(0)).toBe(0);
    expect(maximoDadosDeVidaForcaVital(-1)).toBe(0);
  });
});
