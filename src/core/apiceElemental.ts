// Ápice Elemental (Monge, Combatente dos Elementos, nível 17) — "Enquanto
// sua Sintonia Elemental estiver ativa, você também adquire os seguintes
// benefícios. Golpes Potencializados. Uma vez em cada um dos seus turnos,
// você pode causar dano adicional a um alvo igual a uma jogada de seu dado de
// Artes Marciais ao atingi-lo com um Ataque Desarmado. O dano adicional é do
// mesmo tipo causado por esse ataque. Passo Destrutivo. [...] Resistência a
// Dano. [...]" Aqui: a 1ª parte (Golpes Potencializados do Ápice). A decisão
// de produto é aplicar o dado extra AUTOMATICAMENTE no 1º acerto desarmado do
// turno (igual Golpes Radiantes): é sempre vantajoso e só vale 1x por turno.
// [codeimplementation]

import { SUBCLASSE_ELEMENTOS } from './sintoniaElemental';

export function temApiceElemental(nivelMonge: number, subclasseMonge: string | null | undefined): boolean {
  return nivelMonge >= 17 && subclasseMonge === SUBCLASSE_ELEMENTOS;
}

/** `true` quando o próximo acerto desarmado ganha +1 dado de Artes Marciais:
 * tem o Ápice, a Sintonia Elemental está ativa e ainda não usou neste turno. */
export function golpesPotencializadosApiceDisponivel(opts: {
  nivelMonge: number;
  subclasseMonge: string | null | undefined;
  sintoniaAtiva: boolean;
  usadoTurno: boolean;
}): boolean {
  return temApiceElemental(opts.nivelMonge, opts.subclasseMonge) && opts.sintoniaAtiva && !opts.usadoTurno;
}
