import { describe, expect, it } from 'vitest';
import { explicarCdGolpeAtordoante, golpeAtordoanteDisponivel } from './golpeAtordoante';

describe('explicarCdGolpeAtordoante', () => {
  it('soma 8 + SAB + proficiência', () => {
    expect(explicarCdGolpeAtordoante(3, 3).total.valor).toBe('14');
  });
  it('aceita SAB negativo', () => {
    expect(explicarCdGolpeAtordoante(-1, 3).total.valor).toBe('10');
  });
});

describe('golpeAtordoanteDisponivel', () => {
  const base = { nivelMonge: 5, pontosDeFocoRestantes: 1, usadoTurno: false, armaDeMongeOuDesarmado: true };
  it('disponível no caso normal', () => expect(golpeAtordoanteDisponivel(base)).toBe(true));
  it('nível 4 não tem', () => expect(golpeAtordoanteDisponivel({ ...base, nivelMonge: 4 })).toBe(false));
  it('sem Foco não tem', () => expect(golpeAtordoanteDisponivel({ ...base, pontosDeFocoRestantes: 0 })).toBe(false));
  it('1x por turno', () => expect(golpeAtordoanteDisponivel({ ...base, usadoTurno: true })).toBe(false));
  it('arma que não é de Monge não tem', () =>
    expect(golpeAtordoanteDisponivel({ ...base, armaDeMongeOuDesarmado: false })).toBe(false));
});
