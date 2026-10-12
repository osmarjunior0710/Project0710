import { describe, it, expect } from 'vitest';
import { bonusAperfeicoamentoDePrecognicao, reducaoInsinuacaoDoId, pvTemporarioBioRetorno, danoPensamentosDestrutivos } from './disciplinasConjuracao';

describe('bonusAperfeicoamentoDePrecognicao', () => {
  it('retorna o próprio valor rolado', () => {
    expect(bonusAperfeicoamentoDePrecognicao(4)).toBe(4);
  });

  it('valor mínimo de 1 do dado', () => {
    expect(bonusAperfeicoamentoDePrecognicao(1)).toBe(1);
  });
});

describe('reducaoInsinuacaoDoId', () => {
  it('retorna o próprio valor rolado', () => {
    expect(reducaoInsinuacaoDoId(6)).toBe(6);
  });
});

describe('pvTemporarioBioRetorno', () => {
  it('soma os dados + mod. de Inteligência', () => {
    expect(pvTemporarioBioRetorno(7, 3)).toBe(10);
  });

  it('nunca fica abaixo de 1 (mod. negativo zera a soma)', () => {
    expect(pvTemporarioBioRetorno(1, -5)).toBe(1);
  });

  it('sem dados rolados (mod. de Inteligência 0) ainda garante o mínimo de 1', () => {
    expect(pvTemporarioBioRetorno(0, 0)).toBe(1);
  });
});

describe('danoPensamentosDestrutivos', () => {
  it('soma os dados + mod. de Inteligência', () => {
    expect(danoPensamentosDestrutivos(7, 2)).toBe(9);
  });

  it('nunca fica abaixo de 1', () => {
    expect(danoPensamentosDestrutivos(1, -4)).toBe(1);
  });
});
