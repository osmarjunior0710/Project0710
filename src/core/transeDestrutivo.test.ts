import { describe, expect, it } from 'vitest';
import { podeAtivarTranseDestrutivo, transeDestrutivoDanoElegivel } from './transeDestrutivo';

describe('podeAtivarTranseDestrutivo', () => {
  it('permite ativar com a característica disponível e ao menos 1 Dado de Energia restante', () => {
    expect(podeAtivarTranseDestrutivo(true, 1)).toBe(true);
  });

  it('bloqueia sem a característica, mesmo com dados restantes', () => {
    expect(podeAtivarTranseDestrutivo(false, 5)).toBe(false);
  });

  it('bloqueia sem nenhum Dado de Energia restante', () => {
    expect(podeAtivarTranseDestrutivo(true, 0)).toBe(false);
  });
});

describe('transeDestrutivoDanoElegivel', () => {
  it('elegível com característica disponível, estado ativo e espaço de magia de verdade', () => {
    expect(transeDestrutivoDanoElegivel(true, true, 3, true)).toBe(true);
  });

  it('bloqueia sem a característica', () => {
    expect(transeDestrutivoDanoElegivel(false, true, 3, true)).toBe(false);
  });

  it('bloqueia com o estado desativado', () => {
    expect(transeDestrutivoDanoElegivel(true, false, 3, true)).toBe(false);
  });

  it('bloqueia truque (círculo 0)', () => {
    expect(transeDestrutivoDanoElegivel(true, true, 0, true)).toBe(false);
  });

  it('bloqueia magia concedida de graça sem gastar espaço de verdade', () => {
    expect(transeDestrutivoDanoElegivel(true, true, 3, false)).toBe(false);
  });
});
