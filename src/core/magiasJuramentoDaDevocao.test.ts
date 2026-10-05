import { describe, it, expect } from 'vitest';
import { magiasJuramentoDaDevocao } from './magiasJuramentoDaDevocao';

describe('magiasJuramentoDaDevocao', () => {
  it('nível 1: ainda não bateu o primeiro degrau (3)', () => {
    expect(magiasJuramentoDaDevocao(1)).toEqual([]);
  });

  it('nível 3: só o primeiro degrau', () => {
    expect(magiasJuramentoDaDevocao(3).sort()).toEqual(['Escudo da Fé', 'Proteção Contra o Bem e o Mal'].sort());
  });

  it('nível 4: continua só o primeiro degrau (não pula pro seguinte antes da hora)', () => {
    expect(magiasJuramentoDaDevocao(4).sort()).toEqual(['Escudo da Fé', 'Proteção Contra o Bem e o Mal'].sort());
  });

  it('nível 17: acumula todos os 5 degraus (3/5/9/13/17)', () => {
    expect(magiasJuramentoDaDevocao(17).sort()).toEqual(
      [
        'Escudo da Fé',
        'Proteção Contra o Bem e o Mal',
        'Auxílio',
        'Zona da Verdade',
        'Dissipar Magia',
        'Sinal de Esperança',
        'Defensor da Fé',
        'Movimentação Livre',
        'Coluna de Chamas',
        'Comunhão',
      ].sort(),
    );
  });

  it('nível 20: continua com os 10 (não há degrau além do 17)', () => {
    expect(magiasJuramentoDaDevocao(20)).toHaveLength(10);
  });
});
