// Ataques Elementais (Monge, Combatente dos Elementos, Sintonia Elemental
// ativa) — "Ao acertar com seu Ataque Desarmado, você pode causar com ele,
// à sua escolha, dano Ácido, Elétrico, Gélido, Ígneo ou Trovejante, em vez
// de seu tipo de dano normal. Ao causar um desses tipos de dano, você também
// pode forçar o alvo a realizar uma salvaguarda de Força. Se ele falhar, você
// pode movê-lo até 3 metros em sua direção ou para longe de você."
// O tipo de dano é só rótulo informativo (o app não calcula resistência de
// alvo); o empurrão vira o popup de salvaguarda do alvo. [codeimplementation]

export const ELEMENTOS_SINTONIA = ['Ácido', 'Elétrico', 'Gélido', 'Ígneo', 'Trovejante'] as const;
export type ElementoSintonia = (typeof ELEMENTOS_SINTONIA)[number];

/** O botão "Elemental" só aparece num Ataque Desarmado, com a Sintonia
 * Elemental ativa (arma de Monge comum NÃO conta: o texto diz "seu Ataque
 * Desarmado"). */
export function podeAtaqueElemental(sintoniaAtiva: boolean, ehAtaqueDesarmado: boolean): boolean {
  return sintoniaAtiva && ehAtaqueDesarmado;
}

export const TEXTO_EMPURRAO_ELEMENTAL = 'se falhar, você pode mover o alvo até 3 metros em sua direção ou para longe de você';
