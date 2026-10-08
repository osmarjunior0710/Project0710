import { describe, expect, it } from 'vitest';
import { podeRerolarSalvaguardaComFoco, temSobreviventeDisciplinado } from './sobreviventeDisciplinado';

describe('Sobrevivente Disciplinado', () => {
  it('só a partir do nível 14', () => {
    expect(temSobreviventeDisciplinado(13)).toBe(false);
    expect(temSobreviventeDisciplinado(14)).toBe(true);
  });
  it('re-rolar exige 1 Ponto de Foco', () => {
    expect(podeRerolarSalvaguardaComFoco(14, 1)).toBe(true);
    expect(podeRerolarSalvaguardaComFoco(14, 0)).toBe(false);
    expect(podeRerolarSalvaguardaComFoco(10, 5)).toBe(false);
  });
});
