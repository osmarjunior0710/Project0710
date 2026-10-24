import { describe, it, expect } from 'vitest';
import {
  tipoDanoTrocaTalentoSelvagem,
  acaoVantagemTalentoSelvagem,
  testeBonificadoTalentoSelvagem,
  temBiocinese,
  temSussurradorMental,
  temPsicineticoTalento,
} from './talentosSelvagens';

describe('tipoDanoTrocaTalentoSelvagem (Grupo A)', () => {
  it('Atmocinese/Criocinese/Pirocinese devolvem o tipo certo', () => {
    expect(tipoDanoTrocaTalentoSelvagem(['atmocinese'])).toBe('Elétrico');
    expect(tipoDanoTrocaTalentoSelvagem(['criocinese'])).toBe('Gélido');
    expect(tipoDanoTrocaTalentoSelvagem(['pirocinese'])).toBe('Ígneo');
  });

  it('borda: sem talento do grupo (ou sem talentos nenhum) devolve null', () => {
    expect(tipoDanoTrocaTalentoSelvagem(['biocinese'])).toBeNull();
    expect(tipoDanoTrocaTalentoSelvagem(undefined)).toBeNull();
  });
});

describe('acaoVantagemTalentoSelvagem (Grupo B)', () => {
  it('Clarividência/Empata devolvem a Ação certa', () => {
    expect(acaoVantagemTalentoSelvagem(['clarividencia'])).toBe('Procurar');
    expect(acaoVantagemTalentoSelvagem(['empata'])).toBe('Influenciar');
  });

  it('borda: sem talento do grupo devolve null', () => {
    expect(acaoVantagemTalentoSelvagem(['atmocinese'])).toBeNull();
  });
});

describe('testeBonificadoTalentoSelvagem (Grupo C)', () => {
  it('Modelador de Carne/Trapaceiro Psiônico devolvem atributo+perícias certos', () => {
    expect(testeBonificadoTalentoSelvagem(['modelador-de-carne'])).toEqual({
      atributo: 'Destreza',
      pericias: ['Acrobacia', 'Prestidigitação'],
    });
    expect(testeBonificadoTalentoSelvagem(['trapaceiro-psionico'])).toEqual({
      atributo: 'Carisma',
      pericias: ['Enganação', 'Persuasão'],
    });
  });

  it('borda: sem talento do grupo devolve null', () => {
    expect(testeBonificadoTalentoSelvagem(['biocinese'])).toBeNull();
  });
});

describe('talentos sozinhos do Grupo D', () => {
  it('temBiocinese/temSussurradorMental/temPsicineticoTalento detectam o próprio id', () => {
    expect(temBiocinese(['biocinese'])).toBe(true);
    expect(temSussurradorMental(['sussurrador-mental'])).toBe(true);
    expect(temPsicineticoTalento(['psicinetico-talento'])).toBe(true);
  });

  it('borda: sem o talento (ou sem talentos nenhum) devolve false', () => {
    expect(temBiocinese(['atmocinese'])).toBe(false);
    expect(temSussurradorMental(undefined)).toBe(false);
    expect(temPsicineticoTalento([])).toBe(false);
  });
});
