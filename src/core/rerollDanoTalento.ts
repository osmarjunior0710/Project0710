// Perfurador — 1x/rolagem, reroll de 1 dado de dano À ESCOLHA do
// jogador quando o dano causado é do tipo indicado pelo talento.
// Mesma simplificação já usada pro "Dano Garantido" do Valentão de
// Taverna (`dado-ataque-desarmado`): a regra real diz "1x/turno", mas
// o app trata como "1x por rolagem de dano" — cada "Rolar Dano" já
// corresponde a 1 acerto, e não há hoje um jeito robusto de rastrear
// "já usado neste turno" através de várias rolagens separadas sem
// duplicar o padrão de reset por Fim de Turno já usado noutro lugar.

import { talentos } from '../data/rulesets/dnd2024/talentos';

/** `true` só quando o personagem tem Perfurador — controla se o
 * reroll de dado escolhido fica disponível quando o dano é
 * Perfurante (ver `core/ataque.ts`, `AtaqueInfo.danoTipo`). */
export function temPerfurador(talentosAtuais: string[] | undefined): boolean {
  if (!talentosAtuais) return false;
  return talentosAtuais.some((id) => {
    const t = talentos.find((x) => x.id === id);
    return t?.efeitoMecanico?.tipo === 'reroll-um-dado-de-dano' && t.efeitoMecanico.tipoDano === 'Perfurante';
  });
}
