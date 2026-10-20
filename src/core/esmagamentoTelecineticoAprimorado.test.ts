import { describe, it, expect } from 'vitest';
import { temEsmagamentoTelecineticoAprimorado, esmagamentoAprimoradoElegivel } from './esmagamentoTelecineticoAprimorado';
import { magias } from '../data/rulesets/dnd2024/magias';
import { magiasUAPsionico } from '../data/rulesets/dnd2024/magiasPsionico';

const esmagamento = magiasUAPsionico.find((m) => m.nome === 'Esmagamento Telecinético')!;
const outraMagia = magias.find((m) => m.nome === 'Luz')!;

describe('temEsmagamentoTelecineticoAprimorado', () => {
  it('nível 9: ainda não bateu o nível 10', () => {
    expect(temEsmagamentoTelecineticoAprimorado(9)).toBe(false);
  });

  it('nível 10+: disponível', () => {
    expect(temEsmagamentoTelecineticoAprimorado(10)).toBe(true);
  });
});

describe('esmagamentoAprimoradoElegivel', () => {
  it('sem a característica: não elegível mesmo com dados', () => {
    expect(esmagamentoAprimoradoElegivel(esmagamento, false, 3)).toBe(false);
  });

  it('sem dados restantes: não elegível mesmo com a característica', () => {
    expect(esmagamentoAprimoradoElegivel(esmagamento, true, 0)).toBe(false);
  });

  it('com característica e dados: elegível', () => {
    expect(esmagamentoAprimoradoElegivel(esmagamento, true, 2)).toBe(true);
  });

  it('caso de borda: outra magia, mesmo com característica e dados, nunca é elegível', () => {
    expect(esmagamentoAprimoradoElegivel(outraMagia, true, 2)).toBe(false);
  });
});
