import type { Magia } from '../data/rulesets/dnd2024/magias';

/** Adepto de Ritual (Mago, nível 1) — permite conjurar qualquer magia
 * com o marcador Ritual que esteja no Livro de Magias, sem precisar ter
 * preparada e sem gastar Espaço de Magia. Ilimitado de verdade (RAW não
 * tem contador, só o custo narrativo do tempo de Ritual, que o app não
 * simula) — só filtra o que já está preparada (essas conjuram normal,
 * não precisam desta característica). */
export function magiasRituaisElegiveis(livroDeMagias: Magia[], magiasPreparadas: string[]): Magia[] {
  return livroDeMagias.filter((m) => (m.tempoConjuracao?.includes('Ritual') ?? false) && !magiasPreparadas.includes(m.nome));
}
