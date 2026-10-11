import { describe, expect, it } from 'vitest';
import { alcanceConexaoTelepatica, usoDaConexaoTelepatica } from './conexaoTelepatica';

describe('Conexão Telepática', () => {
  it('alcance = 9 m + 3 × resultado do dado', () => {
    expect(alcanceConexaoTelepatica(1)).toBe(12);
    expect(alcanceConexaoTelepatica(6)).toBe(27);
    expect(alcanceConexaoTelepatica(12)).toBe(45);
  });

  it('1º uso depois do Descanso Longo é grátis, mesmo sem dados', () => {
    expect(usoDaConexaoTelepatica({ gratisUsada: false, dadosRestantes: 0 })).toEqual({ gastaDado: false });
  });

  it('usos seguintes gastam o dado; sem dado não pode usar', () => {
    expect(usoDaConexaoTelepatica({ gratisUsada: true, dadosRestantes: 2 })).toEqual({ gastaDado: true });
    expect(usoDaConexaoTelepatica({ gratisUsada: true, dadosRestantes: 0 })).toBeNull();
  });
});
