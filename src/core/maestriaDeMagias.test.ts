import { describe, it, expect } from 'vitest';
import { magiasElegiveisMaestria } from './maestriaDeMagias';
import { magias } from '../data/rulesets/dnd2024/magias';

// [PH] [codeimplementation] — stub, ver comentário do arquivo.
describe('magiasElegiveisMaestria', () => {
  it('círculo 1 — ainda não implementado, retorna vazio', () => {
    const livro = magias.filter((m) => m.classes.includes('Mago') && m.circulo === 1);
    expect(magiasElegiveisMaestria(livro, 1)).toEqual([]);
  });

  it('círculo 2, livro vazio — ainda não implementado, retorna vazio', () => {
    expect(magiasElegiveisMaestria([], 2)).toEqual([]);
  });
});
