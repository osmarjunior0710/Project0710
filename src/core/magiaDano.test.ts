import { describe, it, expect } from 'vitest';
import { calcularDanoMagia, mecanicaDaMagia, atributoSalvaguarda } from './magiaDano';
import { magias } from '../data/rulesets/dnd2024/magias';

function magia(id: string) {
  const m = magias.find((m) => m.id === id);
  if (!m) throw new Error(`Fixture "${id}" não encontrada em data/rulesets/dnd2024/magias.ts`);
  return m;
}

describe('calcularDanoMagia', () => {
  it('magia sem danoBaseDado (não causa dano direto) — null', () => {
    expect(calcularDanoMagia(magia('luz'), 0)).toBeNull();
  });

  it('magia sem upcast, conjurada no próprio círculo (Chama Sagrada, truque) — Dano Base sem alteração', () => {
    expect(calcularDanoMagia(magia('chamasagrada'), 0)).toEqual({
      quantidade: 1,
      lados: 8,
      mod: 0,
      tipo: 'Radiante',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast "Dado por Círculo" acima do círculo base (Bola de Fogo, 3º círculo base, +1d6/círculo) — soma corretamente', () => {
    expect(calcularDanoMagia(magia('boladefogo'), 5)).toEqual({
      quantidade: 10,
      lados: 6,
      mod: 0,
      tipo: 'Ígneo',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast "Dado por Círculo" conjurada no próprio círculo base — sem bônus (níveisAcima = 0)', () => {
    expect(calcularDanoMagia(magia('boladefogo'), 3)).toEqual({
      quantidade: 8,
      lados: 6,
      mod: 0,
      tipo: 'Ígneo',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast tipo "outro" (Danação/Hex) acima do círculo base — não soma sozinho, avisa upcastNaoAutomatico', () => {
    const resultado = calcularDanoMagia(magia('danacao'), 3);
    expect(resultado).not.toBeNull();
    expect(resultado?.upcastNaoAutomatico).toBe(true);
    expect(resultado?.quantidade).toBe(1);
    expect(resultado?.lados).toBe(6);
  });

  it('upcast tipo "outro", conjurada no próprio círculo base — Dano Base normal, sem aviso', () => {
    const resultado = calcularDanoMagia(magia('danacao'), 1);
    expect(resultado).toEqual({
      quantidade: 1,
      lados: 6,
      mod: 0,
      tipo: 'Necrótico',
      upcastNaoAutomatico: false,
    });
  });
});

describe('mecanicaDaMagia', () => {
  it('ataque à distância (Raio Místico) — "ataque"', () => {
    expect(mecanicaDaMagia(magia('raiomistico'))).toBe('ataque');
  });

  it('salvaguarda de atributo fixo (Badalar Fúnebre) — "salvaguarda"', () => {
    expect(mecanicaDaMagia(magia('badalarfunebre'))).toBe('salvaguarda');
  });

  it('salvaguarda "aleatório" (Rajada Prismática) — também "salvaguarda"', () => {
    expect(mecanicaDaMagia(magia('rajadaprismatica'))).toBe('salvaguarda');
  });

  it('sem ataque nem salvaguarda (Luz, utilidade) — "nenhuma"', () => {
    expect(mecanicaDaMagia(magia('luz'))).toBe('nenhuma');
  });
});

describe('atributoSalvaguarda', () => {
  it('extrai o nome do atributo (Badalar Fúnebre — Sabedoria)', () => {
    expect(atributoSalvaguarda(magia('badalarfunebre'))).toBe('Sabedoria');
  });

  it('"aleatório" (Rajada Prismática) — texto explicando que varia', () => {
    expect(atributoSalvaguarda(magia('rajadaprismatica'))).toBe('variável (sorteado pela magia, veja descrição)');
  });
});
