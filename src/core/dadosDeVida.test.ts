import { describe, expect, it } from 'vitest';
import { curaDeDadoDeVida, reservaDeDadosDeVida, totalDeDadosRestantes } from './dadosDeVida';

const dados: Record<string, string> = { Guerreiro: 'd10', Paladino: 'd10', Clérigo: 'd8', Bardo: 'd8', Mago: 'd6' };
const dadoPorClasse = (n: string) => dados[n];

describe('reservaDeDadosDeVida', () => {
  it('1 classe: 1 dado por nível do tipo da classe', () => {
    const r = reservaDeDadosDeVida([{ classe: 'Mago', nivel: 5 }], dadoPorClasse, {});
    expect(r).toEqual([{ tipo: 'd6', lados: 6, total: 5, gastos: 0, restantes: 5 }]);
  });

  it('multiclasse com o mesmo tipo combina (Guerreiro 5 / Paladino 5 = 10d10)', () => {
    const r = reservaDeDadosDeVida(
      [
        { classe: 'Guerreiro', nivel: 5 },
        { classe: 'Paladino', nivel: 5 },
      ],
      dadoPorClasse,
      {},
    );
    expect(r).toHaveLength(1);
    expect(r[0]).toMatchObject({ tipo: 'd10', total: 10 });
  });

  it('multiclasse com tipos diferentes mantém separado (Clérigo 5 / Paladino 5), do menor pro maior', () => {
    const r = reservaDeDadosDeVida(
      [
        { classe: 'Paladino', nivel: 5 },
        { classe: 'Clérigo', nivel: 5 },
      ],
      dadoPorClasse,
      { d8: 2 },
    );
    expect(r.map((x) => [x.tipo, x.total, x.restantes])).toEqual([
      ['d8', 5, 3],
      ['d10', 5, 5],
    ]);
    expect(totalDeDadosRestantes(r)).toBe(8);
  });

  it('gasto nunca passa do total e classe desconhecida é ignorada', () => {
    const r = reservaDeDadosDeVida(
      [
        { classe: 'Mago', nivel: 2 },
        { classe: 'Inventada', nivel: 9 },
      ],
      dadoPorClasse,
      { d6: 99 },
    );
    expect(r).toEqual([{ tipo: 'd6', lados: 6, total: 2, gastos: 2, restantes: 0 }]);
  });
});

describe('curaDeDadoDeVida', () => {
  it('soma o modificador de Constituição', () => {
    expect(curaDeDadoDeVida(4, 2)).toBe(6);
  });

  it('mínimo de 1 PV mesmo com Constituição negativa', () => {
    expect(curaDeDadoDeVida(1, -3)).toBe(1);
  });
});
