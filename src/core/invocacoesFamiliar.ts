import { invocacoesMisticas } from '../data/rulesets/dnd2024/invocacoesMisticas';
import { criaturas, type Criatura } from '../data/rulesets/dnd2024/criaturas';

/** Formas de Familiar elegíveis pra convocar via alguma Invocação
 * Mística atual do personagem (hoje só Pacto da Corrente, 8 formas
 * especiais) — mesmo padrão de `magiasGratisDasInvocacoes`, sempre
 * recalculado a partir de `invocacoesMisticasAtuais`, nunca
 * persistido. Vazio = nenhuma invocação atual concede Familiar. */
export function formasFamiliarDasInvocacoes(invocacoesAtuais: string[]): Criatura[] {
  const nomes = new Set<string>();
  for (const id of invocacoesAtuais) {
    const invocacao = invocacoesMisticas.find((i) => i.id === id);
    if (!invocacao?.formasFamiliarConcedidas) continue;
    for (const nome of invocacao.formasFamiliarConcedidas) nomes.add(nome);
  }
  return criaturas.filter((c) => nomes.has(c.nome));
}
