// Recuperação Arcana (Mago, nível 1) — ao completar um Descanso Curto,
// recupera Espaços de Magia gastos até um orçamento de círculo
// combinado (metade do nível de Mago, arredondado pra cima); nenhum
// espaço recuperado pode ser de 6º círculo ou superior.

/** Orçamento de círculo combinado disponível pra recuperar. */
export function orcamentoRecuperacaoArcana(nivelMago: number): number {
  return Math.ceil(nivelMago / 2);
}

/** Círculos (1º-5º) com pelo menos 1 espaço gasto, elegíveis pra
 * Recuperação Arcana — 6º círculo ou mais nunca entra, mesmo se gasto. */
export function circulosElegiveisRecuperacaoArcana(espacosGastosPorCirculo: Record<number, number>): number[] {
  return Object.entries(espacosGastosPorCirculo)
    .map(([c, gasto]) => ({ circulo: Number(c), gasto }))
    .filter((e) => e.circulo >= 1 && e.circulo <= 5 && e.gasto > 0)
    .map((e) => e.circulo)
    .sort((a, b) => a - b);
}

/** `true` só quando existe pelo menos 1 espaço elegível pra recuperar E
 * o orçamento do nível é > 0 — controla se a pergunta "quer usar
 * Recuperação Arcana?" aparece no Descanso Curto. */
export function podeUsarRecuperacaoArcana(nivelMago: number, espacosGastosPorCirculo: Record<number, number>): boolean {
  return orcamentoRecuperacaoArcana(nivelMago) > 0 && circulosElegiveisRecuperacaoArcana(espacosGastosPorCirculo).length > 0;
}

/** Custo em orçamento de recuperar `escolha[circulo]` espaços daquele
 * círculo, somado por todos os círculos — círculo N custa N por espaço
 * (regra real: "círculo combinado"). */
export function custoEscolhaRecuperacaoArcana(escolha: Record<number, number>): number {
  return Object.entries(escolha).reduce((soma, [c, qtd]) => soma + Number(c) * qtd, 0);
}

/** `true` só quando a escolha cabe no orçamento E nenhum círculo
 * escolhido passa do que foi realmente gasto naquele círculo. */
export function escolhaValidaRecuperacaoArcana(
  escolha: Record<number, number>,
  espacosGastosPorCirculo: Record<number, number>,
  orcamento: number,
): boolean {
  const dentroDoGasto = Object.entries(escolha).every(
    ([c, qtd]) => qtd >= 0 && qtd <= (espacosGastosPorCirculo[Number(c)] ?? 0),
  );
  return dentroDoGasto && custoEscolhaRecuperacaoArcana(escolha) <= orcamento;
}
