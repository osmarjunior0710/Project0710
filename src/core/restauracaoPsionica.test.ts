import { describe, expect, it } from 'vitest';
import { podeUsarRestauracaoPsionica, temRestauracaoPsionica } from './restauracaoPsionica';

describe('restauracaoPsionica', () => {
  it('temRestauracaoPsionica só a partir do nível 5 de Psiônico', () => {
    expect(temRestauracaoPsionica(4)).toBe(false);
    expect(temRestauracaoPsionica(5)).toBe(true);
    expect(temRestauracaoPsionica(20)).toBe(true);
  });

  it('podeUsarRestauracaoPsionica exige não ter sido usada hoje E ter dado gasto pra recuperar', () => {
    expect(podeUsarRestauracaoPsionica(false, 3)).toBe(true);
    expect(podeUsarRestauracaoPsionica(true, 3)).toBe(false);
    expect(podeUsarRestauracaoPsionica(false, 0)).toBe(false);
  });
});
