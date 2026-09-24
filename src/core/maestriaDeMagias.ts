import type { Magia } from '../data/rulesets/dnd2024/magias';

// Maestria de Magias (Mago, nível 18) — escolhe 1 magia de 1º e 1 de 2º
// círculo (tempo de conjuração de uma Ação) do Livro de Magias. Ficam
// sempre preparadas e podem ser conjuradas no círculo mais baixo sem
// gastar Espaço; trocável no Descanso Longo (Entrega 6b).

/** Magias do Livro de Magias elegíveis pra escolher em cada círculo —
 * precisa ter tempo de conjuração de uma Ação (`'Ação'` ou `'Ação ou
 * Ritual'`, confirmado contra os valores reais de `magias.ts`). */
export function magiasElegiveisMaestria(livroDeMagias: Magia[], circulo: 1 | 2): Magia[] {
  return livroDeMagias.filter((m) => m.circulo === circulo && (m.tempoConjuracao === 'Ação' || m.tempoConjuracao === 'Ação ou Ritual'));
}

/** `escolhas` é `{1: nomeMagiaCirculo1, 2: nomeMagiaCirculo2}` — devolve
 * o círculo em que `nomeMagia` conjura de graça (é uma das 2 escolhas),
 * ou `null` se não for nenhuma delas. */
export function circuloGratisMaestria(nomeMagia: string, escolhas: Record<number, string>): number | null {
  const entrada = Object.entries(escolhas).find(([, nome]) => nome === nomeMagia);
  return entrada ? Number(entrada[0]) : null;
}
