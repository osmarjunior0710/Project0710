// Copiar Magia (Mago, "Expandindo e Substituindo um Livro de Magias" —
// ver sdd/sdd-mago-caracteristicas-base.md, CLAUDE.md §6.1.2). 2 modos:
// "nova" = copiar uma magia encontrada (pergaminho/outro livro) pro seu
// Livro de Magias (2h + 50 PO por círculo); "reescrever" = copiar uma
// magia que já é sua pra um livro reserva (1h + 10 PO por círculo, não
// muda nada no Livro de Magias — a magia já era conhecida).

export type ModoCopiarMagia = 'nova' | 'reescrever';

export interface CustoCopiarMagia {
  horas: number;
  po: number;
}

const HORAS_POR_CIRCULO: Record<ModoCopiarMagia, number> = { nova: 2, reescrever: 1 };
const PO_POR_CIRCULO: Record<ModoCopiarMagia, number> = { nova: 50, reescrever: 10 };

/** Custo real pra copiar uma magia de `circulo` no modo dado — cresce
 * linearmente com o círculo, sem custo pra truque (círculo 0), já que a
 * regra real só cobre "magia de 1º círculo ou superior". */
export function custoCopiarMagia(circulo: number, modo: ModoCopiarMagia): CustoCopiarMagia {
  return { horas: circulo * HORAS_POR_CIRCULO[modo], po: circulo * PO_POR_CIRCULO[modo] };
}

/** Custo BASE (1º círculo) de cada modo — usado no botão de escolha de
 * modo antes de qualquer magia ser selecionada (mostrado com "+" pra
 * indicar que é o mínimo, o valor real escala com o círculo). */
export function custoBaseCopiarMagia(modo: ModoCopiarMagia): CustoCopiarMagia {
  return custoCopiarMagia(1, modo);
}
