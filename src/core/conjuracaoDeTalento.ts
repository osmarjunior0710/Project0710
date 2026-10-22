// Conjuração "própria do talento" — mesma fórmula de
// `core/magiasPersonagem.ts` (resumoConjuracao: mod. do atributo +
// Bônus de Proficiência, CD = 8 + isso), mas sem exigir uma `Classe` —
// usada pelos Talentos Gerais cujo atributo de conjuração não vem de
// nenhuma classe: é "o atributo que o próprio ASI deste talento
// aumentou" (Telecinético, Telepático, Tocado pela Sombra, Tocado
// pelas Fadas, Conjurador Ritualista, Envenenador) ou escolhido
// livremente sem ASI (Iniciado em Magia). Ver
// `sdd/sdd-atributo-talento.md`.

import type { Atributo } from '../data/wizardFixtures';
import { NOME_COMPLETO_POR_ATRIBUTO } from './calculoPersonagem';
import { modificador } from './personagem';
import type { ResumoConjuracao } from './magiasPersonagem';

/** Mesmo cálculo de `resumoConjuracao` (classe), só que a partir do
 * atributo/valor/Bônus de Proficiência já resolvidos pelo chamador —
 * não precisa de `Classe` nem de `WizardSelection`. */
export function resumoConjuracaoDeTalento(atributo: Atributo, valorAtributo: number, bonusProficiencia: number): ResumoConjuracao {
  const modAtributo = modificador(valorAtributo);
  const modAtaque = modAtributo + bonusProficiencia;
  return {
    atributoNome: NOME_COMPLETO_POR_ATRIBUTO[atributo],
    atributo,
    modAtributo,
    cd: 8 + modAtaque,
    modAtaque,
  };
}
