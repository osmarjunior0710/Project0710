import { describe, it, expect } from 'vitest';
import { criarPet, alterarPvPet } from './pets';
import { criaturas } from '../data/rulesets/dnd2024/criaturas';

function acha(id: string) {
  const c = criaturas.find((c) => c.id === id);
  if (!c) throw new Error(`criatura "${id}" não encontrada`);
  return c;
}

describe('criarPet', () => {
  it('caso normal — cria com PV cheio da criatura de origem (Gato, PV 2)', () => {
    const pet = criarPet('Sombra', acha('gato'));
    expect(pet.nome).toBe('Sombra');
    expect(pet.criaturaId).toBe('gato');
    expect(pet.pvAtual).toBe(2);
  });

  it('ids gerados são únicos entre 2 pets criados em sequência', () => {
    const a = criarPet('A', acha('gato'));
    const b = criarPet('B', acha('gato'));
    expect(a.id).not.toBe(b.id);
  });
});

describe('alterarPvPet', () => {
  it('caso normal — dano reduz o PV sem passar de 0', () => {
    const pet = criarPet('Sombra', acha('gato')); // pv 2
    const resultado = alterarPvPet(pet, -1, 2);
    expect(resultado.pvAtual).toBe(1);
  });

  it('caso de borda — dano maior que o PV atual trava em 0, não fica negativo', () => {
    const pet = criarPet('Sombra', acha('gato')); // pv 2
    const resultado = alterarPvPet(pet, -5, 2);
    expect(resultado.pvAtual).toBe(0);
  });

  it('caso de borda — cura não passa do PV máximo', () => {
    const pet = criarPet('Sombra', acha('gato')); // pv 2 (já cheio)
    const resultado = alterarPvPet(pet, 5, 2);
    expect(resultado.pvAtual).toBe(2);
  });
});
