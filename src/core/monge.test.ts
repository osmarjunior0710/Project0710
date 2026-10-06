import { describe, it, expect } from 'vitest';
import { ehArmaDeMonge } from './monge';
import { armas } from '../data/rulesets/dnd2024/armas';

function arma(nome: string) {
  const a = armas.find((a) => a.nome === nome);
  if (!a) throw new Error(`Fixture "${nome}" não encontrada em data/rulesets/dnd2024/armas.ts`);
  return a;
}

describe('ehArmaDeMonge', () => {
  it('Arma Simples Corpo a Corpo (Adaga): conta como arma de Monge', () => {
    expect(ehArmaDeMonge(arma('Adaga'))).toBe(true);
  });

  it('Arma Marcial Corpo a Corpo COM propriedade Leve (Cimitarra): conta', () => {
    expect(ehArmaDeMonge(arma('Cimitarra'))).toBe(true);
  });

  it('borda: Arma Marcial Corpo a Corpo SEM propriedade Leve (Espada Longa): não conta', () => {
    expect(ehArmaDeMonge(arma('Espada Longa'))).toBe(false);
  });

  it('borda: Arma Simples À DISTÂNCIA não conta, mesmo sendo "Simples" (Artes Marciais exige Corpo a Corpo)', () => {
    const simplesDistancia = armas.find((a) => a.categoria === 'Armas Simples à Distância');
    if (!simplesDistancia) throw new Error('Nenhuma arma Simples à Distância encontrada pra testar');
    expect(ehArmaDeMonge(simplesDistancia)).toBe(false);
  });
});
