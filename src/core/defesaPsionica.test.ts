import { describe, expect, it } from 'vitest';
import { podeAtivarDefesaPsionica, temDefesaPsionica } from './defesaPsionica';

describe('defesaPsionica', () => {
  it('temDefesaPsionica só com a disciplina conhecida', () => {
    expect(temDefesaPsionica(['defesa-psionica', 'mente-agucada'])).toBe(true);
    expect(temDefesaPsionica(['mente-agucada'])).toBe(false);
    expect(temDefesaPsionica([])).toBe(false);
  });

  it('podeAtivarDefesaPsionica exige a disciplina E ao menos 1 dado', () => {
    expect(podeAtivarDefesaPsionica(['defesa-psionica'], 1)).toBe(true);
    expect(podeAtivarDefesaPsionica(['defesa-psionica'], 0)).toBe(false);
    expect(podeAtivarDefesaPsionica([], 3)).toBe(false);
  });
});
