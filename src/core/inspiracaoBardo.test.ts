import { describe, it, expect } from 'vitest';
import { usosInspiracaoMaximo, dadoInspiracao, fonteDeInspiracaoDesbloqueada } from './inspiracaoBardo';
import { classes } from '../data/rulesets/dnd2024/classes';
import { criarSelecaoInicial, type WizardSelection } from './personagem';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

function selecaoComCarisma(car: number): WizardSelection {
  const s = criarSelecaoInicial();
  s.atributos = { FOR: 10, DES: 10, CON: 10, INT: 10, SAB: 10, CAR: car };
  return s;
}

describe('usosInspiracaoMaximo', () => {
  it('Bardo com Carisma 16 (mod +3) tem 3 usos no nível 1', () => {
    expect(usosInspiracaoMaximo(selecaoComCarisma(16), classe('Bardo'), 1)).toBe(3);
  });

  it('borda: mínimo é sempre 1 uso, mesmo com Carisma baixo (mod negativo)', () => {
    expect(usosInspiracaoMaximo(selecaoComCarisma(8), classe('Bardo'), 1)).toBe(1);
  });

  it('borda: classe null (ainda sem classe escolhida) devolve 0', () => {
    expect(usosInspiracaoMaximo(selecaoComCarisma(16), null, 1)).toBe(0);
  });

  it('borda: Carisma ainda não rolado (criação em andamento) devolve 0', () => {
    expect(usosInspiracaoMaximo(criarSelecaoInicial(), classe('Bardo'), 1)).toBe(0);
  });

  it('borda: classe sem a característica "Inspiração de Bardo" (Guerreiro) devolve 0', () => {
    expect(usosInspiracaoMaximo(selecaoComCarisma(16), classe('Guerreiro'), 1)).toBe(0);
  });
});

describe('dadoInspiracao', () => {
  it('Bardo: d6 no nível 1, d12 no nível 15 (progressão real)', () => {
    expect(dadoInspiracao(classe('Bardo'), 1)).toBe(6);
    expect(dadoInspiracao(classe('Bardo'), 15)).toBe(12);
  });

  it('borda: classe null devolve 0', () => {
    expect(dadoInspiracao(null, 1)).toBe(0);
  });
});

describe('fonteDeInspiracaoDesbloqueada', () => {
  it('Bardo nível 5+ tem Fonte de Inspiração; nível 4 ainda não', () => {
    expect(fonteDeInspiracaoDesbloqueada(classe('Bardo'), 5)).toBe(true);
    expect(fonteDeInspiracaoDesbloqueada(classe('Bardo'), 4)).toBe(false);
  });

  it('borda: classe null devolve false', () => {
    expect(fonteDeInspiracaoDesbloqueada(null, 5)).toBe(false);
  });
});
