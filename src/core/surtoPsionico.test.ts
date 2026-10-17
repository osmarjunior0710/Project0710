import { describe, expect, it } from 'vitest';
import { aplicarSurtoPsionicoEmValores, dadosElegiveisSurtoPsionico, temSurtoPsionico } from './surtoPsionico';

describe('surtoPsionico', () => {
  it('temSurtoPsionico só a partir do nível 7', () => {
    expect(temSurtoPsionico(6)).toBe(false);
    expect(temSurtoPsionico(7)).toBe(true);
    expect(temSurtoPsionico(20)).toBe(true);
  });

  it('dadosElegiveisSurtoPsionico conta só os valores 1, 2 ou 3', () => {
    expect(dadosElegiveisSurtoPsionico([1, 2, 3, 4, 5])).toBe(3);
    expect(dadosElegiveisSurtoPsionico([4, 5, 6])).toBe(0);
    expect(dadosElegiveisSurtoPsionico([])).toBe(0);
  });

  it('aplicarSurtoPsionicoEmValores sobe todo valor ≤3 pra 4, sem mexer no resto', () => {
    expect(aplicarSurtoPsionicoEmValores([1, 2, 3, 4, 8])).toEqual([4, 4, 4, 4, 8]);
    expect(aplicarSurtoPsionicoEmValores([5, 6])).toEqual([5, 6]);
  });
});
