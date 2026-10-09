// Golpes Potencializados (Monge, nível 6) — "Ao causar dano com seu Ataque
// Desarmado, você escolhe entre causar dano Energético ou seu tipo de dano
// normal." Só rótulo informativo no fechamento do popup de dano (o app não
// calcula resistência/vulnerabilidade de alvo), mesmo padrão da Arma
// Sagrada. [codeimplementation]

export function golpesPotencializadosAtivo(nivelMonge: number): boolean {
  return nivelMonge >= 6;
}

/** Rótulos dos botões de tipo de dano do Ataque Desarmado (nível 6+). */
export const TIPOS_DANO_GOLPES_POTENCIALIZADOS = ['Contundente', '⚡ Energético'] as const;
