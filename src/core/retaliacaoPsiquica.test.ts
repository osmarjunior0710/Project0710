import { describe, expect, it } from 'vitest';
import { podeAtivarRetaliacaoPsiquica, reducaoRetaliacaoPsiquica, temRetaliacaoPsiquica } from './retaliacaoPsiquica';

describe('retaliacaoPsiquica', () => {
  it('temRetaliacaoPsiquica só com a disciplina conhecida', () => {
    expect(temRetaliacaoPsiquica(['retaliacao-psiquica', 'mente-agucada'])).toBe(true);
    expect(temRetaliacaoPsiquica(['mente-agucada'])).toBe(false);
  });

  it('podeAtivarRetaliacaoPsiquica exige a disciplina E ao menos 1 dado', () => {
    expect(podeAtivarRetaliacaoPsiquica(['retaliacao-psiquica'], 1)).toBe(true);
    expect(podeAtivarRetaliacaoPsiquica(['retaliacao-psiquica'], 0)).toBe(false);
    expect(podeAtivarRetaliacaoPsiquica([], 3)).toBe(false);
  });

  it('reducaoRetaliacaoPsiquica = 2x o dado + mod. Inteligência', () => {
    expect(reducaoRetaliacaoPsiquica(5, 3)).toBe(13);
    expect(reducaoRetaliacaoPsiquica(1, 0)).toBe(2);
  });

  it('reducaoRetaliacaoPsiquica nunca fica abaixo de 2 (mínimo, mesmo com mod. Inteligência negativo)', () => {
    expect(reducaoRetaliacaoPsiquica(1, -3)).toBe(2);
    expect(reducaoRetaliacaoPsiquica(1, -1)).toBe(2);
  });
});
