import type { Classe } from '../data/rulesets/dnd2024/classes';
import { magias, type Magia } from '../data/rulesets/dnd2024/magias';
import { espacosDeMagiaAtivos } from './magiasPersonagem';

function circuloMaximoNoNivel(classe: Classe, nivel: number): number {
  return Math.max(0, ...espacosDeMagiaAtivos(classe, nivel).map((e) => e.circulo));
}

/** Versado em Evocação (Mago/Evocador, nível 3, regra oficial): quantas
 * magias de Evocação bônus (gratuitas no Livro de Magias) esse
 * LEVEL-UP específico concede — não é acumulado, é só o delta de
 * "agora" (mesmo padrão de `magiasPeritoNecromanciaNesteNivel`,
 * Necromante homebrew). 2 ao atingir o nível 3 (quando a subclasse é
 * escolhida); +1 toda vez que um novo círculo de espaço de magia é
 * desbloqueado depois disso; 0 em qualquer outro level-up. */
export function magiasVersadoEmEvocacaoNesteNivel(classe: Classe, nivelAnterior: number, novoNivel: number): number {
  if (novoNivel < 3) return 0;
  if (novoNivel === 3) return 2;
  const circuloAntes = circuloMaximoNoNivel(classe, nivelAnterior);
  const circuloDepois = circuloMaximoNoNivel(classe, novoNivel);
  return circuloDepois > circuloAntes ? 1 : 0;
}

/** Catálogo elegível pro Versado em Evocação nesse nível — só magias
 * de Evocação de MAGO (o texto da característica restringe à lista de
 * magias de Mago, diferente de Perito em Necromancia que não
 * restringe por classe) até o círculo máximo disponível. */
export function catalogoVersadoEmEvocacao(circuloMaximo: number): Magia[] {
  return magias.filter((m) => m.escola === 'Evocação' && m.classes.includes('Mago') && m.circulo >= 1 && m.circulo <= circuloMaximo);
}
