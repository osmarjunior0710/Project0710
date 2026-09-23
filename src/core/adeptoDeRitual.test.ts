import { describe, it, expect } from 'vitest';
import { magiasRituaisElegiveis } from './adeptoDeRitual';
import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';

describe('magiasRituaisElegiveis', () => {
  it('filtra só as com tag Ritual, excluindo as já preparadas', () => {
    const compreenderIdiomas = magiasDaClasse('Mago').find((m) => m.nome === 'Compreender Idiomas')!;
    const detectarMagia = magiasDaClasse('Mago').find((m) => m.nome === 'Detectar Magia')!;
    const armaduraArcana = magiasDaClasse('Mago').find((m) => m.nome === 'Armadura Arcana')!; // sem Ritual
    const livro = [compreenderIdiomas, detectarMagia, armaduraArcana];

    expect(magiasRituaisElegiveis(livro, [])).toEqual([compreenderIdiomas, detectarMagia]);
    expect(magiasRituaisElegiveis(livro, ['Detectar Magia'])).toEqual([compreenderIdiomas]);
  });

  it('livro vazio — retorna vazio', () => {
    expect(magiasRituaisElegiveis([], [])).toEqual([]);
  });
});
