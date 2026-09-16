/** Força Indomável (Bárbaro nível 18) — "se o total de um teste ou
 * salvaguarda de Força for menor que seu valor de Força, você pode
 * usar esse valor no lugar do total". Sempre vantajoso pra quem tem a
 * característica (nunca piora o resultado) — por isso o app aplica
 * sozinho, sem pedir confirmação (ver `RollContext.tsx`). */
export function deveAplicarForcaIndomavel(total: number, forcaValor: number): boolean {
  return total < forcaValor;
}
