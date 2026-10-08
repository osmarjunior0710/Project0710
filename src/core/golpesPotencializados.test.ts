import { describe, expect, it } from 'vitest';
import { golpesPotencializadosAtivo, TIPOS_DANO_GOLPES_POTENCIALIZADOS } from './golpesPotencializados';

describe('golpesPotencializadosAtivo', () => {
  it('só a partir do nível 6 de Monge', () => {
    expect(golpesPotencializadosAtivo(5)).toBe(false);
    expect(golpesPotencializadosAtivo(6)).toBe(true);
    expect(golpesPotencializadosAtivo(0)).toBe(false);
  });
  it('oferece Contundente e Energético', () => {
    expect(TIPOS_DANO_GOLPES_POTENCIALIZADOS).toHaveLength(2);
  });
});
