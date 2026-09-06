import { describe, it, expect } from 'vitest';
import { truquesMagiaIniciada, magiasMagiaIniciada, temMagiaIniciada } from './magiaTalentoOrigem';
import { criarSelecaoInicial } from './personagem';

describe('truquesMagiaIniciada/magiasMagiaIniciada (Talento de Origem + Versátil)', () => {
  it('soma as duas gavetas (Origem e Versátil) quando as duas têm Iniciado em Magia', () => {
    const s = criarSelecaoInicial();
    s.truquesMagiaIniciadaEscolhidos = ['Taumaturgia'];
    s.magiaMagiaIniciadaEscolhida = 'Bênção';
    s.truquesMagiaIniciadaEspecieEscolhidos = ['Luz'];
    s.magiaMagiaIniciadaEspecieEscolhida = 'Escudo Arcano';

    expect(truquesMagiaIniciada(s)).toEqual(['Taumaturgia', 'Luz']);
    expect(magiasMagiaIniciada(s)).toEqual(['Bênção', 'Escudo Arcano']);
  });

  it('sem nenhuma das duas fontes, devolve listas vazias e temMagiaIniciada falso (borda)', () => {
    const s = criarSelecaoInicial();
    expect(truquesMagiaIniciada(s)).toEqual([]);
    expect(magiasMagiaIniciada(s)).toEqual([]);
    expect(temMagiaIniciada(s)).toBe(false);
  });
});
