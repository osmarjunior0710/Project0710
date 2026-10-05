import { describe, it, expect } from 'vitest';
import { danoResplendorSagrado } from './resplendorSagrado';

describe('danoResplendorSagrado', () => {
  it('soma mod. de Carisma e Bônus de Proficiência', () => {
    expect(danoResplendorSagrado(5, 6)).toBe(11);
  });

  it('Carisma negativo: ainda soma normalmente (sem mínimo)', () => {
    expect(danoResplendorSagrado(-1, 2)).toBe(1);
  });
});
