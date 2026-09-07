import { describe, it, expect } from 'vitest';
import {
  truquesTalentoGeral,
  magiasSempreTalentoGeral,
  magiasGratisDosTalentosGerais,
  opcoesMagiaEscolhidaPorEscola,
  talentosComEscolhaDeMagiaPendente,
} from './magiaTalentoGeral';

describe('truquesTalentoGeral', () => {
  it('Telecinético concede o truque Mãos Mágicas', () => {
    expect(truquesTalentoGeral(['telecinetico'])).toEqual(['Mãos Mágicas']);
  });

  it('sem o talento: lista vazia', () => {
    expect(truquesTalentoGeral(['telepatico'])).toEqual([]);
  });

  it('sem talentos nenhum: lista vazia', () => {
    expect(truquesTalentoGeral(undefined)).toEqual([]);
    expect(truquesTalentoGeral([])).toEqual([]);
  });
});

describe('magiasSempreTalentoGeral', () => {
  it('Telepático concede Detectar Pensamentos sempre preparada', () => {
    expect(magiasSempreTalentoGeral(['telepatico'])).toEqual(['Detectar Pensamentos']);
  });

  it('Telecinético não concede magia de círculo (só truque)', () => {
    expect(magiasSempreTalentoGeral(['telecinetico'])).toEqual([]);
  });
});

describe('magiasGratisDosTalentosGerais', () => {
  it('Telepático: Detectar Pensamentos com recarga descansoLongo', () => {
    const resultado = magiasGratisDosTalentosGerais(['telepatico']);
    expect(resultado).toHaveLength(1);
    expect(resultado[0].magia.nome).toBe('Detectar Pensamentos');
    expect(resultado[0].recarga).toBe('descansoLongo');
    expect(resultado[0].talentoId).toBe('telepatico');
  });

  it('Telecinético não entra aqui (truque não tem recarga pra rastrear)', () => {
    expect(magiasGratisDosTalentosGerais(['telecinetico'])).toEqual([]);
  });

  it('os 2 juntos: só Telepático aparece na lista de grátis', () => {
    const resultado = magiasGratisDosTalentosGerais(['telecinetico', 'telepatico']);
    expect(resultado.map((r) => r.magia.nome)).toEqual(['Detectar Pensamentos']);
  });
});

describe('opcoesMagiaEscolhidaPorEscola', () => {
  it('Tocado pela Sombra: só magias de 1º círculo de Ilusão ou Necromancia', () => {
    const opcoes = opcoesMagiaEscolhidaPorEscola('tocado-pela-sombra');
    expect(opcoes.length).toBeGreaterThan(0);
    expect(opcoes.every((m) => m.circulo === 1 && ['Ilusão', 'Necromancia'].includes(m.escola))).toBe(true);
  });

  it('Tocado pelas Fadas: só magias de 1º círculo de Adivinhação ou Encantamento', () => {
    const opcoes = opcoesMagiaEscolhidaPorEscola('tocado-pelas-fadas');
    expect(opcoes.length).toBeGreaterThan(0);
    expect(opcoes.every((m) => m.circulo === 1 && ['Adivinhação', 'Encantamento'].includes(m.escola))).toBe(true);
  });

  it('talento sem esse tipo de efeito: lista vazia', () => {
    expect(opcoesMagiaEscolhidaPorEscola('telepatico')).toEqual([]);
  });
});

describe('talentosComEscolhaDeMagiaPendente', () => {
  it('Tocado pela Sombra sem escolha feita: aparece pendente', () => {
    const pendentes = talentosComEscolhaDeMagiaPendente(['tocado-pela-sombra'], undefined);
    expect(pendentes.map((t) => t.id)).toEqual(['tocado-pela-sombra']);
  });

  it('Tocado pela Sombra já com escolha feita: não aparece mais', () => {
    const pendentes = talentosComEscolhaDeMagiaPendente(['tocado-pela-sombra'], { 'tocado-pela-sombra': 'Sono' });
    expect(pendentes).toEqual([]);
  });

  it('Telepático nunca aparece (não é desse tipo de efeito)', () => {
    expect(talentosComEscolhaDeMagiaPendente(['telepatico'], undefined)).toEqual([]);
  });
});

describe('magiasSempreTalentoGeral — magia-escolhida-por-escola', () => {
  it('Tocado pela Sombra sem escolha ainda: só a magia fixa (Invisibilidade)', () => {
    expect(magiasSempreTalentoGeral(['tocado-pela-sombra'])).toEqual(['Invisibilidade']);
  });

  it('Tocado pela Sombra com escolha feita: fixa + escolhida', () => {
    const resultado = magiasSempreTalentoGeral(['tocado-pela-sombra'], { 'tocado-pela-sombra': 'Disfarçar-se' });
    expect(resultado.sort()).toEqual(['Disfarçar-se', 'Invisibilidade'].sort());
  });
});

describe('magiasGratisDosTalentosGerais — magia-escolhida-por-escola', () => {
  it('Tocado pelas Fadas sem escolha ainda: só a fixa (Passo Nebuloso) grátis', () => {
    const resultado = magiasGratisDosTalentosGerais(['tocado-pelas-fadas']);
    expect(resultado.map((r) => r.magia.nome)).toEqual(['Passo Nebuloso']);
    expect(resultado[0].recarga).toBe('descansoLongo');
  });

  it('Tocado pelas Fadas com escolha feita: as 2 magias grátis, independentes', () => {
    const resultado = magiasGratisDosTalentosGerais(['tocado-pelas-fadas'], { 'tocado-pelas-fadas': 'Sono' });
    expect(resultado.map((r) => r.magia.nome).sort()).toEqual(['Passo Nebuloso', 'Sono'].sort());
  });
});
