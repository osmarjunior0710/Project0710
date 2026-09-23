// Ver CLAUDE.md §12.1. Status de implementação de uma característica de
// classe/subclasse — nunca só 2 valores (implementado/não), sempre os 4
// abaixo, pra ficar rastreável se algo já foi CLASSIFICADO como texto puro
// de propósito ou só ainda não foi revisado. O estado nunca se apaga, só
// transiciona (o histórico de quando mudou fica no Git).
export type StatusImplementacao =
  /** Suspeita de que é só narrativa, ainda não confirmado. */
  | 'placeholder-textonly'
  /** Precisa de mecânica real, ainda não implementada. */
  | 'placeholder-codeimplementation'
  /** Confirmado como só narrativo, sem mecânica necessária (permanente). */
  | 'textonly'
  /** Mecânica real existe e funciona (permanente). */
  | 'codeimplementation';

/** `true` = a característica ainda não está pronta (aparece com `[PH]`
 * automaticamente em qualquer tela que a exibir) — `undefined` (ainda não
 * classificado) NÃO conta como placeholder, só os 2 valores que começam
 * com `'placeholder-'`. */
export function ehPlaceholder(status: StatusImplementacao | undefined): boolean {
  return status === 'placeholder-textonly' || status === 'placeholder-codeimplementation';
}
