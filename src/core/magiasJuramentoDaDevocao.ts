import { caracteristicasSubclasse } from '../data/rulesets/dnd2024/caracteristicasSubclasse';

/** Nomes das magias de "Magias do Juramento da Devoção" (Paladino,
 * Juramento da Devoção) já desbloqueadas no nível atual — lista fixa,
 * sem escolha do jogador, acumulando cada faixa (3/5/9/13/17)
 * conforme o nível sobe. Mesmo padrão de `magiasPactoDoInfero.ts`
 * (Bruxo, Patrono Ínfero) — ver `sdd/sdd-paladino-devocao.md` seção 1.
 * Retorna `[]` se a característica não existir no dado (nunca deveria
 * acontecer) ou se o nível ainda não bateu o primeiro degrau (3). */
export function magiasJuramentoDaDevocao(nivel: number): string[] {
  const caracteristica = caracteristicasSubclasse.find(
    (c) => c.classe === 'Paladino' && c.subclasse === 'Juramento da Devoção' && c.nome === 'Magias do Juramento da Devoção',
  );
  if (!caracteristica?.magiasFixasPorNivel) return [];
  const resultado: string[] = [];
  for (const [nivelDegrau, nomes] of Object.entries(caracteristica.magiasFixasPorNivel)) {
    if (nivel >= Number(nivelDegrau)) resultado.push(...nomes);
  }
  return resultado;
}
