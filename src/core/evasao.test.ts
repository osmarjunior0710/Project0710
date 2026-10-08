import { describe, expect, it } from 'vitest';
import { temEvasao } from './evasao';

describe('temEvasao', () => {
  it('só a partir do nível 7 de Monge', () => {
    expect(temEvasao(6)).toBe(false);
    expect(temEvasao(7)).toBe(true);
    expect(temEvasao(0)).toBe(false);
  });
});
