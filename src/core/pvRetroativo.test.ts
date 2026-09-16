import { describe, expect, it } from 'vitest';
import { ajustarPvMaximoPorMudancaDeCon } from './pvRetroativo';

describe('ajustarPvMaximoPorMudancaDeCon', () => {
  it('soma o delta de mod. vezes o nível total quando o mod. sobe', () => {
    expect(ajustarPvMaximoPorMudancaDeCon(100, 2, 3, 20)).toBe(120);
  });

  it('não muda nada quando o mod. não mudou', () => {
    expect(ajustarPvMaximoPorMudancaDeCon(100, 2, 2, 20)).toBe(100);
  });

  it('subtrai quando o mod. cai (ex.: efeito que reduz Constituição)', () => {
    expect(ajustarPvMaximoPorMudancaDeCon(100, 3, 1, 10)).toBe(80);
  });
});
