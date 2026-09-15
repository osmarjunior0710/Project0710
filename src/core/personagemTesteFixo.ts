// "Garante que existe" pro personagem de teste fixo — mesmo padrão de
// `personagemDemo.ts`, mas o botão "🧪 Char de Teste Fixo"
// (CharacterList.tsx) SEMPRE recria o personagem congelado do zero
// (sobrescrevendo qualquer edição feita nele durante testes
// anteriores), porque o objetivo é ter sempre o mesmo ponto de partida
// pra testar — diferente do Demo, que só cria na 1ª visita.

import { personagemTesteFixo, ID_PERSONAGEM_TESTE_FIXO } from '../data/personagemTesteFixo';
import { armazenamentoPersonagens, type PersonagemSalvo } from './armazenamentoPersonagens';

export { ID_PERSONAGEM_TESTE_FIXO };

/** Recria o personagem de teste fixo no armazenamento local a partir
 * do dado congelado, sempre do zero — usado pelo botão "🧪 Char de
 * Teste Fixo" na Lista de Personagens. */
export function recriarPersonagemTesteFixo(): PersonagemSalvo {
  armazenamentoPersonagens.salvar(personagemTesteFixo);
  return personagemTesteFixo;
}
