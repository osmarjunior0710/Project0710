// Ápice Elemental (Monge, Combatente dos Elementos, nível 17) — "Enquanto
// sua Sintonia Elemental estiver ativa, você também adquire os seguintes
// benefícios. Golpes Potencializados. Uma vez em cada um dos seus turnos,
// você pode causar dano adicional a um alvo igual a uma jogada de seu dado de
// Artes Marciais ao atingi-lo com um Ataque Desarmado. O dano adicional é do
// mesmo tipo causado por esse ataque. Passo Destrutivo. [...] Resistência a
// Dano. [...]" Aqui: a 1ª parte (Golpes Potencializados do Ápice). Decisão
// de produto (Osmar): é OPÇÃO do jogador — botão "➕ Ápice" no popup de dano de
// um acerto desarmado, em qual acerto do turno quiser (ex.: esperar um
// crítico, que dobra o dado); depois de usado, só no próximo turno.
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

/** Passo Destrutivo (Ápice Elemental, 2ª parte) — "Ao usar seu Passo do Vento, seu Deslocamento
 * aumenta em 6 metros até o final do turno. Pela duração, qualquer criatura à sua escolha sofre
 * dano igual a uma jogada de seu dado de Artes Marciais quando você entra em um espaço a até 1,5
 * metro dela [...] Uma criatura pode sofrer esse dano apenas uma vez por turno." O app não
 * rastreia posição: usar o Passo do Vento com a Sintonia ativa liga o Passo Destrutivo no turno
 * e o jogador rola 1 dado por criatura. [codeimplementation] */
export const BONUS_DESLOCAMENTO_PASSO_DESTRUTIVO_M = 6;

export function passoDestrutivoSeAplica(opts: {
  nivelMonge: number;
  subclasseMonge: string | null | undefined;
  sintoniaAtiva: boolean;
}): boolean {
  return temApiceElemental(opts.nivelMonge, opts.subclasseMonge) && opts.sintoniaAtiva;
}

/** Resistência a Dano (Ápice Elemental, 3ª parte) — "Você adquire Resistência a um dos seguintes
 * tipos de dano à sua escolha: Ácido, Elétrico, Gélido, Ígneo ou Trovejante. No início de cada um
 * dos seus turnos, você pode alterar essa escolha." Vale enquanto a Sintonia Elemental estiver
 * ativa. O app só guarda e mostra a escolha (nunca calcula dano recebido). Devolve a escolha
 * válida ou `null` (nada escolhido / valor inválido). [codeimplementation] */
export const TIPOS_RESISTENCIA_APICE = ['Ácido', 'Elétrico', 'Gélido', 'Ígneo', 'Trovejante'] as const;

export function resistenciaApiceValida(escolha: string | null | undefined): string | null {
  return (TIPOS_RESISTENCIA_APICE as readonly string[]).includes(escolha ?? '') ? (escolha as string) : null;
}
