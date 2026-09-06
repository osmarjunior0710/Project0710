// Deriva quais perícias/ferramentas/truques/magias o personagem já tem
// por OUTRA fonte (Classe, Origem, Talento, Espécie) — usado pra marcar
// "já possui - <fonte>" em qualquer tela de escolha que ofereça algo
// que já foi concedido de graça em outro lugar do wizard (evita o
// jogador gastar uma escolha repetindo o que já tem). Renomeado de
// `proficienciasOrigem.ts` (só Perícia/Ferramenta × Classe/Origem)
// quando ganhou Truques/Magias × Espécie também.

import type { Origem } from '../data/rulesets/dnd2024/origens';
import type { Especie } from '../data/rulesets/dnd2024/especies';
import type { WizardSelection } from './personagem';
import { truquesEspecie, magiasEspecie } from './magiasEspecie';

export type FonteConcessao = 'Classe' | 'Origem' | 'Talento' | 'Espécie';

export interface ConcessoesJaConcedidas {
  pericias: Map<string, FonteConcessao>;
  ferramentas: Map<string, FonteConcessao>;
  truques: Map<string, FonteConcessao>;
  magias: Map<string, FonteConcessao>;
}

/** `especie` opcional porque nem toda tela que precisa disso roda DEPOIS
 * da etapa de Espécie do wizard (ex.: "2c. Talento da Origem" roda
 * antes) — nesse caso os truques/magias de Espécie simplesmente não
 * entram ainda, sem erro. Ordem de prioridade quando o mesmo nome
 * aparece em 2 fontes: Classe > Origem > Talento > Espécie. */
export function concessoesJaConcedidas(
  selection: WizardSelection,
  origem: Origem | undefined,
  especie?: Especie,
): ConcessoesJaConcedidas {
  const pericias = new Map<string, FonteConcessao>();
  const ferramentas = new Map<string, FonteConcessao>();
  const truques = new Map<string, FonteConcessao>();
  const magias = new Map<string, FonteConcessao>();

  for (const nome of selection.periciasClasseEscolhidas) pericias.set(nome, 'Classe');
  for (const nome of selection.ferramentasClasseEscolhidas) ferramentas.set(nome, 'Classe');
  for (const nome of selection.truquesEscolhidos) truques.set(nome, 'Classe');
  for (const nome of selection.magiasPreparadasEscolhidas) magias.set(nome, 'Classe');

  if (origem) {
    if (!pericias.has(origem.pericias[0])) pericias.set(origem.pericias[0], 'Origem');
    if (!pericias.has(origem.pericias[1])) pericias.set(origem.pericias[1], 'Origem');

    if (origem.ferramenta.categoria === 'fixa') {
      if (!ferramentas.has(origem.ferramenta.nome)) ferramentas.set(origem.ferramenta.nome, 'Origem');
    } else if (selection.ferramentaOrigemEscolhida && !ferramentas.has(selection.ferramentaOrigemEscolhida)) {
      ferramentas.set(selection.ferramentaOrigemEscolhida, 'Origem');
    }
  }

  // Talento de Origem "Iniciado em Magia" (Acólito/Guia/Sábio).
  for (const nome of selection.truquesMagiaIniciadaEscolhidos) {
    if (!truques.has(nome)) truques.set(nome, 'Talento');
  }
  if (selection.magiaMagiaIniciadaEscolhida && !magias.has(selection.magiaMagiaIniciadaEscolhida)) {
    magias.set(selection.magiaMagiaIniciadaEscolhida, 'Talento');
  }

  if (especie) {
    for (const nome of truquesEspecie(selection)) {
      if (!truques.has(nome)) truques.set(nome, 'Espécie');
    }
    // Nível 1 sempre — é o único nível que existe durante a criação
    // (level up acontece depois, na Ficha, fora do wizard).
    for (const nome of magiasEspecie(selection, 1)) {
      if (!magias.has(nome)) magias.set(nome, 'Espécie');
    }
  }

  return { pericias, ferramentas, truques, magias };
}
