// "🧪 Char Teste — Paladino Devoção" — personagem de teste dedicado ao
// foco de Entrega 7 (Juramento da Devoção), ver CLAUDE.md seção 6.4
// "Personagem de teste dedicado ao foco em andamento". Nível 20 (o
// mais alto das 5 características do juramento) pra toda entrega
// dessa subclasse — Magias do Juramento (3), Arma Sagrada (3), Aura
// de Devoção (7), Destruição Protetora (15), Resplendor Sagrado
// (20) — já estar disponível pra testar sem precisar subir nível de
// novo a cada entrega. Apaga esse arquivo e o botão em
// `CharacterList.tsx` quando o foco (EmDev.md "Entrega 7") fechar.

import { gerarPersonagemTeste } from './geradorPersonagemTeste';
import { armazenamentoPersonagens, type PersonagemSalvo } from './armazenamentoPersonagens';

export const ID_PERSONAGEM_TESTE_PALADINO_DEVOCAO = 'teste-fixo-paladino-devocao';

export function montarPersonagemTestePaladinoDevocao(): PersonagemSalvo {
  const base = gerarPersonagemTeste({
    classeNome: 'Paladino',
    origemNome: 'Sábio',
    especieNome: 'Humano',
    nivelAlvo: 20,
    subclasseNome: 'Juramento da Devoção',
  });
  // Carisma alto de propósito — é o atributo que a maioria das contas
  // do juramento usa (CD de Canalizar Divindade, bônus de Arma
  // Sagrada, dano de Resplendor Sagrado), pra qualquer conta bater
  // visivelmente diferente de +0.
  const atributos = { FOR: 16, DES: 10, CON: 14, INT: 8, SAB: 10, CAR: 20 };
  return {
    ...base,
    id: ID_PERSONAGEM_TESTE_PALADINO_DEVOCAO,
    selecao: { ...base.selecao, atributos, desbloquearAtributos: true, nome: 'Char Teste — Paladino Devoção' },
  };
}

/** Recria o personagem do zero no armazenamento local — usado pelo
 * botão "🧪 Char Teste — Paladino Devoção" na Lista de Personagens. */
export function recriarPersonagemTestePaladinoDevocao(): PersonagemSalvo {
  const personagem = montarPersonagemTestePaladinoDevocao();
  armazenamentoPersonagens.salvar(personagem);
  return personagem;
}
