// Características do personagem em TODAS as classes ao mesmo tempo (2026-10, pedido do Osmar: "se funciona no Char
// Multiclasse, qualquer combinação funciona"). Antes, `FichaShell.tsx` perguntava "esse personagem tem a característica
// X?" só pra UMA classe "em foco" (a 1ª que conjura), então Bárbaro/Guerreiro/Bardo/subclasses sumiam num multiclasse.
//
// Regra do módulo: o sistema conhece todas as classes do personagem (`PersonagemClasse[]`, cada uma com no máximo 1
// subclasse ativa) e acha a característica pelo ID estável, em qualquer classe/subclasse — classe ou subclasse nova só
// precisa registrar o ID no dado, nenhuma edição aqui nem em `FichaShell.tsx`. Nível de CLASSE (o da dona da
// característica) é diferente de nível TOTAL (`nivelTotalPersonagem`, soma de todas): quem escala pelo personagem
// inteiro (Bônus de Proficiência etc.) usa o total; quem escala pela classe usa `nivel` do contexto.
// [codeimplementation]

import type { Classe } from '../data/rulesets/dnd2024/classes';
import { ID_CARACTERISTICA_SUBCLASSE, type IdCaracteristicaSubclasse } from '../data/rulesets/dnd2024/idsCaracteristicasSubclasse';
import {
  caracteristicaDesbloqueada,
  caracteristicaSubclasseDesbloqueada,
  contarRepeticoesCaracteristica,
  numeroDeAtaques,
  type CaracteristicaNivel,
} from './levelUp';
import type { PersonagemClasse } from './multiclasse';

/** Uma classe do personagem já resolvida contra o catálogo: objeto da classe + nível NELA + subclasse ativa dela. */
export interface ContextoClasse {
  classe: Classe;
  nivel: number;
  subclasse: string | null;
}

/** Classes do personagem que existem no catálogo (nome desconhecido é ignorado, nunca quebra). */
export function contextosDasClasses(classes: readonly PersonagemClasse[], catalogo: readonly Classe[]): ContextoClasse[] {
  const contextos: ContextoClasse[] = [];
  for (const entrada of classes) {
    const classe = catalogo.find((c) => c.nome === entrada.classe);
    if (classe) contextos.push({ classe, nivel: entrada.nivel, subclasse: entrada.subclasse ?? null });
  }
  return contextos;
}

/** Contextos que já desbloquearam a característica de classe `id`, do maior nível pro menor. */
function donas(contextos: readonly ContextoClasse[], id: string): ContextoClasse[] {
  return contextos
    .filter((c) => caracteristicaDesbloqueada(c.classe, id, c.nivel) !== null)
    .sort((a, b) => b.nivel - a.nivel);
}

/** Classe (com o nível NELA) que concede a característica `id` — a de maior nível se mais de uma tiver. `null` se
 * nenhuma classe do personagem a tem ainda. */
export function donaDaCaracteristica(contextos: readonly ContextoClasse[], id: string): ContextoClasse | null {
  return donas(contextos, id)[0] ?? null;
}

export function temCaracteristica(contextos: readonly ContextoClasse[], id: string): boolean {
  return donaDaCaracteristica(contextos, id) !== null;
}

/** Texto/descrição da característica na classe dona (mesmo retorno de `caracteristicaDesbloqueada`), ou `null`. */
export function detalheDaCaracteristica(contextos: readonly ContextoClasse[], id: string): CaracteristicaNivel | null {
  const dona = donaDaCaracteristica(contextos, id);
  return dona ? caracteristicaDesbloqueada(dona.classe, id, dona.nivel) : null;
}

/** Quantas vezes o ID aparece na progressão da classe dona (padrão "repete o nome pra +1 uso": Indomável, Surto de
 * Ação, Golpe Brutal Fortalecido). 0 se nenhuma classe a tem. */
export function repeticoesDaCaracteristica(contextos: readonly ContextoClasse[], id: string): number {
  const dona = donaDaCaracteristica(contextos, id);
  return dona ? contarRepeticoesCaracteristica(dona.classe, id, dona.nivel) : 0;
}

/** Ataques por ação Atacar: o MAIOR entre as classes (Ataque Extra de classes diferentes não soma, regra do livro).
 * 1 se o personagem não tem nenhuma classe. */
export function maiorNumeroDeAtaques(contextos: readonly ContextoClasse[]): number {
  return contextos.reduce((maximo, c) => Math.max(maximo, numeroDeAtaques(c.classe, c.nivel)), 1);
}

/** Características de SUBCLASSE: `true` se a subclasse ativa de QUALQUER classe do personagem a desbloqueou (cada classe
 * lê o nível dela mesma). Substitui o antigo `caracteristicasSubclasseAtivas(personagem.subclasse, ...)` de 1 classe só. */
export function caracteristicasDeSubclasse<K extends IdCaracteristicaSubclasse>(
  contextos: readonly ContextoClasse[],
  chaves: readonly K[],
): Record<K, boolean> {
  const resultado = {} as Record<K, boolean>;
  for (const chave of chaves) {
    resultado[chave] = contextos.some((c) =>
      caracteristicaSubclasseDesbloqueada(c.subclasse, ID_CARACTERISTICA_SUBCLASSE[chave], c.nivel),
    );
  }
  return resultado;
}

/** Classe (com nível e subclasse) cuja subclasse ativa concede a característica de subclasse `chave` — pra quem escala
 * pelo nível da CLASSE dona (PV da Fúria Implacável, magias do Juramento, Bênção do Tenebroso...). `null` se nenhuma. */
export function donaDaCaracteristicaDeSubclasse(
  contextos: readonly ContextoClasse[],
  chave: IdCaracteristicaSubclasse,
): ContextoClasse | null {
  const dona = contextos
    .filter((c) => caracteristicaSubclasseDesbloqueada(c.subclasse, ID_CARACTERISTICA_SUBCLASSE[chave], c.nivel))
    .sort((a, b) => b.nivel - a.nivel)[0];
  return dona ?? null;
}
