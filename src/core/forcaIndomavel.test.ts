import { describe, expect, it } from 'vitest';
import { deveAplicarForcaIndomavel } from './forcaIndomavel';

describe('deveAplicarForcaIndomavel', () => {
  it('aplica quando o total fica abaixo do valor de Força', () => {
    expect(deveAplicarForcaIndomavel(13, 18)).toBe(true);
  });

  it('não aplica quando o total já é maior ou igual ao valor de Força', () => {
    expect(deveAplicarForcaIndomavel(18, 18)).toBe(false);
    expect(deveAplicarForcaIndomavel(20, 18)).toBe(false);
  });
});
