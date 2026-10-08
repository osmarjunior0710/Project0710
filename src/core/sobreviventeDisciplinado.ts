// Sobrevivente Disciplinado (Monge, nível 14) — "Sua disciplina física e
// mental lhe concede proficiência em todas as salvaguardas. Além disso, ao
// realizar uma salvaguarda e falhar, você pode gastar 1 Ponto de Foco para
// jogar novamente, e deve usar o novo resultado." [codeimplementation]

export function temSobreviventeDisciplinado(nivelMonge: number): boolean {
  return nivelMonge >= 14;
}

/** Re-rolar uma salvaguarda custa 1 Ponto de Foco: só oferece com Foco. */
export function podeRerolarSalvaguardaComFoco(nivelMonge: number, pontosDeFocoRestantes: number): boolean {
  return temSobreviventeDisciplinado(nivelMonge) && pontosDeFocoRestantes >= 1;
}
