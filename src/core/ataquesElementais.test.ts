import { describe, expect, it } from 'vitest';
import { ELEMENTOS_SINTONIA, podeAtaqueElemental } from './ataquesElementais';

describe('Ataques Elementais', () => {
  it('são os 5 elementos do livro', () => {
    expect([...ELEMENTOS_SINTONIA]).toEqual(['Ácido', 'Elétrico', 'Gélido', 'Ígneo', 'Trovejante']);
  });
  it('só com a Sintonia ativa E num Ataque Desarmado (arma de Monge comum não conta)', () => {
    expect(podeAtaqueElemental(true, true)).toBe(true);
    expect(podeAtaqueElemental(false, true)).toBe(false);
    expect(podeAtaqueElemental(true, false)).toBe(false);
  });
});
