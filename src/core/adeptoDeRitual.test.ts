import { describe, it, expect } from 'vitest';
import { magiasRituaisElegiveis } from './adeptoDeRitual';
import { magias } from '../data/rulesets/dnd2024/magias';

// [PH] [codeimplementation] — stub, ver comentário do arquivo.
describe('magiasRituaisElegiveis', () => {
  it('livro com magias — ainda não implementado, retorna vazio', () => {
    const livro = magias.filter((m) => m.classes.includes('Mago')).slice(0, 3);
    expect(magiasRituaisElegiveis(livro, [])).toEqual([]);
  });

  it('livro vazio — ainda não implementado, retorna vazio', () => {
    expect(magiasRituaisElegiveis([], [])).toEqual([]);
  });
});
