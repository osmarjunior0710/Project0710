import { describe, it, expect } from 'vitest';
import { decidirConjuracao } from './conjurarMagia';
import { magias } from '../data/rulesets/dnd2024/magias';

function magia(id: string) {
  const m = magias.find((m) => m.id === id);
  if (!m) throw new Error(`Fixture "${id}" não encontrada em data/rulesets/dnd2024/magias.ts`);
  return m;
}

describe('decidirConjuracao', () => {
  it('caso normal — mecânica de ataque, com dano cadastrado, rolagem de acerto + dano pendente', () => {
    const resultado = decidirConjuracao(magia('raiomistico'), 0, 1, 5, false, false);
    expect(resultado.mecanica).toBe('ataque');
    expect(resultado.rollAcerto).toEqual({ label: 'Ataque de Magia — Raio Místico', formula: '1d20 + 5', mod: 5 });
    expect(resultado.danoPendente).toBeDefined();
    expect(resultado.curaColheitaMacabra).toBeNull();
  });

  it('caso de borda — mecânica de ataque mas sem modAcertoConjuracao (null), cai pro fallback "nenhuma"', () => {
    const resultado = decidirConjuracao(magia('raiomistico'), 0, 1, null, false, false);
    expect(resultado.mecanica).toBe('nenhuma');
    expect(resultado.rollAcerto).toBeUndefined();
  });

  it('salvaguarda (Bola de Fogo) — sem rolagem própria, só texto de feedback', () => {
    const resultado = decidirConjuracao(magia('boladefogo'), 3, 1, 5, false, false);
    expect(resultado.mecanica).toBe('salvaguarda');
    expect(resultado.rollAcerto).toBeUndefined();
    expect(resultado.rollCura).toBeUndefined();
    expect(resultado.textoFeedback).toBe('Alvo faz salvaguarda — veja o popup pra CD e dano.');
  });

  it('cura (Palavra Curativa) — rolagem de cura montada', () => {
    const resultado = decidirConjuracao(magia('palavracurativa'), 1, 1, null, false, false);
    expect(resultado.mecanica).toBe('cura');
    expect(resultado.rollCura).toBeDefined();
    expect(resultado.textoFeedback).toBe('Cura rolada — aplique o total no alvo.');
  });

  it('nenhuma mecânica reconhecida (Luz) — texto de feedback vira a descrição curta da magia', () => {
    const resultado = decidirConjuracao(magia('luz'), 0, 1, null, false, false);
    expect(resultado.mecanica).toBe('nenhuma');
    expect(resultado.textoFeedback).toBe(magia('luz').descricaoCurta);
  });

  it('Colheita Macabra qualifica — magia de Necromancia, característica desbloqueada, espaço de verdade gasto', () => {
    const resultado = decidirConjuracao(magia('toquevampirico'), 3, 5, 5, true, true);
    expect(resultado.curaColheitaMacabra).toBe(6); // curaColheitaMacabra(3) = 3*2
  });

  it('Colheita Macabra NÃO qualifica sem espaço de verdade gasto (ex: magia concedida de graça)', () => {
    const resultado = decidirConjuracao(magia('toquevampirico'), 3, 5, 5, true, false);
    expect(resultado.curaColheitaMacabra).toBeNull();
  });

  it('Colheita Macabra NÃO qualifica pra magia que não é de Necromancia', () => {
    const resultado = decidirConjuracao(magia('raiomistico'), 1, 5, 5, true, true);
    expect(resultado.curaColheitaMacabra).toBeNull();
  });
});
