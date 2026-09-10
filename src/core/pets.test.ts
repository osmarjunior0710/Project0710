import { describe, it, expect } from 'vitest';
import {
  criarPet,
  alterarPvPet,
  caEfetivaPet,
  pvMaxEfetivoPet,
  atributoEfetivoPet,
  calcularAjustesPet,
  comBonusExtra,
} from './pets';
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

  it('caso de borda — sem origemInvocacaoId (pet avulso/manual), fica undefined', () => {
    const pet = criarPet('Sombra', acha('gato'));
    expect(pet.origemInvocacaoId).toBeUndefined();
  });

  it('caso normal — origemInvocacaoId presente quando informado (ex: Pacto da Corrente)', () => {
    const pet = criarPet('Sombra', acha('sprite'), 'pacto-da-corrente');
    expect(pet.origemInvocacaoId).toBe('pacto-da-corrente');
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

describe('caEfetivaPet / pvMaxEfetivoPet / atributoEfetivoPet', () => {
  it('caso normal — sem ajustes, usa os valores da criatura de origem (Gato)', () => {
    const gato = acha('gato');
    const pet = criarPet('Sombra', gato);
    expect(caEfetivaPet(pet, gato)).toBe(12);
    expect(pvMaxEfetivoPet(pet, gato)).toBe(2);
    expect(atributoEfetivoPet(pet, gato, 'DES')).toBe(gato.atributos.DES);
  });

  it('caso de borda — com ajustes, sobrescreve só os campos ajustados (CA e FOR, PV/DES continuam do Gato)', () => {
    const gato = acha('gato');
    const pet = criarPet('Sombra', gato, undefined, { ca: 15, atributos: { FOR: 10 } });
    expect(caEfetivaPet(pet, gato)).toBe(15);
    expect(pvMaxEfetivoPet(pet, gato)).toBe(2); // sem ajuste de PV, mantém o do Gato
    expect(atributoEfetivoPet(pet, gato, 'FOR')).toBe('10 (+0)');
    expect(atributoEfetivoPet(pet, gato, 'DES')).toBe(gato.atributos.DES); // sem ajuste
  });
});

describe('calcularAjustesPet', () => {
  it('caso normal — só os campos que mudaram viram ajuste (CA mudou, resto igual ao Gato)', () => {
    const gato = acha('gato');
    const atributosIguais = {
      FOR: 3, DES: 15, CON: 10, INT: 3, SAB: 12, CAR: 7,
    } as const;
    const ajustes = calcularAjustesPet(gato, { ca: 16, pvMax: 2, atributos: atributosIguais });
    expect(ajustes).toEqual({ ca: 16 });
  });

  it('caso de borda — nada mudou (valores idênticos aos da criatura), ajustes fica vazio', () => {
    const gato = acha('gato');
    const atributosIguais = {
      FOR: 3, DES: 15, CON: 10, INT: 3, SAB: 12, CAR: 7,
    } as const;
    const ajustes = calcularAjustesPet(gato, { ca: 12, pvMax: 2, atributos: atributosIguais });
    expect(ajustes).toEqual({});
  });
});

describe('comBonusExtra / pvMaxEfetivoPet com bônus', () => {
  it('caso normal — ligar o bônus soma ao PV máximo efetivo', () => {
    const gato = acha('gato'); // pv 2
    const pet = comBonusExtra(criarPet('Sombra', gato), { rotulo: 'Legião dos Mortos', pv: 6, dano: 3 });
    expect(pvMaxEfetivoPet(pet, gato)).toBe(8);
  });

  it('caso de borda — desligar o bônus (null) volta ao PV máximo normal', () => {
    const gato = acha('gato');
    const comBonus = comBonusExtra(criarPet('Sombra', gato), { rotulo: 'Legião dos Mortos', pv: 6, dano: 3 });
    const semBonus = comBonusExtra(comBonus, null);
    expect(pvMaxEfetivoPet(semBonus, gato)).toBe(2);
    expect(semBonus.bonusExtra).toBeUndefined();
  });
});
