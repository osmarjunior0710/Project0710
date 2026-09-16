/** Quando o mod. de Constituição muda depois da criação (Aumento no
 * Valor de Atributo escolhido em Constituição, Campeão Primitivo), o
 * PV Máximo deveria mudar retroativamente pra refletir o novo mod. em
 * TODOS os níveis já ganhos (regra real: se o mod. de Constituição
 * sobe, o PV Máximo aumenta como se o mod. novo já valesse desde
 * sempre). Como o app guarda o PV Máximo como 1 total acumulado (não
 * o histórico de cada rolagem por nível), o ajuste retroativo é
 * sempre esse delta — matematicamente idêntico a recalcular tudo do
 * zero, já que a parcela "dado de vida" de cada nível nunca dependeu
 * de Constituição, só a parcela "mod. CON × nível".
 *
 * `nivelTotalComEsseNivel` inclui o nível que acabou de ser ganho
 * nesse mesmo Level Up (mesmo quando é o próprio Level Up que mudou o
 * CON) — o ganho de PV desse nível já foi calculado com o mod. ANTIGO
 * (`LevelUpShell`/`geradorPersonagemTeste` sempre resolvem o PV do
 * nível antes de qualquer ASI desse mesmo nível ser aplicado), então
 * ele também precisa do ajuste. */
export function ajustarPvMaximoPorMudancaDeCon(
  pvMaxAtual: number,
  conModAntigo: number,
  conModNovo: number,
  nivelTotalComEsseNivel: number,
): number {
  return pvMaxAtual + (conModNovo - conModAntigo) * nivelTotalComEsseNivel;
}
