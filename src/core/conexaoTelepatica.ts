// Conexão Telepática (Psiônico, UA 2025 — Poder Psiônico, nível 1). Ver
// sdd/sdd-psionico.md e aprendizados/classes/psionico.md.
//
// "Você possui telepatia com alcance de 9 metros. Como uma Ação Bônus, você pode
// gastar um Dado de Energia Psiônica. Pela próxima hora, o alcance da sua telepatia
// aumenta em metros igual a 3 vezes o número rolado. Na primeira vez que você usar
// esta Ação Bônus após cada Descanso Longo, você não gasta o Dado de Energia
// Psiônica. Em todas as outras vezes que usar esta habilidade, você gasta o dado."
//
// [PH] [codeimplementation] — o app não segue o tempo real (a "próxima hora"): o alcance
// fica anotado até qualquer descanso.

/** Alcance base da telepatia do Psiônico, em metros. */
export const ALCANCE_BASE_TELEPATIA = 9;

/** "O alcance da sua telepatia aumenta em metros igual a 3 vezes o número rolado." */
export function alcanceConexaoTelepatica(resultadoDoDado: number): number {
  return ALCANCE_BASE_TELEPATIA + 3 * Math.max(0, resultadoDoDado);
}

export interface EstadoConexaoTelepatica {
  /** Já usou a Conexão (grátis) desde o último Descanso Longo? */
  gratisUsada: boolean;
  dadosRestantes: number;
}

/** O que acontece ao usar a Conexão agora: `null` = não pode (precisa gastar o dado e não tem). */
export function usoDaConexaoTelepatica(e: EstadoConexaoTelepatica): { gastaDado: boolean } | null {
  if (!e.gratisUsada) return { gastaDado: false };
  if (e.dadosRestantes > 0) return { gastaDado: true };
  return null;
}
