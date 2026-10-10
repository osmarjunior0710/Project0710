import { describe, expect, it } from 'vitest';
import { magias, magiasDaClasse } from './magias';
import { magiasUAPsionico } from './magiasPsionico';

describe('Magias do Psiônico (UA 2025)', () => {
  it('lista da classe por círculo bate com o PDF', () => {
    const porCirculo = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => magiasDaClasse('Psiônico', c).length);
    expect(porCirculo).toEqual([12, 20, 27, 16, 15, 16, 12, 8, 10, 8]);
  });

  it('as 18 magias novas (17 do PDF + Animar Mortos da planilha) existem, sem duplicar nome nem id do catálogo', () => {
    expect(magiasUAPsionico).toHaveLength(18);
    const nomes = magias.map((m) => m.nome);
    expect(new Set(nomes).size).toBe(nomes.length);
    const ids = magias.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(magiasUAPsionico.every((m) => m.classes.join() === 'Psiônico')).toBe(true);
  });

  it('magia oficial da lista ganha Psiônico sem perder as classes que já tinha', () => {
    const escudo = magias.find((m) => m.nome === 'Escudo Arcano')!;
    expect(escudo.classes).toContain('Psiônico');
    expect(escudo.classes).toContain('Mago');
  });

  it('campos estruturados de uma magia nova (Explosão Psiônica)', () => {
    const m = magias.find((x) => x.nome === 'Explosão Psiônica')!;
    expect([m.circulo, m.danoBaseDado, m.danoBaseTipo, m.ataqueOuSalvaguarda]).toEqual([6, '6d8', 'Psíquico', 'Salvaguarda de Inteligência']);
  });
});
