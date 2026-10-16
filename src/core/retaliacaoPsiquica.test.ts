import { describe, expect, it } from 'vitest';
import {
  explicarReducaoRetaliacaoPsiquica,
  podeAtivarRetaliacaoPsiquica,
  reducaoRetaliacaoPsiquica,
  temRetaliacaoPsiquica,
} from './retaliacaoPsiquica';

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

  it('explicarReducaoRetaliacaoPsiquica detalha a conta e bate com o total de reducaoRetaliacaoPsiquica', () => {
    const explicacao = explicarReducaoRetaliacaoPsiquica(5, 4);
    expect(explicacao.linhas).toEqual([
      { label: 'Dado rolado (5) × 2', valor: '10' },
      { label: 'Modificador de Inteligência', valor: '+4' },
    ]);
    expect(explicacao.total).toEqual({ label: 'Redução de dano (mínimo 2)', valor: '14' });
  });

  it('explicarReducaoRetaliacaoPsiquica aplica o mínimo de 2 no total mesmo com mod. negativo', () => {
    const explicacao = explicarReducaoRetaliacaoPsiquica(1, -3);
    expect(explicacao.total.valor).toBe('2');
  });
});
