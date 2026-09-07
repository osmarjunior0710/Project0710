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
    expect(calcularDanoMagia(magia('luz'), 0, 1)).toBeNull();
  });

  it('magia sem upcast, conjurada no próprio círculo (Chama Sagrada, truque, nível 1) — Dano Base sem alteração', () => {
    expect(calcularDanoMagia(magia('chamasagrada'), 0, 1)).toEqual({
      quantidade: 1,
      lados: 8,
      mod: 0,
      tipo: 'Radiante',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast "Dado por Círculo" acima do círculo base (Bola de Fogo, 3º círculo base, +1d6/círculo) — soma corretamente', () => {
    expect(calcularDanoMagia(magia('boladefogo'), 5, 1)).toEqual({
      quantidade: 10,
      lados: 6,
      mod: 0,
      tipo: 'Ígneo',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast "Dado por Círculo" conjurada no próprio círculo base — sem bônus (níveisAcima = 0)', () => {
    expect(calcularDanoMagia(magia('boladefogo'), 3, 1)).toEqual({
      quantidade: 8,
      lados: 6,
      mod: 0,
      tipo: 'Ígneo',
      upcastNaoAutomatico: false,
    });
  });

  it('upcast tipo "outro" (Danação/Hex) acima do círculo base — não soma sozinho, avisa upcastNaoAutomatico', () => {
    const resultado = calcularDanoMagia(magia('danacao'), 3, 1);
    expect(resultado).not.toBeNull();
    expect(resultado?.upcastNaoAutomatico).toBe(true);
    expect(resultado?.quantidade).toBe(1);
    expect(resultado?.lados).toBe(6);
  });

  it('upcast tipo "outro", conjurada no próprio círculo base — Dano Base normal, sem aviso', () => {
    const resultado = calcularDanoMagia(magia('danacao'), 1, 1);
    expect(resultado).toEqual({
      quantidade: 1,
      lados: 6,
      mod: 0,
      tipo: 'Necrótico',
      upcastNaoAutomatico: false,
    });
  });

  describe('Aprimoramento de Truque (escalaTruqueTipo "dado", por nível do personagem)', () => {
    it('nível 1-4 (abaixo do 1º patamar) — Dano Base sem alteração (Chama Sagrada)', () => {
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 4)?.quantidade).toBe(1);
    });

    it('nível 5-10 (1º patamar) — +1 dado (Chama Sagrada, 1d8 → 2d8)', () => {
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 5)).toEqual({
        quantidade: 2,
        lados: 8,
        mod: 0,
        tipo: 'Radiante',
        upcastNaoAutomatico: false,
      });
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 10)?.quantidade).toBe(2);
    });

    it('nível 11-16 (2º patamar) — +2 dados (Chama Sagrada, 1d8 → 3d8)', () => {
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 11)?.quantidade).toBe(3);
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 16)?.quantidade).toBe(3);
    });

    it('nível 17+ (3º patamar, teto) — +3 dados (Chama Sagrada, 1d8 → 4d8)', () => {
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 17)?.quantidade).toBe(4);
      expect(calcularDanoMagia(magia('chamasagrada'), 0, 20)?.quantidade).toBe(4);
    });

    it('Raio Místico (feixes extras simplificados como dados extras na mesma rolagem) — 1d10 → 4d10 no nível 17+', () => {
      expect(calcularDanoMagia(magia('raiomistico'), 0, 1)?.quantidade).toBe(1);
      expect(calcularDanoMagia(magia('raiomistico'), 0, 5)?.quantidade).toBe(2);
      expect(calcularDanoMagia(magia('raiomistico'), 0, 11)?.quantidade).toBe(3);
      expect(calcularDanoMagia(magia('raiomistico'), 0, 17)).toEqual({
        quantidade: 4,
        lados: 10,
        mod: 0,
        tipo: 'Energético',
        upcastNaoAutomatico: false,
      });
    });

    it('magia preparada (círculo > 0) nunca escala por nível — só Upcast por círculo (Bola de Fogo, nível 20)', () => {
      expect(calcularDanoMagia(magia('boladefogo'), 3, 20)?.quantidade).toBe(8);
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
