import { caracteristicaSubclasseDesbloqueada } from '../../../core/levelUp';
import { ID_CARACTERISTICA_SUBCLASSE, type IdCaracteristicaSubclasse } from '../../../data/rulesets/dnd2024/idsCaracteristicasSubclasse';

/**
 * Consolida N chamadas de `caracteristicaSubclasseDesbloqueada(subclasse,
 * ID, nível)` — todas com os MESMOS 2 primeiros argumentos, só o ID
 * muda — numa chamada só (G3.4 do foco de saúde do projeto, ver
 * `EmDevB.md`). Puramente derivado (sem `useState`/efeito), por isso
 * não é hook de verdade — pode ser chamado normalmente, sem seguir as
 * Regras de Hooks.
 *
 * Uso típico: `const { legiaoDosMortos, mestreDaMorte } =
 * caracteristicasSubclasseAtivas(personagem.subclasse, personagem.nivel,
 * ['legiaoDosMortos', 'mestreDaMorte'])`.
 */
export function caracteristicasSubclasseAtivas<K extends IdCaracteristicaSubclasse>(
  subclasse: string | null,
  nivel: number,
  chaves: readonly K[],
): Record<K, boolean> {
  const resultado = {} as Record<K, boolean>;
  for (const chave of chaves) {
    resultado[chave] = caracteristicaSubclasseDesbloqueada(subclasse, ID_CARACTERISTICA_SUBCLASSE[chave], nivel);
  }
  return resultado;
}
