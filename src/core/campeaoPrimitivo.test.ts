import { describe, expect, it } from 'vitest';
import { aplicarCampeaoPrimitivo } from './campeaoPrimitivo';

describe('aplicarCampeaoPrimitivo', () => {
  it('soma +4 em Força/Constituição quando tem a característica', () => {
    expect(aplicarCampeaoPrimitivo(18, 'FOR', true)).toBe(22);
    expect(aplicarCampeaoPrimitivo(15, 'CON', true)).toBe(19);
  });

  it('capa em 25, mesmo que a soma passaria disso', () => {
    expect(aplicarCampeaoPrimitivo(23, 'FOR', true)).toBe(25);
  });

  it('não muda sem a característica, nem em atributo diferente de Força/Constituição', () => {
    expect(aplicarCampeaoPrimitivo(18, 'FOR', false)).toBe(18);
    expect(aplicarCampeaoPrimitivo(18, 'DES', true)).toBe(18);
  });
});
