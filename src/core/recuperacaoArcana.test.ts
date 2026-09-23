import { describe, it, expect } from 'vitest';
import {
  orcamentoRecuperacaoArcana,
  circulosElegiveisRecuperacaoArcana,
  podeUsarRecuperacaoArcana,
  custoEscolhaRecuperacaoArcana,
  escolhaValidaRecuperacaoArcana,
} from './recuperacaoArcana';

describe('orcamentoRecuperacaoArcana', () => {
  it('nível 6 — metade arredondado pra cima (3)', () => {
    expect(orcamentoRecuperacaoArcana(6)).toBe(3);
  });

  it('nível mínimo (1) — metade arredondado pra cima (1)', () => {
    expect(orcamentoRecuperacaoArcana(1)).toBe(1);
  });
});

describe('circulosElegiveisRecuperacaoArcana', () => {
  it('ignora círculo sem gasto e círculo 6º+', () => {
    expect(circulosElegiveisRecuperacaoArcana({ 1: 2, 2: 0, 6: 1 })).toEqual([1]);
  });

  it('sem nenhum espaço gasto — lista vazia', () => {
    expect(circulosElegiveisRecuperacaoArcana({})).toEqual([]);
  });
});

describe('podeUsarRecuperacaoArcana', () => {
  it('nível com orçamento e espaço elegível gasto — true', () => {
    expect(podeUsarRecuperacaoArcana(4, { 2: 1 })).toBe(true);
  });

  it('nada gasto — false mesmo com orçamento', () => {
    expect(podeUsarRecuperacaoArcana(4, {})).toBe(false);
  });
});

describe('custoEscolhaRecuperacaoArcana', () => {
  it('soma círculo × quantidade', () => {
    expect(custoEscolhaRecuperacaoArcana({ 1: 2, 3: 1 })).toBe(5);
  });

  it('escolha vazia — custo 0', () => {
    expect(custoEscolhaRecuperacaoArcana({})).toBe(0);
  });
});

describe('escolhaValidaRecuperacaoArcana', () => {
  it('dentro do gasto e do orçamento — válida', () => {
    expect(escolhaValidaRecuperacaoArcana({ 1: 2 }, { 1: 3 }, 3)).toBe(true);
  });

  it('passa do orçamento — inválida mesmo dentro do gasto', () => {
    expect(escolhaValidaRecuperacaoArcana({ 3: 2 }, { 3: 2 }, 3)).toBe(false);
  });

  it('passa do que foi gasto naquele círculo — inválida mesmo dentro do orçamento', () => {
    expect(escolhaValidaRecuperacaoArcana({ 1: 5 }, { 1: 2 }, 10)).toBe(false);
  });
});
