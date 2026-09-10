import type { Classe } from '../data/rulesets/dnd2024/classes';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import { criaturas, type Criatura } from '../data/rulesets/dnd2024/criaturas';
import { espacosDeMagiaAtivos } from './magiasPersonagem';
import { caracteristicaSubclasseDesbloqueada } from './levelUp';

function circuloMaximoNoNivel(classe: Classe, nivel: number): number {
  return Math.max(0, ...espacosDeMagiaAtivos(classe, nivel).map((e) => e.circulo));
}

/** Perito em Necromancia (Necromante, nível 3, homebrew — ver
 * `caracteristicasSubclasseHomebrew.ts`): quantas magias de
 * Necromancia bônus (gratuitas no Livro de Magias) esse LEVEL-UP
 * específico concede — não é acumulado, é só o delta de "agora" (mesmo
 * padrão de ASI/Arcana Mística em `LevelUpShell.tsx`, que também
 * checam o que muda entre `nivelAnterior` e `novoNivel`). 2 ao atingir
 * o nível 3 (quando a subclasse é escolhida); +1 toda vez que um novo
 * círculo de magia é desbloqueado depois disso; 0 em qualquer outro
 * level-up (inclusive se ainda não tiver a subclasse). */
export function magiasPeritoNecromanciaNesteNivel(classe: Classe, nivelAnterior: number, novoNivel: number): number {
  if (novoNivel < 3) return 0;
  if (novoNivel === 3) return 2;
  const circuloAntes = circuloMaximoNoNivel(classe, nivelAnterior);
  const circuloDepois = circuloMaximoNoNivel(classe, novoNivel);
  return circuloDepois > circuloAntes ? 1 : 0;
}

/** Catálogo elegível pro Perito em Necromancia nesse nível — só magias
 * de Necromancia de verdade (círculo 1+, "magias" no texto da
 * característica, nunca truques — qualquer classe, a característica
 * não restringe à lista de magias de Mago) até o círculo máximo
 * disponível. */
export function catalogoPeritoNecromancia(circuloMaximo: number): Magia[] {
  return magias.filter((m) => m.escola === 'Necromancia' && m.circulo >= 1 && m.circulo <= circuloMaximo);
}

const NOMES_FAMILIAR_MORTO_VIVO = ['Esqueleto', 'Zumbi'];

/** Familiar Morto-Vivo (parte de "Grimório de Necromancia", nível 3,
 * homebrew): ao conjurar Encontrar Familiar, o familiar pode assumir
 * forma de Esqueleto ou Zumbi em vez das formas usuais — mesmo padrão
 * de `formasFamiliarDasInvocacoes` (Bruxo/Pacto da Corrente), só que a
 * elegibilidade vem de uma característica de subclasse em vez de uma
 * Invocação Mística. `[]` = personagem ainda não tem a característica
 * (esconde a caixa "Convocar Familiar" na aba Pets). */
export function formasFamiliarMortoVivoElegiveis(subclasse: string | null, nivel: number): Criatura[] {
  if (!caracteristicaSubclasseDesbloqueada(subclasse, 'Grimório de Necromancia', nivel)) return [];
  return criaturas.filter((c) => NOMES_FAMILIAR_MORTO_VIVO.includes(c.nome));
}
