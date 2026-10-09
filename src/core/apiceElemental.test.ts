import { describe, expect, it } from 'vitest';
import {
  BONUS_DESLOCAMENTO_PASSO_DESTRUTIVO_M,
  golpesPotencializadosApiceDisponivel,
  passoDestrutivoSeAplica,
  temApiceElemental,
} from './apiceElemental';

describe('Ápice Elemental', () => {
  it('só Monge nível 17+ da subclasse Combatente dos Elementos', () => {
    expect(temApiceElemental(17, 'Combatente dos Elementos')).toBe(true);
    expect(temApiceElemental(16, 'Combatente dos Elementos')).toBe(false);
    expect(temApiceElemental(20, null)).toBe(false);
  });
  it('Golpes Potencializados do Ápice: precisa da Sintonia ativa e 1x por turno', () => {
    const base = { nivelMonge: 17, subclasseMonge: 'Combatente dos Elementos', sintoniaAtiva: true, usadoTurno: false };
    expect(golpesPotencializadosApiceDisponivel(base)).toBe(true);
    expect(golpesPotencializadosApiceDisponivel({ ...base, sintoniaAtiva: false })).toBe(false);
    expect(golpesPotencializadosApiceDisponivel({ ...base, usadoTurno: true })).toBe(false);
    expect(golpesPotencializadosApiceDisponivel({ ...base, nivelMonge: 16 })).toBe(false);
  });
});

describe('Passo Destrutivo', () => {
  const base = { nivelMonge: 17, subclasseMonge: 'Combatente dos Elementos', sintoniaAtiva: true };
  it('liga ao usar o Passo do Vento com a Sintonia ativa (nível 17+)', () => {
    expect(passoDestrutivoSeAplica(base)).toBe(true);
    expect(passoDestrutivoSeAplica({ ...base, sintoniaAtiva: false })).toBe(false);
    expect(passoDestrutivoSeAplica({ ...base, nivelMonge: 16 })).toBe(false);
    expect(passoDestrutivoSeAplica({ ...base, subclasseMonge: null })).toBe(false);
  });
  it('o bônus de Deslocamento é 6 m', () => {
    expect(BONUS_DESLOCAMENTO_PASSO_DESTRUTIVO_M).toBe(6);
  });
});
