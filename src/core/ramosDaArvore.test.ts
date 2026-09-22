import { describe, it, expect } from 'vitest';
import { explicarCdRamosDaArvore } from './ramosDaArvore';

describe('explicarCdRamosDaArvore', () => {
  it('CD base 8 + mod. FOR + Bônus de Proficiência (caso normal)', () => {
    expect(explicarCdRamosDaArvore(3, 2)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. FOR', valor: '+3' },
        { label: 'Bônus de Proficiência', valor: '+2' },
      ],
      total: { label: 'CD', valor: '13' },
    });
  });

  it('mod. FOR negativo (borda)', () => {
    expect(explicarCdRamosDaArvore(-1, 2)).toEqual({
      linhas: [
        { label: 'CD base', valor: '8' },
        { label: 'mod. FOR', valor: '-1' },
        { label: 'Bônus de Proficiência', valor: '+2' },
      ],
      total: { label: 'CD', valor: '9' },
    });
  });
});
