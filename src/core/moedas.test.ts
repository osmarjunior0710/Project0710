import { describe, expect, it } from 'vitest';
import {
  MOEDAS_VAZIAS,
  adicionarMoedas,
  gastarMoedas,
  moedasDeOuro,
  normalizarMoedas,
  pesoDasMoedasKg,
  totalEmPO,
  type Moedas,
} from './moedas';

const m = (parcial: Partial<Moedas>): Moedas => ({ ...MOEDAS_VAZIAS, ...parcial });

describe('gastarMoedas', () => {
  it('gasta só do mesmo tipo quando tem o bastante', () => {
    const r = gastarMoedas(m({ po: 5 }), 'po', 3);
    expect(r).toMatchObject({ ok: true, moedas: m({ po: 2 }), troco: MOEDAS_VAZIAS });
  });

  it('completa com moedas menores quando falta do tipo (1 PO + 10 PP paga 2 PO)', () => {
    const r = gastarMoedas(m({ po: 1, pp: 20 }), 'po', 2);
    expect(r).toMatchObject({ ok: true, moedas: m({ pp: 10 }), pagas: m({ po: 1, pp: 10 }) });
  });

  it('quebra moeda maior e devolve troco (1 PL paga 5 PO = 5 PO de troco)', () => {
    const r = gastarMoedas(m({ pl: 1 }), 'po', 5);
    expect(r).toMatchObject({ ok: true, moedas: m({ po: 5 }), troco: m({ po: 5 }) });
  });

  it('troco em PP e PC (1 PO paga 3 PP = 7 PP de troco)', () => {
    const r = gastarMoedas(m({ po: 1 }), 'pp', 3);
    expect(r).toMatchObject({ ok: true, moedas: m({ pp: 7 }) });
  });

  it('junta várias moedas maiores quando nenhuma sozinha cobre (150 PC com 20 PP)', () => {
    const r = gastarMoedas(m({ pp: 20 }), 'pc', 150);
    expect(r).toMatchObject({ ok: true, moedas: m({ pp: 5 }), troco: MOEDAS_VAZIAS });
  });

  it('Electro paga mas não entra no troco (1 PE paga 2 PP = 3 PP de troco)', () => {
    const r = gastarMoedas(m({ pe: 1 }), 'pp', 2);
    expect(r).toMatchObject({ ok: true, moedas: m({ pp: 3 }), troco: m({ pp: 3 }) });
  });

  it('valor total é sempre preservado: antes - gasto = depois', () => {
    const antes = m({ pl: 2, po: 3, pe: 1, pp: 4, pc: 7 });
    const r = gastarMoedas(antes, 'po', 7);
    expect(r.ok).toBe(true);
    if (r.ok) expect(totalEmPO(r.moedas)).toBeCloseTo(totalEmPO(antes) - 7, 5);
  });

  it('bloqueia quando o total não cobre, e quantidade inválida', () => {
    expect(gastarMoedas(m({ po: 2 }), 'po', 3)).toMatchObject({ ok: false, motivo: 'insuficiente' });
    expect(gastarMoedas(m({ po: 2 }), 'po', 0)).toMatchObject({ ok: false, motivo: 'invalido' });
    expect(gastarMoedas(m({ po: 2 }), 'po', 1.5)).toMatchObject({ ok: false, motivo: 'invalido' });
  });
});

describe('moedasDeOuro / adicionar / normalizar / peso', () => {
  it('sobra fracionada da Loja vira PO + PP + PC (2,55 PO)', () => {
    expect(moedasDeOuro(2.55)).toEqual(m({ po: 2, pp: 5, pc: 5 }));
    expect(moedasDeOuro(0.5)).toEqual(m({ pp: 5 }));
    expect(moedasDeOuro(0)).toEqual(MOEDAS_VAZIAS);
  });

  it('adicionar soma no tipo e ignora quantidade inválida', () => {
    expect(adicionarMoedas(m({ po: 1 }), 'po', 4).po).toBe(5);
    expect(adicionarMoedas(m({ po: 1 }), 'po', -2).po).toBe(1);
  });

  it('normalizar aceita lixo do armazenamento', () => {
    expect(normalizarMoedas(null)).toEqual(MOEDAS_VAZIAS);
    expect(normalizarMoedas({ po: 3.9, pc: -4, pp: 'x' })).toEqual(m({ po: 3 }));
  });

  it('100 moedas pesam 1 kg', () => {
    expect(pesoDasMoedasKg(m({ po: 60, pp: 40 }))).toBe(1);
    expect(pesoDasMoedasKg(MOEDAS_VAZIAS)).toBe(0);
  });
});
