import { describe, it, expect } from 'vitest';
import { calcularSentidos, sentidosAtivos } from './sentidos';

describe('calcularSentidos', () => {
  it('personagem sem espécie/invocação: tudo zerado', () => {
    expect(calcularSentidos(null, [])).toEqual({
      visaoNoEscuro: 0,
      visaoAsCegas: 0,
      visaoVerdadeira: 0,
      sismiconsciencia: 0,
    });
  });

  it('Anão sozinho: Visão no Escuro 36m, resto zerado', () => {
    const r = calcularSentidos('Anão', []);
    expect(r.visaoNoEscuro).toBe(36);
    expect(r.visaoVerdadeira).toBe(0);
  });

  it('Pequenino: sem Visão no Escuro (não tem esse traço)', () => {
    expect(calcularSentidos('Pequenino', []).visaoNoEscuro).toBe(0);
  });

  it('Anão + Visão Diabólica (mesmo tipo, ambos 36m): fica 36m, não 72m', () => {
    const r = calcularSentidos('Anão', ['visao-diabolica']);
    expect(r.visaoNoEscuro).toBe(36);
  });

  it('Bruxo com Visão da Bruxa + Visão Diabólica: 2 tipos diferentes, os dois aparecem', () => {
    const r = calcularSentidos(null, ['visao-da-bruxa', 'visao-diabolica']);
    expect(r.visaoVerdadeira).toBe(9);
    expect(r.visaoNoEscuro).toBe(36);
  });

  it('invocação sem sentido nenhum não afeta nada', () => {
    const r = calcularSentidos(null, ['pacto-da-lamina']);
    expect(r).toEqual({ visaoNoEscuro: 0, visaoAsCegas: 0, visaoVerdadeira: 0, sismiconsciencia: 0 });
  });

  it('Elfo Drow: linhagem escolhida aumenta a Visão no Escuro de 18m pra 36m (usa o maior valor)', () => {
    const r = calcularSentidos('Elfo', [], 'Drow');
    expect(r.visaoNoEscuro).toBe(36);
  });

  it('Elfo Alto Elfo: linhagem sem sentido próprio, mantém o 18m do traço base', () => {
    const r = calcularSentidos('Elfo', [], 'Alto Elfo');
    expect(r.visaoNoEscuro).toBe(18);
  });
});

describe('sentidosAtivos', () => {
  it('filtra só os > 0, na ordem de exibição', () => {
    const r = calcularSentidos(null, ['visao-da-bruxa', 'visao-diabolica']);
    expect(sentidosAtivos(r)).toEqual([
      { tipo: 'visaoNoEscuro', alcanceMetros: 36 },
      { tipo: 'visaoVerdadeira', alcanceMetros: 9 },
    ]);
  });

  it('vazio quando tudo zerado', () => {
    expect(sentidosAtivos(calcularSentidos(null, []))).toEqual([]);
  });
});
