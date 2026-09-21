// Sorteio de escolhas do wizard ("🎲 Aleatório" nas listas de "Escolha N"):
// preenche as vagas que faltam mantendo o que o jogador já marcou, e NUNCA
// sorteia algo que ele já possui por outra fonte (Classe/Origem/Espécie/
// Talento — ver `core/concessoesJaConcedidas.ts`), pra não gastar uma
// escolha repetindo o que já veio de graça.

/** Devolve a lista completa de escolhas (as `atuais` mantidas, cortadas em
 * `max`, mais sorteios até completar). `evitar` só afeta o que é SORTEADO —
 * o que o jogador marcou à mão fica, mesmo que esteja em `evitar`. Se as
 * opções livres acabarem antes de completar, devolve o que deu (nunca repete
 * nem cai em algo de `evitar`). `rng` injetável (0 <= n < 1) pra testar. */
export function sortearEscolhas<T>(
  opcoes: readonly T[],
  atuais: readonly T[],
  max: number,
  evitar: ReadonlySet<T> = new Set(),
  rng: () => number = Math.random,
): T[] {
  const resultado = [...new Set(atuais)].slice(0, Math.max(0, max));
  const livres = opcoes.filter((o) => !resultado.includes(o) && !evitar.has(o));
  while (resultado.length < max && livres.length > 0) {
    const i = Math.min(livres.length - 1, Math.floor(rng() * livres.length));
    resultado.push(livres.splice(i, 1)[0]);
  }
  return resultado;
}
