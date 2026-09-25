import type { Magia } from '../data/rulesets/dnd2024/magias';

// Assinatura Mágica (Mago, nível 20) — escolhe 2 magias de 3º círculo do
// Livro de Magias (permanente, sem regra de troca). Ficam sempre
// preparadas e cada uma pode ser conjurada 1x no 3º círculo sem gastar
// Espaço, recarregando em Descanso Curto OU Longo — diferente da
// Maestria de Magias, que é ilimitada.

/** Magias do Livro de Magias elegíveis pra escolher — regra real não
 * exige tempo de conjuração específico, só círculo 3. */
export function magiasElegiveisAssinatura(livroDeMagias: Magia[]): Magia[] {
  return livroDeMagias.filter((m) => m.circulo === 3);
}

/** `escolhas` são as 2 magias de Assinatura; `gastas` são as que já
 * conjuraram de graça neste período (zera em Descanso Curto E Longo).
 * Devolve o círculo (sempre 3) em que `nomeMagia` conjura de graça
 * agora, ou `null` se não for uma Assinatura ou já tiver sido usada. */
export function circuloGratisAssinatura(nomeMagia: string, escolhas: string[], gastas: string[]): number | null {
  if (!escolhas.includes(nomeMagia) || gastas.includes(nomeMagia)) return null;
  return 3;
}
