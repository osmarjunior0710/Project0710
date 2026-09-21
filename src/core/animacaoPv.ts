// Animação da barra de vida estilo "jogo de luta" (ver `BarraDeVida.tsx`):
// o valor real muda na hora, e um marcador vermelho vai alcançando ele —
// esvaziando (dano) ou sendo preenchido de verde (cura). Aqui só a
// matemática de tempo, sem React, pra poder testar.

/** Pausa com o trecho vermelho parado antes de começar a se mover — só
 * no 1º toque; toques seguintes com a animação já rolando não repetem. */
export const PAUSA_ANTES_ANIMAR_MS = 300;

const MS_POR_PONTO = 200;
const DURACAO_MIN_MS = 1000;
const DURACAO_MAX_MS = 2000;

/** Duração proporcional à distância a percorrer: 0,2 s por ponto, no
 * mínimo 1 s e no máximo 2 s (5 pontos = 1 s; 8 = 1,6 s; dano grande não
 * fica arrastado). */
export function duracaoAnimacaoPvMs(pontos: number): number {
  const bruta = Math.abs(pontos) * MS_POR_PONTO;
  return Math.min(DURACAO_MAX_MS, Math.max(DURACAO_MIN_MS, bruta));
}

/** Posição (linear) entre `de` e `para` depois de `decorridoMs` de uma
 * animação de `duracaoMs`. Passou do tempo = já está em `para`. */
export function valorNoTempo(de: number, para: number, decorridoMs: number, duracaoMs: number): number {
  if (duracaoMs <= 0 || decorridoMs >= duracaoMs) return para;
  if (decorridoMs <= 0) return de;
  return de + (para - de) * (decorridoMs / duracaoMs);
}
