// Truques concedidos por uma característica de SUBCLASSE (ex.: Manipular
// Elementos do Monge / Combatente dos Elementos concede Elementalismo) —
// lista fixa, sem escolha, sempre disponível a partir do nível da
// característica. Genérico: lê `truquesConcedidos` de qualquer
// característica de qualquer subclasse (mesmo espírito de
// `magiasFixasDaClasseBase`), não só do Monge.

import { caracteristicasSubclasse } from '../data/rulesets/dnd2024/caracteristicasSubclasse';
import type { PersonagemClasse } from './multiclasse';

export interface TruqueDeSubclasse {
  nomeMagia: string;
  /** Classe dona da subclasse que concedeu (pra pill de classe). */
  classe: string;
}

/** Truques concedidos pelas subclasses ESCOLHIDAS do personagem, já
 * desbloqueados no nível de cada classe. Sem duplicar o mesmo truque. */
export function truquesConcedidosPorSubclasse(classes: PersonagemClasse[]): TruqueDeSubclasse[] {
  const resultado: TruqueDeSubclasse[] = [];
  for (const c of classes) {
    if (!c.subclasse) continue;
    for (const f of caracteristicasSubclasse) {
      if (f.classe !== c.classe || f.subclasse !== c.subclasse || f.nivel > c.nivel || !f.truquesConcedidos) continue;
      for (const nomeMagia of f.truquesConcedidos) {
        if (!resultado.some((r) => r.nomeMagia === nomeMagia)) resultado.push({ nomeMagia, classe: c.classe });
      }
    }
  }
  return resultado;
}
