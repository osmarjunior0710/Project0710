// "🧪 Char Multiclasse" — Bárbaro 1 / Bardo 1 / Bruxo 1, todos os atributos
// em 20 (pedido do Osmar, 2026-09) — pra conferir na tela as linhas de
// recursos de classe juntas (Fúria + Inspiração de Bardo + Magia de Pacto,
// ver `core/recursosVisiveis.ts`). Mesmo espírito do Char de Teste Fixo
// (`personagemTesteFixo.ts`): sempre recriado do zero. A base (Bárbaro nível
// 1) sai do gerador de teste com Origem/Espécie fixas; as outras 2 classes
// entram como multiclasse com as escolhas mínimas, sempre as mesmas (as
// primeiras magias em ordem, nunca sorteadas).

import { magiasDaClasse } from '../data/rulesets/dnd2024/magias';
import { armazenamentoPersonagens, type PersonagemSalvo } from './armazenamentoPersonagens';
import { gerarPersonagemTeste } from './geradorPersonagemTeste';
import type { MagiaConhecida } from './magiasPersonagem';

export const ID_PERSONAGEM_TESTE_MULTICLASSE = 'teste-fixo-multiclasse';

// Já marcadas com a classe (formato de `MagiaConhecida`, ver
// `sdd/sdd-multiclasse-truques-magias.md`) — escrito direto, sem
// depender do palpite de `normalizarMagiasConhecidas`, porque este é
// justamente o personagem usado pra testar a marca de classe na tela.
const nomesComClasse = (classe: string, circulo: number, quantidade: number): MagiaConhecida[] =>
  magiasDaClasse(classe, circulo)
    .map((m) => m.nome)
    .sort((a, b) => a.localeCompare(b, 'pt-BR'))
    .slice(0, quantidade)
    .map((nome) => ({ nome, classe }));

export function montarPersonagemTesteMulticlasse(): PersonagemSalvo {
  const base = gerarPersonagemTeste({ classeNome: 'Bárbaro', origemNome: 'Sábio', especieNome: 'Anão', nivelAlvo: 1 });
  const atributos20 = { FOR: 20, DES: 20, CON: 20, INT: 20, SAB: 20, CAR: 20 };
  // PV: Bárbaro 1 (d12 máx 12 + CON 5) + Bardo 1 (média 5 + 5) + Bruxo 1 (média 5 + 5) = 37
  const pvMax = 37;
  return {
    ...base,
    id: ID_PERSONAGEM_TESTE_MULTICLASSE,
    nivel: 1,
    xp: 0,
    pvAtual: pvMax,
    pvMax,
    selecao: { ...base.selecao, atributos: atributos20, desbloquearAtributos: true, nome: 'Char Multiclasse' },
    classes: [
      { classe: 'Bárbaro', nivel: 1, subclasse: null },
      { classe: 'Bardo', nivel: 1, subclasse: null },
      { classe: 'Bruxo', nivel: 1, subclasse: null },
    ],
    classeAtivaAtual: 'Bárbaro',
    // Entrada no Bardo: 1 perícia + 1 Instrumento Musical à escolha.
    periciasMulticlasseAtual: ['Persuasão'],
    ferramentasMulticlasseAtual: ['Alaúde'],
    truquesAtual: [...nomesComClasse('Bardo', 0, 2), ...nomesComClasse('Bruxo', 0, 2)],
    magiasPreparadasAtual: [...nomesComClasse('Bardo', 1, 2), ...nomesComClasse('Bruxo', 1, 2)],
  };
}

/** Recria o personagem do zero no armazenamento local — usado pelo botão
 * "🧪 Char Multiclasse" na Lista de Personagens. */
export function recriarPersonagemTesteMulticlasse(): PersonagemSalvo {
  const personagem = montarPersonagemTesteMulticlasse();
  armazenamentoPersonagens.salvar(personagem);
  return personagem;
}
