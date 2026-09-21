import { useEffect, useRef, useState } from 'react';
import { PAUSA_ANTES_ANIMAR_MS, duracaoAnimacaoPvMs, valorNoTempo } from '../../core/animacaoPv';

/** Animação "jogo de luta" compartilhada (barra de vida, anel de XP): o
 * `alvo` é o valor real (muda na hora); o valor devolvido é o
 * MARCADOR, que o alcança depois de uma pausa curta (só no 1º toque) e
 * de forma linear (ver `core/animacaoPv.ts` pra tempo). Vários toques
 * seguidos não reiniciam: o alvo se move e o marcador continua de onde
 * está. Em JS com requestAnimationFrame, não CSS transition (mesma razão
 * da `LinearProgressBar` — geometria SVG não anima de forma confiável). */
export function useMarcadorAnimado(alvo: number): number {
  const [marcador, setMarcador] = useState(alvo);
  const marcadorRef = useRef(alvo);
  const alvoRef = useRef(alvo);
  const frameRef = useRef<number | null>(null);
  const pausaRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const animandoRef = useRef(false);

  function iniciar() {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    const de = marcadorRef.current;
    const para = alvoRef.current;
    if (de === para) {
      animandoRef.current = false;
      return;
    }
    const duracao = duracaoAnimacaoPvMs(para - de);
    const inicio = performance.now();
    animandoRef.current = true;
    const passo = (agora: number) => {
      const decorrido = agora - inicio;
      const v = valorNoTempo(de, para, decorrido, duracao);
      marcadorRef.current = v;
      setMarcador(v);
      if (decorrido < duracao) {
        frameRef.current = requestAnimationFrame(passo);
      } else {
        animandoRef.current = false;
        frameRef.current = null;
      }
    };
    frameRef.current = requestAnimationFrame(passo);
  }

  useEffect(() => {
    alvoRef.current = alvo;
    if (marcadorRef.current === alvo && !animandoRef.current) return;
    if (animandoRef.current) {
      // já rolando: continua de onde está, sem nova pausa
      iniciar();
      return;
    }
    if (pausaRef.current !== null) return; // pausa em curso já lê o alvo mais novo
    pausaRef.current = setTimeout(() => {
      pausaRef.current = null;
      iniciar();
    }, PAUSA_ANTES_ANIMAR_MS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [alvo]);

  useEffect(
    () => () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      if (pausaRef.current !== null) clearTimeout(pausaRef.current);
    },
    [],
  );

  return marcador;
}
