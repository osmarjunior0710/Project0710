// Sentidos Especiais — junta espécie + Invocações Místicas atuais num
// resultado por tipo. Regra padrão (Apêndice C): quando 2+ fontes dão
// o MESMO tipo de sentido, usa o maior valor entre elas, nunca soma —
// somar só valeria se o texto de uma fonte específica pedisse isso de
// propósito (nenhuma hoje pede; ex. futuro: características do
// Patrono Ínfero, ainda não importadas).

import { especies } from '../data/rulesets/dnd2024/especies';
import { invocacoesMisticas } from '../data/rulesets/dnd2024/invocacoesMisticas';
import { ORDEM_SENTIDOS, type TipoSentido } from '../data/rulesets/dnd2024/sentidos';

function sentidosZerados(): Record<TipoSentido, number> {
  return { visaoNoEscuro: 0, visaoAsCegas: 0, visaoVerdadeira: 0, sismiconsciencia: 0 };
}

export function calcularSentidos(
  nomeEspecie: string | null,
  invocacoesAtuais: string[],
  subescolhaEspecieEscolhida: string | null = null,
): Record<TipoSentido, number> {
  const resultado = sentidosZerados();

  const especie = especies.find((e) => e.nome === nomeEspecie);
  for (const traco of especie?.traços ?? []) {
    const s = traco.sentidoConcedido;
    if (s) resultado[s.tipo] = Math.max(resultado[s.tipo], s.alcanceMetros);
  }

  const opcaoSubescolha = especie?.opcoesSubescolha?.find((o) => o.nome === subescolhaEspecieEscolhida);
  const sentidoDaSubescolha = opcaoSubescolha?.sentidoConcedido;
  if (sentidoDaSubescolha) {
    resultado[sentidoDaSubescolha.tipo] = Math.max(resultado[sentidoDaSubescolha.tipo], sentidoDaSubescolha.alcanceMetros);
  }

  for (const id of invocacoesAtuais) {
    const s = invocacoesMisticas.find((i) => i.id === id)?.sentidoConcedido;
    if (s) resultado[s.tipo] = Math.max(resultado[s.tipo], s.alcanceMetros);
  }

  return resultado;
}

/** Só os sentidos com valor > 0, na ordem de exibição — pra tela não
 * precisar filtrar/ordenar sozinha. */
export function sentidosAtivos(sentidos: Record<TipoSentido, number>): { tipo: TipoSentido; alcanceMetros: number }[] {
  return ORDEM_SENTIDOS.filter((tipo) => sentidos[tipo] > 0).map((tipo) => ({ tipo, alcanceMetros: sentidos[tipo] }));
}
