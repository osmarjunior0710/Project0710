// Resiliente — único Talento Geral hoje que concede "+1 num atributo
// à escolha + proficiência de Salvaguarda nesse atributo" (efeito
// próprio, não usa o `ConcedeAsiTalento` genérico). Ver `talentos.ts`
// (`efeitoMecanico: 'atributo-e-salvaguarda-escolhidos'`).

import { talentos } from '../data/rulesets/dnd2024/talentos';
import { atributosOrdem, type Atributo } from '../data/wizardFixtures';
import type { Classe } from '../data/rulesets/dnd2024/classes';

/** Atributos elegíveis pra `talentoId` do tipo
 * `atributo-e-salvaguarda-escolhidos` (Resiliente) — todo atributo que
 * o personagem AINDA não é proficiente em Salvaguarda (regra real: só
 * faz sentido escolher um em que ainda não tem o bônus). `[]` se o
 * talento não for desse tipo. */
export function opcoesAtributoResiliente(talentoId: string, classeOriginal: Classe | null): Atributo[] {
  const t = talentos.find((x) => x.id === talentoId);
  if (t?.efeitoMecanico?.tipo !== 'atributo-e-salvaguarda-escolhidos') return [];
  const jaProficiente: readonly Atributo[] = classeOriginal?.salvaguardas ?? [];
  return atributosOrdem.filter((a) => !jaProficiente.includes(a));
}

/** Atributo(s) escolhido(s) por Resiliente — varre TODOS os talentos
 * atuais (mesmo motivo de `proficienciaArmadura.ts`: em tese um
 * personagem poderia pegar Resiliente mais de uma vez em builds
 * futuras de multiclasse/Dádiva, embora hoje `repetivel: false`
 * limite isso — ainda assim, a função já nasce genérica). */
export function atributosResilienteEscolhidos(
  talentosAtuais: string[] | undefined,
  escolhas: Record<string, string> | undefined,
): Atributo[] {
  if (!talentosAtuais || !escolhas) return [];
  const resultado: Atributo[] = [];
  for (const id of talentosAtuais) {
    const t = talentos.find((x) => x.id === id);
    if (t?.efeitoMecanico?.tipo === 'atributo-e-salvaguarda-escolhidos') {
      const atributo = escolhas[id] as Atributo | undefined;
      if (atributo) resultado.push(atributo);
    }
  }
  return resultado;
}
