// Vigor Implacável (Orc) — ao ser reduzido a 0 PV, mas não morto
// imediatamente, fica com 1 PV. 1x por Descanso Longo. Só dispara
// numa transição de PV > 0 pra PV = 0 (nunca se já estava em 0, e
// nunca se um dano matou instantaneamente — esse caso não existe
// ainda no motor, ver PENDENCIAS.md).

export function deveAplicarVigorImplacavel(pvAntes: number, pvDepoisSemVigor: number, jaGasto: boolean): boolean {
  return !jaGasto && pvAntes > 0 && pvDepoisSemVigor === 0;
}
