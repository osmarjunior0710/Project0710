import { describe, expect, it } from 'vitest';
import { sortearEscolhas } from './sortearEscolhas';

const opcoes = ['Alaúde', 'Flauta', 'Lira', 'Oboé', 'Tambor', 'Violino'];

describe('sortearEscolhas', () => {
  it('completa até o máximo, sem repetir', () => {
    const r = sortearEscolhas(opcoes, [], 3);
    expect(r).toHaveLength(3);
    expect(new Set(r).size).toBe(3);
    expect(r.every((x) => opcoes.includes(x))).toBe(true);
  });

  it('mantém o que já estava marcado e só sorteia as vagas que faltam', () => {
    const r = sortearEscolhas(opcoes, ['Flauta'], 3);
    expect(r[0]).toBe('Flauta');
    expect(r).toHaveLength(3);
    expect(new Set(r).size).toBe(3);
  });

  it('nunca sorteia o que está em "evitar" (o que o jogador já possui)', () => {
    const evitar = new Set(['Oboé', 'Lira']);
    for (let i = 0; i < 50; i++) {
      const r = sortearEscolhas(opcoes, [], 4, evitar);
      expect(r.some((x) => evitar.has(x))).toBe(false);
    }
  });

  it('o que foi marcado à mão fica, mesmo se estiver em "evitar"', () => {
    const r = sortearEscolhas(opcoes, ['Oboé'], 2, new Set(['Oboé']));
    expect(r).toContain('Oboé');
    expect(r).toHaveLength(2);
  });

  it('borda: opções livres acabam antes do máximo — devolve só o que deu, sem repetir', () => {
    const r = sortearEscolhas(['A', 'B', 'C'], [], 3, new Set(['B', 'C']));
    expect(r).toEqual(['A']);
  });

  it('borda: atuais acima do máximo é cortado; máximo 0 devolve vazio', () => {
    expect(sortearEscolhas(opcoes, ['Alaúde', 'Flauta', 'Lira'], 2)).toEqual(['Alaúde', 'Flauta']);
    expect(sortearEscolhas(opcoes, [], 0)).toEqual([]);
  });

  it('usa o rng injetado (determinístico)', () => {
    // rng sempre 0 => sempre o 1º livre
    expect(sortearEscolhas(['A', 'B', 'C'], [], 2, new Set(), () => 0)).toEqual(['A', 'B']);
  });
});
