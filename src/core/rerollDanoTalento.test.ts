import { describe, it, expect } from 'vitest';
import { temPerfurador } from './rerollDanoTalento';

describe('temPerfurador', () => {
  it('Perfurador: true', () => {
    expect(temPerfurador(['perfurador'])).toBe(true);
  });

  it('sem o talento: false', () => {
    expect(temPerfurador(['analitico'])).toBe(false);
    expect(temPerfurador(undefined)).toBe(false);
  });
});
