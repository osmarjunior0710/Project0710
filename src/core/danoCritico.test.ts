import { describe, expect, it } from 'vitest';
import { danoComCritico, dadoExtraPerfurador } from './danoCritico';

describe('danoComCritico', () => {
  it('sem crítico mantém os dados e o modificador', () => {
    const r = danoComCritico({ quantidade: 1, lados: 8, mod: 3 }, false);
    expect(r).toEqual({ quantidade: 1, gruposExtras: undefined, formula: '1d8 + 3' });
  });

  it('crítico dobra os dados e NÃO dobra o modificador', () => {
    const r = danoComCritico({ quantidade: 1, lados: 8, mod: 3 }, true);
    expect(r.quantidade).toBe(2);
    expect(r.formula).toBe('2d8 + 3');
  });

  it('crítico dobra também os grupos extras (Golpe Brutal/Ataque Furtivo)', () => {
    const r = danoComCritico({ quantidade: 2, lados: 6, mod: 0, gruposExtras: [{ quantidade: 1, lados: 10 }] }, true);
    expect(r.quantidade).toBe(4);
    expect(r.gruposExtras).toEqual([{ quantidade: 2, lados: 10 }]);
    expect(r.formula).toBe('4d6 + 2d10');
  });

  it('borda: sem modificador não escreve "+ 0"', () => {
    expect(danoComCritico({ quantidade: 1, lados: 4, mod: 0 }, false).formula).toBe('1d4');
  });
});

describe('Crítico Melhorado do Perfurador', () => {
  it('só no crítico, com dano Perfurante e o talento: +1 dado do tamanho da arma', () => {
    expect(dadoExtraPerfurador(true, 'Perfurante', true, 4)).toEqual([{ quantidade: 1, lados: 4 }]);
    expect(dadoExtraPerfurador(false, 'Perfurante', true, 4)).toEqual([]);
    expect(dadoExtraPerfurador(true, 'Cortante', true, 4)).toEqual([]);
    expect(dadoExtraPerfurador(true, 'Perfurante', false, 4)).toEqual([]);
  });

  it('o dado extra NÃO dobra: Adaga (1d4+3) crítica = 2d4 + 3 + 1d4', () => {
    const dano = danoComCritico(
      { quantidade: 1, lados: 4, mod: 3, gruposFixos: dadoExtraPerfurador(true, 'Perfurante', true, 4) },
      true,
    );
    expect(dano.quantidade).toBe(2);
    expect(dano.gruposExtras).toEqual([{ quantidade: 1, lados: 4 }]);
    expect(dano.formula).toBe('2d4 + 3 + 1d4');
  });

  it('convive com dado extra que dobra (Golpe Brutal 1d10 vira 2d10) e sem crítico não muda nada', () => {
    const critico = danoComCritico(
      { quantidade: 1, lados: 4, mod: 0, gruposExtras: [{ quantidade: 1, lados: 10 }], gruposFixos: [{ quantidade: 1, lados: 4 }] },
      true,
    );
    expect(critico.formula).toBe('2d4 + 2d10 + 1d4');
    expect(danoComCritico({ quantidade: 1, lados: 4, mod: 0 }, false).gruposExtras).toBeUndefined();
  });
});
