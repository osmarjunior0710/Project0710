import { describe, expect, it } from 'vitest';
import { podeAtivarSintoniaElemental, temSintoniaElemental } from './sintoniaElemental';

describe('Sintonia Elemental', () => {
  it('só Monge nível 3+ da subclasse Combatente dos Elementos', () => {
    expect(temSintoniaElemental(3, 'Combatente dos Elementos')).toBe(true);
    expect(temSintoniaElemental(2, 'Combatente dos Elementos')).toBe(false);
    expect(temSintoniaElemental(10, 'Combatente das Sombras')).toBe(false);
    expect(temSintoniaElemental(10, null)).toBe(false);
  });
  it('ativar custa 1 Ponto de Foco', () => {
    expect(podeAtivarSintoniaElemental(3, 'Combatente dos Elementos', 1)).toBe(true);
    expect(podeAtivarSintoniaElemental(3, 'Combatente dos Elementos', 0)).toBe(false);
    expect(podeAtivarSintoniaElemental(3, null, 5)).toBe(false);
  });
});
