import { describe, expect, it } from 'vitest';
import { duracaoAnimacaoPvMs, valorNoTempo } from './animacaoPv';

describe('duracaoAnimacaoPvMs', () => {
  it('5 pontos levam 1 s (mínimo)', () => {
    expect(duracaoAnimacaoPvMs(5)).toBe(1000);
  });

  it('8 pontos levam 1,6 s (0,2 s por ponto)', () => {
    expect(duracaoAnimacaoPvMs(8)).toBeCloseTo(1600);
  });

  it('distância pequena ou zero cai no mínimo de 1 s', () => {
    expect(duracaoAnimacaoPvMs(1)).toBe(1000);
    expect(duracaoAnimacaoPvMs(0)).toBe(1000);
  });

  it('dano grande fica travado em 2 s e sinal não importa', () => {
    expect(duracaoAnimacaoPvMs(50)).toBe(2000);
    expect(duracaoAnimacaoPvMs(-50)).toBe(2000);
  });
});

describe('valorNoTempo', () => {
  it('interpola linear no meio do caminho', () => {
    expect(valorNoTempo(10, 20, 500, 1000)).toBe(15);
    expect(valorNoTempo(20, 10, 250, 1000)).toBe(17.5);
  });

  it('bordas: no início é `de`, no fim (ou depois) é `para`', () => {
    expect(valorNoTempo(10, 20, 0, 1000)).toBe(10);
    expect(valorNoTempo(10, 20, 1000, 1000)).toBe(20);
    expect(valorNoTempo(10, 20, 5000, 1000)).toBe(20);
  });
});
