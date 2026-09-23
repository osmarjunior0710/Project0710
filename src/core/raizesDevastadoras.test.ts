import { describe, it, expect } from 'vitest';
import { explicarCdRaizesDevastadoras } from './raizesDevastadoras';

describe('explicarCdRaizesDevastadoras', () => {
  it('CD base 8 + mod. FOR + Bônus de Proficiência (caso normal)', () => {
    expect(explicarCdRaizesDevastadoras(3, 4)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. FOR', valor: '+3' },
        { label: 'Bônus de Proficiência', valor: '+4' },
      ],
      total: { label: 'CD', valor: '15' },
    });
  });

  it('mod. FOR negativo (borda)', () => {
    expect(explicarCdRaizesDevastadoras(-1, 2)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. FOR', valor: '-1' },
        { label: 'Bônus de Proficiência', valor: '+2' },
      ],
      total: { label: 'CD', valor: '9' },
    });
  });
});
