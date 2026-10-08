// Sintonia Elemental (Monge, Combatente dos Elementos, nível 3) — "No início
// do seu turno, você pode gastar 1 Ponto de Foco para imbuir-se de energia
// elemental. A energia dura 10 minutos ou até você ter a condição
// Incapacitado." Toggle sem contador de tempo (mesmo padrão de Defesa
// Superior/Arma Sagrada); o jogador encerra à mão. Os benefícios (Ataques
// Elementais, Extensão, Passo dos Elementos, Ápice) são entregas próprias.
// [codeimplementation]

export const SUBCLASSE_ELEMENTOS = 'Combatente dos Elementos';
export const CUSTO_FOCO_SINTONIA_ELEMENTAL = 1;

/** `true` quando o personagem tem a característica: Monge nível 3+ com a
 * subclasse Combatente dos Elementos escolhida. */
export function temSintoniaElemental(nivelMonge: number, subclasseMonge: string | null | undefined): boolean {
  return nivelMonge >= 3 && subclasseMonge === SUBCLASSE_ELEMENTOS;
}

export function podeAtivarSintoniaElemental(
  nivelMonge: number,
  subclasseMonge: string | null | undefined,
  pontosDeFocoRestantes: number,
): boolean {
  return temSintoniaElemental(nivelMonge, subclasseMonge) && pontosDeFocoRestantes >= CUSTO_FOCO_SINTONIA_ELEMENTAL;
}
