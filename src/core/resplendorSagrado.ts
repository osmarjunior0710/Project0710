/** Resplendor Sagrado (Paladino, Juramento da Devoção, nível 20) —
 * ver `sdd/sdd-paladino-devocao.md` seção 5. Mecânica PARCIAL: só a
 * ativação (Ação Bônus, 1x/Descanso Longo ou recuperando com espaço
 * de 5º círculo) é real — os 3 efeitos em si são `textonly`:
 * - Dano Radiante: em INIMIGO — o app não tem ficha de inimigo, só
 *   mostra o valor calculado (esta função) pro jogador aplicar
 *   manualmente.
 * - Luz Solar: o app não modela luz/visão de área.
 * - Vigília Consagrada: depende do tipo do oponente (Ínfero/Morto-
 *   Vivo), que o app não sabe numa salvaguarda qualquer.
 */
export function danoResplendorSagrado(modCarisma: number, bonusProficiencia: number): number {
  return modCarisma + bonusProficiencia;
}
