import { describe, it, expect } from 'vitest';
import { quantidadeMaestriaEmArma, armasParaMaestria } from './maestriaArma';
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
});
