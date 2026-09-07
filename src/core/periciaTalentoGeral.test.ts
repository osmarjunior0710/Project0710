import { describe, it, expect } from 'vitest';
import { opcoesPericiaRestrita, acaoVirouBonusDoTalento, acoesConvertidasEmBonus } from './periciaTalentoGeral';

describe('opcoesPericiaRestrita', () => {
  it('Analítico: Intuição/Investigação/Percepção', () => {
    expect(opcoesPericiaRestrita('analitico')).toEqual(['Intuição', 'Investigação', 'Percepção']);
  });

  it('Mente Aguçada: Arcanismo/História/Investigação/Natureza/Religião', () => {
    expect(opcoesPericiaRestrita('mente-agucada')).toEqual([
      'Arcanismo',
      'História',
      'Investigação',
      'Natureza',
      'Religião',
    ]);
  });

  it('talento sem esse tipo de efeito: lista vazia', () => {
    expect(opcoesPericiaRestrita('especialista-em-pericia')).toEqual([]);
  });
});

describe('acaoVirouBonusDoTalento', () => {
  it('Analítico: Procurar', () => {
    expect(acaoVirouBonusDoTalento('analitico')).toBe('Procurar');
  });

  it('Mente Aguçada: Analisar', () => {
    expect(acaoVirouBonusDoTalento('mente-agucada')).toBe('Analisar');
  });

  it('talento sem esse tipo de efeito: null', () => {
    expect(acaoVirouBonusDoTalento('especialista-em-pericia')).toBeNull();
  });
});

describe('acoesConvertidasEmBonus', () => {
  it('Analítico sozinho: só Procurar', () => {
    expect(acoesConvertidasEmBonus(['analitico'])).toEqual(['Procurar']);
  });

  it('Analítico + Mente Aguçada juntos: os 2', () => {
    expect(acoesConvertidasEmBonus(['analitico', 'mente-agucada']).sort()).toEqual(['Analisar', 'Procurar'].sort());
  });

  it('sem talentos desse tipo: lista vazia', () => {
    expect(acoesConvertidasEmBonus(['especialista-em-pericia'])).toEqual([]);
    expect(acoesConvertidasEmBonus(undefined)).toEqual([]);
  });
});
