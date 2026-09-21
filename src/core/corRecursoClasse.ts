// Cor padrão dos pips (contadores de uso) de cada classe — pedido do Osmar
// (2026-09): cada classe tem UMA cor, igual em qualquer tela onde o recurso
// dela aparece (área de recursos do Combate, painéis de Ação/Bônus/Reação,
// aba Magias...). Classe nova entra aqui na mesma entrega em que ganha o 1º
// recurso com contador — e se o Osmar não disser qual cor, PERGUNTAR (não
// escolher sozinho). Ver DECISOES-CLASSES.md.

export type CorRecurso = 'vermelho' | 'roxo' | 'mostarda';

const COR_POR_CLASSE: Record<string, CorRecurso> = {
  Bárbaro: 'vermelho', // Fúria
  Bardo: 'mostarda', // Inspiração de Bardo
  Bruxo: 'roxo', // Magia de Pacto
};

/** `null` = a classe ainda não tem cor definida (usa o azul padrão até o
 * Osmar escolher). */
export function corDoRecursoDaClasse(nomeClasse: string): CorRecurso | null {
  return COR_POR_CLASSE[nomeClasse] ?? null;
}
