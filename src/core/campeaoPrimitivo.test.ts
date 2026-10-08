import { describe, expect, it } from 'vitest';
import { aplicarCampeaoPrimitivo, rotuloCapstoneDoAtributo } from './campeaoPrimitivo';

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

  it('Corpo e Mente (Monge 20) soma +4 em Destreza/Sabedoria, capa em 25, e não toca Força/Constituição', () => {
    const monge = { campeaoPrimitivo: false, corpoEMente: true };
    expect(aplicarCampeaoPrimitivo(18, 'DES', monge)).toBe(22);
    expect(aplicarCampeaoPrimitivo(14, 'SAB', monge)).toBe(18);
    expect(aplicarCampeaoPrimitivo(23, 'DES', monge)).toBe(25);
    expect(aplicarCampeaoPrimitivo(18, 'FOR', monge)).toBe(18);
  });

  it('Campeão Primitivo e Corpo e Mente juntos (multiclasse): cada um só no seu par de atributos', () => {
    const ambos = { campeaoPrimitivo: true, corpoEMente: true };
    expect(aplicarCampeaoPrimitivo(10, 'FOR', ambos)).toBe(14);
    expect(aplicarCampeaoPrimitivo(10, 'DES', ambos)).toBe(14);
    expect(aplicarCampeaoPrimitivo(10, 'INT', ambos)).toBe(10);
  });

  it('rótulo do ⓘ muda por atributo', () => {
    expect(rotuloCapstoneDoAtributo('DES')).toBe('Corpo e Mente');
    expect(rotuloCapstoneDoAtributo('CON')).toBe('Campeão Primitivo');
  });
});
