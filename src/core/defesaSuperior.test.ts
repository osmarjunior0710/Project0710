import { describe, expect, it } from 'vitest';
import { podeAtivarDefesaSuperior, temDefesaSuperior } from './defesaSuperior';

describe('Defesa Superior', () => {
  it('só a partir do nível 18', () => {
    expect(temDefesaSuperior(17)).toBe(false);
    expect(temDefesaSuperior(18)).toBe(true);
  });
  it('ativar custa 3 Pontos de Foco', () => {
    expect(podeAtivarDefesaSuperior(18, 3)).toBe(true);
    expect(podeAtivarDefesaSuperior(18, 2)).toBe(false);
    expect(podeAtivarDefesaSuperior(17, 10)).toBe(false);
  });
});
