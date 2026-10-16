import { describe, expect, it } from 'vitest';
import { dadosRecuperadosReservasPsionicas } from './reservasPsionicas';

describe('reservasPsionicas', () => {
  it('nada antes do nível 18, mesmo com poucos dados restantes', () => {
    expect(dadosRecuperadosReservasPsionicas(17, 0)).toBe(0);
  });

  it('nada se já tem 4 ou mais restantes', () => {
    expect(dadosRecuperadosReservasPsionicas(18, 4)).toBe(0);
    expect(dadosRecuperadosReservasPsionicas(18, 7)).toBe(0);
  });

  it('completa até 4 quando tem menos (3 ou menos)', () => {
    expect(dadosRecuperadosReservasPsionicas(18, 0)).toBe(4);
    expect(dadosRecuperadosReservasPsionicas(18, 1)).toBe(3);
    expect(dadosRecuperadosReservasPsionicas(18, 3)).toBe(1);
  });

  it('nunca recupera um valor negativo', () => {
    expect(dadosRecuperadosReservasPsionicas(20, -1)).toBeGreaterThanOrEqual(0);
  });
});
