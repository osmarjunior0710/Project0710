import { describe, expect, it } from 'vitest';
import { PREFERENCIAS_PILLS_MAGIA_PADRAO, normalizarPreferenciasPillsMagia } from './preferenciasPillsMagia';

describe('normalizarPreferenciasPillsMagia', () => {
  it('devolve o padrão quando não há nada salvo', () => {
    expect(normalizarPreferenciasPillsMagia(null)).toEqual(PREFERENCIAS_PILLS_MAGIA_PADRAO);
  });

  it('círculo e classe nascem ligados (comportamento atual não muda), o resto nasce desligado', () => {
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.classe).toBe(true);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.circulo).toBe(true);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.escola).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.alcance).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.componenteV).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.componenteS).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.componenteM).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.ataqueOuSalvaguarda).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.duracao).toBe(false);
    expect(PREFERENCIAS_PILLS_MAGIA_PADRAO.tipoAcao).toBe(false);
  });

  it('respeita um valor salvo válido', () => {
    expect(normalizarPreferenciasPillsMagia({ escola: true }).escola).toBe(true);
    expect(normalizarPreferenciasPillsMagia({ classe: false }).classe).toBe(false);
  });

  it('ignora campo de tipo errado e cai no padrão', () => {
    expect(normalizarPreferenciasPillsMagia({ escola: 'sim' }).escola).toBe(false);
    expect(normalizarPreferenciasPillsMagia({ circulo: 'nao' }).circulo).toBe(true);
  });

  it('ignora lixo que não é objeto', () => {
    expect(normalizarPreferenciasPillsMagia('quebrado')).toEqual(PREFERENCIAS_PILLS_MAGIA_PADRAO);
  });
});
