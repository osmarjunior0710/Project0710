import { describe, expect, it } from 'vitest';
import { pontosDeFocoRecuperadosFocoPerfeito } from './focoPerfeito';

describe('Foco Perfeito', () => {
  it('com 3 ou menos, recupera até 4', () => {
    expect(pontosDeFocoRecuperadosFocoPerfeito(15, 3)).toBe(1);
    expect(pontosDeFocoRecuperadosFocoPerfeito(15, 0)).toBe(4);
  });
  it('com 4 ou mais, não recupera nada', () => {
    expect(pontosDeFocoRecuperadosFocoPerfeito(15, 4)).toBe(0);
    expect(pontosDeFocoRecuperadosFocoPerfeito(20, 12)).toBe(0);
  });
  it('antes do nível 15, nada', () => {
    expect(pontosDeFocoRecuperadosFocoPerfeito(14, 0)).toBe(0);
  });
});
