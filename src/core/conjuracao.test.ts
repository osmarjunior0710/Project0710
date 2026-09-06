import { describe, it, expect } from 'vitest';
import { personagemConjura } from './conjuracao';
import { classes } from '../data/rulesets/dnd2024/classes';
import { criarSelecaoInicial } from './personagem';

const guerreiro = classes.find((c) => c.nome === 'Guerreiro');
if (!guerreiro) throw new Error('Fixture "Guerreiro" não encontrada em data/rulesets/dnd2024/classes.ts');

describe('personagemConjura', () => {
  it('sem classe: false', () => {
    expect(personagemConjura(null)).toBe(false);
  });

  it('classe sem recurso de magia (Guerreiro) e sem seleção: false', () => {
    expect(personagemConjura(guerreiro)).toBe(false);
  });

  it('classe sem recurso de magia, mas espécie concede truque (Elfo Drow): true', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Elfo', subescolhaEspecieEscolhida: 'Drow' };
    expect(personagemConjura(guerreiro, s)).toBe(true);
  });

  it('classe sem recurso de magia, espécie sem sub-escolha escolhida ainda: false', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Elfo', subescolhaEspecieEscolhida: null };
    expect(personagemConjura(guerreiro, s)).toBe(false);
  });

  it('espécie com truque fixo sem depender de sub-escolha (Aasimar — Portador da Luz): true', () => {
    const s = { ...criarSelecaoInicial(), especie: 'Aasimar' };
    expect(personagemConjura(guerreiro, s)).toBe(true);
  });
});
