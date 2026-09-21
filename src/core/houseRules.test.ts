import { describe, expect, it } from 'vitest';
import { HOUSE_RULES_PADRAO, normalizarHouseRules } from './houseRules';

describe('normalizarHouseRules', () => {
  it('devolve o padrão quando não há nada salvo', () => {
    expect(normalizarHouseRules(null)).toEqual(HOUSE_RULES_PADRAO);
  });

  it('respeita um valor salvo válido', () => {
    expect(normalizarHouseRules({ pesoMochila: false }).pesoMochila).toBe(false);
  });

  it('ignora campo de tipo errado e cai no padrão', () => {
    expect(normalizarHouseRules({ pesoMochila: 'nao' }).pesoMochila).toBe(HOUSE_RULES_PADRAO.pesoMochila);
  });

  it('confirmação de crítico nasce desligada e respeita o valor salvo', () => {
    expect(HOUSE_RULES_PADRAO.confirmacaoCritico).toBe(false);
    expect(normalizarHouseRules({ confirmacaoCritico: true }).confirmacaoCritico).toBe(true);
  });

  it('peso das moedas nasce ligado e respeita o valor salvo', () => {
    expect(HOUSE_RULES_PADRAO.pesoMoedas).toBe(true);
    expect(normalizarHouseRules({ pesoMoedas: false }).pesoMoedas).toBe(false);
  });

  it('ignora lixo que não é objeto', () => {
    expect(normalizarHouseRules('quebrado')).toEqual(HOUSE_RULES_PADRAO);
  });
});
