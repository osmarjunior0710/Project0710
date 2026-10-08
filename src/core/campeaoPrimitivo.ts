import type { Atributo } from '../data/wizardFixtures';

/** Bônus de atributo de característica de nível 20 que sobe 2 atributos de
 * uma vez, +4 cada, até no máximo 25 — automático, sem escolha do
 * jogador (mesmo espírito de um Aumento no Valor de Atributo, só que sem
 * decisão), por isso quem chama nunca pergunta nada, só aplica:
 * - Campeão Primitivo (Bárbaro 20): Força e Constituição.
 * - Corpo e Mente (Monge 20): Destreza e Sabedoria. */
export interface CapstonesAtributo {
  campeaoPrimitivo: boolean;
  corpoEMente: boolean;
}

/** `boolean` = só Campeão Primitivo (assinatura original, ainda usada por
 * quem só precisa de Força/Constituição, ex. capacidade de carga). */
export type TemCapstone = boolean | CapstonesAtributo;

function normalizar(tem: TemCapstone): CapstonesAtributo {
  return typeof tem === 'boolean' ? { campeaoPrimitivo: tem, corpoEMente: false } : tem;
}

/** Nome da característica que está somando em `atributo` (pro ⓘ). */
export function rotuloCapstoneDoAtributo(atributo: Atributo): string {
  return atributo === 'DES' || atributo === 'SAB' ? 'Corpo e Mente' : 'Campeão Primitivo';
}

export function aplicarCampeaoPrimitivo(valorBase: number, atributo: Atributo, tem: TemCapstone): number {
  const f = normalizar(tem);
  const doCampeao = f.campeaoPrimitivo && (atributo === 'FOR' || atributo === 'CON');
  const doCorpoEMente = f.corpoEMente && (atributo === 'DES' || atributo === 'SAB');
  if (!doCampeao && !doCorpoEMente) return valorBase;
  return Math.min(25, valorBase + 4);
}
