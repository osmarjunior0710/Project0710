import { describe, it, expect } from 'vitest';
import { quantidadeMaestriaEmArma, armasParaMaestria, armasElegiveisParaMaestriaExtra } from './maestriaArma';
import { classes } from '../data/rulesets/dnd2024/classes';
import { armas } from '../data/rulesets/dnd2024/armas';

function classe(nome: string) {
  const c = classes.find((c) => c.nome === nome);
  if (!c) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/classes.ts`);
  return c;
}

describe('quantidadeMaestriaEmArma', () => {
  it('Guerreiro nível 1 tem 3 tipos de arma, nível 16 tem 6 (progressão real)', () => {
    expect(quantidadeMaestriaEmArma(classe('Guerreiro'), 1)).toBe(3);
    expect(quantidadeMaestriaEmArma(classe('Guerreiro'), 16)).toBe(6);
  });

  it('borda: classe sem o recurso "Maestria em Arma" (Bardo) devolve 0', () => {
    expect(quantidadeMaestriaEmArma(classe('Bardo'), 1)).toBe(0);
  });
});

describe('armasParaMaestria', () => {
  it('Guerreiro (proficiência "Armas Simples e Marciais") pode escolher o catálogo inteiro', () => {
    expect(armasParaMaestria(classe('Guerreiro'))).toBe(armas);
    expect(armasParaMaestria(classe('Guerreiro')).length).toBe(armas.length);
  });

  it('borda: classe com proficiência restrita (Bardo, só Armas Simples) ainda não tem filtro fino — devolve lista vazia, não o catálogo errado', () => {
    expect(armasParaMaestria(classe('Bardo'))).toEqual([]);
  });

  it('Bárbaro (mesma proficiência ampla do Guerreiro) só pode escolher armas Corpo a Corpo — nunca à Distância', () => {
    const elegiveis = armasParaMaestria(classe('Bárbaro'));
    expect(elegiveis.length).toBeGreaterThan(0);
    expect(elegiveis.length).toBeLessThan(armas.length);
    expect(elegiveis.every((a) => a.categoria.includes('Corpo a Corpo'))).toBe(true);
  });
});

describe('armasElegiveisParaMaestriaExtra — Mestre das Armas (slot-maestria-extra)', () => {
  it('Bardo (só Armas Simples nativas) só pode escolher entre as Simples, mesmo sem o recurso nativo de Maestria', () => {
    const elegiveis = armasElegiveisParaMaestriaExtra(classe('Bardo'));
    expect(elegiveis.length).toBeGreaterThan(0);
    expect(elegiveis.every((a) => a.categoria.includes('Simples'))).toBe(true);
  });

  it('com Treinamento com Armas Marciais, Bardo passa a poder escolher também Marciais', () => {
    const semTalento = armasElegiveisParaMaestriaExtra(classe('Bardo'), []);
    const comTalento = armasElegiveisParaMaestriaExtra(classe('Bardo'), ['treinamento-com-armas-marciais']);
    expect(comTalento.length).toBeGreaterThan(semTalento.length);
    expect(comTalento.length).toBe(armas.length);
  });

  it('borda: classe sem nenhuma proficiência de arma cadastrada devolve lista vazia', () => {
    const semClasse = { nome: 'Classe Inexistente' } as unknown as Parameters<typeof armasElegiveisParaMaestriaExtra>[0];
    expect(armasElegiveisParaMaestriaExtra(semClasse)).toEqual([]);
  });
});
