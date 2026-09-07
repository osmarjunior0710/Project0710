import { describe, it, expect } from 'vitest';
import { truquesTalentoGeral, magiasSempreTalentoGeral, magiasGratisDosTalentosGerais } from './magiaTalentoGeral';

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
