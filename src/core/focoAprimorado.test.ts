import { describe, expect, it } from 'vitest';
import { ataquesTorrenteComFoco, temFocoAprimorado } from './focoAprimorado';

describe('Foco Aprimorado', () => {
  it('só a partir do nível 10', () => {
    expect(temFocoAprimorado(9)).toBe(false);
    expect(temFocoAprimorado(10)).toBe(true);
  });
  it('Torrente com Foco: 2 ataques antes do 10, 3 a partir dele', () => {
    expect(ataquesTorrenteComFoco(5)).toBe(2);
    expect(ataquesTorrenteComFoco(10)).toBe(3);
    expect(ataquesTorrenteComFoco(20)).toBe(3);
  });
});
