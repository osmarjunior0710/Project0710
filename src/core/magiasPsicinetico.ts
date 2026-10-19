import { caracteristicasSubclasse } from '../data/rulesets/dnd2024/caracteristicasSubclasse';

/** Nomes das magias de "Magias do Psicinético" (Psiônico, Psicinético)
 * já desbloqueadas no nível atual — lista fixa, sem escolha do
 * jogador, acumulando cada faixa (3/5/7/9) conforme o nível sobe.
 * Mesmo padrão de `magiasJuramentoDaDevocao.ts`. Retorna `[]` se a
 * característica não existir no dado (nunca deveria acontecer) ou se
 * o nível ainda não bateu o primeiro degrau (3). */
export function magiasPsicinetico(nivel: number): string[] {
  const caracteristica = caracteristicasSubclasse.find(
    (c) => c.classe === 'Psiônico' && c.subclasse === 'Psicinético' && c.nome === 'Magias do Psicinético',
  );
  if (!caracteristica?.magiasFixasPorNivel) return [];
  const resultado: string[] = [];
  for (const [nivelDegrau, nomes] of Object.entries(caracteristica.magiasFixasPorNivel)) {
    if (nivel >= Number(nivelDegrau)) resultado.push(...nomes);
  }
  return resultado;
}
