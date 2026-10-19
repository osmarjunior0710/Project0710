import { describe, it, expect } from 'vitest';
import { magiasPsicinetico } from './magiasPsicinetico';

describe('magiasPsicinetico', () => {
  it('nível 1: ainda não bateu o primeiro degrau (3)', () => {
    expect(magiasPsicinetico(1)).toEqual([]);
  });

  it('nível 3: só o primeiro degrau', () => {
    expect(magiasPsicinetico(3).sort()).toEqual(
      ['Nuvem de Adagas', 'Levitação', 'Escudo Arcano', 'Onda Trovejante'].sort(),
    );
  });

  it('nível 4: continua só o primeiro degrau (não pula pro seguinte antes da hora)', () => {
    expect(magiasPsicinetico(4).sort()).toEqual(
      ['Nuvem de Adagas', 'Levitação', 'Escudo Arcano', 'Onda Trovejante'].sort(),
    );
  });

  it('nível 9: acumula todos os 4 degraus (3/5/7/9)', () => {
    expect(magiasPsicinetico(9).sort()).toEqual(
      [
        'Nuvem de Adagas',
        'Levitação',
        'Escudo Arcano',
        'Onda Trovejante',
        'Lentidão',
        'Esmagamento Telecinético',
        'Esfera Resiliente de Otiluke',
        'Moldar Rochas',
        'Telecinese',
        'Muralha de Energia',
      ].sort(),
    );
  });

  it('nível 20: continua com os 10 (não há degrau além do 9)', () => {
    expect(magiasPsicinetico(20)).toHaveLength(10);
  });
});
