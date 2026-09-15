// "Garante que existe" pro personagem de teste fixo — mesmo padrão de
// `personagemDemo.ts`, mas o botão "🧪 Char de Teste Fixo"
// (CharacterList.tsx) SEMPRE recria o personagem congelado do zero
// (sobrescrevendo qualquer edição feita nele durante testes
// anteriores), porque o objetivo é ter sempre o mesmo ponto de partida
// pra testar — diferente do Demo, que só cria na 1ª visita.

import { personagemTesteFixo, ID_PERSONAGEM_TESTE_FIXO } from '../data/personagemTesteFixo';
import { armazenamentoPersonagens, type PersonagemSalvo } from './armazenamentoPersonagens';
import { armas } from '../data/rulesets/dnd2024/armas';
import { armaduras } from '../data/rulesets/dnd2024/armaduras';
import { equipamentoAventura } from '../data/rulesets/dnd2024/equipamentoAventura';
import { gruposFerramenta } from '../data/rulesets/dnd2024/ferramentas';
import type { ItemCarrinho } from './loja';

export { ID_PERSONAGEM_TESTE_FIXO };

/** Todo item de arma/armadura/equipamento cadastrado no catálogo (1
 * de cada), pra Entrega 3 — abrir qualquer popup de item sem precisar
 * comprar nada na Loja primeiro. Calculado aqui, não congelado em
 * `data/personagemTesteFixo.ts`, pra nunca ficar desatualizado quando
 * o catálogo crescer (nova arma/armadura importada da planilha já
 * aparece na Mochila do char de teste automaticamente). */
function itensCatalogoCompleto(): ItemCarrinho[] {
  const nomes = [
    ...armas.map((a) => a.nome),
    ...armaduras.map((a) => a.nome),
    ...equipamentoAventura.map((e) => e.nome),
    ...Object.values(gruposFerramenta).flatMap((grupo) => grupo.map((f) => f.nome)),
  ];
  return [...new Set(nomes)].map((nome) => ({ nome, quantidade: 1 }));
}

/** Recria o personagem de teste fixo no armazenamento local a partir
 * do dado congelado, sempre do zero — usado pelo botão "🧪 Char de
 * Teste Fixo" na Lista de Personagens. */
export function recriarPersonagemTesteFixo(): PersonagemSalvo {
  const comEquipamentoCompleto: PersonagemSalvo = {
    ...personagemTesteFixo,
    selecao: { ...personagemTesteFixo.selecao, itens: itensCatalogoCompleto() },
  };
  armazenamentoPersonagens.salvar(comEquipamentoCompleto);
  return comEquipamentoCompleto;
}
