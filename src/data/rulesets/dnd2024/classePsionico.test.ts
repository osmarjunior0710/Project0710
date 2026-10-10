import { describe, expect, it } from 'vitest';
import { classes } from './classes';
import { classePsionico, caracteristicasClassePsionico } from './classePsionico';

const mago = classes.find((c) => c.id === 'mago')!;
const valor = (nome: string, nivel: number) =>
  classePsionico.recursos.find((r) => r.nome === nome)!.valorPorNivel[nivel];

describe('Psiônico (UA 2025) — integridade das tabelas', () => {
  it('está registrado e tem os 20 níveis', () => {
    expect(classes.find((c) => c.id === 'psionico')).toBe(classePsionico);
    expect(classePsionico.progressao.map((p) => p.nivel)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
  });

  it('espaços de magia são idênticos aos do Mago (conjurador completo)', () => {
    const ehEspaco = (n: string) => n.startsWith('Espaços de Magia');
    const dele = classePsionico.recursos.filter((r) => ehEspaco(r.nome));
    const doMago = mago.recursos.filter((r) => ehEspaco(r.nome));
    expect(dele.length).toBe(9);
    expect(dele.map((r) => r.valorPorNivel)).toEqual(doMago.map((r) => r.valorPorNivel));
  });

  it('truques seguem a tabela (2 → 3 no nível 3 → 4 no nível 10)', () => {
    expect([1, 2, 3, 9, 10, 20].map((n) => valor('Truques Conhecidos', n))).toEqual([2, 2, 3, 3, 4, 4]);
  });

  it('Dados de Energia Psiônica: quantidade e lados por nível', () => {
    expect([1, 5, 9, 13, 17, 20].map((n) => valor('Dados de Energia Psiônica (quantidade)', n))).toEqual([4, 6, 8, 10, 12, 12]);
    expect([1, 4, 5, 10, 11, 17, 20].map((n) => valor('Dado de Energia Psiônica (lados)', n))).toEqual([6, 6, 8, 8, 10, 12, 12]);
  });

  it('toda característica da progressão tem texto', () => {
    const nomes = new Set(caracteristicasClassePsionico.map((c) => c.nome));
    for (const p of classePsionico.progressao)
      for (const n of p.caracteristicas)
        if (n !== 'Característica de Subclasse') expect(nomes.has(n), `${n} (nível ${p.nivel})`).toBe(true);
  });
});
