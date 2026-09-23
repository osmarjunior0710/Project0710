import { describe, it, expect } from 'vitest';
import { custoCopiarMagia, custoBaseCopiarMagia } from './copiarMagia';

describe('custoCopiarMagia', () => {
  it('magia de 2º círculo, modo nova — 4h + 100 PO', () => {
    expect(custoCopiarMagia(2, 'nova')).toEqual({ horas: 4, po: 100 });
  });

  it('círculo 0 (truque) — custo zero em qualquer modo', () => {
    expect(custoCopiarMagia(0, 'nova')).toEqual({ horas: 0, po: 0 });
    expect(custoCopiarMagia(0, 'reescrever')).toEqual({ horas: 0, po: 0 });
  });
});

describe('custoBaseCopiarMagia', () => {
  it('modo nova — 2h + 50 PO (1º círculo)', () => {
    expect(custoBaseCopiarMagia('nova')).toEqual({ horas: 2, po: 50 });
  });

  it('modo reescrever — 1h + 10 PO (1º círculo)', () => {
    expect(custoBaseCopiarMagia('reescrever')).toEqual({ horas: 1, po: 10 });
  });
});
