import { describe, it, expect } from 'vitest';
import { resumoConjuracaoDeTalento } from './conjuracaoDeTalento';

describe('resumoConjuracaoDeTalento', () => {
  it('calcula mod./CD/ataque a partir do atributo e Bônus de Proficiência informados (Inteligência 16, Bônus +3)', () => {
    const resumo = resumoConjuracaoDeTalento('INT', 16, 3);
    expect(resumo).toEqual({
      atributoNome: 'Inteligência',
      atributo: 'INT',
      modAtributo: 3,
      modAtaque: 6,
      cd: 14,
    });
  });

  it('borda: valor de atributo baixo (10) dá mod. 0, CD/ataque só com o Bônus de Proficiência', () => {
    const resumo = resumoConjuracaoDeTalento('CAR', 10, 2);
    expect(resumo).toEqual({
      atributoNome: 'Carisma',
      atributo: 'CAR',
      modAtributo: 0,
      modAtaque: 2,
      cd: 10,
    });
  });
});
